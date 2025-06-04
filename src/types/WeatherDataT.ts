export interface WeatherDataT {
  date: {
    time: string;
    day: string;
  };
  today: {
    name: string;
    clouds: {
      all: string;
    };
    wind: {
      deg: number;
      gust: number;
      speed: number;
    };
    weather: [
      {
        description: string;
        icon: string;
        id: number;
        main: string;
      }
    ];
    sys: {
      country: string;
      id: number;
      sunrise: number;
      sunset: number;
    };
    main: {
      temp: string;
      feels_like: string;
      temp_max: string;
      temp_min: string;
      humidity: string;
    };
  };
  weatherList: any[];
}
