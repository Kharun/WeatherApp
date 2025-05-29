import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import styles from "./HomePage.module.css";
import { WeatherApi } from "../../../../api";
import { LocationIcon, SearchIcon, SunIcon } from "../../../../assets/icons";

export const HomePage = () => {
  const [search, setSearch] = useState("Бишкек");
  const [debounceQuery] = useDebounce(search, 500);
  const [data, setData] = useState({
    date: {
      day: "",
      month: "",
      year: "",
    },
  });

  const fetchData = async () => {
    try {
      const resp = await WeatherApi.getWeather({ q: search });
      console.log(getDayOfWeek(resp.data.dt));
      const respList = await WeatherApi.getWeatherAll({ q: search });
      console.log(respList.data.list.filter((item: any) => item.dt_txt.includes("12:00:00")));
    } catch (err) {
      console.error(err);
    }
  };

  const getDayOfWeek = (time: number) => {
    const date = new Date(time * 1000);
    return date.toLocaleDateString("ru-RU", { weekday: "long" });
  };

  useEffect(() => {
    if (debounceQuery) {
      fetchData();
    }
  }, [debounceQuery]);

  return (
    <>
      <div className={styles.main}>
        <div className={styles.content}>
          <div className={styles.content_info}>
            <div className={styles.content_info_top}>
              <h2>Вторник</h2>
              <p>20 Jun 2022</p>
              <div className={styles.content_info_location}>
                <LocationIcon />
                Biarritz, FR
              </div>
            </div>
            <div className={styles.content_info_bottom}>
              <SunIcon />
              <h2>29 °C</h2>
              <p>Sunny</p>
            </div>
          </div>

          <div className={styles.others_info}>
            <div className={styles.others_info_top}>
              <div className={styles.others_info_top_item}>
                <h2>PRECIPITATION</h2>
                <p>0%</p>
              </div>
              <div className={styles.others_info_top_item}>
                <h2>HUMIDITY</h2>
                <p>42%</p>
              </div>
              <div className={styles.others_info_top_item}>
                <h2>WIND</h2>
                <p>3 km/h</p>
              </div>
            </div>

            <div className={styles.others_days}>
              <div className={styles.others_days_item}>
                <SunIcon />
                <p>Tue</p>
                <h2>30 °C</h2>
              </div>
              <div className={styles.others_days_item}>
                <SunIcon />
                <p>Wed</p>
                <h2>30 °C</h2>
              </div>
              <div className={styles.others_days_item}>
                <SunIcon />
                <p>Thu</p>
                <h2>30 °C</h2>
              </div>
              <div className={styles.others_days_item}>
                <SunIcon />
                <p>Fry</p>
                <h2>30 °C</h2>
              </div>
            </div>

            <label htmlFor="search" className={styles.search}>
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
