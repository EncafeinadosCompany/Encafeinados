import React from "react";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import  LoadingSpinner  from "@/common/atoms/LoadingSpinner";

test("Renderizar el spinner correctamente", ()=>{
    render(<LoadingSpinner/>)
    expect(screen.getByRole("status")).toBeInTheDocument();
})

test("Muestra el mensaje si se proporciona", ()=>{
    render(<LoadingSpinner message="Cargando..."/>);
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
})

test("Aplica la clase personalizada si se proporciona", ()=>{
    const customClassName = "bg-red-500";
    const {container} = render(<LoadingSpinner className={customClassName}/>);
    expect(container.firstChild).toHaveClass(customClassName);
})
