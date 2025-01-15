"use client";
import React, { FC, useState } from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import { fetchRouteData } from "../../actions/fetchRouteData";

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
    { key: "driving", label: "🚘" },
    { key: "walking", label: "🚶" },
    { key: "bicycling", label: "🚲" },
    { key: "transit", label: "🚃" },
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
              sx={styles.button}
              label={mode.label || ""}
              value={mode.key}
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
            平均摂取カロリー：{intake ? `${intake}kcal` : 0}
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
    justifyContent: "center", // ボタンを中央揃え
    marginTop: "40px", // 全体の上余白を調整
  },
  tabContainer: {
    marginBottom: 5,
    border: "2px solid rgb(127, 127, 127)",
    backgroundColor: "#F9F9F9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // 通常時のドロップシャドウ
    borderRadius: 10,
    padding: 3,
  },
  button: {
    fontSize: "3em", // 絵文字のサイズを調整
    margin: "0px 20px", // ボタンの間隔を調整
    padding: "10px 20px", // ボタンの余白を調整
    borderRadius: "20px", // ボタンに丸みを追加
    backgroundColor: "#F9F9F9", // ボタンの背景色
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // 通常時のドロップシャドウ
    transition: "box-shadow 0.3s ease", // なめらかな切り替え
    "&:hover": {
      backgroundColor: "#FDFDFD", // ホバー時の背景色
      boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.5)", // ホバー時のインナーシャドウ
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "justify",
    border: "2px solid rgb(127, 127, 127)",
    backgroundColor: "#F9F9F9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)", // 通常時のドロップシャドウ
    borderRadius: 10,
    padding: 4,
  },
  text: {
    fontSize: 30,
    fontfamily: "Arial",
    color: "black",
    padding: 2,
  },
};

export default Direction;
