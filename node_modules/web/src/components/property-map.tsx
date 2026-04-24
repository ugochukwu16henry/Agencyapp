import Image from "next/image";

const buildMapboxStaticMapUrl = (lat: number, lng: number) => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) return null;
  return `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+f59e0b(${lng},${lat})/${lng},${lat},13,0/900x400?access_token=${token}`;
};

const buildGoogleMapFallback = (lat: number, lng: number) =>
  `https://www.google.com/maps?q=${lat},${lng}&z=13&output=embed`;

export function PropertyMap({
  lat,
  lng,
}: {
  lat?: number | null;
  lng?: number | null;
}) {
  if (typeof lat !== "number" || typeof lng !== "number") {
    return null;
  }

  const mapboxUrl = buildMapboxStaticMapUrl(lat, lng);
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <h2 className="px-4 py-3 text-sm font-semibold text-slate-800">
        Interactive Map Preview
      </h2>
      {mapboxUrl ? (
        <Image
          src={mapboxUrl}
          alt="Property map"
          width={900}
          height={400}
          className="h-64 w-full object-cover"
        />
      ) : (
        <iframe
          src={buildGoogleMapFallback(lat, lng)}
          title="Property map fallback"
          className="h-64 w-full border-0"
          loading="lazy"
        />
      )}
    </section>
  );
}
