"use client";
import React, { FC } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Box from "@mui/material/Box";

type ShowMapProps = {
  originCoords: { latitude: number; longitude: number } | null;
  destination: { latitude: number | null; longitude: number | null } | null;
  style?: React.CSSProperties;
};

const ShowMap: FC<ShowMapProps> = ({ originCoords, style, destination }) => {
  if (!originCoords) return null;
  const containerStyle = {
    width: "45%",
    height: "10%",
    ...style,
    marginTop: "50px",
    marginBottom: "70px",
    padding: "50px, 0",
  };

  const center = {
    lat: originCoords?.latitude,
    lng: originCoords?.longitude,
  };

  return (
    <Box sx={{ flex: 1, mt: 5, pt: 5 }}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={17}>
          <Marker
            position={{
              lat: originCoords?.latitude,
              lng: originCoords?.longitude,
            }}
            title="出発地点"
          />
          {destination?.latitude && destination.longitude && (
            <Marker
              position={{
                lat: destination.latitude,
                lng: destination.longitude,
              }}
              title="目的地"
            />
          )}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default ShowMap;
