import React from 'react';
import { useSafeNumericValue } from '@/common/hooks/useSafeNumericValue';
import { useAppData } from '@/common/context/AppDataContext';
import SafeNumericDisplay from '@/common/atoms/SafeNumericDisplay';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/common/ui/card';
import { Button } from '@/common/ui/button';

const SafeNumericExamples: React.FC = () => {
  const { isMobile } = useAppData();
  const [totalItems, setTotalItems] = React.useState(125);
  const [price, setPrice] = React.useState(29.99);
  const [rating, setRating] = React.useState(4.8);
  
  const { safeValue: safeTotalItems } = useSafeNumericValue(totalItems);
  
  const handleRefresh = () => {
    setTotalItems(0);
    setPrice(0);
    setRating(0);
    
    setTimeout(() => {
      setTotalItems(Math.floor(Math.random() * 200) + 50);
      setPrice(Math.round((Math.random() * 50 + 10) * 100) / 100);
      setRating(Math.round((Math.random() * 4 + 1) * 10) / 10);
    }, 1000);
  };
  
  return (
    <div className="p-4 max-w-md mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Visualización Segura de Números</CardTitle>
          <CardDescription>
            Demostración de diferentes formas de mostrar valores numéricos 
            de manera segura en {isMobile ? 'dispositivos móviles' : 'computadoras'}.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Valor sin protección (problemas en móvil):</h3>
            <p className="text-lg font-bold">{totalItems} artículos disponibles</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Usando el hook useSafeNumericValue:</h3>
            <p className="text-lg font-bold">{safeTotalItems} artículos disponibles</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Usando el componente SafeNumericDisplay:</h3>
            <p className="text-lg font-bold">
              <SafeNumericDisplay 
                value={totalItems} 
                suffix=" artículos disponibles" 
              />
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Precio con formato:</h3>
            <p className="text-lg font-bold">
              <SafeNumericDisplay 
                value={price} 
                prefix="$" 
                format={(val) => val.toFixed(2)} 
              />
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Calificación:</h3>
            <p className="text-lg font-bold">
              <SafeNumericDisplay 
                value={rating} 
                suffix="/5" 
                format={(val) => val.toFixed(1)} 
              />
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button onClick={handleRefresh} className="w-full">
            Simular actualización de datos
          </Button>
        </CardFooter>
      </Card>
      
      <div className="text-xs text-gray-500">
        <p>El problema ocurre principalmente cuando:</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Se inicializa un valor con 0 o null</li>
          <li>El valor cambia durante el ciclo de renderizado</li>
          <li>Hay diferencias de rendimiento entre dispositivos</li>
        </ul>
      </div>
    </div>
  );
};

export default SafeNumericExamples;
