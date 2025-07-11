import React from "react";
import {render, screen, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import "jest"
import { InputForm } from "@/common/atoms/forms/input_form.atom";

test("Renderizar el input de formlario con el texto correcto", () => {
    render(<InputForm/>)
    expect(screen.getByTestId("custom-input-form")).toBeInTheDocument();
})

test("Ejecutar onChange cuando se escribe en el input", () => {
   const handleChange = jest.fn();
   render(<InputForm onChange={handleChange}/>)
   const inputElement = screen.getByTestId("custom-input-form");
   fireEvent.change(inputElement,{target:{value:"Email"}});
   expect(handleChange).toHaveBeenCalledTimes(1); 
})