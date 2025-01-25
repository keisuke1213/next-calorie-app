"use server";

import { calculateCalories } from "../../../util/calculateCalories";
import { translateMode } from "../../../util/translateMode";
import { fetchBusRealtimeData } from "./fetchGtfs";

const calculateMinDuration = (legs: any) => {
  let durationSum = 0;
  let duration = 1000000000;
  let legIndex = 0;
  const translatedLegs = legs.map((leg: any) =>
    leg.map((l: any) => ({
      ...l,
      mode: translateMode(l.mode),
    }))
  );

  translatedLegs.forEach((leg: any, index: number) => {
    durationSum = leg.reduce((sum: number, l: any) => sum + l.duration, 0);
    if (durationSum < duration) {
      duration = durationSum;
      legIndex = index;
    }
  });

  return [translatedLegs[legIndex], duration];
};

const calcurateMaxDuration = (legs: any) => {
  let durationSum = 0;
  let result = 0;
  let legIndex = 0;
  legs.forEach((leg: any) => {
    durationSum = 0;
    leg.forEach((l: any) => {
      l.mode = translateMode(l.mode);
      durationSum += l.duration;
    });
    result = Math.max(result, durationSum);
    if (result > durationSum) {
      legIndex = legs.indexOf(leg);
    }
  });
  return legs[legIndex];
};

export const fetchTransitRouteData = async (
  origin: {
    latitude: number | null;
    longitude: number | null;
  },
  destination: {
    latitude: number | null;
    longitude: number | null;
  },
  weight: number
) => {
  const arriveBy = "false";
  const numItineraries = 3;
  const useRealtime = "false";

  try {
    const fromPlace = `${origin.latitude},${origin.longitude}`;
    const toPlace = `${destination.latitude},${destination.longitude}`;

    const params = {
      fromPlace: fromPlace,
      toPlace: toPlace,
      arriveBy: arriveBy,
      numItineraries: numItineraries.toString(),
      useRealtime: useRealtime,
      mode: "TRANSIT",
      maxWalkDistance: "2000",
      locale: "ja",
    };

    const queryString = new URLSearchParams(params).toString();

    const plan = await fetch(
      `http://34.97.5.202:8080/otp/routers/default/plan?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const busRealtimeData = await fetchBusRealtimeData(params);
    // console.log("busRealtimeData", busRealtimeData);

    const planData = await plan.json();

    const legs = planData.plan.itineraries.map((itinerary: any) =>
      itinerary.legs.flatMap((leg: any) => leg)
    );

    const minDurationRoute = calculateMinDuration(legs);
    const [minDuration, duration] = minDurationRoute;
    console.log("min", minDuration);
    const maxDuration = calcurateMaxDuration(legs);

    type StartAndEnd = {
      [key: string]: string;
    }[];

    const startAndEnd: StartAndEnd = [];

    minDuration.forEach((l: any) => {
      startAndEnd.push({ [l.from.name]: l.to.name });
    });

    const normalizeTripId = (tripId: string) => tripId?.split(":").pop();
    const normalizeRouteId = (routeId: string) => routeId?.split(":").pop();

    const enrichedRouteData = minDuration.map((leg: any) => {
      if (leg.mode === "🚌") {
        // リアルタイムデータから一致する運行情報を取得
        const matchingRealtimeData = Array.from(busRealtimeData.values()).find(
          (realtime) =>
            normalizeTripId(realtime.tripId) === normalizeTripId(leg.tripId) ||
            normalizeRouteId(realtime.routeId) ===
              normalizeRouteId(leg.routeId) ||
            realtime.stopId === leg.from.stopId ||
            realtime.stopId === leg.to.stopId
        );

        // リアルタイム情報を統合
        if (matchingRealtimeData) {
          return {
            ...leg,
            occupancyStatus: matchingRealtimeData.occupancyStatus || "UNKNOWN", // 混雑状況
            vehicleId: matchingRealtimeData.vehicleId || "UNKNOWN", // 車両ID
          };
        }
      }
      return leg;
    });

    const hours = Math.floor(duration / 3600);
    const minutes = Math.round((duration % 3600) / 60);
    const time: any = `${hours}時間${minutes}分`;
    let distance: any = 0;

    minDuration.forEach((e: any) => {
      console.log("dis", e.distance);
      distance += e.distance;
    });

    const formde = Math.round(distance / 100) / 10;

    distance = `${formde}km`;
    console.log("distance", distance);

    const calories = calculateCalories(enrichedRouteData, weight);
    return { calories, startAndEnd, time, distance };
  } catch (error) {
    console.error("リアルタイム情報の取得に失敗しました", error);
    return;
  }
};
