import React, { type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TitleForm } from '@/common/atoms/auth/titleForm';


jest.mock('framer-motion', () => ({
  motion: {
    h1: ({ children, className, initial, animate, transition, ...rest }: { children: ReactNode; className?: string; initial?: unknown; animate?: unknown; transition?: unknown;[key: string]: any }) => (
      <h1 data-testid="motion-h1" className={className} {...rest}>
        {children}
      </h1>
    ),
    p: ({ children, className, initial, animate, transition, ...rest }: { children: ReactNode; className?: string; initial?: unknown; animate?: unknown; transition?: unknown;[key: string]: any }) => (
      <p data-testid="motion-p" className={className} {...rest}>
        {children}
      </p>
    ),
  },
}));

describe('TitleForm', () => {
  const testProps = {
    title: 'Iniciar Sesión',
    subtitle: 'Bienvenido a tu cuenta'
  };

  test('renderiza el título y subtítulo correctamente', () => {
    render(<TitleForm {...testProps} />);

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByText('Bienvenido a tu cuenta')).toBeInTheDocument();
  });

  test('aplica las clases de estilo correctas al título', () => {
    render(<TitleForm {...testProps} />);

    const titleElement = screen.getByTestId('motion-h1');
    expect(titleElement).toHaveClass('text-2xl');
    expect(titleElement).toHaveClass('font-medium');
    expect(titleElement).toHaveClass('text-amber-900');
  });

  test('aplica las clases de estilo correctas al subtítulo', () => {
    render(<TitleForm {...testProps} />);

    const subtitleElement = screen.getByTestId('motion-p');
    expect(subtitleElement).toHaveClass('text-gray-500');
    expect(subtitleElement).toHaveClass('mt-3');
  });

  test('maneja títulos y subtítulos largos', () => {
    const longProps = {
      title: 'Este es un título muy largo que podría causar problemas de diseño',
      subtitle: 'Este es un subtítulo extenso que contiene mucha información para el usuario y debe ser manejado correctamente'
    };

    render(<TitleForm {...longProps} />);

    expect(screen.getByText(longProps.title)).toBeInTheDocument();
    expect(screen.getByText(longProps.subtitle)).toBeInTheDocument();
  });

  test('maneja correctamente cadenas vacías', () => {
    render(<TitleForm title="" subtitle="" />);

    const titleElement = screen.getByTestId('motion-h1');
    const subtitleElement = screen.getByTestId('motion-p');

    expect(titleElement).toBeInTheDocument();
    expect(subtitleElement).toBeInTheDocument();
    expect(titleElement.textContent).toBe('');
    expect(subtitleElement.textContent).toBe('');
  });
});