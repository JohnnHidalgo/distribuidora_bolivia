import { useState, useEffect } from "react";
import { GetcategoryproviderAPI, Datum } from "../interfaces/getcategoryprovider.interface";
import { getCategoryProvider } from "../services/getcategoryprovider";

interface UseCategoryProviderReturn {
  data: Datum[] | null;
  loading: boolean;
  error: Error | null;
}

export function useCategoryProvider(): UseCategoryProviderReturn {
  const [data, setData] = useState<Datum[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: GetcategoryproviderAPI = await getCategoryProvider();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
