import React, { useEffect } from "react";

interface LeafletErrorWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper específico para manejar errores de Leaflet sin afectar el ErrorBoundary global.
 * Solo filtra errores conocidos de DOM manipulation que ocurren en móvil.
 */
export const LeafletErrorWrapper: React.FC<LeafletErrorWrapperProps> = ({
  children,
}) => {
  useEffect(() => {
    // ✅ Solo interceptar errores específicos de Leaflet
    const originalError = console.error;
    const originalLog = console.log;

    console.error = function (...args) {
      const errorMessage = args.join(" ").toLowerCase();

      // Lista de errores conocidos de Leaflet que son seguros de ignorar
      const leafletDOMErrors = [
        "failed to execute 'removechild' on 'node'",
        "the node to be removed is not a child of this node",
        "cannot read property '_leaflet' of null",
        "cannot read property '_container' of null",
        "leaflet control",
        "attribution container",
      ];

      const isLeafletDOMError = leafletDOMErrors.some((pattern) =>
        errorMessage.includes(pattern)
      );

      if (isLeafletDOMError) {
        // Silenciar errores de Leaflet DOM conocidos
        console.warn(
          "🟡 LeafletErrorWrapper: Silenced non-critical Leaflet DOM error:",
          args[0]
        );
        return;
      }

      // Para todos los demás errores, usar el console.error original
      originalError.apply(console, args);
    };

    // Cleanup al desmontar
    return () => {
      console.error = originalError;
      console.log = originalLog;
    };
  }, []);

  return <>{children}</>;
};
