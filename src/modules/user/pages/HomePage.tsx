import React from 'react';
import { FaCoffee } from 'react-icons/fa';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <FaCoffee className="text-amber-700 text-5xl mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold text-amber-800 mb-6">
          Bienvenido a Encafeinados
        </h1>
        <p className="text-xl text-amber-700 mb-8">
          Tu destino para descubrir los mejores cafés y experiencias
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-amber-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <h2 className="text-xl font-bold text-amber-800 mb-3">Descubre</h2>
            <p className="text-gray-600">Explora nuestra selección de cafés premium</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <h2 className="text-xl font-bold text-amber-800 mb-3">Aprende</h2>
            <p className="text-gray-600">Conoce sobre el arte del café y su preparación</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <h2 className="text-xl font-bold text-amber-800 mb-3">Disfruta</h2>
            <p className="text-gray-600">Vive la experiencia completa de Encafeinados</p>
          </div>
        </div>
        
        <button className="mt-10 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
          Comenzar
        </button>
      </div>
    </div>
  );
};

export default HomePage;