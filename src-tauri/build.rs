fn main() {
    configure_gnu_cdylib();
    configure_sidecar();
    tauri_build::build()
}

// windows-gnu: rustc exports every dependency rlib symbol from `cdylib`s, which
// overflows the PE/COFF 16-bit export-ordinal limit (rust-lang/rust#92212) —
// `ld: error: export ordinal too large`. Restrict the cdylib to its own symbols.
fn configure_gnu_cdylib() {
    let Ok(target) = std::env::var("TARGET") else {
        return;
    };
    if target.contains("windows") && target.contains("gnu") {
        println!("cargo::rustc-link-arg-cdylib=-Wl,--exclude-libs=ALL");
    }
}

fn configure_sidecar() {
    let Ok(target) = std::env::var("TARGET") else {
        return;
    };
    let extension = if target.contains("windows") {
        ".exe"
    } else {
        ""
    };
    let path = std::path::PathBuf::from("binaries").join(format!("terax-cli-{target}{extension}"));
    let valid =
        std::fs::metadata(&path).is_ok_and(|metadata| metadata.is_file() && metadata.len() > 0);
    if valid {
        return;
    }
    if std::env::var("PROFILE").as_deref() == Ok("release") {
        panic!(
            "release sidecar {} is missing or empty; run pnpm build:cli before packaging",
            path.display()
        );
    }

    let mut config = std::env::var("TAURI_CONFIG")
        .map(|value| serde_json::from_str(&value).expect("parse TAURI_CONFIG"))
        .unwrap_or_else(|_| serde_json::json!({}));
    config["bundle"]["externalBin"] = serde_json::json!([]);
    std::env::set_var(
        "TAURI_CONFIG",
        serde_json::to_string(&config).expect("serialize TAURI_CONFIG"),
    );
}
