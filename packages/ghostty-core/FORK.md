# Terax Ghostty core lineage

The production core is the maintained adaptation documented in
`adapted/UPSTREAM.md`. It adapts the mature bulk render-state bridge from
Restty onto current pinned Ghostty source, without importing the Restty
application runtime, PTY transport, or per-pane GPU lifecycle. It is the model
loaded by the `ghostty-webgl` and `ghostty-webgpu` backends.

Two earlier experimental integrations have been removed:

- the legacy `coder/ghostty-web` fork, built with
  `patches/ghostty-wasm-api.patch`; and
- the unmodified upstream ABI evaluation core under `official/`.

Neither was imported by the active runtime. Their types and key constants
remain reachable through the `./protocol` entry point, which does not load any
WASM.

## Adapted core provenance

- Ghostty source: `https://github.com/ghostty-org/ghostty`
- Restty source: `https://github.com/wiedymi/restty`
- Build: Zig WASM `ReleaseFast`, SIMD plus scalar variants

See `adapted/UPSTREAM.md` for the pinned commits, artifact sizes, and SHA-256
checksums, and `patches/ghostty-el0-pending-wrap.patch` for the single retained
source patch.

Terax imports only the low-level WASM bridge and input encoder. Rendering,
scheduling, PTY transport, and GPU resource ownership live outside this
package. The adaptation retains the upstream Ghostty MIT license
(`adapted/LICENSE.ghostty`) and the Restty MIT license
(`adapted/LICENSE.restty`).
