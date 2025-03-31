import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest";
import UserLocationMarker from "@/common/atoms/map/UserLocationMarker";
import { Marker } from "react-leaflet";

jest.mock("react-leaflet", () => ({
  Marker: jest.fn(() => <div data-testid="marker" />),
}));

describe("UserLocationMarker", () => {
  test("No renderiza nada si no hay posición", () => {
    const { container } = render(<UserLocationMarker position={null} />);
    expect(container.firstChild).toBeNull();
  });

  test("Renderiza el marcador si hay posición", () => {
    const position: [number, number] = [51.505, -0.09];
    render(<UserLocationMarker position={position} />);
    expect(screen.getByTestId("marker")).toBeInTheDocument();
  });

  test("Renderiza el marcador con la clase 'pulsing' si pulsing es true", () => {
    const position: [number, number] = [51.505, -0.09];
    render(<UserLocationMarker position={position} pulsing={true} />);
    expect(Marker).toHaveBeenCalledWith(
      expect.objectContaining({
        position: position,
        icon: expect.any(Object),
      }),
      expect.anything()
    );
  });
});
