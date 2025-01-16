"use server";

import { calculateCalories } from "../../../util/calculateCalories";
import { translateMode } from "../../../util/translateMode";

export const fetchRouteData = async (
  mode: string,
  originCoords: { latitude: number | null; longitude: number | null },
  destinationCoords: { latitude: number | null; longitude: number | null },
  weight: number
) => {
  if (
    !originCoords.latitude ||
    !originCoords.longitude ||
    !destinationCoords.latitude ||
    !destinationCoords.longitude
  ) {
    console.error("座標が取得できませんでした");
    return;
  }

  const origin = `${originCoords.latitude},${originCoords.longitude}`;
  const destination = `${destinationCoords.latitude},${destinationCoords.longitude}`;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  let isBicycling = false;

  // 1時間後の出発時刻　ダミー

  if (!apiKey) {
    console.error("APIキーが設定されていません");
    return;
  }

  if (mode === "bicycling") {
    mode = "walking";
    isBicycling = true;
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (isBicycling) mode = "bicycling";

    mode = translateMode(mode);

    if (data.routes.length > 0) {
      const legs = data.routes[0].legs;
      const legsWithMode = legs.map((leg: any) => ({
        ...leg,
        mode,
      }));
      const { perCalories, bicyclingTimeHour } = calculateCalories(
        legsWithMode,
        weight
      );
      const calories = perCalories[0][mode];
      const distance = legs[0].distance.text;
      let duration = legs[0].duration.value;

      if (mode === "🚲" && bicyclingTimeHour) {
        const hours = Math.floor(bicyclingTimeHour);
        const minutes = Math.round((bicyclingTimeHour % 1) * 60);
        duration = `${hours}時間${minutes}分`;
      } else {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.round((duration % 3600) / 60);
        duration = `${hours}時間${minutes}分`;
      }

      return { distance, duration, calories };
    } else {
      console.error("ルートが見つかりませんでした");
    }
  } catch (error) {
    console.error("エラー:", error);
  }
};
