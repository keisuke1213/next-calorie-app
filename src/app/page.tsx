"use client";
import Direction from "./map/Direction";
import InputLocation from "./map/InputLocation";
import { Box, Card, CardContent, Typography } from "@mui/material";
import ShowMap from "./map/ShowMap";
import { fetchCoordinatesByName } from "./actions/fetchCoordinatesByName";
import { fetchRouteData } from "./actions/fetchRouteData";
import { useState } from "react";
import useLocation from "./hooks/useLoction";
import { fetchWebsiteAndCalories } from "./actions/fetchWebsiteAndCalories";
import { fetchPlace } from "./actions/fetchPlace";
import { Place } from "./types/place";
import { CSSProperties } from "react";

export default function App() {
  const styles: { [key: string]: CSSProperties } = {
    container: {
      position: "relative" as "relative",
      width: "100vw",
      height: "100vh", // 全画面を占有
    },
    map: {
      position: "absolute" as "absolute",
      height: "100%",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0, // 画面全体を埋めるスタイル
    },
    overlay: {
      position: "absolute" as "absolute", // マップ上に配置
      top: 0, // 必要に応じて位置調整
      left: 0,
      right: 0,
      zIndex: 1, // マップより手前に表示
      padding: 2,
    },
    marker: {
      cursor: "pointer",
      backgroundColor: "red",
      padding: "5px",
      borderRadius: "50%",
      color: "white",
      textAlign: "center",
    },
    direction: {
      zIndex: 1,
    },
    detailContainer: {
      backgroundColor: "white",
      padding: "10px",
      borderRadius: "5px",
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      position: "absolute" as "absolute",
      bottom: "10px",
      left: "10px",
      zIndex: 2,
    },
    detailTitle: {
      fontWeight: "bold",
      fontSize: "1.2em",
    },
  };

  const { originCoords } = useLocation();

  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [intake, setIntake] = useState<string | null>(null);

  const setFetchRouteDataResult = (res: any) => {
    const { distance, duration, calories } = res;
    setDistance(distance);
    setDuration(duration);
    setCalories(calories);
  };

  const handleSubmit = async (formData: FormData): Promise<void> => {
    setDuration(null);
    setDistance(null);
    const origin = formData.get("origin") as string;
    const goal = formData.get("destination") as string;
    const places = await fetchPlace(goal);
    setPlaces(places);
  };

  const handleMarkerPress = async (place: Place) => {
    const destinationCoords = await fetchCoordinatesByName(place.name);
    const intakeRes = (await fetchWebsiteAndCalories(place.name)) ?? null;

    if (intakeRes) {
      setIntake(intakeRes);
    }

    if (originCoords && destinationCoords) {
      setDestination(destinationCoords);
      const res = await fetchRouteData(
        "driving",
        originCoords,
        destinationCoords
      );
      if (res) {
        setFetchRouteDataResult(res);
      }
    }
  };

  const getLocationProps = {
    originCoords,
    handleSubmit,
  };

  const directionProps = {
    originCoords,
    destination,
    distance,
    duration,
    calories,
    intake,
    setFetchRouteDataResult,
  };

  const showMapProps = {
    originCoords,
    style: { ...styles.map },
    destination,
  };
  console.log("intake", intake);
  return (
    <Box sx={styles.container}>
      <ShowMap {...showMapProps} />
      <Box sx={styles.overlay}>
        <InputLocation {...getLocationProps} />
        {distance && duration ? (
          <Direction {...directionProps} />
        ) : (
          <Box sx={{ zIndex: 1, color: "black" }}>
            {places.map((place, index) => (
              <Card
                key={index}
                sx={styles.card}
                onClick={() => handleMarkerPress(place)}
              >
                <CardContent>
                  <Typography variant="h5" component="div">
                    {place.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {place.website || "Fetching details..."}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
