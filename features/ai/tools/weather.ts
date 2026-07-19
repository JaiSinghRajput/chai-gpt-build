import { tool } from "ai";
import { z } from "zod";

export function createWeatherTool() {
  return tool({
    description:
      "Get the current weather for any city or location in the world.",

    inputSchema: z.object({
      location: z
        .string()
        .describe("City, state, or country. Example: Jaipur, London, Tokyo"),
    }),

    execute: async ({ location }) => {
      // 1. Geocode the location
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          location
        )}&count=1`
      );

      if (!geoResponse.ok) {
        throw new Error("Failed to geocode location.");
      }

      const geoData = await geoResponse.json();

      if (!geoData.results?.length) {
        return {
          success: false,
          error: `Could not find "${location}".`,
        };
      }

      const place = geoData.results[0];

      // 2. Fetch current weather
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`
      );

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather.");
      }

      const weatherData = await weatherResponse.json();

      return {
        success: true,

        location: {
          name: place.name,
          country: place.country,
          admin1: place.admin1,
          latitude: place.latitude,
          longitude: place.longitude,
        },

        current: weatherData.current,
      };
    },
  });
}