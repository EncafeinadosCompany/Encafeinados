import { useState, useCallback, useEffect } from "react";
import L from "leaflet";
import toast from "react-hot-toast";

const ORS_API_KEY =
  typeof import.meta !== "undefined" && import.meta.env
    ? import.meta.env.VITE_ORS_API_KEY || ""
    : "";

const USE_OSRM_FALLBACK = true;

// Añade esta función auxiliar para formatear el tiempo
const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} h`;
  }

  return `${hours} h ${remainingMinutes} min`;
};

export const useRouteNavigation = () => {
  const [transportMode, setTransportMode] = useState<
    "walking" | "cycling" | "driving"
  >("walking");
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [destination, setDestination] = useState<[number, number] | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>(
    []
  );
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    time: number;
    distance: number;
    ascent?: number;
    descent?: number;
    instructions?: any[];
  } | null>(null);
  const [routeQuality, setRouteQuality] = useState<"high" | "medium" | "low">(
    "medium"
  );

  const calculateRoute = useCallback(async () => {
    if (!origin || !destination) return;

    setIsCalculatingRoute(true);
    setRouteInfo(null);

    try {
      if (ORS_API_KEY) {
        try {
          const orsResult = await calculateWithORS(
            origin,
            destination,
            transportMode
          );

          setRouteCoordinates(orsResult.coordinates);
          setRouteInfo({
            time: orsResult.time,
            distance: orsResult.distance,
            ascent: orsResult.ascent,
            descent: orsResult.descent,
            instructions: orsResult.instructions,
          });

          setRouteQuality("high");
          console.log(`Ruta OpenRouteService (${transportMode}):`, {
            distancia: `${orsResult.distance.toFixed(1)}km`,
            tiempo: `${formatDuration(orsResult.time)}`,
            subida: orsResult.ascent ? `${orsResult.ascent}m` : "N/A",
            bajada: orsResult.descent ? `${orsResult.descent}m` : "N/A",
          });

          return;
        } catch (orsError) {
          console.error("Error en OpenRouteService:", orsError);
          if (!USE_OSRM_FALLBACK) {
            throw orsError;
          }
        }
      }

      if (USE_OSRM_FALLBACK) {
        const osrmResult = await calculateWithOSRM(
          origin,
          destination,
          transportMode
        );

        setRouteCoordinates(osrmResult.coordinates);
        setRouteInfo({
          time: osrmResult.time,
          distance: osrmResult.distance,
        });

        setRouteQuality("medium");
        console.log(`Ruta OSRM fallback (${transportMode}):`, {
          distancia: `${osrmResult.distance.toFixed(1)}km`,
          tiempo: `${formatDuration(osrmResult.time)}`,
        });
      } else {
        throw new Error(
          "No se pudo calcular la ruta con OpenRouteService y no hay fallback configurado"
        );
      }
    } catch (error) {
      console.error("Error calculando ruta:", error);

      toast.error(
        error instanceof Error && error.message?.includes("API key")
          ? "Error de API: Verifica la clave de OpenRouteService"
          : "No se pudo calcular la ruta. Usando estimación aproximada."
      );

      calculateLocalFallback(origin, destination, transportMode);
    } finally {
      setIsCalculatingRoute(false);
    }
  }, [origin, destination, transportMode]);

  const calculateWithORS = async (
    origin: [number, number],
    destination: [number, number],
    mode: "walking" | "cycling" | "driving"
  ) => {
    const modeMapping = {
      walking: "foot-walking",
      cycling: "cycling-regular",
      driving: "driving-car",
    };

    const getPreferences = () => {
      const preferences: any = {
        options: {},
      };

      switch (mode) {
        case "walking":
          preferences.options.profile_params = {
            weightings: {
              green: 0.4,
              quiet: 0.3,
            },
          };
          preferences.options.avoid_features = ["steps", "ferries"];
          break;

        case "cycling":
          preferences.options.profile_params = {
            weightings: {
              green: 0.3,
              quiet: 0.5,
            },
            difficulty_params: {
              fitness_level: 3,
            },
          };
          preferences.options.avoid_features = ["ferries", "fords"];
          break;

        case "driving":
          preferences.options.avoid_features = ["ferries"];

          const hour = new Date().getHours();
          if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
            preferences.options.profile_params = {
              weightings: {
                fastest: 1,
              },
            };
          }
          break;
      }

      return preferences;
    };

    const url = `https://api.openrouteservice.org/v2/directions/${modeMapping[mode]}/geojson`;

    const requestBody = {
      coordinates: [
        [origin[1], origin[0]],
        [destination[1], destination[0]],
      ],
      elevation: true,
      instructions: true,
      language: "es",
      units: "km",
      geometry_simplify: true,
      ...getPreferences(),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: ORS_API_KEY,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error ORS (${response.status}): ${
            errorData.error?.message || "Respuesta inválida"
          }`
        );
      }

      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        throw new Error("No se encontró ruta en la respuesta");
      }

      const route = data.features[0];
      const properties = route.properties;
      const summary = properties.summary;

      const coordinates: [number, number][] = route.geometry.coordinates.map(
        (coord: number[]): [number, number] => [coord[1], coord[0]]
      );

      const segments = properties.segments || [];
      const ascent = segments.reduce(
        (total: number, seg: any) => total + (seg.ascent || 0),
        0
      );
      const descent = segments.reduce(
        (total: number, seg: any) => total + (seg.descent || 0),
        0
      );

      const instructions = segments.flatMap(
        (segment: any) => segment.steps || []
      );

      const applyRealisticAdjustments = (
        duration: number,
        distance: number
      ) => {
        let adjustedDuration = duration;

        switch (mode) {
          case "walking":
            adjustedDuration *= 1.1;
            break;

          case "cycling":
            adjustedDuration *= 1.15;
            break;

          case "driving":
            adjustedDuration *= 1.2; // +20%

            // Ajuste por hora
            const hour = new Date().getHours();
            const isRushHour =
              (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
            if (isRushHour) adjustedDuration *= 1.25;
            break;
        }

        return {
          adjustedDuration,
          distance,
        };
      };

      const { adjustedDuration } = applyRealisticAdjustments(
        summary.duration,
        summary.distance
      );

      return {
        coordinates,
        time: Math.ceil(adjustedDuration / 60),
        distance: parseFloat(summary.distance.toFixed(1)),
        ascent: Math.round(ascent),
        descent: Math.round(descent),
        instructions: instructions.map((step: any) => ({
          text: step.instruction,
          distance: step.distance,
          duration: step.duration,
          type: step.type,
          name: step.name || "",
        })),
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Tiempo de espera agotado en OpenRouteService");
      }
      throw error;
    }
  };

  const calculateWithOSRM = async (
    origin: [number, number],
    destination: [number, number],
    mode: "walking" | "cycling" | "driving"
  ) => {
    const modeMapping = {
      walking: "foot",
      cycling: "bike",
      driving: "car",
    };

    const url =
      `https://router.project-osrm.org/route/v1/${modeMapping[mode]}/` +
      `${origin[1]},${origin[0]};${destination[1]},${destination[0]}` +
      `?overview=full&geometries=geojson&annotations=true&continue_straight=true`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      const data = await response.json();

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        throw new Error(`Error OSRM: ${data.message || "Respuesta inválida"}`);
      }

      const coordinates: [number, number][] =
        data.routes[0].geometry.coordinates.map(
          (coord: number[]): [number, number] => [coord[1], coord[0]]
        );

      const rawDuration = data.routes[0].duration;
      const rawDistance = data.routes[0].distance;

      let adjustedDuration = rawDuration;

      switch (mode) {
        case "walking":
          adjustedDuration *= 1.15;
          if (rawDistance > 3000) adjustedDuration *= 1.1;
          break;

        case "cycling":
          adjustedDuration *= 1.2;
          if (rawDistance > 8000) adjustedDuration *= 1.08;
          break;

        case "driving":
          adjustedDuration *= 1.25;
          const currentHour = new Date().getHours();
          const isRushHour =
            (currentHour >= 7 && currentHour <= 9) ||
            (currentHour >= 17 && currentHour <= 19);
          if (isRushHour) adjustedDuration *= 1.3;
          break;
      }

      return {
        coordinates,
        time: Math.ceil(adjustedDuration / 60),
        distance: parseFloat((rawDistance / 1000).toFixed(1)),
      };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Tiempo de espera agotado en OSRM");
      }
      throw error;
    }
  };

  const calculateLocalFallback = (
    origin: [number, number],
    destination: [number, number],
    mode: "walking" | "cycling" | "driving"
  ) => {
    setRouteCoordinates([origin, destination]);
    setRouteQuality("low");

    const distanceMeters = L.latLng(origin[0], origin[1]).distanceTo(
      L.latLng(destination[0], destination[1])
    );

    const getUrbanDeviationFactor = (distanceM: number) => {
      if (distanceM < 500) return 1.15;
      if (distanceM < 2000) return 1.29;
      if (distanceM < 5000) return 1.38;
      if (distanceM < 10000) return 1.45;
      return 1.31;
    };

    const routeFactor = getUrbanDeviationFactor(distanceMeters);
    const estimatedRouteDistance = distanceMeters * routeFactor;
    const distanceKm = parseFloat((estimatedRouteDistance / 1000).toFixed(1));

    const getRealisticSpeed = (
      distance: number,
      transportMode: string
    ): number => {
      switch (transportMode) {
        case "walking":
          return distance > 5 ? 4.0 : distance > 2 ? 4.5 : 4.8;
        case "cycling":
          return distance > 8 ? 14.5 : distance > 3 ? 16.0 : 13.5;
        case "driving":
          const hour = new Date().getHours();
          const isPeakHour =
            (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);

          if (isPeakHour) {
            return distance > 10 ? 22 : distance > 5 ? 18 : 15;
          } else {
            return distance > 10 ? 35 : distance > 5 ? 28 : 22;
          }
        default:
          return 5;
      }
    };

    const speed = getRealisticSpeed(distanceKm, mode);
    const baseTimeMinutes = (distanceKm / speed) * 60;

    const getAdditionalMinutes = (distKm: number, transportMode: string) => {
      switch (transportMode) {
        case "walking":
          return Math.min(5, distKm * 0.5);
        case "cycling":
          return Math.min(5, distKm * 0.3);
        case "driving":
          return Math.min(8, distKm * 0.8);
        default:
          return 0;
      }
    };

    const additionalMinutes = getAdditionalMinutes(distanceKm, mode);
    const totalTimeMinutes = Math.ceil(baseTimeMinutes + additionalMinutes);

    setRouteInfo({
      distance: distanceKm,
      time: totalTimeMinutes,
    });

    console.log(`Estimación local (${mode}) - BAJA CALIDAD:`, {
      distanciaLineal: `${(distanceMeters / 1000).toFixed(1)}km`,
      factorDesvio: routeFactor.toFixed(2),
      distanciaEstimada: `${distanceKm}km`,
      velocidad: `${speed}km/h`,
      tiempoBase: `${Math.round(baseTimeMinutes)}min`,
      demoras: `${Math.round(additionalMinutes)}min`,
      tiempoTotal: `${formatDuration(totalTimeMinutes)}`,
    });

    toast(
      `Utilizando estimación aproximada para la ruta (${distanceKm}km, ~${formatDuration(
        totalTimeMinutes
      )})`,
      {
        duration: 4000,
        icon: "⚠️",
        style: {
          backgroundColor: "#FFF3CD",
          color: "#856404",
        },
      }
    );
  };

  useEffect(() => {
    if (origin && destination) {
      calculateRoute();
    }
  }, [origin, destination, transportMode, calculateRoute]);

  const clearRoute = useCallback(() => {
    setOrigin(null);
    setDestination(null);
    setRouteCoordinates([]);
    setRouteInfo(null);
    setRouteQuality("medium");
  }, []);

  return {
    transportMode,
    setTransportMode,
    origin,
    destination,
    setOrigin,
    setDestination,
    isCalculatingRoute,
    setIsCalculatingRoute,
    routeInfo,
    setRouteInfo,
    routeCoordinates,
    clearRoute,
    isRouteActive: Boolean(origin && destination),
    routeQuality,
  };
};
