// Chennai localities (approx coordinates)
// You can tweak/extend this list any time.
export const LOCATIONS = [
  { name: 'T Nagar',         lat: 13.0418, lon: 80.2333 },
  { name: 'Anna Nagar',      lat: 13.0860, lon: 80.2100 },
  { name: 'Adyar',           lat: 13.0012, lon: 80.2550 },
  { name: 'Velachery',       lat: 12.9791, lon: 80.2212 },
  { name: 'Tambaram',        lat: 12.9229, lon: 80.1275 },
  { name: 'Guindy',          lat: 13.0108, lon: 80.2206 },
  { name: 'Mylapore',        lat: 13.0330, lon: 80.2696 },
  { name: 'Kodambakkam',     lat: 13.0510, lon: 80.2214 },
  { name: 'Porur',           lat: 13.0380, lon: 80.1588 },
  { name: 'Ambattur',        lat: 13.1143, lon: 80.1548 },
  { name: 'Sholinganallur',  lat: 12.8926, lon: 80.2270 },
  { name: 'Chromepet',       lat: 12.9507, lon: 80.1394 },
]

// Haversine distance (kilometers)
export function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = d => (d * Math.PI) / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Fare bands (distance-based)
// Zones tuned for city travel and typical pass pricing. Adjust to your policy.
const ZONES = [
  { maxKm: 5,   monthly: 600  },
  { maxKm: 10,  monthly: 900  },
  { maxKm: 20,  monthly: 1200 },
  { maxKm: 35,  monthly: 1500 },
  { maxKm: 50,  monthly: 1800 },
  { maxKm: 999, monthly: 2200 },
]

// Multipliers for periods
// Weekly ≈ 35% of monthly, Yearly ≈ 10x monthly (with ~2 months discount).
const PERIOD_MULTIPLIER = {
  weekly: 0.35,
  monthly: 1,
  yearly: 10,
}

// Calculates price in INR given src/dst + passType ("weekly"|"monthly"|"yearly")
export function calculateFareINR(srcName, dstName, passType) {
  const src = LOCATIONS.find(l => l.name === srcName)
  const dst = LOCATIONS.find(l => l.name === dstName)
  if (!src || !dst || src === dst) return 0

  const km = haversineKm(src.lat, src.lon, dst.lat, dst.lon)
  const zone = ZONES.find(z => km <= z.maxKm) || ZONES[ZONES.length - 1]
  const monthlyBase = zone.monthly
  const mult = PERIOD_MULTIPLIER[passType] ?? 1
  const price = Math.round(monthlyBase * mult)

  return { km: parseFloat(km.toFixed(2)), zoneMonthly: monthlyBase, priceINR: price }
}
