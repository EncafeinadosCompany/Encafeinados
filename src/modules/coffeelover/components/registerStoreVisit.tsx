import { useRegisterVisitMutation } from "@/api/mutations/branchApprovalMutations";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ValidateVisitPage = () => {
  const [searchParams] = useSearchParams();
  const shopId = searchParams.get("branch_id");

  const {
    mutate: validateVisit,
    isError,
    isIdle: isLoading,
    status,
  } = useRegisterVisitMutation();

  useEffect(() => {
    if (!shopId) return;

    if (navigator.geolocation) {
      console.log("Obteniendo ubicación...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          validateVisit({
            shop_id: shopId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error al obtener ubicación:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  if (isLoading) return <p>⏳ Validando tu visita...</p>;
  if (isError) return <p>❌ Hubo un problema registrando tu visita</p>;
  if (status === "success") return <p>🎉 ¡Visita registrada con éxito!</p>;

  return <p>🔍 Preparando validación...</p>;
};

export default ValidateVisitPage;
