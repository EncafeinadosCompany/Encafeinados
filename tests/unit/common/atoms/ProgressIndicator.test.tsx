import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import "jest";
import ProgressIndicator from "@/common/atoms/auth/ProgressIndicator";

describe("ProgressIndicator", () => {
    test("Renderizar el número correcto de pasos",()=>{
        render(<ProgressIndicator step={2} totalSteps={3} />)
        expect(screen.getAllByRole("listitem")).toHaveLength(3)
    });

    test("Muestra un check en los pasos completados",()=>{
        render(<ProgressIndicator step={2} totalSteps={3} />)
        expect(screen.getAllByRole("listitem")[0]).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")[1]).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")[2]).toBeInTheDocument();
    })
})