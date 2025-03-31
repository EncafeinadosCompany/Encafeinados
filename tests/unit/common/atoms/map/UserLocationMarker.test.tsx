import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MapContainer } from 'react-leaflet';
import UserLocationMarker from '@/common/atoms/map/UserLocationMarker';
import { LatLngTuple } from 'leaflet';
import { ReactNode } from 'react';

jest.mock('react-leaflet', () => ({
  MapContainer: jest.fn(({ children }) => <div data-testid="map-container">{children}</div>),
  Marker: jest.fn(({ position, icon }) => (
    <div data-testid="marker" data-position={JSON.stringify(position)} data-icon-html={icon.options.html}>
      Marker
    </div>
  ))
}));

jest.mock('leaflet', () => ({
  divIcon: jest.fn(({ className, html, iconSize, iconAnchor }) => ({
    options: { className, html, iconSize, iconAnchor }
  }))
}));

describe('UserLocationMarker', () => {
  const position: LatLngTuple = [51.505, -0.09]; 
  const renderWithMapContainer = (component: ReactNode) => {
    return render(
      <MapContainer center={[0, 0] as LatLngTuple} zoom={13}>
        {component}
      </MapContainer>
    );
  };

  test('No renderiza nada cuando position es null', () => {
    const { queryByTestId } = renderWithMapContainer(
      <UserLocationMarker position={null} />
    );
    expect(queryByTestId('marker')).not.toBeInTheDocument();
  });

  test('No renderiza nada cuando position no está definido', () => {
    const { queryByTestId } = renderWithMapContainer(
      <UserLocationMarker position={null} />
    );
    expect(queryByTestId('marker')).not.toBeInTheDocument();
  });

  test('Renderiza el marcador cuando se proporciona una posición válida', () => {
    const { getByTestId } = renderWithMapContainer(
      <UserLocationMarker position={position as [number, number]} />
    );
    
    const marker = getByTestId('marker');
    expect(marker).toBeInTheDocument();
    
    const markerPosition = JSON.parse(marker.dataset.position || '[]');
    expect(markerPosition).toEqual(position);
  });

  test('Aplica la clase pulsing cuando pulsing=true', () => {
    const { getByTestId } = renderWithMapContainer(
      <UserLocationMarker position={position as [number, number]} pulsing={true} />
    );
    
    const marker = getByTestId('marker');
    const iconHtml = marker.dataset.iconHtml || '';
    
    expect(iconHtml).toContain('pulsing');
    expect(iconHtml).toContain('user-marker pulsing');
  });

  test('No aplica la clase pulsing cuando pulsing=false', () => {
    const { getByTestId } = renderWithMapContainer(
      <UserLocationMarker position={position as [number, number]} pulsing={false} />
    );
    
    const marker = getByTestId('marker');
    const iconHtml = marker.dataset.iconHtml || '';
    
    expect(iconHtml).not.toContain('user-marker pulsing');
    expect(iconHtml).toContain('user-marker ');
  });

  test('Usa la clase pulsing predeterminada (false) cuando no se proporciona', () => {
    const { getByTestId } = renderWithMapContainer(
      <UserLocationMarker position={position as [number, number]} />
    );
    
    const marker = getByTestId('marker');
    const iconHtml = marker.dataset.iconHtml || '';
    
    expect(iconHtml).not.toContain('user-marker pulsing');
    expect(iconHtml).toContain('user-marker ');
  });
});