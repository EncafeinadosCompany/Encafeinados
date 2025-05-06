import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "jest";
import "@testing-library/jest-dom";
import { ButtonGoogle } from "@/common/atoms/auth/button_google.atom";


test("Renderizar el botón de Google con el texto correcto", () => {
    render(<ButtonGoogle>Clik me</ButtonGoogle>)
    expect(screen.getByText("Clik me")).toBeInTheDocument();
});

test("Ejecutar onClick cuando se hace click" , () =>{
    const handleClick = jest.fn();
    render(<ButtonGoogle onClick={handleClick}>Google</ButtonGoogle>)
    const buttonElement = screen.getByText("Google");
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
})