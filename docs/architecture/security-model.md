# Security model

Terax runs shells and reads and writes files. Its security model validates data at every boundary and keeps OS access in Rust.

## Boundaries

1. **IPC boundary** - commands are registered explicitly and validated in Rust.
2. **File-system boundary** - file commands normalize and validate paths before IO.
3. **Workspace boundary** - PTY spawn and file operations use the workspace authorization registry.
4. **Plugin boundary** - webview plugin APIs are capability-gated in `src-tauri/capabilities/default.json`.
5. **Terminal boundary** - escape sequences are parsed conservatively and never treated as executable commands.

## Workspace authorization registry

`WorkspaceRegistry` tracks directories that PTY spawn and file operations may use.

- `workspace_authorize` adds a directory.
- `authorize_spawn_cwd` rejects a spawn cwd outside an authorized root.
- `authorize_user_spawn_cwd` registers the user's chosen cwd as a new root.
- The registry is bootstrapped with the launch directory and the user's home directory.

Any new feature that spawns a shell or mutates files outside the current workspace must interact with this registry.

## Control bridge

The control server listens only on local loopback. Its token is injected into Terax-spawned native shells with the pane id and must never be logged or echoed.

## Invariants

- New file-system-touching commands must respect the workspace authorization registry.
- New plugin APIs must be added to the capability allowlist.
- Tokens, credentials, and user secrets must never appear in logs or command output.
