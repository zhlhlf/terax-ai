use std::path::PathBuf;

use portable_pty::CommandBuilder;

use crate::modules::control::ShellControlEnv;
use crate::modules::workspace::{self, WorkspaceEnv};

pub fn build_command(
    cwd: Option<String>,
    workspace: WorkspaceEnv,
    shell: Option<String>,
    control: Option<ShellControlEnv>,
) -> Result<CommandBuilder, String> {
    let shell = sanitize_shell_override(shell);
    #[cfg(unix)]
    {
        unix::build(cwd, workspace, shell, control)
    }
    #[cfg(windows)]
    {
        windows::build(cwd, workspace, shell, control)
    }
}

fn sanitize_shell_override(shell: Option<String>) -> Option<String> {
    let candidate = shell
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty())?;
    let target = std::fs::canonicalize(&candidate).ok();
    let allowed = list_shells().into_iter().any(|s| {
        s.path == candidate
            || (target.is_some() && std::fs::canonicalize(&s.path).ok() == target)
    });
    if allowed {
        Some(candidate)
    } else {
        log::warn!("ignoring non-enumerated shell override '{candidate}'");
        None
    }
}

pub fn detect_shell_name() -> String {
    #[cfg(unix)]
    {
        let (_, path) = unix::Shell::detect();
        path.rsplit('/').next().unwrap_or("").to_string()
    }
    #[cfg(windows)]
    {
        windows_shell_path()
            .file_stem()
            .and_then(|s| s.to_str())
            .map(|s| s.to_ascii_lowercase())
            .unwrap_or_default()
    }
}

#[derive(serde::Serialize)]
pub struct ShellInfo {
    pub name: String,
    pub path: String,
}

pub fn list_shells() -> Vec<ShellInfo> {
    #[cfg(unix)]
    {
        unix::list_shells()
    }
    #[cfg(windows)]
    {
        windows::list_shells()
    }
}

fn ensure_utf8_locale(cmd: &mut CommandBuilder) {
    let is_utf8 = |v: &str| {
        let up = v.to_ascii_uppercase();
        up.contains("UTF-8") || up.contains("UTF8")
    };
    let already_utf8 = ["LC_ALL", "LC_CTYPE", "LANG"]
        .iter()
        .any(|k| std::env::var(k).ok().as_deref().is_some_and(is_utf8));
    if already_utf8 {
        return;
    }
    #[cfg(target_os = "macos")]
    let fallback = "en_US.UTF-8";
    #[cfg(all(unix, not(target_os = "macos")))]
    let fallback = "C.UTF-8";
    #[cfg(windows)]
    let fallback = "en_US.UTF-8";
    cmd.env("LANG", fallback);
}

fn apply_common(
    cmd: &mut CommandBuilder,
    cwd: Option<String>,
    control: Option<&ShellControlEnv>,
) {
    cmd.env("TERM", "xterm-256color");
    cmd.env("COLORTERM", "truecolor");
    cmd.env("TERAX_TERMINAL", "1");
    let appimage_overrides = workspace::appimage_env_overrides();
    let clean_path = match appimage_overrides.iter().find(|(key, _)| *key == "PATH") {
        Some((_, value)) => value.clone(),
        None => std::env::var_os("PATH"),
    };
    for (key, value) in appimage_overrides {
        match value {
            Some(v) => cmd.env(key, v),
            None => cmd.env_remove(key),
        }
    }
    if let Some(control) = control {
        cmd.env("TERAX_CONTROL_ADDR", &control.address);
        cmd.env("TERAX_CONTROL_TOKEN", &control.token);
        cmd.env("TERAX_PANE_ID", control.pane_id.to_string());
        if let Some(path) = &control.cli_path {
            cmd.env("TERAX_CLI", path);
        }
        if let Some(bin_dir) = &control.cli_bin_dir {
            let paths = std::iter::once(bin_dir.clone()).chain(
                clean_path
                    .as_deref()
                    .into_iter()
                    .flat_map(std::env::split_paths),
            );
            if let Ok(path) = std::env::join_paths(paths) {
                cmd.env("PATH", path);
            }
        }
    }
    ensure_utf8_locale(cmd);

    let resolved_cwd = cwd
        .map(PathBuf::from)
        .filter(|p| p.is_dir())
        .or_else(|| workspace::launch_cwd_snapshot().filter(|p| p.is_dir()))
        .or_else(|| dirs::home_dir().filter(|p| p.is_dir()));
    if let Some(cwd) = resolved_cwd {
        #[cfg(windows)]
        let cwd = PathBuf::from(cwd.to_string_lossy().replace('/', "\\"));
        log::info!("pty cwd: {}", cwd.display());
        cmd.cwd(cwd);
    } else {
        log::warn!("pty cwd: no usable directory, inheriting from process");
    }
}

#[cfg(unix)]
mod unix {
    use std::path::{Path, PathBuf};

    use portable_pty::CommandBuilder;

    use super::{apply_common, ShellInfo};
    use crate::modules::control::ShellControlEnv;
    use crate::modules::workspace::WorkspaceEnv;

    pub enum Shell {
        Zsh,
        Bash,
        Fish,
        Other,
    }

    impl Shell {
        pub fn classify(path: &str) -> Shell {
            match path.rsplit('/').next().unwrap_or("") {
                "zsh" => Shell::Zsh,
                "bash" => Shell::Bash,
                "fish" => Shell::Fish,
                _ => Shell::Other,
            }
        }

        pub fn detect() -> (Shell, String) {
            let path = login_shell()
                .or_else(|| std::env::var("SHELL").ok())
                .filter(|s| !s.is_empty())
                .unwrap_or_else(|| "/bin/sh".into());
            (Self::classify(&path), path)
        }

        pub fn resolve(shell_override: Option<String>) -> (Shell, String) {
            if let Some(path) = shell_override
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
            {
                if Path::new(&path).is_file() {
                    return (Self::classify(&path), path);
                }
                log::warn!("configured shell '{path}' not found, using auto-detect");
            }
            Self::detect()
        }
    }

    fn login_shell() -> Option<String> {
        use std::ffi::CStr;
        unsafe {
            let uid = libc::getuid();
            let pw = libc::getpwuid(uid);
            if pw.is_null() {
                return None;
            }
            let shell_ptr = (*pw).pw_shell;
            if shell_ptr.is_null() {
                return None;
            }
            CStr::from_ptr(shell_ptr).to_string_lossy().into_owned().into()
        }
    }

    pub fn build(
        cwd: Option<String>,
        _workspace: WorkspaceEnv,
        shell: Option<String>,
        control: Option<ShellControlEnv>,
    ) -> Result<CommandBuilder, String> {
        let (_, shell_path) = Shell::resolve(shell);
        let mut cmd = CommandBuilder::new(&shell_path);
        apply_common(&mut cmd, cwd, control.as_ref());
        log::info!("spawning native shell: {shell_path}");
        Ok(cmd)
    }

    pub fn list_shells() -> Vec<ShellInfo> {
        let mut out = Vec::new();
        let (_, shell_path) = Shell::detect();
        let path = PathBuf::from(&shell_path);
        if path.is_file() {
            out.push(ShellInfo {
                name: path
                    .file_name()
                    .map(|s| s.to_string_lossy().into_owned())
                    .unwrap_or_else(|| shell_path.clone()),
                path: shell_path,
            });
        }
        out
    }
}

#[cfg(windows)]
mod windows {
    use std::path::PathBuf;

    use portable_pty::CommandBuilder;

    use super::{apply_common, windows_shell_path, ShellInfo};
    use crate::modules::control::ShellControlEnv;
    use crate::modules::workspace::WorkspaceEnv;

    pub fn build(
        cwd: Option<String>,
        workspace: WorkspaceEnv,
        shell: Option<String>,
        control: Option<ShellControlEnv>,
    ) -> Result<CommandBuilder, String> {
        if let WorkspaceEnv::Wsl { distro } = workspace {
            return build_wsl(cwd, distro);
        }
        let shell_path = shell
            .map(PathBuf::from)
            .filter(|p| p.is_file())
            .unwrap_or_else(windows_shell_path);
        let mut cmd = CommandBuilder::new(&shell_path);
        if shell_path.file_name().and_then(|s| s.to_str()) == Some("bash.exe") {
            cmd.env("CHERE_INVOKING", "1");
        }
        apply_common(&mut cmd, cwd, control.as_ref());
        log::info!("spawning native shell: {}", shell_path.display());
        Ok(cmd)
    }

    fn build_wsl(cwd: Option<String>, distro: String) -> Result<CommandBuilder, String> {
        crate::modules::workspace::validate_wsl_distro_name(&distro)?;
        let shell_path = crate::modules::workspace::wsl_login_shell(distro.clone())?;
        let args = [
            "-d".to_string(),
            distro,
            "--cd".to_string(),
            cwd.unwrap_or_else(|| "~".to_string()),
            "--exec".to_string(),
            shell_path,
        ];
        let mut cmd = CommandBuilder::new("wsl.exe");
        for arg in args {
            cmd.arg(arg);
        }
        log::info!("spawning native WSL shell");
        Ok(cmd)
    }

    pub fn list_shells() -> Vec<ShellInfo> {
        let mut out = Vec::new();
        let shell_path = windows_shell_path();
        if shell_path.is_file() {
            out.push(ShellInfo {
                name: shell_path
                    .file_stem()
                    .map(|s| s.to_string_lossy().into_owned())
                    .unwrap_or_else(|| "shell".to_string()),
                path: shell_path.to_string_lossy().into_owned(),
            });
        }
        out
    }
}

#[cfg(windows)]
pub fn windows_shell_path() -> PathBuf {
    if let Some(p) = which_in_path("pwsh.exe") {
        return p;
    }
    if let Some(pf) = std::env::var_os("ProgramFiles").map(PathBuf::from) {
        let candidate = pf.join("PowerShell").join("7").join("pwsh.exe");
        if candidate.is_file() {
            return candidate;
        }
    }
    let system32 = std::env::var_os("SystemRoot")
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from(r"C:\Windows"))
        .join("System32");
    let ps5 = system32
        .join("WindowsPowerShell")
        .join("v1.0")
        .join("powershell.exe");
    if ps5.is_file() {
        return ps5;
    }
    system32.join("cmd.exe")
}

#[cfg(windows)]
fn which_in_path(name: &str) -> Option<PathBuf> {
    let path = std::env::var_os("PATH")?;
    for dir in std::env::split_paths(&path) {
        let candidate = dir.join(name);
        if candidate.is_file() {
            return Some(candidate);
        }
    }
    None
}

#[cfg(test)]
mod tests {
    use std::ffi::OsStr;

    use portable_pty::CommandBuilder;

    use super::{apply_common, sanitize_shell_override, ShellControlEnv};

    #[test]
    fn rejects_non_enumerated_override() {
        let exe = std::env::current_exe()
            .unwrap()
            .to_string_lossy()
            .into_owned();
        assert_eq!(sanitize_shell_override(Some(exe)), None);
    }

    #[test]
    fn empty_or_missing_override_is_none() {
        assert_eq!(sanitize_shell_override(Some("   ".into())), None);
        assert_eq!(sanitize_shell_override(None), None);
    }

    #[test]
    fn common_env_includes_authenticated_caller_context() {
        let mut command = CommandBuilder::new("shell");
        let control = ShellControlEnv {
            address: "127.0.0.1:1234".into(),
            token: "secret".into(),
            pane_id: 42,
            cli_path: Some("/app/terax-cli".into()),
            cli_bin_dir: Some(std::path::PathBuf::from("/app/bin")),
        };
        apply_common(&mut command, None, Some(&control));

        assert_eq!(
            command.get_env("TERAX_CONTROL_ADDR"),
            Some(OsStr::new("127.0.0.1:1234"))
        );
        assert_eq!(
            command.get_env("TERAX_CONTROL_TOKEN"),
            Some(OsStr::new("secret"))
        );
        assert_eq!(command.get_env("TERAX_PANE_ID"), Some(OsStr::new("42")));
    }
}
