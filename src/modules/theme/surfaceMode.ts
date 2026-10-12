export type SurfaceMode = "app-alpha" | "native-backdrop" | "image";

type Inputs = {
  backgroundKind: "none" | "image";
  backgroundImageId: string | null;
  windowVibrancy: boolean;
  nativeBackdropAvailable: boolean;
};

export function resolveSurfaceMode({
  backgroundKind,
  backgroundImageId,
  windowVibrancy,
  nativeBackdropAvailable,
}: Inputs): SurfaceMode {
  if (windowVibrancy && nativeBackdropAvailable) return "native-backdrop";
  return backgroundKind === "image" && !!backgroundImageId
    ? "image"
    : "app-alpha";
}
