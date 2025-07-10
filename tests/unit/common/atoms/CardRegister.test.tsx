import  React from "react";
import {render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CardRegister from "@/common/atoms/forms/card_register.atom";

describe("CardRegister", ()=>{

    const mockProps= {
        link:"/",
        title:"Some Title",
        subtitle:"Some Subtitles",
        description:"Some description",
    };

    test("Renderizar el componente CardRegister con los props correctos", () =>{
        render(
            <MemoryRouter>
                <CardRegister {...mockProps}/>
            </MemoryRouter>
        );
        expect(screen.getByText(mockProps.title)).toBeInTheDocument();
        expect(screen.getByText(mockProps.subtitle)).toBeInTheDocument();
        expect(screen.getByText(mockProps.description)).toBeInTheDocument();
    })

    test("El enlace redirige correctamente al hacer click", () => {
        render(
          <MemoryRouter>
            <CardRegister {...mockProps} />
          </MemoryRouter>
        );
    
        const linkElement = screen.getByRole("link");
        expect(linkElement).toHaveAttribute("href", mockProps.link);
    
        fireEvent.click(linkElement);
    
        expect(window.location.pathname).toBe(mockProps.link);
      });
});