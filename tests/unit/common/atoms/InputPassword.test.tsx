import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest";
import { InputPassword } from "@/common/atoms/auth/input_passwork";


test("Renderizar el input de password con el texto correcto", () => {
  render(<InputPassword />);
  expect(screen.getByTestId("custom-input-password")).toBeInTheDocument();

});

test("Ejecutar onChange cuando se escribe en el input", () => {
 const handleChange = jest.fn();
 render(<InputPassword onChange={handleChange} />);
 const inputElement = screen.getByTestId("custom-input-password");
 fireEvent.change(inputElement, {target: {value: "Password"}})
 expect(handleChange).toHaveBeenCalledTimes(1); 
})