

import React from "react";
import { TextEncoder, TextDecoder } from "util";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {MemoryRouter} from "react-router-dom"
import SearchCoffee from "@/common/atoms/search";

test("Renderizar el input de busqueda con el texto correcto", () => {
  render(
    <MemoryRouter>
      <SearchCoffee />
    </MemoryRouter>
  );
  expect(screen.getByTestId("custom-input-search")).toBeInTheDocument();
});

test("Ejecutar onChange cuando se escribe en el input", () => {
    const handleChange = jest.fn();

    render(
      <MemoryRouter>
        <SearchCoffee onChange={handleChange} />
      </MemoryRouter>
    );

    const inputElement= screen.getByPlaceholderText("Buscar cafeterías...");
    fireEvent.change(inputElement, { target: { value: "Cafetería" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
});

test("El ícono de mapa tiene el enlace correcto", ()=>{
    render(
        <MemoryRouter>
            <SearchCoffee/>
        </MemoryRouter>
    )
    const LinkElement = screen.getByRole("link",{name:""});
    expect(LinkElement).toHaveAttribute("href","/coffeelover/map-coffelover");
})