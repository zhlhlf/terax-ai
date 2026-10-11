use serde::Serialize;

/// The translucent window backdrop a platform can provide.
///
/// Linux is `None` on purpose: blur there is owned by the compositor, not the
/// app, so there is nothing for the app to apply even though the settings
/// toggle stays visible on every platform.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "kebab-case")]
pub enum Backdrop {
    /// macOS `NSVisualEffectView`.
    Vibrancy,
    /// Windows 11 Mica.
    Mica,
    /// Windows 11 21H2: `apply_mica` succeeds through the undocumented
    /// `DWMWA_MICA_EFFECT` attribute, but the backdrop is composited over the
    /// whole window rectangle, so it reads as a flat dark layer and hides the
    /// CSS-painted rounded corners. Offered as an explicit opt-in rather than
    /// reported as `Mica`, which would make the effect look like it came from
    /// the platform rather than from the user overriding it.
    WindowsForce,
    None,
}

/// First build with the documented `DWMWA_SYSTEMBACKDROP_TYPE` attribute.
///
/// Below it `window-vibrancy` falls back to the undocumented
/// `DWMWA_MICA_EFFECT` (build 22000, the first Windows 11).
const MICA_BUILD: u32 = 22523;
/// First Windows 11 build, where the undocumented attribute above becomes
/// available. Windows 10 has no Mica at all and stays `None`.
const WINDOWS_11_BUILD: u32 = 22000;

pub fn backdrop_for(os: &str, build: u32) -> Backdrop {
    match os {
        "macos" => Backdrop::Vibrancy,
        "windows" if build >= MICA_BUILD => Backdrop::Mica,
        "windows" if build >= WINDOWS_11_BUILD => Backdrop::WindowsForce,
        _ => Backdrop::None,
    }
}

#[tauri::command]
pub fn window_backdrop_kind() -> Backdrop {
    backdrop_for(std::env::consts::OS, os_build())
}

/// `dark` only matters for Mica, which tints its own backdrop and cannot read
/// the webview's theme.
#[tauri::command]
pub fn window_set_backdrop(
    window: tauri::Window,
    enabled: bool,
    dark: bool,
) -> Result<(), String> {
    set_backdrop(&window, enabled, dark)
}

#[cfg(target_os = "windows")]
fn os_build() -> u32 {
    use windows_sys::Wdk::System::SystemServices::RtlGetVersion;
    use windows_sys::Win32::System::SystemInformation::OSVERSIONINFOW;

    // GetVersionExW reports 6.2 for unmanifested apps; RtlGetVersion does not.
    let mut info: OSVERSIONINFOW = unsafe { std::mem::zeroed() };
    info.dwOSVersionInfoSize = std::mem::size_of::<OSVERSIONINFOW>() as u32;
    if unsafe { RtlGetVersion(&mut info) } == 0 {
        info.dwBuildNumber
    } else {
        0
    }
}

#[cfg(not(target_os = "windows"))]
fn os_build() -> u32 {
    0
}

#[cfg(target_os = "macos")]
fn set_backdrop(window: &tauri::Window, enabled: bool, _dark: bool) -> Result<(), String> {
    use window_vibrancy::{apply_vibrancy, clear_vibrancy, NSVisualEffectMaterial};

    if enabled {
        // UnderWindowBackground is the material meant for a whole-window
        // backdrop; Sidebar/HudWindow are for panels drawn on top of content.
        apply_vibrancy(window, NSVisualEffectMaterial::UnderWindowBackground, None, None)
            .map_err(|e| e.to_string())
    } else {
        clear_vibrancy(window).map(|_| ()).map_err(|e| e.to_string())
    }
}

#[cfg(target_os = "windows")]
fn set_backdrop(window: &tauri::Window, enabled: bool, dark: bool) -> Result<(), String> {
    use window_vibrancy::{apply_mica, clear_mica};

    if enabled {
        apply_mica(window, Some(dark)).map_err(|e| e.to_string())
    } else {
        clear_mica(window).map_err(|e| e.to_string())
    }
}

#[cfg(not(any(target_os = "macos", target_os = "windows")))]
fn set_backdrop(_window: &tauri::Window, _enabled: bool, _dark: bool) -> Result<(), String> {
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::{backdrop_for, Backdrop, MICA_BUILD};

    #[test]
    fn macos_reports_vibrancy_regardless_of_build() {
        assert_eq!(backdrop_for("macos", 0), Backdrop::Vibrancy);
    }

    #[test]
    fn windows_11_reports_mica() {
        assert_eq!(backdrop_for("windows", MICA_BUILD), Backdrop::Mica);
        assert_eq!(backdrop_for("windows", 26100), Backdrop::Mica);
    }

    #[test]
    fn windows_10_reports_none_because_mica_would_fail() {
        assert_eq!(backdrop_for("windows", 19045), Backdrop::None);
        assert_eq!(backdrop_for("windows", 0), Backdrop::None);
    }

    /// Mica below the documented attribute is composited over the whole window
    /// rectangle, which covers the CSS-painted rounded corners. It is offered
    /// as an opt-in rather than reported as a platform backdrop.
    #[test]
    fn windows_11_21h2_reports_the_force_kind() {
        assert_eq!(backdrop_for("windows", 22000), Backdrop::WindowsForce);
        assert_eq!(backdrop_for("windows", 22000 + 522), Backdrop::WindowsForce);
        assert_eq!(backdrop_for("windows", 22621), Backdrop::Mica);
    }

    #[test]
    fn unsupported_platforms_report_none() {
        assert_eq!(backdrop_for("linux", 99999), Backdrop::None);
        assert_eq!(backdrop_for("freebsd", 0), Backdrop::None);
        assert_eq!(backdrop_for("", 0), Backdrop::None);
    }

    #[test]
    fn serializes_as_kebab_case_for_the_webview() {
        assert_eq!(
            serde_json::to_string(&Backdrop::Vibrancy).unwrap(),
            "\"vibrancy\""
        );
        assert_eq!(serde_json::to_string(&Backdrop::Mica).unwrap(), "\"mica\"");
        assert_eq!(
            serde_json::to_string(&Backdrop::WindowsForce).unwrap(),
            "\"windows-force\""
        );
        assert_eq!(serde_json::to_string(&Backdrop::None).unwrap(), "\"none\"");
    }
}
