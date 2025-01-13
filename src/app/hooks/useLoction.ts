"use client";
import { useState, useEffect } from "react";

const useLocation = () => {
  const [originCoords, setOriginCoords] = useState({
    latitude: 35.681236,
    longitude: 139.767125,
  });

  useEffect(() => {
    const getCurrentLocation = async () => {
      if (!navigator.geolocation) {
        alert("位置情報がサポートされていません。");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOriginCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          alert("位置情報の取得に失敗しました。");
          console.error(error);
        }
      );
    };

    getCurrentLocation();
  }, []);

  return { originCoords };
};

export default useLocation;
