"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

/* ══════════════════════════════════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════════════════════════════════ */

export interface WeatherData {
  temperature: number;
  description: string;
  weatherCode: number;
  humidity: number;
  isDay: boolean;
}

/** A single item in the recommendation carousel — sourced from Supabase */
export interface RecommendationCard {
  productId: string;
  teaId: string;
  teaName: string;
  productName: string;
  brandName: string;
  brandTag: "theorea" | "partner";
  categorySlug: string;
  type: string;               // human-readable category label
  origin: string;
  flavorProfile: string[];
  body: string | null;
  caffeineLevel: string | null;
  brewTempMin: number | null;
  brewTempMax: number | null;
  steepTimeMin: number | null;
  steepTimeMax: number | null;
  infusionsMax: number | null;
  pricePence: number | null;
  imageUrl: string | null;
  score: number;
  reason: string;             // generated narrative reason
  caffeineWarning: string | null;
}

interface TeaContext {
  time: {
    hour: number;
    period: "morning" | "afternoon" | "evening" | "night";
    greeting: string;
    display: string;
  };
  weather: WeatherData | null;
  season: "spring" | "summer" | "autumn" | "winter";
  /** Top recommendation — kept for backward compat */
  recommendation: { tea: string; reason: string };
  /** All 3 ranked recommendations from Supabase */
  recommendations: RecommendationCard[];
  isLoading: boolean;
  locationName: string | null;
}

/* ══════════════════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════════════════ */

const CATEGORY_LABELS: Record<string, string> = {
  "oolong":       "Oolong",
  "black-tea":    "Black Tea",
  "green-tea":    "Green Tea",
  "white-tea":    "White Tea",
  "scented-tea":  "Scented Tea",
  "pu-erh":       "Pu-erh",
  "herbal":       "Herbal",
  "yellow-tea":   "Yellow Tea",
};

function describeWeather(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? "Clear skies" : "Clear night";
  if (code <= 3)  return "Partly cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Light drizzle";
  if (code <= 69) return "Rainy";
  if (code <= 79) return "Snowy";
  if (code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "Overcast";
}

function getSeason(month: number): TeaContext["season"] {
  if (month >= 3 && month <= 5)  return "spring";
  if (month >= 6 && month <= 8)  return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

function getTimePeriod(hour: number) {
  if (hour >= 5  && hour < 12) return { period: "morning"   as const, greeting: "Good morning" };
  if (hour >= 12 && hour < 17) return { period: "afternoon" as const, greeting: "Good afternoon" };
  if (hour >= 17 && hour < 21) return { period: "evening"   as const, greeting: "Good evening" };
  return                               { period: "night"     as const, greeting: "Good evening" };
}

/** Maps weather data → the condition string the SQL function expects */
function mapWeatherCondition(weather: WeatherData | null): string {
  if (!weather) return "any";
  const { temperature: t, weatherCode: c } = weather;
  if (t < 10) return "cold";
  if (c >= 51 && c <= 82) return "rainy";
  if (t > 22) return "warm";
  if (c <= 2)  return "sunny";
  return "any";
}

/**
 * Generates a Théorea-voice narrative reason from the raw Supabase row.
 * Contextualised by time, weather, and the tea's own characteristics.
 */
function buildNarrativeReason(
  row: {
    tea_name: string;
    flavor_profile: string[] | null;
    body: string | null;
    caffeine_level: string | null;
  },
  period: string,
  weather: WeatherData | null,
  hour: number
): string {
  const temp    = weather?.temperature ?? 15;
  const isCold  = temp < 10;
  const isRainy = weather ? (weather.weatherCode >= 51 && weather.weatherCode <= 82) : false;
  const isWarm  = temp > 22;

  const flavors = (row.flavor_profile ?? []).slice(0, 2).filter(Boolean).join(", ");

  const bodyPhrase =
    row.body === "full"  ? "its full body rises with quiet warmth" :
    row.body === "light" ? "delicate and unhurried in the cup" :
    "balanced and composed in every infusion";

  // Context opener
  const opener =
    period === "morning"   && isCold  ? "A cold morning calls for depth. " :
    period === "morning"   && isRainy ? "Rain against the window. " :
    period === "morning"   && isWarm  ? "A warm, bright morning. " :
    period === "morning"              ? "A clear morning. " :
    period === "afternoon" && isRainy ? "A grey afternoon. " :
    period === "afternoon" && isWarm  ? "The afternoon warmth. " :
    period === "afternoon"            ? "The afternoon light. " :
    isCold                            ? "The evening cools. " :
    "The evening settles. ";

  // Caffeine advisory woven into the closing naturally
  const caffeineClose =
    hour >= 18 && row.caffeine_level === "low"
      ? " A gentle choice to end the day."
      : hour >= 18 && row.caffeine_level === "medium"
      ? " One or two infusions — let the evening settle."
      : "";

  return `${opener}${row.tea_name}${flavors ? ` — ${flavors}` : ""}, ${bodyPhrase}.${caffeineClose}`;
}

/* ── Fallback cards when Supabase is unreachable ─────────────────────────── */
function buildFallbackRecommendations(
  period: string,
  weather: WeatherData | null,
  hour: number
): RecommendationCard[] {
  const base = [
    {
      productId: "fallback-dhp",
      teaId: "fallback-dhp",
      teaName: "Da Hong Pao",
      productName: "Da Hong Pao — Rock Oolong",
      brandName: "Maison Théorea",
      brandTag: "theorea" as const,
      categorySlug: "oolong",
      type: "Oolong",
      origin: "Wuyi, Fujian",
      flavorProfile: ["roasted", "mineral", "stone fruit"],
      body: "full",
      caffeineLevel: "medium",
      brewTempMin: 90, brewTempMax: 95,
      steepTimeMin: 30, steepTimeMax: 60,
      infusionsMax: 8, pricePence: 2800,
      imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=800&q=80",
      score: 9, caffeineWarning: null,
    },
    {
      productId: "fallback-jsb",
      teaId: "fallback-jsb",
      teaName: "Jasmin Snow Buds",
      productName: "Jasmin Snow Buds — Scented White",
      brandName: "Maison Théorea",
      brandTag: "theorea" as const,
      categorySlug: "scented-tea",
      type: "Scented Tea",
      origin: "Fuding, Fujian",
      flavorProfile: ["jasmine", "honey", "floral"],
      body: "light",
      caffeineLevel: "low",
      brewTempMin: 75, brewTempMax: 80,
      steepTimeMin: 90, steepTimeMax: 150,
      infusionsMax: 5, pricePence: 2400,
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      score: 7, caffeineWarning: null,
    },
  ];

  return base.map((r) => ({
    ...r,
    reason: buildNarrativeReason(
      { tea_name: r.teaName, flavor_profile: r.flavorProfile, body: r.body, caffeine_level: r.caffeineLevel },
      period, weather, hour
    ),
  }));
}

/* ══════════════════════════════════════════════════════════════════════════
   Hook
   ══════════════════════════════════════════════════════════════════════════ */

export function useTeaContext(): TeaContext {
  const [weather, setWeather]               = useState<WeatherData | null>(null);
  const [locationName, setLocationName]     = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationCard[]>([]);
  const [isLoading, setIsLoading]           = useState(true);

  const now    = new Date();
  const hour   = now.getHours();
  const { period, greeting } = getTimePeriod(hour);
  const season = getSeason(now.getMonth());

  useEffect(() => {
    let cancelled = false;

    async function fetchContext() {
      let resolvedWeather: WeatherData | null = null;

      /* ── Step 1: Location + weather ─────────────────────────────── */
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 8000,
            enableHighAccuracy: false,
          })
        );

        const { latitude, longitude } = position.coords;

        const [weatherRes, geoRes] = await Promise.all([
          fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,is_day&timezone=auto`
          ),
          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`
          ),
        ]);

        const [weatherJson, geoJson] = await Promise.all([
          weatherRes.json(),
          geoRes.json(),
        ]);

        if (!cancelled && weatherJson.current) {
          const c = weatherJson.current;
          resolvedWeather = {
            temperature:  c.temperature_2m,
            weatherCode:  c.weather_code,
            humidity:     c.relative_humidity_2m,
            isDay:        c.is_day === 1,
            description:  describeWeather(c.weather_code, c.is_day === 1),
          };
          setWeather(resolvedWeather);
        }

        if (!cancelled && geoJson.address) {
          const city =
            geoJson.address.city    ||
            geoJson.address.town    ||
            geoJson.address.village ||
            geoJson.address.county;
          setLocationName(city || null);
        }
      } catch {
        if (!cancelled) {
          setWeather(null);
          setLocationName(null);
        }
      }

      /* ── Step 2: Supabase recommendation RPC ─────────────────────── */
      try {
        const condition  = mapWeatherCondition(resolvedWeather);
        const { data, error } = await supabase.rpc("recommend_teas", {
          p_time_of_day:  period,
          p_weather:      condition,
          p_temp_celsius: resolvedWeather?.temperature ?? null,
          p_current_hour: hour,
          p_limit:        3,
        });

        if (!cancelled && !error && data && data.length > 0) {
          const cards: RecommendationCard[] = (data as Array<Record<string, unknown>>).map((row) => ({
            productId:     row.product_id   as string,
            teaId:         row.tea_id       as string,
            teaName:       row.tea_name     as string,
            productName:   row.product_name as string,
            brandName:     row.brand_name   as string,
            brandTag:      (row.brand_name === "Maison Théorea" ? "theorea" : "partner") as "theorea" | "partner",
            categorySlug:  row.category_slug as string,
            type:          CATEGORY_LABELS[row.category_slug as string] ?? (row.category_slug as string),
            origin:        row.origin_region as string,
            flavorProfile: (row.flavor_profile as string[]) ?? [],
            body:          row.body          as string | null,
            caffeineLevel: row.caffeine_level as string | null,
            brewTempMin:   row.brew_temp_min_c  as number | null,
            brewTempMax:   row.brew_temp_max_c  as number | null,
            steepTimeMin:  row.steep_time_min_s as number | null,
            steepTimeMax:  row.steep_time_max_s as number | null,
            infusionsMax:  row.infusions_max    as number | null,
            pricePence:    row.price_pence      as number | null,
            imageUrl:      row.image_url        as string | null,
            score:         row.score            as number,
            caffeineWarning: row.caffeine_warning as string | null,
            reason: buildNarrativeReason(
              {
                tea_name:       row.tea_name       as string,
                flavor_profile: row.flavor_profile as string[],
                body:           row.body           as string | null,
                caffeine_level: row.caffeine_level as string | null,
              },
              period,
              resolvedWeather,
              hour
            ),
          }));
          setRecommendations(cards);
        } else if (!cancelled) {
          // Supabase returned no rows — use fallback
          setRecommendations(buildFallbackRecommendations(period, resolvedWeather, hour));
        }
      } catch {
        if (!cancelled) {
          setRecommendations(buildFallbackRecommendations(period, resolvedWeather, hour));
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchContext();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const top = recommendations[0];

  return {
    time: {
      hour,
      period,
      greeting,
      display: now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
    },
    weather,
    season,
    recommendation: {
      tea:    top?.teaName ?? "Da Hong Pao",
      reason: top?.reason  ?? "",
    },
    recommendations,
    isLoading,
    locationName,
  };
}
