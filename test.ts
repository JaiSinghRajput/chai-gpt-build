async function geocodeLocation(location: string) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      location
    )}&count=1`
  );

  if (!response.ok) {
    throw new Error("Failed to geocode location.");
  }

  const data = await response.json();

  if (!data.results?.length) {
    return null;
  }

  return data.results[0];
}

async function getCurrentWeather(latitude: number, longitude: number) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather.");
  }

  return response.json();
}

async function test() {
  try {
    const place = await geocodeLocation("Jaipur");

    if (!place) {
      console.log("Location not found");
      return;
    }

    console.log("Geocoding Result:");
    console.log(place);

    const weather = await getCurrentWeather(
      place.latitude,
      place.longitude
    );

    console.log("\nCurrent Weather:");
    console.log(weather.current);
  } catch (error) {
    console.error(error);
  }
}

test();