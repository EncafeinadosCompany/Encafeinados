import React from "react";
import {render, screen, fireEvent} from "@testing-library/react"
import "@testing-library/jest-dom"
import "jest"
import { InputEmail } from "@/common/atoms/Input-email";

test("Renderizar el input de email con el texto correcto", () => {
    render(<InputEmail/>)
    expect(screen.getByTestId("custom-input-email")).toBeInTheDocument();
})

test("Ejecutar onChange cuando se escribe en el input", () => {
    const handleChange = jest.fn();
    render(<InputEmail onChange={handleChange}/>)
    const inputElement = screen.getByTestId("custom-input-email");
    fireEvent.change(inputElement,{target:{value:"Email"}});
    expect(handleChange).toHaveBeenCalledTimes(1);
})