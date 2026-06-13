"use client"

import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, LayerGroup, LayersControl } from "react-leaflet"
import L from "leaflet"
import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
  Tooltip as RTooltip,
} from "recharts"
import { CITY_CENTER, sensors, type EcoSensor } from "@/lib/eco-data"

function makeIcon(status: "normal" | "alert") {
  const isAlert = status === "alert"
  const color = isAlert ? "var(--eco-bad)" : "var(--eco-good)"
  const pulse = isAlert ? "eco-marker-pulse" : ""
  const html = `
    <div class="relative flex items-center justify-center">
      <span class="${pulse}" style="position:absolute;height:18px;width:18px;border-radius:9999px;background:${color}"></span>
      <span style="position:relative;height:18px;width:18px;border-radius:9999px;background:${color};border:2px solid rgba(255,255,255,0.85);box-shadow:0 2px 8px rgba(0,0,0,0.5)"></span>
    </div>`
  return L.divIcon({
    html,
    className: "eco-divicon",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

function SensorPopup({ sensor }: { sensor: EcoSensor }) {
  const isAlert = sensor.status === "alert"
  return (
    <div className="p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{sensor.id}</p>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-medium"
          style={{
            background: isAlert
              ? "color-mix(in oklch, var(--eco-bad) 18%, transparent)"
              : "color-mix(in oklch, var(--eco-good) 18%, transparent)",
            color: isAlert ? "var(--eco-bad)" : "var(--eco-good)",
          }}
        >
          {isAlert ? "ALERT" : "NORMAL"}
        </span>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{sensor.location}</p>

      <div className="mt-2 grid grid-cols-3 gap-1 text-center">
        <Stat label="CO" value={`${sensor.co}`} unit="PPM" alert={sensor.co > 800} />
        <Stat label="NO₂" value={`${sensor.no2}`} unit="ppb" alert={sensor.no2 > 150} />
        <Stat label="PM2.5" value={`${sensor.pm25}`} unit="µg" alert={sensor.pm25 > 90} />
      </div>

      <p className="mt-2 mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        CO — last hour
      </p>
      <div className="h-16 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sensor.readings} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
            <YAxis hide domain={["dataMin - 40", "dataMax + 40"]} />
            <RTooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 11,
                color: "var(--foreground)",
              }}
              labelStyle={{ color: "var(--muted-foreground)" }}
              formatter={(v: number) => [`${v} PPM`, "CO"]}
            />
            <Line
              type="monotone"
              dataKey="co"
              stroke={isAlert ? "var(--eco-bad)" : "var(--eco-good)"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  unit,
  alert,
}: {
  label: string
  value: string
  unit: string
  alert: boolean
}) {
  return (
    <div className="rounded-md bg-secondary/60 px-1 py-1.5">
      <p className="text-[9px] uppercase text-muted-foreground">{label}</p>
      <p
        className="text-sm font-semibold"
        style={{ color: alert ? "var(--eco-bad)" : "var(--foreground)" }}
      >
        {value}
      </p>
      <p className="text-[8px] text-muted-foreground">{unit}</p>
    </div>
  )
}

function ResizeFix() {
  const map = useMap()
  useEffect(() => {
    const fix = () => map.invalidateSize()
    // Run after the container has laid out, and again shortly after.
    const t1 = setTimeout(fix, 100)
    const t2 = setTimeout(fix, 500)
    window.addEventListener("resize", fix)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener("resize", fix)
    }
  }, [map])
  return null
}

export default function EcoMap() {
  return (
    <MapContainer
      center={CITY_CENTER}
      zoom={13}
      scrollWheelZoom
      className="h-full w-full"
      style={{ height: "100%", width: "100%" }}
    >
      <ResizeFix />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Dark">
          <TileLayer
            attribution='&copy; CartoDB contributors'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.Overlay checked name="Emission Zones">
          <LayerGroup>
            {sensors.map((s) => (
              <Circle
                key={`zone-${s.id}`}
                center={[s.lat, s.lng]}
                radius={s.status === "alert" ? 900 : 650}
                pathOptions={{
                  color: s.status === "alert" ? "var(--eco-bad)" : "var(--eco-good)",
                  fillColor: s.status === "alert" ? "var(--eco-bad)" : "var(--eco-good)",
                  fillOpacity: s.status === "alert" ? 0.22 : 0.12,
                  weight: 1,
                  opacity: 0.4,
                }}
              />
            ))}
          </LayerGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay checked name="Sensor Markers">
          <LayerGroup>
            {sensors.map((s) => (
              <Marker key={s.id} position={[s.lat, s.lng]} icon={makeIcon(s.status)}>
                <Popup>
                  <SensorPopup sensor={s} />
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  )
}
