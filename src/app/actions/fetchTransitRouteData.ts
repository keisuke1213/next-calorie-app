"use server";

import { calculateCalories } from "../../../util/calculateCalories";
import { translateMode } from "../../../util/translateMode";
import { fetchBusRealtimeData } from "./fetchGtfs";

const calculateDuration = (legs: any) => {
  let durationSum = 0;
  let result = 1000000000;
  let legIndex = 0;
  legs.forEach((leg: any) => {
    durationSum = 0;
    leg.forEach((l: any) => {
      l.mode = translateMode(l.mode);
      durationSum += l.duration;
    });
    console.log("durationSum", durationSum);
    result = Math.min(result, durationSum);
    if (result < durationSum) {
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
    console.log("legs", legs);

    const transitRouteData = calculateDuration(legs);
    // console.log("transitRouteData", transitRouteData);

    const normalizeTripId = (tripId: string) => tripId?.split(":").pop();
    const normalizeRouteId = (routeId: string) => routeId?.split(":").pop();

    const enrichedRouteData = transitRouteData.map((leg: any) => {
      if (leg.mode === "🚃") {
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

    // console.log("enrichedRouteData", enrichedRouteData);

    return calculateCalories(enrichedRouteData, weight);
  } catch (error) {
    console.error("リアルタイム情報の取得に失敗しました", error);
    return;
  }
};
