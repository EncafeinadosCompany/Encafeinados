import React from "react"; // Importa React
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom"; // Importa jest-dom para los matchers
import "jest"; // Asegúrate de importar los tipos de Jest
import { ButtonDefault } from "@/common/atoms/button"; // Usa alias para importar

test("Renderiza el botón con el texto correcto", () => {
  render(<ButtonDefault>Click Me</ButtonDefault>);
  expect(screen.getByText("Click Me")).toBeInTheDocument(); // Corrige el matcher
});

test("Ejecuta onClick cuando se hace clic", () => {
  const handleClick = jest.fn(); // Asegúrate de que jest.fn() esté correctamente configurado
  render(<ButtonDefault onClick={handleClick}>Click Me</ButtonDefault>);
  const buttonElement = screen.getByText("Click Me");
  fireEvent.click(buttonElement); // Usa fireEvent en lugar de .click()
  expect(handleClick).toHaveBeenCalledTimes(1);
});
