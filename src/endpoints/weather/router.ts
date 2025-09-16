import { Hono } from "hono";
import { fromHono } from "chanfana";
import { WeatherList } from "./weatherList";
import { WeatherCreate } from "./weatherCreate";
import { WeatherRead } from "./weatherRead";
import { WeatherUpdate } from "./weatherUpdate";
import { WeatherDelete } from "./weatherDelete";

export const weatherRouter = fromHono(new Hono());

weatherRouter.get("/", WeatherList);
weatherRouter.post("/", WeatherCreate);
weatherRouter.get("/:id", WeatherRead);
weatherRouter.put("/:id", WeatherUpdate);
weatherRouter.delete("/:id", WeatherDelete);