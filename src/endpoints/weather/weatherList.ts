import { D1ListEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { WeatherModel } from "./base";

export class WeatherList extends D1ListEndpoint<HandleArgs> {
  _meta = {
    model: WeatherModel,
  };

  searchFields = ["city", "country", "description"];
  defaultOrderBy = "recorded_at DESC";
}