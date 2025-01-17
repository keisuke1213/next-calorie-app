"use client";
import Direction from "./components/map/Direction";
import InputLocation from "./components/header/InputLocation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid2,
  Stack,
  Typography,
} from "@mui/material";
import ShowMap from "./components/map/ShowMap";
import { fetchCoordinatesByName } from "./actions/fetchCoordinatesByName";
import { fetchRouteData } from "./actions/fetchRouteData";
import { useState, useEffect } from "react";
import useLocation from "./hooks/useLoction";
import { fetchWebsiteAndCalories } from "./actions/fetchWebsiteAndCalories";
import { fetchPlace } from "./actions/fetchPlace";
import { PerCalories, Place } from "./types/types";
import { CSSProperties } from "react";
import Header from "./components/header/header";

export default function App() {
  const styles: { [key: string]: CSSProperties } = {
    container: {
      position: "relative" as const,
      width: "100vw",
      height: "100%",
      backgroundColor: "#F5F5F5",
      overflowX: "hidden",
      "@media (maxWidth: 768px)": {
        // position: "relative" as "relative",
        // width: "100vw",
        // height: "100vh",
        // backgroundColor: "#F5F5F5",
        overflowX: "hidden",
        marginBottom: "80px",
      },
    } as CSSProperties,
    map: {
      position: "absolute" as const,
      height: "80%",
      top: 110,
      left: 50,
      right: 0,
      bottom: 0, // 画面全体を埋めるスタイル
      borderRadius: "30px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 1)", // 通常時のドロップシャドウ
      "@media (maxWidth: 768px)": {
        // position: "absolute" as "absolute",
        // height: "50%",
        // top: 110,
        // left: 50,
        // right: 0,
        // bottom: 0, // 画面全体を埋めるスタイル
        borderRadius: "30px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 1)", // 通常時のドロップシャドウ
      },
    } as CSSProperties,
    overlay: {
      position: "absolute" as const, // マップ上に配置
      top: -22, // 必要に応じて位置調整
      left: 400,
      bottom: 0,
      right: -390,
      padding: 2,
    },
    result: {
      position: "absolute" as const,
      top: 110,
      left: 150,
      marginTop: "5px",
      marginLeft: "auto",
      marginRight: "auto",
      width: "400px",
      padding: "20px",
      backgroundColor: "#FDFDFD",
      border: "3px solid rgb(133, 231, 244)",
      borderRadius: "30px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
      cursor: "pointer",
      maxHeight: "500px",
      // overflowY: "auto",
      zIndex: 1,
      "@media (max-width: 768px)": {
        top: 200,
        left: 50,
        width: "300px",
        margin: "auto",
        padding: "20px",
        backgroundColor: "#FDFDFD",
        border: "3px solid rgb(133, 231, 244)",
        borderRadius: "30px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
        cursor: "pointer",
        maxHeight: "400px",
        overflowY: "auto",
        zIndex: 1,
      },
    } as CSSProperties,
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
      position: "absolute" as const,
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
  const [sumCalories, setSumCalories] = useState<number | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [intake, setIntake] = useState<string | null>(null);
  const [perCalories, setPerCalories] = useState<PerCalories>([]);
  const [selectedMode, setSelectedMode] = useState("driving");
  const [isMobile, setIsMobile] = useState(false);

  const options = Array.from({ length: 121 }, (_, i) => i + 30);
  const [weight, setWeight] = useState<number>(options[0]);

  const setFetchRouteDataResult = (res: any) => {
    const { distance, duration, calories } = res;
    setDistance(distance);
    setDuration(duration);
    setSumCalories(calories);
  };

  const handleSubmit = async (formData: FormData): Promise<void> => {
    setPerCalories([]);
    setDuration(null);
    setDistance(null);
    const origin = formData.get("origin") as string;
    const goal = formData.get("destination") as string;
    const places = await fetchPlace(goal);
    setPlaces(places);
  };

  const handleMarkerPress = async (place: Place) => {
    setSelectedMode("driving");
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
        destinationCoords,
        weight
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
    sumCalories,
    setSumCalories,
    intake,
    setFetchRouteDataResult,
    perCalories,
    setPerCalories,
    weight,
    selectedMode,
    setSelectedMode,
  };

  const headerProps = {
    weight,
    setWeight,
    options,
    getLocationProps,
  };

  const showMapProps = {
    originCoords,
    style: { ...styles.map },
    destination,
  };
  console.log("intake", intake);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 初回レンダリング時にチェック

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <Box sx={styles.container}>
      <Header {...headerProps} />
      <Stack>
        {places && places.length > 0 && (
          <Box sx={styles.result}>
            {places.map((place, index) => (
              <Card
                sx={{
                  margin: "10px, auto, 0 ,auto",
                  padding: "1px",
                  backgroundColor: "#F9F9F9",
                  borderRadius: "30px",
                  boxShadow: "0 0 10px rgba(16, 16, 16, 0.2)",
                  "&:hover": {
                    boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.2)",
                  },
                  "@media (max-width: 768px)": {
                    width: "100%",
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
      <Grid2 container spacing={4} alignItems="center">
        <Grid2 size={6}>{!isMobile && <ShowMap {...showMapProps} />}</Grid2>
        <Grid2 size={{ lg: 6, md: 12 }} sx={{ mx: "auto" }}>
          <Direction {...directionProps} />
        </Grid2>
      </Grid2>
    </Box>
  );
}
