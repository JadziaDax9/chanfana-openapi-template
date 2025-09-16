import { D1ReadEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { WeatherModel } from "./base";

export class WeatherRead extends D1ReadEndpoint<HandleArgs> {
  _meta = {
    model: WeatherModel,
  };
}