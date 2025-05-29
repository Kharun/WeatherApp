import { API } from "../instance";

export const WeatherApi = {
  getWeather: (params: any) => API.get("weather", { params }),
  getWeatherAll: (params: any) => API.get("forecast", { params }),
};
