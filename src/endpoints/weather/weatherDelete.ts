import { D1DeleteEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { WeatherModel } from "./base";

export class WeatherDelete extends D1DeleteEndpoint<HandleArgs> {
  _meta = {
    model: WeatherModel,
  };
}