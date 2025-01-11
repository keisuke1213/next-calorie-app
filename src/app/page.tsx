"use client";
import Direction from "./map/Direction";
import InputLocation from "./map/InputLocation";
import { Box } from "@mui/material";
import ShowMap from "./map/ShowMap";
import { fetchCoordinatesByName } from "./actions/fetchCoordinatesByName";
import { fetchRouteData } from "./actions/fetchRouteData";
import { useState } from "react";
import useLocation from "./hooks/useLoction";
import { fetchWebsiteAndCalories } from "./actions/fetchWebsiteAndCalories";

export default function App() {
  const { originCoords } = useLocation();

  const [destination, setDestination] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [calories, setCalories] = useState<number | null>(null);

  const setFetchRouteDataResult = (res: any) => {
    const { distance, duration, calories } = res;
    setDistance(distance);
    setDuration(duration);
    setCalories(calories);
  };

  const handleSubmit = async (formData: FormData) => {
    const origin = formData.get("origin") as string;
    const destination = formData.get("destination") as string;
    fetchWebsiteAndCalories( destination );
    const destinationCoords = await fetchCoordinatesByName(destination);

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
    setFetchRouteDataResult,
  };

  const showMapProps = {
    originCoords,
    style: { ...styles.map },
    destination,
  };

  return (
    <Box sx={styles.container}>
      <ShowMap {...showMapProps} />
      <Box sx={styles.overlay}>
        <InputLocation {...getLocationProps} />
        {distance && duration && <Direction {...directionProps} />}
      </Box>
    </Box>
  );
}

const styles = {
  container: {
    position: "relative",
    width: "100vw",
    height: "100vh", // 全画面を占有
  },
  map: {
    position: "absolute" as const,
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0, // 画面全体を埋めるスタイル
  },
  overlay: {
    position: "absolute", // マップ上に配置
    top: 0, // 必要に応じて位置調整
    left: 0,
    right: 0,
    zIndex: 1, // マップより手前に表示
    padding: 2,
  },
  direction: {
    zIndex: 1,
  },
};

export const getDestinationFromFormData = (formData: FormData): string => {
  return formData.get("destination") as string;
};
