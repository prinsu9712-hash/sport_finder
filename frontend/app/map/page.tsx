"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { SectionTitle } from "@/components/section-title";

type Position = {
  lat: number;
  lng: number;
};

declare global {
  interface Window {
    gm_authFailure?: () => void;
  }
}

function getOpenStreetMapEmbedUrl(position: Position | null) {
  const center = position || { lat: 23.0225, lng: 72.5714 };
  const delta = 0.03;
  const left = center.lng - delta;
  const right = center.lng + delta;
  const top = center.lat + delta;
  const bottom = center.lat - delta;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;
}

export default function MapPage() {
  const [position, setPosition] = useState<Position | null>(null);
  const [locationError, setLocationError] = useState("");
  const [googleAuthFailed, setGoogleAuthFailed] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  useEffect(() => {
    const previousAuthFailureHandler = window.gm_authFailure;

    window.gm_authFailure = () => {
      setGoogleAuthFailed(true);
      previousAuthFailureHandler?.();
    };

    return () => {
      window.gm_authFailure = previousAuthFailureHandler;
    };
  }, []);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "playcircle-google-map",
    googleMapsApiKey: apiKey
  });
  const canUseGoogleMap =
    Boolean(apiKey) && isLoaded && !loadError && !googleAuthFailed;

  function detectLocation() {
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (current) => {
        setPosition({
          lat: current.coords.latitude,
          lng: current.coords.longitude
        });
      },
      (error) => {
        setLocationError(error.message || "Location permission was denied.");
      }
    );
  }

  return (
    <div className="stack-lg">
      <section className="glass-card">
        <SectionTitle
          eyebrow="Map"
          title="Detect your location and visualize your play area"
          description="The page uses Google Maps when the API key works and falls back to OpenStreetMap if Google blocks the domain."
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
        {locationError ? <p className="error-text">{locationError}</p> : null}
      </section>

      <section className="glass-card">
        {canUseGoogleMap ? (
          <>
            <GoogleMap
              center={position || { lat: 23.0225, lng: 72.5714 }}
              zoom={12}
              mapContainerStyle={{ height: "420px", width: "100%" }}
            >
              {position ? <Marker position={position} /> : null}
            </GoogleMap>
            <p className="helper-text">Google Maps is active.</p>
          </>
        ) : (
          <div className="stack-md">
            <iframe
              title="PlayCircle map"
              src={getOpenStreetMapEmbedUrl(position)}
              style={{
                border: 0,
                width: "100%",
                height: "420px",
                borderRadius: "24px"
              }}
              loading="lazy"
            />
            <p className="helper-text">
              {googleAuthFailed
                ? "Google rejected the API key, referrer, billing, or Maps JavaScript API setting, so the page switched to OpenStreetMap."
                : apiKey
                ? "Google Maps could not load for this domain, so the page switched to OpenStreetMap."
                : "Google Maps key is missing, so the page is using OpenStreetMap instead."}
            </p>
            {loadError || googleAuthFailed ? (
              <p className="error-text">
                Check that Maps JavaScript API is enabled, billing is active,
                and both `localhost:3000` and your Vercel domain are allowed
                referrers.
              </p>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
