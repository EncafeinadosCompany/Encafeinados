import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import SelectTypeDocument from "@/common/atoms/forms/select_type_document.atom";
import { documentTypeList } from "@/common/utils/lists/type_document.utils";


describe("SelectTypeDocument", () => {
    const mockOnValueChange = jest.fn();

    beforeAll(() => {
        global.HTMLElement.prototype.scrollIntoView = jest.fn();
    });

    test("Renderizar correctamente el componente con el placeholder", () => {
        render(
            <SelectTypeDocument value={undefined} onValueChange={mockOnValueChange}></SelectTypeDocument>
        )
        expect(screen.getAllByText("Selecciona tipo")[0]).toBeInTheDocument();
    })

    test("Renderizar las opciones correctamente", async () => {
        render(
            <SelectTypeDocument value={undefined} onValueChange={mockOnValueChange}></SelectTypeDocument>
        )

        fireEvent.click(screen.getByRole("combobox"));

        await waitFor(() => {
            const options = screen.getAllByRole("option");
            expect(options).toHaveLength(documentTypeList.length);

            documentTypeList.forEach((doc) => {
                expect(screen.getByText(doc.description)).toBeInTheDocument();
            });
        });
    })
})