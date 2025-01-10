"use client";
import React, { FC } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Box from "@mui/material/Box";

type ShowMapProps = {
  originCoords: { latitude: number; longitude: number };
  destination: { latitude: number | null; longitude: number | null };
  style?: React.CSSProperties;
};

const ShowMap: FC<ShowMapProps> = ({ originCoords, style, destination }) => {
  const containerStyle = {
    width: "100%",
    height: "400px",
    ...style,
  };

  const center = {
    lat: originCoords.latitude,
    lng: originCoords.longitude,
  };

  return (
    <Box sx={{ flex: 1 }}>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}>
          <Marker
            position={{
              lat: originCoords.latitude,
              lng: originCoords.longitude,
            }}
            title="出発地点"
          />
          {destination.latitude && destination.longitude && (
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