# Two-process model and IPC command reference

Rust owns OS access. The webview communicates with it through Tauri IPC commands registered in `src-tauri/src/lib.rs`.

This boundary is the security model. Untrusted input from terminal escape sequences, file contents, or control clients is validated before use and never executed by the renderer.

## Adding a command

1. Define a `#[tauri::command]` in the relevant module.
2. Validate every argument and path.
3. Register it explicitly in `lib.rs`.
4. Add or update focused tests for validation and failure modes.
5. Prefer a narrow typed frontend wrapper over calling `invoke` from components.

## Command surface

### PTY (`src-tauri/src/modules/pty/`)

- `pty_open` - native shell session for a workspace, shell override, pane id, and optional WSL environment.
- `pty_write` - raw terminal input using an `x-pty-id` header and raw IPC body.
- `pty_ack_output` - cumulative frontend parse acknowledgement used for credit-based delivery.
- `pty_resize`, `pty_close` - live session lifecycle.
- `pty_list_shells` - enumerated shell choices for settings.

### Files (`src-tauri/src/modules/fs/`)

- Tree, read, stat, canonicalize, and editor file IO commands.
- Create, rename, move, delete, and batch mutation commands.
- Search, list-files, grep, and glob commands.
- Watch commands for explorer refreshes.

### Workspace (`src-tauri/src/modules/workspace.rs`)

- `workspace_authorize` and `workspace_current_dir` manage authorized roots.
- WSL helpers list distros, resolve the default distro, and read home paths.

### LSP (`src-tauri/src/modules/lsp/`)

- Detect, resolve root, spawn, send, kill, and inspect language-server processes.
- Rust handles process lifetime and JSON-RPC framing; language semantics stay in the frontend.

### History (`src-tauri/src/modules/history/`)

- Suggest, record, list, and inspect terminal command history for the command palette.

### Control (`src-tauri/src/modules/control.rs`)

- `control_frontend_ready` marks the restored main UI ready.
- `control_respond` completes a local control request.

### Window and settings

- `get_launch_dir` and `get_launch_files` drain launch arguments once.
- `open_settings_window` opens the settings webview.
- `vibrancy::window_backdrop_kind` and `vibrancy::window_set_backdrop` support native backdrops.
