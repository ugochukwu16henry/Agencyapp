export type MapProvider = "MAPBOX" | "GOOGLE";

export type MapViewport = {
  lat: number;
  lng: number;
  zoom?: number;
};

export function buildMapboxStaticMapUrl(viewport: MapViewport) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return null;

  const zoom = viewport.zoom ?? 13;
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+f59e0b(${viewport.lng},${viewport.lat})/${viewport.lng},${viewport.lat},${zoom},0/900x400?access_token=${token}`;
}

export function buildGoogleMapFallback(viewport: MapViewport) {
  return `https://www.google.com/maps?q=${viewport.lat},${viewport.lng}&z=${viewport.zoom ?? 13}&output=embed`;
}
