"use server";
import axios from "axios";
import { Place } from "../types/place";

export async function fetchPlace(searchQuery: string): Promise<Place[]> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  console.log("key", key);
  try {
    const { data } = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${key}&query=${searchQuery}`
    );

    const fetchedPlaces: Place[] = data.results.map((place: any) => ({
      name: place.name,
      location: {
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      },
    }));

    return fetchedPlaces;
  } catch (error) {
    console.error("Error fetching Places:", error);
    return [];
  }
}
