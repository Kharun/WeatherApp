import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import styles from "./HomePage.module.css";
import { WeatherApi } from "../../../../api";
import { CloudRain, CloudSun, LocationIcon, SearchIcon, SunIcon } from "../../../../assets/icons";
import type { WeatherDataT } from "../../../../types";

export const HomePage = () => {
  const [search, setSearch] = useState("Бишкек");
  const [debounceQuery] = useDebounce(search, 500);
  const [data, setData] = useState<WeatherDataT>({
    date: {
      time: "",
      day: "",
    },
    today: {
      name: "",
      clouds: {
        all: "",
      },
      wind: {
        deg: 0,
        gust: 0,
        speed: 0,
      },
      weather: [
        {
          description: "",
          icon: "",
          id: 0,
          main: "",
        },
      ],
      sys: {
        country: "",
        id: 0,
        sunrise: 0,
        sunset: 0,
      },
      main: {
        temp: "",
        feels_like: "",
        temp_max: "",
        temp_min: "",
        humidity: "",
      },
    },
    weatherList: [""],
  });
  const [statuses, setStatuses] = useState({
    loading: false,
    error: false,
  });
  const today = new Date();
  const formattedDate = `${today.getDate()} ${today.toLocaleString("ru-RU", { month: "long" })} ${today.getFullYear()}`;

  const fetchData = async () => {
    try {
      setStatuses((prev) => ({ ...prev, loading: true, error: false }));
      const resp = await WeatherApi.getWeather({ q: search });
      setData((prev) => ({
        ...prev,
        today: resp.data,
        weatherList: resp.data.dt,
        date: { ...prev.date, day: getDayOfWeek(resp.data.dt) },
      }));
      const respList = await WeatherApi.getWeatherAll({ q: search });
      setData((prev) => ({
        ...prev,
        weatherList: respList.data.list.filter((item: any) => item.dt_txt.includes("12:00:00")),
      }));
      setStatuses((prev) => ({ ...prev, loading: false }));
    } catch (err) {
      console.error(err);
      setStatuses((prev) => ({ ...prev, loading: false, error: true }));
    }
  };

  const getDayOfWeek = (time: number) => {
    const date = new Date(time * 1000);
    return date.toLocaleDateString("ru-RU", { weekday: "long" });
  };

  const getWeatherIcon = (desc: string) => {
    switch (desc) {
      case "Clear":
        return <SunIcon />;
      case "Rain":
        return <CloudRain />;
      case "Snow":
        return <CloudRain />;
      case "Clouds":
        return <CloudSun />;
      case "Thunderstorm":
        return <CloudSun />;
    }
  };

  useEffect(() => {
    if (debounceQuery) {
      fetchData();
    }
  }, [debounceQuery]);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      date: {
        ...prev.date,
        time: formattedDate,
      },
    }));
  }, []);

  console.log(data);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={`${styles.content_info} ${statuses.loading && styles.active}`}>
            <div className={styles.content_info_top}>
              <h2>{data.date?.day?.split("")[0]?.toUpperCase() + data.date?.day?.split("").slice(1).join("")}</h2>
              <p>{data.date?.time}</p>
              <div className={styles.content_info_location}>
                <LocationIcon />
                {data.today.name}
              </div>
            </div>
            <div className={styles.content_info_bottom}>
              {getWeatherIcon(data.today.weather[0].main)}
              <h2>{Math.round(Number(data.today.main.temp))} °C</h2>
              <p>
                {data.today?.weather[0]?.description?.split("")[0]?.toUpperCase() +
                  data.today?.weather[0]?.description?.split("").slice(1).join("")}
              </p>
            </div>
          </div>

          <div className={styles.others_info}>
            <div className={styles.others_info_top}>
              <div className={styles.others_info_top_item}>
                <h2>ВЛАЖНОСТЬ</h2>
                <p>{data.today.main.humidity}%</p>
              </div>
              <div className={styles.others_info_top_item}>
                <h2>ВЕТЕР</h2>
                <p>{Math.round(Number(data.today.wind.speed))} км/ч</p>
              </div>
            </div>

            <div className={`${styles.others_days}`}>
              {Array.isArray(data.weatherList) &&
                data.weatherList.slice(1).map((item: any) => (
                  <div className={styles.others_days_item} key={item.dt}>
                    {getWeatherIcon(item.weather[0].main)}
                    <p>{getDayOfWeek(item.dt).slice(0, 3)}</p>
                    <h2>{Math.round(Number(item.main.temp))} °C</h2>
                  </div>
                ))}
            </div>

            <label htmlFor="search" className={`${styles.search} ${statuses.error && styles.active}`}>
              <input
                type="text"
                id="search"
                placeholder="Введите город"
                onChange={(e: any) => setSearch(e.target.value)}
              />
              <SearchIcon />
            </label>
          </div>
        </div>
      </div>
    </>
  );
};
