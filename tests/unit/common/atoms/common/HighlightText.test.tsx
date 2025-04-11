import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HighlightText from '@/common/atoms/common/HighlightText';

describe('HighlightText', () => {
  test('renderiza texto sin resaltar cuando no hay término de búsqueda', () => {
    render(<HighlightText text="Café de especialidad" highlight="" />);
    
    const element = screen.getByText('Café de especialidad');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toBe('SPAN');
    expect(element.querySelector('.bg-yellow-100')).toBeNull();
  });

  test('renderiza texto con término resaltado', () => {
    const { container } = render(<HighlightText text="Café de especialidad" highlight="café" />);
    
    const mainSpan = container.querySelector('span');
    expect(mainSpan?.textContent).toBe('Café de especialidad');
    
    const highlightedPart = screen.getByText('Café');
    expect(highlightedPart).toHaveClass('bg-yellow-100');
    expect(highlightedPart).toHaveClass('text-yellow-800');
    expect(highlightedPart).toHaveClass('font-semibold');
  });

  test('maneja múltiples coincidencias en el texto', () => {
    render(<HighlightText text="Café con café molido" highlight="café" />);
    
    const highlightedParts = screen.getAllByText(/café/i);
    expect(highlightedParts).toHaveLength(2);
    
    highlightedParts.forEach(part => {
      expect(part).toHaveClass('bg-yellow-100');
    });
  });

  test('escapa caracteres especiales de regex en el término de búsqueda', () => {
    render(<HighlightText text="Precio: $5.99 (oferta)" highlight="$5.99 (" />);
    
    const highlightedPart = screen.getByText('$5.99 (');
    expect(highlightedPart).toHaveClass('bg-yellow-100');
  });

  test('aplica className personalizado al elemento span principal', () => {
    const { container } = render(
      <HighlightText 
        text="Café de especialidad" 
        highlight="café" 
        className="text-lg font-bold" 
      />
    );
    
    const mainSpan = container.querySelector('span');
    expect(mainSpan).toHaveClass('text-lg');
    expect(mainSpan).toHaveClass('font-bold');
  });

  test('es case-insensitive en las coincidencias', () => {
    render(<HighlightText text="CAFÉ de Especialidad" highlight="café" />);
    
    const highlightedPart = screen.getByText('CAFÉ');
    expect(highlightedPart).toHaveClass('bg-yellow-100');
  });

  test('maneja correctamente texto sin coincidencias', () => {
    render(<HighlightText text="Café de especialidad" highlight="chocolate" />);
    
    expect(screen.getByText('Café de especialidad')).toBeInTheDocument();
    
    const container = screen.getByText('Café de especialidad');
    expect(container.querySelector('.bg-yellow-100')).toBeNull();
  });
});