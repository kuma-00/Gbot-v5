import { Area, WeatherCode } from "@src/data/weather_area.ts";
import { FetchWeatherJson } from "@src/types/weather.ts";
import { extractAsPromised } from "fuzzball";

//https://qiita.com/youtoy/items/932bc48b03ced5a45c71

const jma_url = "https://www.jma.go.jp/bosai/forecast/data/forecast/";
const jma_image_url = "https://www.jma.go.jp/bosai/forecast/img/";

export const getWeather = async (areaCode: string) => {
  //`${jma_url}${areaCode}.json`
  const areaName = Area.find(
    (a) => a.value == areaCode && a.getCode == areaCode,
  )?.name;
  if (!areaName) throw new Error("unknown AreaCode");
  const json = (await (
    await fetch(`${jma_url}${areaCode}.json`)
  ).json()) as FetchWeatherJson;
  const areas = json[0].timeSeries[0].areas.map((area) => ({
    name: areaName + ">" + area.area.name,
    weatherCodes: area.weatherCodes,
    weatherImages: area.weatherCodes.map(
      (code) => `${jma_image_url}${WeatherCode[code][0]}`,
    ),
    weathers:
      area.weathers ?? area.weatherCodes.map((code) => WeatherCode[code][3]),
  }));
  return json[0].timeSeries[0].timeDefines.map((time, index) =>
    areas.map((area) => ({
      name: area.name,
      timeDefine: time,
      weatherCode: area.weatherCodes[index],
      weatherImages: area.weatherImages[index],
      weather: area.weathers[index],
    })),
  );
};

export const getArea = async (
  area: string,
): Promise<{ name: string; value: string; getCode: string } | undefined> => {
  return (
    await extractAsPromised(area, Area, {
      processor: (choice) => choice.name,
      limit: 1,
      cutoff: 50,
    })
  )?.[0]?.[0];
};
