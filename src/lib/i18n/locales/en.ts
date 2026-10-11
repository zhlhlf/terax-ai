/**
 * Source-of-truth dictionary. `zh-CN` must satisfy this exact shape.
 * Flat dot-notation keys, grouped by area. Do not translate here.
 */
export const en = {
  // ── Settings: top-level navigation ────────────────────────────────────
  "settings.tab.general": "General",
  "settings.tab.editor": "Editor",
  "settings.tab.themes": "Themes",
  "settings.tab.shortcuts": "Shortcuts",
  "settings.tab.models": "Models",
  "settings.tab.agents": "Agents",
  "settings.tab.about": "About",

  // ── Settings: General ─────────────────────────────────────────────────
  "settings.general.title": "General",
  "settings.general.description": "Mode, terminal, and startup.",
  "settings.general.appearance": "Appearance",
  "settings.general.appearance.system": "System",
  "settings.general.appearance.light": "Light",
  "settings.general.appearance.dark": "Dark",
  "settings.general.appearance.hint1":
    "For theme, background and customization, see the",
  "settings.general.appearance.hint2": "tab.",
  "settings.general.zoom": "Zoom",
  "settings.general.zoom.level": "UI zoom level",
  "settings.general.language": "Language",
  "settings.general.language.description":
    "Interface language. Applies immediately across all windows.",
  "settings.general.explorer": "Explorer",
  "settings.general.showHidden.title": "Show hidden files",
  "settings.general.showHidden.description":
    "Include dot-prefixed files and folders (.env, .gitignore, .config) in the file explorer and search.",
  "settings.general.gitDecorations.title": "Git decorations",
  "settings.general.gitDecorations.description":
    "Tint changed files and dim gitignored entries in the file explorer.",
  "settings.general.terminal": "Terminal",
  "settings.general.renderer.title": "Terminal renderer",
  "settings.general.renderer.description":
    "Automatic uses WebGPU with WebGL fallback. Choose WebGL for graphics compatibility. Applies to new terminals.",
  "settings.general.renderer.auto": "Automatic",
  "settings.general.renderer.webgl": "WebGL",
  "settings.general.screenReader.title": "Screen reader support",
  "settings.general.screenReader.description":
    "Expose terminal output as accessible text. Page Up and Page Down browse history when the output region is focused.",
  "settings.general.cursorBlink.title": "Cursor blinking",
  "settings.general.cursorBlink.description":
    "Blink the terminal cursor. Off by default for lower idle CPU, matching VS Code and the macOS terminal.",
  "settings.general.cursorStyle.title": "Cursor style",
  "settings.general.cursorStyle.description": "Shape of the terminal cursor.",
  "settings.general.cursorStyle.bar": "Bar",
  "settings.general.cursorStyle.block": "Block",
  "settings.general.cursorStyle.underline": "Underline",
  "settings.general.fontFamily.title": "Font family",
  "settings.general.fontFamily.description":
    'Nerd Font name for icons (e.g. "CaskaydiaCove Nerd Font Mono"). Leave blank to auto-detect.',
  "settings.general.fontFamily.placeholder": "Auto-detect",
  "settings.general.fontWeight.title": "Font weight",
  "settings.general.fontWeight.description": "Thickness of terminal characters",
  "settings.general.fontWeight.normal": "Normal",
  "settings.general.fontWeight.medium": "Medium",
  "settings.general.fontWeight.semiBold": "Semi-Bold",
  "settings.general.fontWeight.bold": "Bold",
  "settings.general.shell.title": "Integrated terminal shell",
  "settings.general.shell.description":
    "Shell for new terminal tabs. Existing tabs keep their shell.",
  "settings.general.shell.descriptionWsl":
    "Shell for the integrated terminal. WSL spaces use the distro login shell. Existing tabs keep their shell.",
  "settings.general.shell.descriptionUnsupported":
    "Command blocks and directory tracking are unavailable for this shell.",
  "settings.general.shell.auto": "Auto",
  "settings.general.workspaceEnv.title": "Workspace environment",
  "settings.general.workspaceEnv.description":
    "Where new spaces run, terminal and AI agent alike: Windows or a WSL distro. Existing spaces keep theirs; switch any from the status bar.",
  "settings.general.workspaceEnv.local": "Windows",
  "settings.general.workspaceEnv.unavailable": "{name} (unavailable)",
  "settings.general.letterSpacing.title": "Letter spacing",
  "settings.general.letterSpacing.description":
    "Extra horizontal space between characters (px). Use negative values to tighten Nerd Fonts.",
  "settings.general.fontSize.title": "Font size",
  "settings.general.fontSize.description": "Terminal text size.",
  "settings.general.scrollback.title": "Scrollback",
  "settings.general.scrollback.description":
    "Lines of history kept per terminal. Higher uses more RAM (~3 KB / line).",
  "settings.general.confirmClose.title":
    "Confirm before killing a running process",
  "settings.general.confirmClose.description":
    "Ask before closing a terminal tab or quitting while a command is still running. Unsaved editor changes are always confirmed.",
  "settings.general.agents": "Agents",
  "settings.general.agentNotifications.title": "Coding agent notifications",
  "settings.general.agentNotifications.description":
    "Alert when a coding agent needs your input or finishes. Native notification when Terax is unfocused, in-app otherwise.",
  "settings.general.notificationSound.title": "Notification sound",
  "settings.general.notificationSound.description":
    "Play a sound with agent notifications and in-app alerts.",
  "settings.general.startup": "Startup",
  "settings.general.autostart.title": "Launch at login",
  "settings.general.autostart.description":
    "Open Terax automatically when you sign in.",
  "settings.general.restoreWindow.title": "Restore window position & size",
  "settings.general.restoreWindow.description":
    "Reopen the main window where you left it. Applies on next launch.",
  "settings.general.notificationTest.idle": "Test in 2s",
  "settings.general.notificationTest.waiting": "Switch apps...",
  "settings.general.notificationTest.sending": "Sending...",
  "settings.general.notificationTest.requested": "Requested",
  "settings.general.notificationTest.denied": "Blocked",
  "settings.general.notificationTest.failed": "Failed",
  "settings.general.notificationTest.titleIdle":
    "Send a native test notification after two seconds",
  "settings.general.notificationTest.titleWaiting":
    "Switch to another app to verify native delivery",
  "settings.general.notificationTest.titleRequested":
    "The native notification was requested",
  "settings.general.notificationTest.titleDenied":
    "Notifications are disabled by the system",
  "settings.general.notificationTest.titleFailed":
    "Terax could not request a native notification",
  "settings.general.px": "{value} px",
  "settings.general.lines": "{n} lines",

  // ── Settings: Editor ──────────────────────────────────────────────────
  "settings.editor.title": "Editor",
  "settings.editor.description":
    "Editing behavior, saving, and language servers.",
  "settings.editor.appearance": "Appearance",
  "settings.editor.fontSize.title": "Font size",
  "settings.editor.fontSize.description": "Code editor text size.",
  "settings.editor.editing": "Editing",
  "settings.editor.vim.title": "Vim mode",
  "settings.editor.vim.description":
    "Enable Vim keybindings in the code editor.",
  "settings.editor.wordWrap.title": "Word wrap",
  "settings.editor.wordWrap.description":
    "Wrap long lines instead of scrolling horizontally.",
  "settings.editor.wrapColumn.title": "Wrap column",
  "settings.editor.wrapColumn.description":
    "Soft-wrap at this column, or earlier when the editor is narrower.",
  "settings.editor.saving": "Saving",
  "settings.editor.autoSave.title": "Auto save",
  "settings.editor.autoSave.description":
    "Automatically save files after a delay when changes are detected.",
  "settings.editor.autoSaveDelay.title": "Auto save delay",
  "settings.editor.autoSaveDelay.description":
    "Delay before unsaved changes are saved automatically.",
  "settings.editor.formatOnSave.title": "Format on save",
  "settings.editor.formatOnSave.description":
    "Format the file on explicit save (Cmd+S / :w) with the formatter below.",
  "settings.editor.formatter.title": "Formatter",
  "settings.editor.formatter.description":
    "Language server formats the buffer before writing; external tools run on the saved file from your PATH.",
  "settings.editor.customCommand.title": "Custom command",
  "settings.editor.customCommand.description":
    "Runs on the saved file; {file} is replaced with the quoted path (appended when omitted).",
  "settings.editor.customCommand.placeholder": "mytool --fix {file}",
  "settings.editor.languageOverrides.title": "Language overrides",
  "settings.editor.languageOverrides.description":
    "Use a different formatter for specific languages (e.g. Ruff for Python).",
  "settings.editor.languageOverrides.add": "Add override",
  "settings.editor.removeOverride": "Remove override",
  "settings.editor.formatter.lsp": "Language server",
  "settings.editor.formatter.custom": "Custom command",
  "settings.editor.milliseconds": "ms",
  "settings.editor.columns": "columns",

  // ── Settings: Themes ──────────────────────────────────────────────────
  "settings.themes.title": "Themes",
  "settings.themes.description": "Theme, background image, and customization.",
  "settings.themes.theme": "Theme",
  "settings.themes.create": "Create",
  "settings.themes.import": "Import .terax-theme",
  "settings.themes.editTheme": "Edit {name}",
  "settings.themes.removeTheme": "Remove {name}",
  "settings.themes.mica.title": "Mica background",
  "settings.themes.mica.description":
    "Blend the header, status bar and gutters into the desktop wallpaper. Windows 11 only.",
  "settings.themes.vibrancy.title": "Window vibrancy",
  "settings.themes.vibrancy.description":
    "Frost the header, status bar and gutters over what is behind the window. Panes stay solid.",
  "settings.themes.editorTheme": "Editor theme",
  "settings.themes.editorTheme.description":
    "Syntax colors for the code editor. Auto follows the app theme.",
  "settings.themes.editorTheme.auto": "Auto (match app theme)",
  "settings.themes.background": "Background",
  "settings.themes.replaceImage": "Replace image",
  "settings.themes.chooseImage": "Choose image",
  "settings.themes.opacity": "Opacity",
  "settings.themes.blur": "Blur",
  "settings.themes.dropHint":
    "Drop an image here or pick one. Stored locally; doesn't affect the default look until set.",
  "settings.themes.error.notImage": "{file}: not an image",
  "settings.themes.error.importFailed": "failed to import image",
  "settings.themes.error.readFailed": "failed to read",

  // ── Settings: Shortcuts ───────────────────────────────────────────────
  "settings.shortcuts.title": "Shortcuts",
  "settings.shortcuts.description": "View and customize keyboard shortcuts.",
  "settings.shortcuts.search": "Search shortcuts...",
  "settings.shortcuts.resetAll": "Reset all shortcuts?",
  "settings.shortcuts.resetAll.description":
    "This will revert all your custom keyboard shortcuts to their factory defaults. This action cannot be undone.",
  "settings.shortcuts.resetAllAction": "Reset All",
  "settings.shortcuts.cancel": "Cancel",
  "settings.shortcuts.reset": "Reset",
  "settings.shortcuts.resetToDefault": "Reset to default",
  "settings.shortcuts.clear": "Clear shortcut",
  "settings.shortcuts.unassigned": "Unassigned",
  "settings.shortcuts.recording": "Recording...",
  "settings.shortcuts.recordingCancel": "(Esc to cancel)",

  // ── Settings: About ───────────────────────────────────────────────────
  "settings.about.title": "About",
  "settings.about.build": "Build",
  "settings.about.bundleId": "Bundle ID",
  "settings.about.license": "License",
  "settings.about.sourceCode": "Source code",
  "settings.about.website": "Website",
  "settings.about.tagline": "Open-source AI-native terminal emulator",
  "settings.about.upToDate": "You're up to date",
  "settings.about.checking": "Checking…",
  "settings.about.downloading": "Downloading…",
  "settings.about.installVersion": "Install v{version}",
  "settings.about.updateVersion": "Update to v{version}",
  "settings.about.checkFailed": "Check failed — retry",
  "settings.about.restartToInstall": "Restart to install",
  "settings.about.checkForUpdates": "Check for updates",
  "settings.about.viewOnGithub": "View on GitHub",
  "settings.about.reportIssue": "Report an issue",

  // ── Settings: Models ──────────────────────────────────────────────────
  "settings.models.title": "Models",
  "settings.models.description":
    "Connect the providers you use. Keys live in your OS keychain and are used only by Terax.",
  "settings.models.providers": "Providers",
  "settings.models.addProvider": "Add provider",
  "settings.models.cloud": "Cloud",
  "settings.models.localAndCustom": "Local & custom",
  "settings.models.empty.title": "No providers connected yet.",
  "settings.models.empty.hint":
    'Click "Add provider" to connect a cloud or local model source.',
  "settings.models.defaults": "Defaults",
  "settings.models.chatModel": "Chat model",
  "settings.models.autocomplete": "Autocomplete",
  "settings.models.trigger": "Trigger",
  "settings.models.triggerAutomatic": "Automatic (as you type)",
  "settings.models.triggerManual": "Manual ({shortcut})",
  "settings.models.shortcutFallback": "shortcut",
  "settings.models.notConnected": "not connected",
  "settings.models.providerNotConnected":
    "{name} isn't connected — add it below.",
  "settings.models.connected": "Connected",
  "settings.models.getKey": "Get key",
  "settings.models.enterApiKey": "Enter your API key.",
  "settings.models.keyPrefixError": '{name} keys start with "{prefix}".',
  "settings.models.saveFailed": "Failed to save: {error}",
  "settings.models.pasteApiKey": "Paste API key",
  "settings.models.showKey": "Show key",
  "settings.models.hideKey": "Hide key",
  "settings.models.docs": "Docs",
  "settings.models.test": "Test",
  "settings.models.tokens": "tokens",
  "settings.models.save": "Save",
  "settings.models.reachable": "Reachable — server responded.",
  "settings.models.unreachable": "Could not reach the server.",
  "settings.models.openaiCompatible": "OpenAI Compatible",
  "settings.models.voice.descriptionOpenai":
    "Uses your official OpenAI API key and the Whisper model for transcription.",
  "settings.models.voice.descriptionGroq":
    "Uses your official Groq API key and Groq's Whisper endpoint for transcription.",
  "settings.models.voice.descriptionWhispercpp":
    "Connects to a local Whisper.cpp server for fully offline transcription.",
  "settings.models.meta.lmstudio.description":
    "Run GGUF models via LM Studio's HTTP server (Developer tab → enable).",
  "settings.models.meta.lmstudio.hintPre":
    "The model id loaded in LM Studio — see the server's",
  "settings.models.meta.lmstudio.hintPost": "page.",
  "settings.models.meta.mlx.description":
    "Apple-silicon inference via mlx_lm.server (pip install mlx-lm).",
  "settings.models.meta.mlx.hint":
    "The Hugging Face repo path you launched mlx_lm.server with.",
  "settings.models.meta.ollama.description":
    "Local models via Ollama's built-in OpenAI-compatible API.",
  "settings.models.meta.ollama.hint":
    "The model name from `ollama list` / `ollama pull`.",
  "settings.models.meta.compat.description":
    "Any OpenAI-compatible endpoint — vLLM, Z.AI, Fireworks, etc.",
  "settings.models.meta.openrouter.description":
    "Any model on OpenRouter — type its full provider/model id.",
  "settings.models.meta.openrouter.hintPre": "Browse ids at",
  "settings.models.loading": "Loading…",
  "settings.models.testing": "Testing…",
  "settings.models.removeProvider": "Remove provider",
  "settings.models.removeEndpoint": "Remove endpoint",
  "settings.models.removeKey": "Remove key",
  "settings.models.baseUrl": "Base URL",
  "settings.models.modelId": "Model ID",
  "settings.models.context": "Context",
  "settings.models.apiKey": "API key",
  "settings.models.name": "Name",
  "settings.models.name.placeholder": "My endpoint",
  "settings.models.baseUrl.placeholder": "https://api.example.com/v1",
  "settings.models.modelId.placeholder": "gpt-4o, qwen3-max, glm-4.6, …",
  "settings.models.apiKey.placeholder":
    "Optional — leave empty for unauthenticated endpoints",
  "settings.models.voiceInput": "Voice input",
  "settings.models.stt.whispercpp": "Whisper.cpp (local)",
  "settings.models.stt.provider": "Provider",
  "settings.models.stt.model": "Model",
  "settings.models.stt.model.placeholder": "whisper-large-v3-turbo",
  "settings.models.stt.baseUrl": "Base URL",
  "settings.models.deleteKey": "Delete",

  // ── Settings: Agents ──────────────────────────────────────────────────
  "settings.agents.title": "Agents",
  "settings.agents.description":
    "Personas and snippets the AI uses. Switch agents from the input bar.",
  "settings.agents.agents": "Agents",
  "settings.agents.newAgent": "New agent",
  "settings.agents.editAgent": "Edit agent",
  "settings.agents.builtIn": "Built-in",
  "settings.agents.active": "Active",
  "settings.agents.useAgent": "Use agent",
  "settings.agents.snippets": "Snippets",
  "settings.agents.newSnippet": "New snippet",
  "settings.agents.editSnippet": "Edit snippet",
  "settings.agents.snippets.hint1":
    "Reusable instructions you can drop into any prompt with",
  "settings.agents.snippets.hint2": ".",
  "settings.agents.snippets.empty1":
    "No snippets yet. Create one and insert it with",
  "settings.agents.snippets.empty2": "in the AI input.",
  "settings.agents.handle.errorRequired": "Required.",
  "settings.agents.handle.errorFormat":
    "Lowercase letters, digits, and dashes only.",
  "settings.agents.handle.errorTaken": "Already in use.",
  "settings.agents.icon": "Icon",
  "settings.agents.name": "Name",
  "settings.agents.name.placeholder": "e.g. Test Engineer",
  "settings.agents.description.label": "Description",
  "settings.agents.description.placeholder":
    "One line — shown in the agent picker",
  "settings.agents.instructions": "Instructions",
  "settings.agents.instructions.placeholder":
    "Persona & rules. Appended to Terax's core system prompt.",
  "settings.agents.handle": "Handle",
  "settings.agents.handle.placeholder": "review",
  "settings.agents.snippetName.placeholder": "e.g. Pre-merge review checklist",
  "settings.agents.snippetDescription.placeholder":
    "One line — shown in the # picker",
  "settings.agents.content": "Content",
  "settings.agents.content.placeholder":
    "Inserted into the prompt as a <snippet> block when you use #handle.",
  "settings.agents.customInstructions": "Custom instructions",
  "settings.agents.customInstructions.placeholder":
    "e.g. Always reply in concise bullet points. Prefer pnpm over npm. My machine is an M-series Mac.",
  "settings.agents.saved": "Saved",
  "settings.agents.edit": "Edit",
  "settings.agents.delete": "Delete",

  // ── Built-in agents (name + description only; instructions stay English) ─
  "agent.builtin.coder.name": "Coder",
  "agent.builtin.coder.description":
    "General-purpose coding assistant. Writes, edits, and runs.",
  "agent.builtin.architect.name": "Architect",
  "agent.builtin.architect.description":
    "Design and tradeoffs. Plans before code.",
  "agent.builtin.reviewer.name": "Code Reviewer",
  "agent.builtin.reviewer.description":
    "Reviews diffs for correctness, perf, security.",
  "agent.builtin.security.name": "Security",
  "agent.builtin.security.description":
    "Threat-models changes and flags vulns.",
  "agent.builtin.designer.name": "Designer",
  "agent.builtin.designer.description": "UI/UX critique and refinement.",

  // ── Settings: shared ──────────────────────────────────────────────────
  "settings.common.remove": "Remove",
  "settings.common.replace": "Replace",
  "settings.common.save": "Save",
  "settings.common.cancel": "Cancel",
  "settings.install.copyCommand": "Copy install command",
  "settings.lsp.languageServers": "Language servers",
  "settings.lsp.addCustomServer": "Add custom server",
  "settings.lsp.detectAgain": "Detect again",
  "settings.lsp.removeServer": "Remove server",
  "settings.lsp.customServer": "Custom language server",
  "settings.lsp.checking": "checking...",
  "settings.lsp.notFound": "not found on PATH",
  "settings.lsp.enable": "Enable {name} language server",
  "settings.lsp.disable": "Disable {name} language server",
  "settings.lsp.field.name": "Name",
  "settings.lsp.field.command": "Command",
  "settings.lsp.field.arguments": "Arguments",
  "settings.lsp.field.extensions": "File extensions",
  "settings.lsp.field.languageId": "LSP language id",
  "settings.lsp.field.rootMarkers": "Root markers",
  "settings.lsp.addServer": "Add server",
  "settings.lsp.install.title": "Install {name} language server",
  "settings.lsp.install.descriptionPre": "Terax could not find",
  "settings.lsp.install.descriptionPost":
    "on your PATH. Install it, then check again to enable this language server.",
  "settings.lsp.install.manual":
    "Install this custom server manually and make sure its command is available on PATH.",
  "settings.lsp.install.stillNotFound":
    "Still not found. Finish the installation and make sure the command is available on PATH.",
  "settings.lsp.install.documentation": "Documentation",
  "settings.lsp.install.checking": "Checking...",
  "settings.lsp.install.checkAgain": "Check again",

  // ── Shortcut labels (values are i18n keys via `shortcut.<id>`) ────────
  "shortcut.commandPalette.open": "Open command palette",
  "shortcut.commandPalette.content": "Find in files",
  "shortcut.settings.open": "Open settings",
  "shortcut.tab.new": "New tab",
  "shortcut.tab.newBlock": "New Blocks terminal",
  "shortcut.tab.newPrivate": "New private terminal",
  "shortcut.tab.newPreview": "New web preview",
  "shortcut.tab.newEditor": "New editor tab",
  "shortcut.tab.close": "Close tab or pane",
  "shortcut.pane.splitRight": "Split pane right",
  "shortcut.pane.splitDown": "Split pane down",
  "shortcut.pane.focusNext": "Focus next pane",
  "shortcut.pane.focusPrev": "Focus previous pane",
  "shortcut.pane.swapLeft": "Swap pane left",
  "shortcut.pane.swapRight": "Swap pane right",
  "shortcut.pane.swapUp": "Swap pane up",
  "shortcut.pane.swapDown": "Swap pane down",
  "shortcut.pane.source": "Toggle source panel",
  "shortcut.terminal.clear": "Clear terminal",
  "shortcut.terminal.toggleInput": "Toggle Shell / AI input",
  "shortcut.blocks.prev": "Previous command block",
  "shortcut.blocks.next": "Next command block",
  "shortcut.tab.next": "Next tab",
  "shortcut.tab.prev": "Previous tab",
  "shortcut.tab.selectByIndex": "Jump to tab 1–9",
  "shortcut.space.next": "Next space",
  "shortcut.space.prev": "Previous space",
  "shortcut.space.overview": "Open spaces",
  "shortcut.explorer.search": "Search files",
  "shortcut.search.focus": "Find in tab",
  "shortcut.ai.toggle": "Toggle AI agent",
  "shortcut.ai.toggleMini": "Toggle AI chat window",
  "shortcut.ai.askSelection": "Ask AI about selection",
  "shortcut.agent.focusAttention": "Jump to agent needing attention",
  "shortcut.sidebar.toggle": "Toggle file explorer",
  "shortcut.explorer.focus": "Toggle file explorer focus",
  "shortcut.explorer.toggleHidden": "Toggle hidden files",
  "shortcut.view.zoomIn": "Zoom in",
  "shortcut.view.zoomOut": "Zoom out",
  "shortcut.view.zoomReset": "Reset zoom",
  "shortcut.view.zenMode": "Toggle zen mode",
  "shortcut.editor.undo": "Undo",
  "shortcut.editor.redo": "Redo",
  "shortcut.editor.save": "Save file",
  "shortcut.editor.aiComplete": "Trigger AI completion",
  "shortcut.editor.codeComplete": "Trigger code completion",

  // ── Shortcut groups ───────────────────────────────────────────────────
  "shortcutGroup.General": "General",
  "shortcutGroup.Tabs": "Tabs",
  "shortcutGroup.Spaces": "Spaces",
  "shortcutGroup.Panes": "Panes",
  "shortcutGroup.Terminal": "Terminal",
  "shortcutGroup.View": "View",
  "shortcutGroup.Search": "Search",
  "shortcutGroup.AI": "AI",
  "shortcutGroup.Editor": "Editor",
} as const;
