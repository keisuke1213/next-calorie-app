import { PerCalories } from "@/app/types/types";

export const modeIntoNumber = (mode: string) => {
  switch (mode) {
    case "🚘":
      return 1;
    case "🚶":
      return 3;
    case "🚲":
      return 4;
    case "🚌":
      return 2;
    default:
      return 0;
  }
};

const switchMetsByoccupancyStatus = (occupancyStatus: number): number => {
  switch (occupancyStatus) {
    case 0: // 空車
      return 1.2;
    case 1: // 多くの座席が利用可能
      return 1.3;
    case 2: // 少しの座席が利用可能
      return 1.5;
    case 3: // 立席のみ利用可能
      return 2.0;
    case 4: // 非常に混雑（圧迫状態）
      return 2.5;
    case 5: // 満席または満員
      return 2.8;
    default: // 不明または計算外
      return 0;
  }
};

type leg = {
  distance:
    | {
        text: string;
        value: number;
      }
    | number;
  duration:
    | {
        text: string;
        value: number;
      }
    | number;

  mode: string;
  occupancyStatus?: number;
}[];

const caluculateBicyclingCalories = (
  l: {
    distance:
      | {
          text: string;
          value: number;
        }
      | number;
    duration:
      | {
          text: string;
          value: number;
        }
      | number;
  },
  weight: number
) => {
  const distanceValue =
    typeof l.distance === "number" ? l.distance : l.distance.value;
  const cyclingSpeedKmh = 15; // 自転車の速度 (km/h)
  const reductionSpeedKmh = 4; // 減速分の速度 (km/h)

  const effectiveSpeedKmh = cyclingSpeedKmh - reductionSpeedKmh; // 実効速度 (km/h)

  const bicyclingTimeHour = distanceValue / 1000 / effectiveSpeedKmh; // 距離 ÷ 速度

  const cal = Math.round(bicyclingTimeHour * 4 * weight);
  const sumCalories = cal;
  return { cal, sumCalories, bicyclingTimeHour };
};

export const calculateCalories = (leg: leg, weight: number) => {
  console.log("cal leg", leg);
  console.log("weight", weight);
  const perCalories: PerCalories = [];

  let sumCalories = 0;

  for (const l of leg) {
    let calories = 0;

    if (l.mode === "🚲") {
      const { cal, sumCalories, bicyclingTimeHour } =
        caluculateBicyclingCalories(l, weight);
      perCalories.push({ [l.mode]: cal });
      return { perCalories, sumCalories, bicyclingTimeHour };
    } else {
      console.log("l.mode", l.mode);
      let mets = modeIntoNumber(l.mode);
      console.log("mets", mets);
      if (l.occupancyStatus) {
        mets = switchMetsByoccupancyStatus(l.occupancyStatus);
        console.log("mets1", mets);
      }

      const durationValue =
        typeof l.duration === "number" ? l.duration : l.duration.value;

      const time = durationValue / 3600;

      calories += Math.round(mets! * weight * time);
      sumCalories += calories;
      perCalories.push({ [l.mode]: calories });
    }
  }
  console.log("perCalories", perCalories);

  return { perCalories, sumCalories };
};
