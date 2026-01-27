import { GetcategoryproviderAPI } from "../interfaces/getcategoryprovider.interface";

const API_URL = process.env.NEXT_PUBLIC_API_CATEGORY_PROVIDER;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export async function getCategoryProvider(): Promise<GetcategoryproviderAPI> {
  if (!API_URL || !API_TOKEN) {
    throw new Error("API_URL or API_TOKEN is not defined");
  }

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
