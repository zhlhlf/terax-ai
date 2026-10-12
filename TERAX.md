# TERAX.md

Terax loads this file from the repository root as project memory. It is also the living architecture reference; read it before changing code.

## Project

**Terax** is an open-source terminal emulator. It uses a Tauri 2 + Rust backend with `portable-pty`, and a React 19 + TypeScript frontend backed by libghostty-vt with WebGPU rendering and a WebGL fallback.

- Bundle id: `app.zhlhlf.terax`
- Package manager: pnpm
- Platforms: macOS, Linux, Windows

## Quality bar

Production-grade or it does not ship. Check correctness, concurrency, failure modes, performance, security, and UX together. Unused code and dependencies are a defect.

Verify with:

```text
pnpm check-types
pnpm test
pnpm lint
cd src-tauri && cargo check --all-targets
```

A change to PTY spawning, workspace authorization, file IO, IPC, or renderer lifecycle needs a focused test that locks the invariant.

## Architecture

### Rust boundary

The webview does not access the filesystem, processes, or shells directly. Rust owns OS access and exposes a narrow IPC surface:

- `pty::*`: long-lived interactive sessions, raw input, credit-based output, exit reporting, and workspace-gated spawning.
- `fs::*`: file explorer, editor IO, search, grep, glob, and mutation.
- `shell::*`: one-shot and background shell helpers used by non-interactive features.
- `workspace::*`: authorized workspace roots and WSL helpers.
- `lsp::*`: language-server process hosting and framed JSON-RPC transport.
- `history::*`: command history used by the command palette.
- `control::*`: authenticated local control bridge.
- `open_settings_window`: separate settings webview.
- `vibrancy::*`: native window backdrop support.

Shells are native. Terax does not inject profiles or wrapper scripts. `shell_init::build_command` resolves the selected shell, applies common environment variables and workspace cwd, and starts the shell directly. WSL is launched through `wsl.exe` with the selected distro and cwd.

### Frontend

- `app/`: workspace composition, tabs, panes, command handling, global shortcuts.
- `modules/terminal/`: Ghostty VT models, rendering, PTY transport, and tab lifecycle.
- `modules/editor/`: CodeMirror editor stack, buffers, formatting, themes, and LSP integration.
- `modules/explorer/`: file tree, search, file operations, and drag-and-drop.
- `modules/settings/`: settings app and persistence.
- `modules/markdown/`: preview rendering.
- `modules/spaces/`: workspace spaces and persisted layout.
- `modules/command-palette/`: command catalog and palette.
- `modules/shortcuts/`: keyboard shortcut registry and matching.

Tabs and panes may contain terminal, editor, markdown, or web preview leaves.

## Security

- PTY spawn and file commands go through the workspace authorization registry.
- File mutation commands validate paths before touching disk.
- IPC commands are registered explicitly; webview plugin APIs are capability-gated.
- Local control credentials are scoped to the local loopback and never logged.

## Conventions

- Imports use `@/...`, never relative imports across modules.
- Use pnpm; do not use npm, npx, or yarn.
- Prefer dependency-light pure functions over hidden imperative logic.
- Do not add comments unless they explain a non-obvious invariant or workaround.
- No emojis. Avoid em-dashes.
- Normalize Windows paths at boundaries; frontend canonical paths use forward slashes.

## Platform notes

- Windows uses ConPTY. `CONPTY_LIFECYCLE_LOCK` serializes open and close, and the Job Object kills descendants when Terax exits.
- Terminal input sends CR (`\r`) for Enter.
- Windows shell priority is PowerShell 7, Windows PowerShell, then cmd. Unix uses the selected shell resolved from the user environment.
- The updater, window state, autostart, clipboard, opener, OS metadata, log, process, and store plugins remain wired only where needed.
