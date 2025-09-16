import { SELF } from "cloudflare:test";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Helper function to create weather data and return its ID
async function createWeatherRecord(weatherData: any) {
  const response = await SELF.fetch(`http://local.test/weather`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(weatherData),
  });
  const body = await response.json<{
    success: boolean;
    result: { id: number };
  }>();
  return body.result.id;
}

describe("Weather API Integration Tests", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
  });

  // Tests for GET /weather
  describe("GET /weather", () => {
    it("should get an empty list of weather records", async () => {
      const response = await SELF.fetch(`http://local.test/weather`);
      const body = await response.json<{ success: boolean; result: any[] }>();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.result).toEqual([]);
    });

    it("should get a list with one weather record", async () => {
      await createWeatherRecord({
        city: "London",
        country: "UK",
        temperature: 20.5,
        humidity: 65,
        description: "Partly cloudy",
        wind_speed: 5.2,
        recorded_at: "2025-09-16T12:00:00.000Z",
      });

      const response = await SELF.fetch(`http://local.test/weather`);
      const body = await response.json<{ success: boolean; result: any[] }>();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.result.length).toBe(1);
      expect(body.result[0]).toEqual(
        expect.objectContaining({
          city: "London",
          country: "UK",
        }),
      );
    });
  });

  // Tests for POST /weather
  describe("POST /weather", () => {
    it("should create a new weather record successfully", async () => {
      const weatherData = {
        city: "New York",
        country: "USA",
        temperature: 25.3,
        humidity: 70,
        description: "Sunny",
        wind_speed: 8.1,
        recorded_at: "2025-09-16T15:30:00.000Z",
      };
      const response = await SELF.fetch(`http://local.test/weather`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(weatherData),
      });

      const body = await response.json<{ success: boolean; result: any }>();

      expect(response.status).toBe(201);
      expect(body.success).toBe(true);
      expect(body.result).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          ...weatherData,
        }),
      );
    });

    it("should return a 400 error for invalid input", async () => {
      const invalidWeatherData = {
        // Missing required fields
        description: "This is invalid weather data",
      };
      const response = await SELF.fetch(`http://local.test/weather`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invalidWeatherData),
      });
      const body = await response.json();

      expect(response.status).toBe(400);
      expect(body.success).toBe(false);
      expect(body.errors).toBeInstanceOf(Array);
    });
  });

  // Tests for GET /weather/{id}
  describe("GET /weather/{id}", () => {
    it("should get a single weather record by its ID", async () => {
      const weatherData = {
        city: "Tokyo",
        country: "Japan",
        temperature: 18.7,
        humidity: 85,
        description: "Rainy",
        wind_speed: 3.5,
        recorded_at: "2025-09-16T09:00:00.000Z",
      };
      const weatherId = await createWeatherRecord(weatherData);

      const response = await SELF.fetch(`http://local.test/weather/${weatherId}`);
      const body = await response.json<{ success: boolean; result: any }>();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.result).toEqual(
        expect.objectContaining({
          id: weatherId,
          ...weatherData,
        }),
      );
    });

    it("should return a 404 error if weather record is not found", async () => {
      const nonExistentId = 9999;
      const response = await SELF.fetch(
        `http://local.test/weather/${nonExistentId}`,
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.errors[0].message).toBe("Not Found");
    });
  });

  // Tests for PUT /weather/{id}
  describe("PUT /weather/{id}", () => {
    it("should update a weather record successfully", async () => {
      const weatherData = {
        city: "Paris",
        country: "France",
        temperature: 15.2,
        humidity: 60,
        description: "Overcast",
        wind_speed: 4.8,
        recorded_at: "2025-09-16T14:00:00.000Z",
      };
      const weatherId = await createWeatherRecord(weatherData);

      const updatedData = {
        city: "Paris",
        country: "France",
        temperature: 22.1,
        humidity: 55,
        description: "Clear skies",
        wind_speed: 6.2,
        recorded_at: "2025-09-16T16:00:00.000Z",
      };

      const response = await SELF.fetch(`http://local.test/weather/${weatherId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const body = await response.json<{ success: boolean; result: any }>();

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(body.result).toEqual(
        expect.objectContaining({
          id: weatherId,
          ...updatedData,
        }),
      );
    });

    it("should return 404 when trying to update a non-existent weather record", async () => {
      const nonExistentId = 9999;
      const updatedData = {
        city: "Berlin",
        country: "Germany",
        temperature: 12.0,
        humidity: 72,
        description: "Foggy",
        wind_speed: 2.1,
        recorded_at: "2025-09-16T08:00:00.000Z",
      };
      const response = await SELF.fetch(
        `http://local.test/weather/${nonExistentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        },
      );

      expect(response.status).toBe(404);
    });
  });

  // Tests for DELETE /weather/{id}
  describe("DELETE /weather/{id}", () => {
    it("should delete a weather record successfully", async () => {
      const weatherData = {
        city: "Sydney",
        country: "Australia",
        temperature: 28.5,
        humidity: 45,
        description: "Hot and dry",
        wind_speed: 12.3,
        recorded_at: "2025-09-16T11:00:00.000Z",
      };
      const weatherId = await createWeatherRecord(weatherData);

      const deleteResponse = await SELF.fetch(
        `http://local.test/weather/${weatherId}`,
        {
          method: "DELETE",
        },
      );
      const deleteBody = await deleteResponse.json<{
        success: boolean;
        result: any;
      }>();

      expect(deleteResponse.status).toBe(200);
      expect(deleteBody.success).toBe(true);
      expect(deleteBody.result.id).toBe(weatherId);

      // Verify the weather record is actually deleted
      const getResponse = await SELF.fetch(`http://local.test/weather/${weatherId}`);
      expect(getResponse.status).toBe(404);
    });

    it("should return 404 when trying to delete a non-existent weather record", async () => {
      const nonExistentId = 9999;
      const response = await SELF.fetch(
        `http://local.test/weather/${nonExistentId}`,
        {
          method: "DELETE",
        },
      );
      const body = await response.json();

      expect(response.status).toBe(404);
      expect(body.success).toBe(false);
      expect(body.errors[0].message).toBe("Not Found");
    });
  });
});