"use server";

import { calculateCalories } from "../../../util/calculateCalories";
import { translateMode } from "../../../util/translateMode";

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
    const encodedFromPlace = encodeURIComponent(fromPlace);
    const encodedToPlace = encodeURIComponent(toPlace);

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
      `http://localhost:8080/otp/routers/default/plan?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const planData = await plan.json();

    const legs = planData.plan.itineraries.map((itinerary: any) =>
      itinerary.legs.flatMap((leg: any) => leg)
    );

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
        result = Math.min(result, durationSum);
        if (result < durationSum) {
          legIndex = legs.indexOf(leg);
        }
      });
      return legs[legIndex];
    };

    const transitRouteData = calculateDuration(legs);

    return calculateCalories(transitRouteData, weight);
  } catch (error) {
    console.error("リアルタイム情報の取得に失敗しました", error);
    return;
  }
};
