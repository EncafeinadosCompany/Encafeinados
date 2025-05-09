import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest";
import ProgressIndicator from "@/common/atoms/auth/progress_indicator.atom";

describe("ProgressIndicator", () => {
    test("Renderizar el número correcto de pasos",()=>{
        render(<ProgressIndicator step={2} totalSteps={3} />)
        expect(screen.getAllByRole("listitem")).toHaveLength(3)
    });

    test("Muestra un check en los pasos completados",()=>{
        render(<ProgressIndicator step={2} totalSteps={3} />);
        
        const listItems = screen.getAllByRole("listitem");
        expect(listItems).toHaveLength(3);
        
        expect(listItems[0].querySelector("svg")).toBeInTheDocument(); 
        expect(listItems[1].querySelector("svg")).not.toBeInTheDocument();
        expect(listItems[2].querySelector("svg")).not.toBeInTheDocument();
    })
})