import { z } from "zod";

export const weather = z.object({
  id: z.number().int(),
  city: z.string(),
  country: z.string(),
  temperature: z.number(),
  humidity: z.number().min(0).max(100),
  description: z.string(),
  wind_speed: z.number().min(0),
  recorded_at: z.string().datetime(),
});

export const WeatherModel = {
  tableName: "weather",
  primaryKeys: ["id"],
  schema: weather,
  serializer: (obj: Record<string, string | number | boolean>) => {
    return {
      ...obj,
    };
  },
  serializerObject: weather,
};