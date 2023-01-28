export type FetchWeatherJson = Weather[];

export type Weather = {
  publishingOffice: string;
  reportDatetime: string;
  timeSeries: WeatherTimeSeries[];
  tempAverage?: {
    areas: TempArea[];
  };
  precipAverage?: {
    areas: PrecipArea[];
  }
};

export type WeatherTimeSeries = {
  timeDefines: string[];
  areas: WeatherArea[];
};

export type WeatherArea = {
  area: { name: string; code: string };
  weatherCodes: string[];
  weathers?: string[];
  winds?: string[];
  waves?:string[];
  pops?: string[]
  reliabilities: string[];
};

export type TempArea = {
  area: { name: string; code: string };
  max: string;
  min: string;
};

export type PrecipArea = {
  area: { name: string; code: string };
  max: string;
  min: string;
};
