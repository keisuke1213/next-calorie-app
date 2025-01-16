"use server";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function fetchWebsiteAndCalories(
  restaurant: string,
  retryCount = 0
): Promise<string | void> {
  const MAX_RETRIES = 3;

  try {
    const queryParams = new URLSearchParams({
      q: `${restaurant}`,
      key: process.env.CUSTOM_SEARCH_API_KEY!,
      cx: process.env.CUSTOM_SEARCH_ENGINE_ID!,
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?${queryParams.toString()}`,
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const searchResponse = await response.json();

    const website = searchResponse?.items?.[0]?.htmlSnippet ?? null; // 安全にアクセス
    if (website) {
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY!
      );

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `content: ${website}, プロンプト: contentを解析して、飲食関連の情報だった場合、得られた情報から一般的な摂取カロリーを予測してください。困難な場合は概算で構いません。そして、カロリーの数字だけを「」で囲み、カロリー数値以外は「」で囲まないでください。例外として、もし飲食関連の情報ではなかった場合は「」で囲み、予測不能と返してください。`;
      const result = await model.generateContent(prompt); //ここから抽出した情報を正規表現でさらに抽出

      const responseText = result.response.candidates
        ?.map((e) => e.content.parts.map((e) => e.text)[0])
        .join(" ");
      const match = responseText?.match(/「(.*?)」/);
      const calorieInfo = match ? match[1] : null;

      if (calorieInfo) {
        console.log("Extracted calorie information:", calorieInfo);
        return calorieInfo; // 正規表現で抽出した情報を返す
      } else {
        console.warn("No calorie information found in the response.");
        return; // 正規表現で抽出した情報を返す
      }
    } else {
      console.warn("No website found in search results.");
      return; // 正規表現で抽出した情報を返す
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error response:",
        error.response?.data || error.message
      );

      if (error.message.includes("Network Error")) {
        if (retryCount < MAX_RETRIES) {
          setTimeout(
            () => fetchWebsiteAndCalories(restaurant, retryCount + 1),
            5000
          );
        } else {
          console.error("Max retries reached. Aborting request.");
        }
      } else if (error.response?.status === 400) {
        console.log("Bad Request - Check the API parameters.");
      }
    } else {
      console.error("Unexpected error:", error);
    }
    return error;
  }
}
