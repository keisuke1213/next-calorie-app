"use client";
import React, { FC, useState } from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import { fetchRouteData } from "../actions/fetchRouteData";

type GetLocationProps = {
  originCoords: { latitude: number; longitude: number } | null;
  destination: { latitude: number | null; longitude: number | null } | null;
  distance: number | null;
  duration: number | null;
  calories: number | null;
  intake: string | null;
  setFetchRouteDataResult: (res: any) => void;
};

const Direction: FC<GetLocationProps> = ({
  originCoords,
  distance,
  duration,
  calories,
  destination,
  intake,
  setFetchRouteDataResult,
}) => {
  if (!originCoords) return null;
  const [selectedMode, setSelectedMode] = useState("driving");
  console.log("intake", intake);
  const modes = [
    { key: "driving", label: "車" },
    { key: "walking", label: "徒歩" },
    { key: "bicycling", label: "自転車" },
    { key: "transit", label: "公共交通機関" },
  ];

  const handleModeChange = async (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setSelectedMode(newValue);
    if (!destination) return;
    const res = await fetchRouteData(newValue, originCoords, destination);
    if (res) {
      setFetchRouteDataResult(res);
    }
  };

  return (
    <Box>
      <Box sx={styles.container}>
        <Tabs
          value={selectedMode}
          onChange={handleModeChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={styles.tabContainer}
        >
          {modes.map((mode) => (
            <Tab
              key={mode.key}
              label={mode.label}
              value={mode.key}
              sx={selectedMode === mode.key ? styles.activeTab : styles.tab}
            />
          ))}
        </Tabs>

        {/* 選択されたモードを表示 */}
        <Box sx={styles.content}>
          <Typography sx={styles.text}>距離: {distance}</Typography>
          <Typography sx={styles.text}>所要時間: {duration}</Typography>
          <Typography sx={styles.text}>
            予想消費カロリー: {calories && calories > 0 ? `${calories}kcal` : 0}
          </Typography>
          <Typography sx={styles.text}>
            予想摂取カロリー：{intake ? `${intake}kcal` : 0}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 2,
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  tabContainer: {
    marginBottom: 2,
  },
  tab: {
    padding: 1,
    margin: 0.5,
    backgroundColor: "#ddd",
    borderRadius: 1,
  },
  activeTab: {
    backgroundColor: "#007BFF",
    color: "#fff",
  },
  text: {
    fontSize: 16,
    color: "black",
  },
};

export default Direction;
