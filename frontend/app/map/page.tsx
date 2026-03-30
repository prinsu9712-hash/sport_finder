"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useState } from "react";
import { SectionTitle } from "@/components/section-title";

type Position = {
  lat: number;
  lng: number;
};

export default function MapPage() {
  const [position, setPosition] = useState<Position | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  function detectLocation() {
    navigator.geolocation.getCurrentPosition((current) => {
      setPosition({
        lat: current.coords.latitude,
        lng: current.coords.longitude
      });
    });
  }

  return (
    <div className="stack-lg">
      <section className="glass-card">
        <SectionTitle
          eyebrow="Map"
          title="Detect your location and visualize your play area"
          description="Add your Google Maps key in the frontend env to render the live map."
        />
        <div className="action-row">
          <button className="button button-primary" onClick={detectLocation}>
            Detect location
          </button>
          <span className="helper-text">
            {position
              ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
              : "Location not detected yet"}
          </span>
        </div>
      </section>

      <section className="glass-card">
        {apiKey ? (
          <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
              center={position || { lat: 23.0225, lng: 72.5714 }}
              zoom={12}
              mapContainerStyle={{ height: "420px", width: "100%" }}
            >
              {position ? <Marker position={position} /> : null}
            </GoogleMap>
          </LoadScript>
        ) : (
          <p className="helper-text">
            Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to `frontend/.env.local` to enable the map.
          </p>
        )}
      </section>
    </div>
  );
}
