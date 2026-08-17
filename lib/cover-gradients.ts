const MESHES = ["cover-mesh-1", "cover-mesh-2", "cover-mesh-3", "cover-mesh-4", "cover-mesh-5", "cover-mesh-6"];

/** Deterministic art-directed gradient class for a given id/string — stands in for stock photography. */
export function coverMesh(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return MESHES[Math.abs(hash) % MESHES.length];
}
