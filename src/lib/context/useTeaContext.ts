"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  description: string;
  weatherCode: number;
  humidity: number;
  isDay: boolean;
}

interface TeaContext {
  /** Current local time info */
  time: {
    hour: number;
    period: "morning" | "afternoon" | "evening" | "night";
    greeting: string;
    display: string;
  };
  /** Weather at user's location */
  weather: WeatherData | null;
  /** Season based on date + hemisphere */
  season: "spring" | "summer" | "autumn" | "winter";
  /** Lou's contextual tea recommendation */
  recommendation: {
    tea: string;
    reason: string;
  };
  /** Loading state */
  isLoading: boolean;
  /** Location name (reverse geocoded) */
  locationName: string | null;
}

/** Map WMO weather codes to human descriptions */
function describeWeather(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? "Clear skies" : "Clear night";
  if (code <= 3) return "Partly cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Light drizzle";
  if (code <= 69) return "Rainy";
  if (code <= 79) return "Snowy";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  if (code >= 95) return "Thunderstorm";
  return "Overcast";
}

/** Determine season (Northern Hemisphere — UK) */
function getSeason(month: number): TeaContext["season"] {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

/** Time period and greeting */
function getTimePeriod(hour: number) {
  if (hour >= 5 && hour < 12)
    return { period: "morning" as const, greeting: "Good morning" };
  if (hour >= 12 && hour < 17)
    return { period: "afternoon" as const, greeting: "Good afternoon" };
  if (hour >= 17 && hour < 21)
    return { period: "evening" as const, greeting: "Good evening" };
  return { period: "night" as const, greeting: "Good evening" };
}

/** Generate a contextual tea recommendation based on time, weather, and season */
function getRecommendation(
  period: string,
  weather: WeatherData | null,
  season: string
): { tea: string; reason: string } {
  const temp = weather?.temperature ?? 15;
  const isRainy = weather
    ? weather.weatherCode >= 51 && weather.weatherCode <= 82
    : false;
  const isCold = temp < 10;
  const isWarm = temp > 22;

  // Morning
  if (period === "morning") {
    if (isCold || isRainy) {
      return {
        tea: "Da Hong Pao",
        reason: `A ${isCold ? "cold" : "rainy"} morning calls for warmth. Da Hong Pao's roasted mineral depth will ground you — its body rises like quiet heat.`,
      };
    }
    return {
      tea: "Jasmin Snow Buds",
      reason:
        "A fresh morning. Jasmin Snow Buds will open gently — their floral clarity is perfect for a clear mind at the start of the day.",
    };
  }

  // Afternoon
  if (period === "afternoon") {
    if (isWarm) {
      return {
        tea: "Jasmin Snow Buds",
        reason: `At ${Math.round(temp)}°C, something light and floral. Let the jasmine cool your palate — brew it slightly cooler for extra delicacy.`,
      };
    }
    if (isRainy) {
      return {
        tea: "Da Hong Pao",
        reason:
          "Rain against the window, warmth in the cup. Da Hong Pao's roasted sweetness is the perfect companion for a grey afternoon.",
      };
    }
    return {
      tea: "Da Hong Pao",
      reason:
        "The afternoon asks for something grounding. Da Hong Pao's mineral warmth pairs beautifully with a moment of stillness.",
    };
  }

  // Evening / Night
  if (season === "winter" || isCold) {
    return {
      tea: "Da Hong Pao",
      reason: `A ${season} evening at ${Math.round(temp)}°C. Da Hong Pao's deep warmth will close the day with quiet richness — let each steep unfold slowly.`,
    };
  }

  return {
    tea: "Jasmin Snow Buds",
    reason:
      "The evening is mild. Jasmin Snow Buds brewed lightly — almost meditative. A gentle way to close the day.",
  };
}

export function useTeaContext(): TeaContext {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const now = new Date();
  const hour = now.getHours();
  const { period, greeting } = getTimePeriod(hour);
  const season = getSeason(now.getMonth());

  useEffect(() => {
    let cancelled = false;

    async function fetchContext() {
      try {
        // Get user's location
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 8000,
              enableHighAccuracy: false,
            })
        );

        const { latitude, longitude } = position.coords;

        // Fetch weather from Open-Meteo (free, no API key)
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,is_day&timezone=auto`
        );
        const weatherData = await weatherRes.json();

        if (!cancelled && weatherData.current) {
          const current = weatherData.current;
          setWeather({
            temperature: current.temperature_2m,
            weatherCode: current.weather_code,
            humidity: current.relative_humidity_2m,
            isDay: current.is_day === 1,
            description: describeWeather(
              current.weather_code,
              current.is_day === 1
            ),
          });
        }

        // Reverse geocode for location name (Open-Meteo geocoding)
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`
        );
        const geoData = await geoRes.json();

        if (!cancelled && geoData.address) {
          const city =
            geoData.address.city ||
            geoData.address.town ||
            geoData.address.village ||
            geoData.address.county;
          setLocationName(city || null);
        }
      } catch {
        // Geolocation denied or unavailable — use defaults
        if (!cancelled) {
          setWeather(null);
          setLocationName(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchContext();
    return () => {
      cancelled = true;
    };
  }, []);

  const recommendation = getRecommendation(period, weather, season);

  return {
    time: {
      hour,
      period,
      greeting,
      display: now.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    weather,
    season,
    recommendation,
    isLoading,
    locationName,
  };
}
