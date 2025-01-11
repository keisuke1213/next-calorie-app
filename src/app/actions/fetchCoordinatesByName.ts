"use server";
export const fetchCoordinatesByName = async (
  name: string
): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
        name
      )}&inputtype=textquery&fields=geometry&key=${
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      }`
    );

   const data = await response.json();
    if (data.candidates && data.candidates[0]) {
      const { lat, lng } = data.candidates[0].geometry.location;
      console.log({ lat, lng });
      return { latitude: lat, longitude: lng };
    } else {
      console.log("No coordinates found");
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};
