import React from "react"; 
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest";
import { ButtonDefault } from "@/common/atoms/common/button.atom"; 

test("Renderiza el botón con el texto correcto", () => {
  render(<ButtonDefault>Click Me</ButtonDefault>);
  expect(screen.getByText("Click Me")).toBeInTheDocument(); 
});

test("Ejecuta onClick cuando se hace clic", () => {
  const handleClick = jest.fn();
  render(<ButtonDefault onClick={handleClick}>Click Me</ButtonDefault>);
  const buttonElement = screen.getByText("Click Me");
  fireEvent.click(buttonElement); 
  expect(handleClick).toHaveBeenCalledTimes(1);
});
