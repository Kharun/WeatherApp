import axios from "axios";

export const API = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5/",
  params: {
    appid: "af51d83606def0048413d75cf64f8bb2",
    lang: "ru",
    units: "metric",
  },
});
