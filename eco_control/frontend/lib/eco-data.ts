// Centralized mock data for the Smart City Eco-Portal.
// All values are static but realistic to make the prototype feel production-ready.

export type EcoRating = "A" | "B" | "C" | "Critical"
export type SensorStatus = "normal" | "alert"

export const CURRENCY = "₸" // Kazakhstani Tenge — matches "123 ABC 04" plate format

export interface SensorReading {
  t: string // hour label
  co: number // PPM
}

export interface EcoSensor {
  id: string
  name: string
  location: string
  lat: number
  lng: number
  status: SensorStatus
  co: number // current CO PPM
  no2: number // current NO2 ppb
  pm25: number // current PM2.5 µg/m³
  readings: SensorReading[]
}

export interface Violation {
  id: string
  plate: string
  image: string
  vehicle: string
  gas: string
  level: number
  unit: string
  limit: number
  time: string
  location: string
  fine: number
}

export interface NewsItem {
  id: string
  title: string
  excerpt: string
  date: string
  category: string
  image: string
}

function genReadings(base: number, spike = false): SensorReading[] {
  const hours = ["12:00", "12:10", "12:20", "12:30", "12:40", "12:50", "13:00"]
  return hours.map((t, i) => {
    const wave = Math.round(Math.sin(i * 1.1) * base * 0.12)
    const drift = spike && i >= 4 ? base * 0.7 + (i - 4) * base * 0.25 : 0
    return { t, co: Math.max(40, Math.round(base + wave + drift)) }
  })
}

// City: Aktobe, Kazakhstan center
export const CITY_CENTER: [number, number] = [50.2838, 57.1644]

export const sensors: EcoSensor[] = [
  {
    id: "SNS-014",
    name: "Eco-Sensor 14",
    location: "Satpaev St & Kenesary Ave",
    lat: 50.2840,
    lng: 57.1640,
    status: "alert",
    co: 942,
    no2: 188,
    pm25: 96,
    readings: genReadings(620, true),
  },
  {
    id: "SNS-022",
    name: "Eco-Sensor 22",
    location: "Zhienbayeva & Tolstoy St",
    lat: 50.2900,
    lng: 57.1700,
    status: "normal",
    co: 312,
    no2: 64,
    pm25: 28,
    readings: genReadings(290),
  },
  {
    id: "SNS-007",
    name: "Eco-Sensor 7",
    location: "Airport Highway (North)",
    lat: 50.2600,
    lng: 57.1500,
    status: "alert",
    co: 1015,
    no2: 204,
    pm25: 112,
    readings: genReadings(680, true),
  },
  {
    id: "SNS-031",
    name: "Eco-Sensor 31",
    location: "Abay Ave & Kurmangazy St",
    lat: 50.2750,
    lng: 57.1750,
    status: "normal",
    co: 268,
    no2: 51,
    pm25: 22,
    readings: genReadings(255),
  },
  {
    id: "SNS-045",
    name: "Eco-Sensor 45",
    location: "Tauke Khan Ave (South)",
    lat: 50.2950,
    lng: 57.1600,
    status: "normal",
    co: 341,
    no2: 70,
    pm25: 31,
    readings: genReadings(330),
  },
  {
    id: "SNS-053",
    name: "Eco-Sensor 53",
    location: "Bukhar Zhyrau Ave",
    lat: 50.2700,
    lng: 57.2000,
    status: "normal",
    co: 297,
    no2: 58,
    pm25: 25,
    readings: genReadings(280),
  },
  {
    id: "SNS-061",
    name: "Eco-Sensor 61",
    location: "Industrial Zone (East)",
    lat: 50.3100,
    lng: 57.2200,
    status: "normal",
    co: 388,
    no2: 81,
    pm25: 36,
    readings: genReadings(360),
  },
]

export const violations: Violation[] = [
  {
    id: "V-90412",
    plate: "847 AKT 01",
    image: "/images/cam-truck.png",
    vehicle: "GAZ-3309 Diesel Truck",
    gas: "High CO",
    level: 1180,
    unit: "PPM",
    limit: 800,
    time: "13:02:41",
    location: "Airport Highway (North)",
    fine: 42500,
  },
  {
    id: "V-90408",
    plate: "123 AKT 01",
    image: "/images/cam-sedan.png",
    vehicle: "Toyota Camry",
    gas: "High CO",
    level: 950,
    unit: "PPM",
    limit: 800,
    time: "12:58:09",
    location: "Satpaev St & Kenesary Ave",
    fine: 28000,
  },
  {
    id: "V-90401",
    plate: "552 AKT 01",
    image: "/images/cam-suv.png",
    vehicle: "Hyundai Santa Fe",
    gas: "High NO₂",
    level: 240,
    unit: "ppb",
    limit: 150,
    time: "12:51:33",
    location: "Zhienbayeva & Tolstoy St",
    fine: 31500,
  },
  {
    id: "V-90396",
    plate: "071 AKT 01",
    image: "/images/cam-truck.png",
    vehicle: "KamAZ-5320 Hauler",
    gas: "High PM2.5",
    level: 168,
    unit: "µg/m³",
    limit: 90,
    time: "12:47:12",
    location: "Industrial Zone (East)",
    fine: 56000,
  },
  {
    id: "V-90388",
    plate: "990 AKT 01",
    image: "/images/cam-sedan.png",
    vehicle: "Kia Optima",
    gas: "High CO",
    level: 870,
    unit: "PPM",
    limit: 800,
    time: "12:39:58",
    location: "Abay Ave & Kurmangazy St",
    fine: 19000,
  },
  {
    id: "V-90377",
    plate: "418 AKT 01",
    image: "/images/cam-suv.png",
    vehicle: "Nissan X-Trail",
    gas: "High NO₂",
    level: 196,
    unit: "ppb",
    limit: 150,
    time: "12:34:21",
    location: "Tauke Khan Ave (South)",
    fine: 24500,
  },
  {
    id: "V-90369",
    plate: "203 AKT 01",
    image: "/images/cam-truck.png",
    vehicle: "MAN TGX Freight",
    gas: "High CO",
    level: 1320,
    unit: "PPM",
    limit: 800,
    time: "12:29:47",
    location: "Airport Highway (North)",
    fine: 61000,
  },
  {
    id: "V-90354",
    plate: "667 AKT 01",
    image: "/images/cam-sedan.png",
    vehicle: "Volkswagen Polo",
    gas: "High CO",
    level: 905,
    unit: "PPM",
    limit: 800,
    time: "12:22:10",
    location: "Bukhar Zhyrau Ave",
    fine: 22000,
  },
  {
    id: "V-90341",
    plate: "812 AKT 01",
    image: "/images/cam-suv.png",
    vehicle: "Lexus RX 350",
    gas: "High PM2.5",
    level: 134,
    unit: "µg/m³",
    limit: 90,
    time: "12:15:55",
    location: "Satpaev St & Kenesary Ave",
    fine: 33000,
  },
  {
    id: "V-90330",
    plate: "045 AKT 01",
    image: "/images/cam-truck.png",
    vehicle: "Isuzu NQR Box Truck",
    gas: "High CO",
    level: 1090,
    unit: "PPM",
    limit: 800,
    time: "12:08:30",
    location: "Industrial Zone (East)",
    fine: 47500,
  },
  {
    id: "V-90318",
    plate: "739 AKT 01",
    image: "/images/cam-sedan.png",
    vehicle: "Hyundai Elantra",
    gas: "High NO₂",
    level: 172,
    unit: "ppb",
    limit: 150,
    time: "12:01:14",
    location: "Abay Ave & Kurmangazy St",
    fine: 18500,
  },
  {
    id: "V-90305",
    plate: "560 AKT 01",
    image: "/images/cam-suv.png",
    vehicle: "Toyota Land Cruiser",
    gas: "High CO",
    level: 988,
    unit: "PPM",
    limit: 800,
    time: "11:54:02",
    location: "Tauke Khan Ave (South)",
    fine: 29500,
  },
]

export const adminMetrics = [
  { label: "Vehicles Scanned Today", value: "48,217", delta: "+6.4%", trend: "up" as const },
  { label: "Violations Detected", value: "1,284", delta: "+12.1%", trend: "up" as const },
  { label: "Average CO Level", value: "418 PPM", delta: "-3.2%", trend: "down" as const },
  { label: "Active Eco-Sensors", value: "142 / 150", delta: "94.6%", trend: "flat" as const },
]

// ---- Driver portal data ----

export interface DriverTicket {
  id: string
  date: string
  location: string
  image: string
  gas: string
  level: number
  unit: string
  limit: number
  fine: number
  status: "Unpaid" | "Paid" | "Disputed"
}

export const driverProfile = {
  name: "Aliya Nurlanovna",
  make: "Toyota",
  model: "Camry 2.5",
  year: 2021,
  plate: "123 AKT 01",
  color: "Pearl White",
  rating: "C" as EcoRating,
  ratingNote: "Above-average emissions in the last quarter",
  totalScans: 312,
  flagged: 4,
}

export const driverEmissionHistory = [
  { month: "Jan", co: 540, limit: 800 },
  { month: "Feb", co: 610, limit: 800 },
  { month: "Mar", co: 720, limit: 800 },
  { month: "Apr", co: 880, limit: 800 },
  { month: "May", co: 950, limit: 800 },
  { month: "Jun", co: 1180, limit: 800 },
]

export const driverTickets: DriverTicket[] = [
  {
    id: "V-90408",
    date: "13 Jun 2026, 12:58",
    location: "Mangilik El & Turan Ave",
    image: "/images/cam-sedan.png",
    gas: "High CO",
    level: 950,
    unit: "PPM",
    limit: 800,
    fine: 28000,
    status: "Unpaid",
  },
  {
    id: "V-88120",
    date: "29 May 2026, 09:14",
    location: "Saryarka Ave Underpass",
    image: "/images/cam-sedan.png",
    gas: "High CO",
    level: 905,
    unit: "PPM",
    limit: 800,
    fine: 22000,
    status: "Unpaid",
  },
  {
    id: "V-84551",
    date: "17 Apr 2026, 18:42",
    location: "Republic Ave & Beibitshilik",
    image: "/images/cam-sedan.png",
    gas: "High CO",
    level: 862,
    unit: "PPM",
    limit: 800,
    fine: 18000,
    status: "Disputed",
  },
  {
    id: "V-80233",
    date: "05 Mar 2026, 08:03",
    location: "Kenesary & Auezov Lights",
    image: "/images/cam-sedan.png",
    gas: "High CO",
    level: 815,
    unit: "PPM",
    limit: 800,
    fine: 15000,
    status: "Paid",
  },
]

export const news: NewsItem[] = [
  {
    id: "n1",
    title: "City rolls out 120 new electric buses to cut downtown emissions",
    excerpt:
      "The municipal transit authority unveiled a zero-emission fleet expected to remove 14,000 tonnes of CO₂ annually from the central corridor.",
    date: "11 Jun 2026",
    category: "Infrastructure",
    image: "/images/news-buses.png",
  },
  {
    id: "n2",
    title: "New Euro-6 emission norms take effect for all commercial vehicles",
    excerpt:
      "Starting July, diesel freight and delivery vehicles must pass quarterly roadside CO and PM2.5 checks or face escalating fines.",
    date: "08 Jun 2026",
    category: "Regulation",
    image: "/images/news-smog.png",
  },
  {
    id: "n3",
    title: "Five things drivers can do to lower their Eco-Rating this summer",
    excerpt:
      "From timely catalytic converter checks to avoiding cold-start idling, small habits can shift your vehicle from a C to an A rating.",
    date: "04 Jun 2026",
    category: "Tips",
    image: "/images/news-green.png",
  },
  {
    id: "n4",
    title: "Green-corridor pilot reduces peak-hour pollution by 22%",
    excerpt:
      "Adaptive traffic-light timing tied to live Eco-Sensor data has measurably cleared the air along the Turan Avenue test route.",
    date: "31 May 2026",
    category: "Sustainability",
    image: "/images/news-green.png",
  },
]

export function formatCurrency(amount: number): string {
  return `${amount.toLocaleString("en-US")} ${CURRENCY}`
}
