"use server";
export const fetchRouteData = async (
  mode: string,
  originCoords: { latitude: number | null; longitude: number | null },
  destinationCoords: { latitude: number | null; longitude: number | null }
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
  console.log("mode", mode);

  const origin = `${originCoords.latitude},${originCoords.longitude}`;
  console.log(origin);
  const destination = `${destinationCoords.latitude},${destinationCoords.longitude}`;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  let mets = 0;

  switch (mode) {
    case "driving":
      mets = 1;
      break;
    case "walking":
      mets = 3;
      break;
    case "bicycling":
      mets = 4;
      mode = "walking";
      break;
    case "transit":
      mets = 2;
      break;
    default:
  }

  // 1時間後の出発時刻　ダミー

  if (!apiKey) {
    console.error("APIキーが設定されていません");
    return;
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.routes.length > 0) {
      let calories = 0;
      const leg = data.routes[0].legs[0];
      const distance = leg.distance.text;
      let duration = leg.duration.text;

      if (mets == 4) {
        const cyclingSpeedKmh = 15; // 自転車の速度 (km/h)
        const reductionSpeedKmh = 4; // 減速分の速度 (km/h)

        const effectiveSpeedKmh = cyclingSpeedKmh - reductionSpeedKmh; // 実効速度 (km/h)

        const bicyclingTimeHour = leg.distance.value / 1000 / effectiveSpeedKmh; // 距離 ÷ 速度

        const totalMinutes = Math.round(bicyclingTimeHour * 60); // 総分数に変換

        const hours = Math.floor(totalMinutes / 60); // 時間

        const minutes = totalMinutes % 60; // 残りの分

        duration = `${hours}時間${minutes}分`;

        calories = Math.round(bicyclingTimeHour * mets * 65);
      } else {
        leg.steps.forEach((step: { duration: { value: number } }) => {
          const time = step.duration.value / 3600;
          calories += Math.round(mets * 65 * time);
        });
      }

      console.log(
        "distance",
        distance,
        "duration",
        duration,
        "calories",
        calories
      );
      return { distance, duration, calories };
    } else {
      console.error("ルートが見つかりませんでした");
    }
  } catch (error) {
    console.error("エラー:", error);
  }
};
