// src/hooks/useApi.js
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000/api  ";

export default function useApi(endpoint) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE}/${endpoint}`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, loading };
}
