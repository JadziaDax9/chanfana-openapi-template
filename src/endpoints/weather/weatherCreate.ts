import { D1CreateEndpoint } from "chanfana";
import { HandleArgs } from "../../types";
import { WeatherModel } from "./base";

export class WeatherCreate extends D1CreateEndpoint<HandleArgs> {
  _meta = {
    model: WeatherModel,
    fields: WeatherModel.schema.pick({
      // this is purposely missing the id, because users shouldn't be able to define it
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