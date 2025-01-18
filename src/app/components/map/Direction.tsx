"use client";
import React, { FC, useState, useEffect } from "react";
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
  combinedData: any[];
  setCombinedData: (data: any[]) => void;
  submitTrriger: boolean;
  fromTo: FromTo | undefined;
  setFromTo: (fromTo: FromTo) => void;
};

type FromTo = {
  [key: string]: string;
}[];

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
  combinedData,
  setCombinedData,
  submitTrriger,
}) => {
  if (!originCoords) return null;
  const [fromTo, setFromTo] = useState<FromTo | undefined>(undefined);

  const modes = [
    { key: "driving", label: "🚘" },
    { key: "walking", label: "🚶" },
    { key: "bicycling", label: "🚲" },
    { key: "transit", label: "🚌" },
  ];

  const handleModeChange = async (
    event: React.SyntheticEvent,
    mode: string
  ) => {
    setFromTo(undefined);
    setCombinedData([]);
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

      const calories = res?.calories;

      if (calories) {
        const { perCalories, sumCalories } = calories;
        if (perCalories && perCalories.length > 0 && sumCalories) {
          setPerCalories(perCalories);
          setSumCalories(sumCalories);
        }
      }

      const startAndEnd = res?.startAndEnd;
      console.log("startAndEnd", startAndEnd);
      if (startAndEnd) {
        setFromTo(startAndEnd);
      }
    }

    // console.log("fromTo", fromTo);
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
  useEffect(() => {
    setCombinedData([]);
    if (fromTo && perCalories) {
      const combined = fromTo.map((data, index) => ({
        ...data,
        ...perCalories[index],
      }));
      setCombinedData(combined);
    }
  }, [fromTo, perCalories]);

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
            {combinedData && combinedData.length > 0 && (
              <Box sx={styles.flexContainer}>
                {combinedData.map((data: any, index: number) => {
                  let fromToKey = Object.keys(data)[0];
                  let fromToValue = data[fromToKey];
                  if (data[fromToKey] === "Destination") fromToValue = "目的地";
                  Object.keys(data)[0] === "Origin"
                    ? (fromToKey = "出発地")
                    : (fromToKey = Object.keys(data)[0]);
                  const perCaloriesKey = Object.keys(data)[1];
                  const perCaloriesValue = data[perCaloriesKey];
                  return (
                    <Box key={index} sx={styles.flexItem}>
                      {combinedData.length > 1 && (
                        <Typography sx={{ fontSize: "10px" }}>
                          {fromToKey} → {fromToValue}
                        </Typography>
                      )}
                      <Typography sx={styles.text}>
                        {perCaloriesKey}
                        <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                          {perCaloriesValue}
                        </span>
                        <span className="text-sm md:text-base lg:text-lg xl:text-xl">
                          kcal
                        </span>
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
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
      marginTop: "2px", // 画面幅が600px以下の場合の上余白を調整
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px", // 要素間の間隔を設
    "@media (max-width: 600px)": {
      gap: "2px", // 画面幅が600px以下の場合の要素間の間隔を調整
    },
    "@media (min-width: 601px) and (max-width: 960px)": {
      flexDirection: "", // 画面幅が601pxから960pxの場合に横方向に変更
      gap: "8px", // 要素間の間隔を調整
    },
    "@media (min-width: 961px)": {
      flexDirection: "row", // 画面幅が961px以上の場合に横方向に変更
      gap: "13px", // 要素間の間隔を調整
    },
  },
  flexItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 10px",
  },
  tabContainer: {
    marginBottom: 5,
    display: "flex",
    flexWrap: "wrap",
    padding: 1,
    "@media (max-width: 600px)": {
      marginBottom: 3,
      width: "95%",
    },
  },
  button: {
    fontSize: "1.5em", // 絵文字のサイズを調整
    margin: "0px 10px", // ボタンの間隔を調整
    padding: "10px 20px", // ボタンの余白を調整
    borderRadius: "20px", // ボタンに丸みを追加
    backgroundColor: "#F9F9F9", // ボタンの背景色
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // 通常時のドロップシャドウ
    transition: "box-shadow 0.3s ease", // なめらかな切り替え
    flex: "1 0 auto",
    "&:hover": {
      backgroundColor: "#FDFDFD", // ホバー時の背景色
      boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.5)", // ホバー時のインナーシャドウ
    },
    "@media (max-width: 600px)": {
      width: "10px",
      fontSize: "1em", // 画面幅が600px以下の場合の絵文字のサイズを調整
      borderRadius: "10px", // 画面幅が600px以下の場合のボタンの丸みを調整
      margin: "0px 3px", // 画面幅が600px以下の場合のボタンの間隔を調整
      padding: "0", // ボタンの余白を調整
      backgroundColor: "inherit", // 画面幅が600px以下の場合のボタンの背景色を無効化
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
    padding: "4",
    "@media (max-width: 600px)": {
      padding: 2,
      width: "330px",
      marginBottom: "80px",
      margin: 0,
    },
  },
  text: {
    fontSize: 30,
    fontFamily: "Arial",
    color: "black",
    padding: 2,
    "@media (max-width: 768px)": {
      fontSize: "20px",
    },
  },
};

export default Direction;
