"use server";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import fetch from "node-fetch";
import path from "path";
import fs from "fs";
import unzipper from "unzipper";
import csvParser from "csv-parser";

const key = process.env.GTFS_API_KEY;

type Stop = {
  stop_id: string;
  stop_name: string;
  stop_lat: string;
  stop_lon: string;
}[];

const time = new Date().getTime();

export const fetchBusRealtimeData = async (params: {
  fromPlace: string;
  toPlace: string;
  arriveBy: string;
  numItineraries: string;
  useRealtime: string;
  mode: string;
  maxWalkDistance: string;
  locale: string;
}) => {
  const query = new URLSearchParams(params).toString();
  const url = `https://api.odpt.org/api/v4/gtfs/realtime/odpt_KyotoBus_AllLinesAnotherversion_vehicle?acl:consumerKey=${key}&${query}`;

  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
      new Uint8Array(buffer)
    );

    // リアルタイムデータを格納するマップ
    const busDataMap = new Map();
    feed.entity.forEach((entity) => {
      const vehicle = entity.vehicle;
      console.log("vehicle", vehicle);
      if (vehicle) {
        const trip = vehicle.trip; // trip情報を取得
        const vehicleDescriptor = vehicle.vehicle;

        busDataMap.set(vehicleDescriptor?.id, {
          tripId: trip?.tripId || null, // 運行ID
          routeId: trip?.routeId || null, // 路線ID
          occupancyStatus: vehicle.occupancyStatus || null, // 乗車率
          vehicleId: vehicleDescriptor?.id || null, // 車両ID
        });
      }
    });

    return busDataMap;
  } catch (error) {
    console.error("Error fetching Bus Realtime Data:", error);
    return new Map();
  }
};

export const fetchAndParseGTFS = async () => {
  console.log("fetchAndParseGTFS");
  const res = await fetch("http://34.97.5.202/otp/routers/default/index/stops");
  const stops = await res.json();
  console.log("stops", stops);
  // // GTFSデータの取得
  // const url = `https://api.odpt.org/api/v4/files/odpt/KyotoMunicipalTransportation/Kyoto_City_Subway_GTFS.zip?date=20240815&acl:consumerKey=${key}`;
  // const response = await fetch(url);
  // if (!response.ok) {
  //   throw new Error(`Failed to fetch GTFS data: ${response.statusText}`);
  // }
  // const arrayBuffer = await response.arrayBuffer();
  // const buffer = Buffer.from(arrayBuffer);
  // const zipFilePath = path.join(process.cwd(), "Kyoto_City_Subway_GTFS.zip");
  // fs.writeFileSync(zipFilePath, buffer);

  // // GTFSデータの解凍
  // const extractPath = path.join(process.cwd(), "gtfs_data");
  // await fs
  //   .createReadStream(zipFilePath)
  //   .pipe(unzipper.Extract({ path: extractPath }))
  //   .promise();

  // // stops.txtの解析
  // const stops: Stop = [];
  // const stopsFilePath = path.join(extractPath, "stops.txt");
  // await new Promise((resolve, reject) => {
  //   fs.createReadStream(stopsFilePath)
  //     .pipe(csvParser())
  //     .on("data", (row) => {
  //       stops.push(row);
  //     })
  //     .on("end", resolve)
  //     .on("error", reject);
  // });

  // console.log("stops", stops);

  return stops;
};
