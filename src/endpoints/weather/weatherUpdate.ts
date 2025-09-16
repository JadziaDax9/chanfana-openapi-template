import { D1UpdateEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { WeatherModel } from "./base";

export class WeatherUpdate extends D1UpdateEndpoint<HandleArgs> {
  _meta = {
    model: WeatherModel,
    fields: WeatherModel.schema.pick({
      city: true,
      country: true,
      temperature: true,
      humidity: true,
      description: true,
      wind_speed: true,
      recorded_at: true,
    }),
  };
}