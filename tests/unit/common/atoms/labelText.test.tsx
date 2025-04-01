import React from 'react';  
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LabelText } from '@/common/atoms/labelText';

describe('LabelText', () => {
  test('renderiza correctamente el texto del label', () => {
    render(<LabelText>Email</LabelText>);
    
    const labelElement = screen.getByText('Email');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe('LABEL');
  });

  test('aplica las clases de estilo correctas', () => {
    render(<LabelText>Nombre</LabelText>);
    
    const labelElement = screen.getByText('Nombre');
    expect(labelElement).toHaveClass('text-sm');
    expect(labelElement).toHaveClass('font-medium');
    expect(labelElement).toHaveClass('text-foreground');
  });

  test('acepta y renderiza elementos hijos complejos', () => {
    render(
      <LabelText>
        Contraseña <span data-testid="required-mark" className="text-red-500">*</span>
      </LabelText>
    );
    
    const labelElement = screen.getByText(/Contraseña/);
    const requiredMark = screen.getByTestId('required-mark');
    
    expect(labelElement).toBeInTheDocument();
    expect(requiredMark).toBeInTheDocument();
    expect(labelElement).toContainElement(requiredMark);
  });

  test('propaga atributos HTML adicionales al elemento label', () => {
    render(<LabelText htmlFor="username">Nombre de usuario</LabelText>);
    
    const labelElement = screen.getByText('Nombre de usuario');
    expect(labelElement).toHaveAttribute('for', 'username');
  });
});