"use client";
import React, { FC, useState } from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import { fetchRouteData } from "../../actions/fetchRouteData";
import { fetchTransitRouteData } from "../../actions/fetchTransitRouteData";
import { PerCalories, TransitRouteData } from "../../types/types";

type GetLocationProps = {
  originCoords: { latitude: number; longitude: number } | null;
  destination: { latitude: number | null; longitude: number | null } | null;
  distance: number | null;
  duration: number | null;
  intake: string | null;
  setFetchRouteDataResult: (res: any) => void;
  setPerCalories: (perCalories: PerCalories) => void;
  perCalories: PerCalories;
  sumCalories: number | null;
  setSumCalories: (sumCalories: number) => void;
  weight: number;
  selectedMode: string;
  setSelectedMode: (mode: string) => void;
};

const Direction: FC<GetLocationProps> = ({
  originCoords,
  distance,
  duration,
  destination,
  intake,
  setFetchRouteDataResult,
  setPerCalories,
  perCalories,
  sumCalories,
  setSumCalories,
  weight,
  setSelectedMode,
  selectedMode,
}) => {
  if (!originCoords) return null;

  const modes = [
    { key: "driving", label: "🚘" },
    { key: "walking", label: "🚶" },
    { key: "bicycling", label: "🚲" },
    { key: "transit", label: "🚃" },
  ];

  const handleModeChange = async (
    event: React.SyntheticEvent,
    mode: string
  ) => {
    setPerCalories([]);
    setSelectedMode(mode);
    if (!destination) return;
    if (mode === "transit") {
      const res = await fetchTransitRouteData(
        originCoords,
        destination,
        weight
      );
      console.log("res", res);

      if (res) {
        const { perCalories, sumCalories } = res;
        if (perCalories && perCalories.length > 0 && sumCalories) {
          setPerCalories(perCalories);
          setSumCalories(sumCalories);
        }
      }
    }
    const routeData = await fetchRouteData(
      mode,
      originCoords,
      destination,
      weight
    );
    if (routeData) {
      setFetchRouteDataResult(routeData);
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
            予想消費カロリー: {sumCalories ? `${sumCalories}kcal` : `0 kcal`}
          </Typography>
          <Box sx={styles.boxContainer}>
            {perCalories && perCalories.length > 0 && (
              <>
                <Box sx={styles.flexContainer}>
                  {perCalories.map((data: any, index: number) => {
                    const key: any = Object.keys(data)[0];
                    const value = data[key];
                    return (
                      <Typography key={index} sx={styles.text}>
                        {key}: {value}
                      </Typography>
                    );
                  })}
                </Box>
              </>
            )}
          </Box>
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
    marginTop: "50px", // 全体の上余白を調整
    "@media (max-width: 600px)": {
      marginTop: "5px", // 画面幅が600px以下の場合の上余白を調整
    },
  },
  boxContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px, 0, 0, 30px",
  },
  flexContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px", // 要素間の間隔を設
    "@media (max-width: 600px)": {},
    "@media (min-width: 601px) and (max-width: 960px)": {
      flexDirection: "row", // 画面幅が601pxから960pxの場合に横方向に変更
      gap: "8px", // 要素間の間隔を調整
    },
    "@media (min-width: 961px)": {
      flexDirection: "row", // 画面幅が961px以上の場合に横方向に変更
      gap: "13px", // 要素間の間隔を調整
    },
  },
  tabContainer: {
    marginBottom: 5,
    // // border: "2px solid rgb(127, 127, 127)",
    // backgroundColor: "#F9F9F9",
    // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // 通常時のドロップシャドウ
    // borderRadius: 10,
    padding: 1, //
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
    "@media (max-width: 600px)": {
      fontSize: "2em", // 画面幅が600px以下の場合の絵文字のサイズを調整
      padding: "2px 2px", // 画面幅が600px以下の場合のボタンの余白を調整
      borderRadius: "15px", // 画面幅が600px以下の場合のボタンの丸みを調整
      margin: "0px 5px", // 画面幅が600px以下の場合のボタンの間隔を調整
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
    "@media (max-width: 600px)": {
      padding: 2,
      width: "365px",
      margin: 0,
    },
  },
  text: {
    fontSize: 30,
    fontfamily: "Arial",
    color: "black",
    padding: 2,
  },
};

export default Direction;
