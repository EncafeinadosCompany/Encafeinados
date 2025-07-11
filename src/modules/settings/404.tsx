import { Coffee, Home, ArrowLeft, CoffeeIcon, Croissant, Coffee as CoffeeCup } from '@/common/ui/icons';

const NotFound = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-100 to-amber-200 relative overflow-hidden">
      {/* Decorative coffee beans background */}
      <div className="absolute inset-0 opacity-5">
        {[...Array(20)].map((_, i) => (
          <Coffee
            key={i}
            size={24}
            className="absolute animate-spin"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen p-4">
        {/* Main coffee cup with steam */}
        <div className="relative mb-12 transform hover:scale-105 transition-transform duration-300">
          <div className="relative">
            <CoffeeCup size={150} className="text-brown-800" />
            {/* Steam animation */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-8 bg-white rounded-full animate-steam opacity-70"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                    transform: `translateY(${i * 2}px)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Text content with enhanced styling */}
        <div className="text-center mb-12 relative">
          <h1 className="text-8xl font-bold text-brown-900 mb-6 animate-pulse">404</h1>
          <div className="space-y-3">
            <p className="text-3xl text-brown-800 font-semibold animate-fade-in">
              ¡Ups! Esta mesa está vacía
            </p>
            <p className="text-xl text-brown-600 animate-fade-in-delayed">
              Parece que el café que buscas no está en nuestro menú
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 right-1/4 animate-float">
          <Croissant size={40} className="text-amber-600 opacity-30" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 animate-float-delayed">
          <CoffeeIcon size={40} className="text-brown-600 opacity-30" />
        </div>

        {/* Coffee stains */}
        <div className="absolute opacity-10 top-1/3 right-1/3 -rotate-12">
          <div className="w-40 h-40 rounded-full bg-brown-800 blur-xl" />
        </div>
        <div className="absolute opacity-10 bottom-1/3 left-1/3 rotate-45">
          <div className="w-32 h-32 rounded-full bg-brown-800 blur-lg" />
        </div>

        {/* Enhanced buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mt-8 z-10 ">
          <button
            onClick={handleBack}
            className="flex items-center gap-3 px-8 py-4 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg "
          >
            <ArrowLeft size={24} />
            <span className="font-medium">Volver atrás</span>
          </button>
          <a
            href="/"
            className="flex items-center gap-3 px-8 py-4 bg-amber-700 text-white rounded-full hover:bg-brown-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <Home size={24} />
            <span className="font-medium">Ir al inicio</span>
          </a>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes steam {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(-10px) scale(1.2); opacity: 0.4; }
          100% { transform: translateY(-20px) scale(0.8); opacity: 0; }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        .animate-steam {
          animation: steam 2s infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out;
        }
        .animate-fade-in-delayed {
          animation: fadeIn 1s ease-out 0.3s both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NotFound;