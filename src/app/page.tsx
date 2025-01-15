"use client";
import Direction from "./components/map/Direction";
import InputLocation from "./components/map/InputLocation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import ShowMap from "./components/map/ShowMap";
import { fetchCoordinatesByName } from "./actions/fetchCoordinatesByName";
import { fetchRouteData } from "./actions/fetchRouteData";
import { useState } from "react";
import useLocation from "./hooks/useLoction";
import { fetchWebsiteAndCalories } from "./actions/fetchWebsiteAndCalories";
import { fetchPlace } from "./actions/fetchPlace";
import { Place } from "./types/place";
import { CSSProperties } from "react";
import Header from "./components/header";
import zIndex from "@mui/material/styles/zIndex";

export default function App() {
  const styles: { [key: string]: CSSProperties } = {
    container: {
      position: "relative" as "relative",
      width: "100vw",
      height: "100vh",
      backgroundColor: "#F5F5F5",
    },
    map: {
      position: "absolute" as "absolute",
      height: "80%",
      top: 110,
      left: 50,
      right: 0,
      bottom: 0, // 画面全体を埋めるスタイル
      borderRadius: "30px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 1)", // 通常時のドロップシャドウ
    },
    overlay: {
      position: "absolute" as "absolute", // マップ上に配置
      top: -22, // 必要に応じて位置調整
      left: 400,
      bottom: 0,
      right: -390,
      padding: 2,
    },
    result: {
      margin: "-540px -100px 0px 0px",
      padding: "20px",
      backgroundColor: "#FDFDFD",
      border: "3px solid rgb(133, 231, 244)",
      borderRadius: "30px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
      cursor: "pointer",
      maxHeight: "500px",
      overflowY: "auto",
      zIndex: 1,
    },
    // element: {
    //   marginTop: "20px",
    //   padding: "1px",
    //   backgroundColor: "#F9F9F9",
    //   borderRadius: "30px",
    //   boxShadow: "0 0 10px rgba(16, 16, 16, 0.2)",
    //   "&:hover": {
    //     boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.2)", // ホバー時のインナーシャドウ
    //   },
    // },
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
      boxShadow: "0 0 10px rgba(236, 38, 38, 0.1)",
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
    setPlaces([]);
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
      <Header />
      <ShowMap {...showMapProps} />
      <Box sx={styles.overlay}>
        <InputLocation {...getLocationProps} />

        <Direction {...directionProps} />

        <Stack sx={{ width: "fit-content" }}>
          {places && places.length > 0 && (
            <Box sx={styles.result}>
              {places.map((place, index) => (
                <Card
                  sx={{
                    marginTop: "20px",
                    padding: "1px",
                    backgroundColor: "#F9F9F9",
                    borderRadius: "30px",
                    boxShadow: "0 0 10px rgba(16, 16, 16, 0.2)",
                    "&:hover": {
                      boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.2)", // ホバー時のインナーシャドウ
                    },
                  }}
                  key={index}
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
        </Stack>
      </Box>
    </Box>
  );
}

//ベースカラー
// #F9F9F9
