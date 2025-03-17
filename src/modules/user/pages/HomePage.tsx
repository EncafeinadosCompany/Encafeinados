import React, { useState, useEffect } from "react";
import {
  FaCoffee,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaUser,
  FaStore,
  FaHeart,
  FaInfoCircle,
  FaArrowRight,
  FaChevronDown,
} from "react-icons/fa";

import MapComponent from "../../../components/MapComponent";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  // Control scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document
      .querySelectorAll(".animate-on-scroll")
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const storesData = [
    {
      id: 1,
      name: "Café Pergamino",
      image: "/api/placeholder/400/300",
      address: "Carrera 37 #8A-37, El Poblado",
      description:
        "Café de especialidad con granos de las mejores fincas colombianas.",
    },
    {
      id: 2,
      name: "Urbania Café",
      image: "/api/placeholder/400/300",
      address: "Calle 8 #43B-132, El Poblado",
      description:
        "Un espacio moderno y acogedor con métodos de preparación innovadores.",
    },
    {
      id: 3,
      name: "Café Velvet",
      image: "/api/placeholder/400/300",
      address: "Carrera 37 #10A-16, El Poblado",
      description: "Tostadores artesanales con un ambiente bohemio y relajado.",
    },
    {
      id: 4,
      name: "Al Alma Café",
      image: "/api/placeholder/400/300",
      address: "Carrera 45 #5-31, El Poblado",
      description: "Brunch y café de calidad en un ambiente cálido y acogedor.",
    },
  ];

  const teamMembers = [
    {
      id: 1,
      name: "Ana Rodríguez",
      position: "Fundadora & CEO",
      image: "/api/placeholder/300/300",
      bio: "Apasionada barista con 10 años de experiencia en la industria del café.",
    },
    {
      id: 2,
      name: "Carlos Méndez",
      position: "Maestro Tostador",
      image: "/api/placeholder/300/300",
      bio: "Experto en perfiles de tueste y selección de granos de alta calidad.",
    },
    {
      id: 3,
      name: "Laura Torres",
      position: "Sommelier de Café",
      image: "/api/placeholder/300/300",
      bio: "Catadora profesional especializada en cafés de origen y métodos de preparación.",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === storesData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? storesData.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex flex-col">
      {/* Navbar with scroll effect */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white shadow-lg"
            : "bg-gradient-to-r from-amber-800 to-orange-800 text-white"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <FaCoffee
                className={`text-2xl mr-2 transition-colors duration-300 ${
                  isScrolled ? "text-amber-700" : "text-amber-200"
                }`}
              />
              <div
                className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping ${
                  isScrolled ? "bg-amber-500" : "bg-amber-200"
                }`}
              ></div>
            </div>
            <span
              className={`font-bold text-xl transition-colors duration-300 ${
                isScrolled ? "text-amber-800" : "text-white"
              }`}
            >
              Encafeinados
            </span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a
              href="#beneficios"
              className={`transition-all duration-300 hover:opacity-80 ${
                isScrolled ? "text-amber-700" : "text-amber-100"
              }`}
            >
              <div className="flex items-center">
                <FaHeart className="mr-1" />
                <span>Beneficios</span>
              </div>
            </a>
            <a
              href="#nosotros"
              className={`transition-all duration-300 hover:opacity-80 ${
                isScrolled ? "text-amber-700" : "text-amber-100"
              }`}
            >
              <div className="flex items-center">
                <FaInfoCircle className="mr-1" />
                <span>Acerca de</span>
              </div>
            </a>
            <button
              className={`transition-all duration-300 px-4 py-1 rounded-full ${
                isScrolled
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                  : "bg-white text-amber-800"
              } hover:shadow-lg`}
            >
              <div className="flex items-center">
                <FaUser className="mr-1" />
                <span>Iniciar Sesión</span>
              </div>
            </button>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              className={`focus:outline-none transition-colors duration-300 ${
                isScrolled ? "text-amber-800" : "text-white"
              }`}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile navigation tabs */}
        <div className="md:hidden flex justify-between bg-gradient-to-r from-amber-700 to-orange-700 text-sm">
          <button
            onClick={() => setActiveTab(0)}
            className={`flex-1 py-2 text-center transition-all ${
              activeTab === 0 ? "bg-amber-600 text-white" : "text-amber-100"
            }`}
          >
            <FaHeart className="inline mr-1" />
            <span>Beneficios</span>
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`flex-1 py-2 text-center transition-all ${
              activeTab === 1 ? "bg-amber-600 text-white" : "text-amber-100"
            }`}
          >
            <FaInfoCircle className="inline mr-1" />
            <span>Acerca de</span>
          </button>
          <button
            onClick={() => setActiveTab(2)}
            className={`flex-1 py-2 text-center transition-all ${
              activeTab === 2 ? "bg-amber-600 text-white" : "text-amber-100"
            }`}
          >
            <FaUser className="inline mr-1" />
            <span>Iniciar</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow pt-20">
        {/* Hero Section with Real Map */}
        <div className="container mx-auto px-4 py-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-101 hover:shadow-2xl">
        <MapComponent />
      </div>
    </div>

        {/* Welcome Message with enhanced design */}
        <div className="container mx-auto px-4 py-6">
          <div
            id="welcome-section"
            className="animate-on-scroll bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl p-6 md:p-8 text-center relative overflow-hidden transform transition-all duration-500 hover:shadow-2xl"
          >
            {/* Decorative coffee beans background */}
            <div className="absolute -right-10 -top-10 w-40 h-40 opacity-5 rotate-12">
              <FaCoffee className="w-full h-full text-amber-900" />
            </div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 opacity-5 -rotate-12">
              <FaCoffee className="w-full h-full text-amber-900" />
            </div>

            <div
              className={`transition-all duration-1000 transform ${
                isVisible["welcome-section"]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="relative inline-block mb-6">
                <FaCoffee className="text-amber-700 text-4xl mx-auto" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
                Bienvenido a Encafeinados
              </h1>
              <p className="text-lg text-amber-700 mb-6 max-w-2xl mx-auto">
                Descubre un nuevo mundo de experiencias alrededor del mejor café
                colombiano, donde cada taza cuenta una historia única.
              </p>

              {/* Features section with animation */}
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10"
                id="beneficios"
              >
                {[
                  {
                    title: "Descubre",
                    icon: "☕",
                    desc: "Explora nuestra selección exclusiva de cafés premium de origen único",
                  },
                  {
                    title: "Aprende",
                    icon: "📚",
                    desc: "Conoce sobre el arte del café, desde el cultivo hasta la taza",
                  },
                  {
                    title: "Disfruta",
                    icon: "✨",
                    desc: "Vive experiencias sensoriales únicas diseñadas para verdaderos amantes del café",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 group relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h2 className="text-xl font-bold text-amber-800 mb-2 group-hover:text-orange-800 transition-colors">
                      {feature.title}
                    </h2>
                    <p className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors">
                      {feature.desc}
                    </p>
                    <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[40px] border-r-[40px] border-b-amber-100 border-r-amber-100 opacity-50"></div>
                  </div>
                ))}
              </div>

              <button className="mt-10 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:from-amber-700 hover:to-orange-700 group relative">
                <span className="relative z-10 flex items-center">
                  Comenzar
                  <FaArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Team Members Section with circular photos and enhanced design */}
        <div className="container mx-auto px-4 py-10" id="nosotros">
          <div
            id="team-section"
            className="animate-on-scroll bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl p-6 overflow-hidden"
          >
            <div
              className={`transition-all duration-1000 transform ${
                isVisible["team-section"]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center justify-center mb-10">
                <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-grow"></div>
                <h2 className="text-3xl font-bold px-6 bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                  Nuestro Equipo
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent flex-grow"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member, index) => (
                  <div
                    key={member.id}
                    className={`flex flex-col items-center p-6 rounded-xl shadow-md transition-all duration-500 transform hover:-translate-y-2 hover:shadow-xl bg-gradient-to-br from-white to-amber-50 relative overflow-hidden`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full -ml-8 -mb-8 opacity-50"></div>

                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 shadow-lg ring-4 ring-amber-100 transform transition-all duration-500 hover:scale-105">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-amber-800">
                      {member.name}
                    </h3>
                    <p className="text-orange-600 font-medium mb-2">
                      {member.position}
                    </p>
                    <p className="text-gray-600 text-sm text-center">
                      {member.bio}
                    </p>
                    <button className="mt-4 text-amber-700 hover:text-orange-600 font-medium text-sm flex items-center transition-colors">
                      Conoce más <FaChevronDown className="ml-1 text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Carousel of Partner Stores with enhanced animation */}
        <div className="container mx-auto px-4 py-8">
          <div
            id="stores-section"
            className="animate-on-scroll bg-gradient-to-br from-white to-amber-50 rounded-2xl shadow-xl p-6 overflow-hidden"
          >
            <div
              className={`transition-all duration-1000 transform ${
                isVisible["stores-section"]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-600 rounded-full mr-3"></div>
                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
                    Tiendas Aliadas
                  </h2>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={prevSlide}
                    className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 p-2 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 p-2 rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {storesData.map((store, index) => (
                    <div key={store.id} className="w-full flex-shrink-0 px-2">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 h-full">
                        <div className="relative">
                          <img
                            src={store.image}
                            alt={store.name}
                            className="w-full h-56 object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                            <p className="text-sm font-medium opacity-80">
                              {store.address}
                            </p>
                          </div>
                        </div>
                        <div className="p-5">
                          <div className="flex items-center mb-2">
                            <div className="w-1 h-4 bg-orange-500 rounded-full mr-2"></div>
                            <h3 className="text-xl font-semibold text-amber-800">
                              {store.name}
                            </h3>
                          </div>
                          <p className="text-gray-600 text-sm mb-4">
                            {store.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-orange-600 font-medium">
                              {index === 0
                                ? "★★★★★"
                                : index === 1
                                ? "★★★★☆"
                                : "★★★★½"}
                            </span>
                            <button className="text-amber-700 hover:text-orange-600 text-sm font-medium flex items-center transition-colors group">
                              Visitar
                              <FaArrowRight className="ml-1 transform transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enhanced carousel indicators */}
                <div className="flex justify-center mt-6 space-x-3">
                  {storesData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "bg-gradient-to-r from-amber-600 to-orange-600 scale-125"
                          : "bg-amber-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section with enhanced design */}
        <div className="container mx-auto px-4 py-8 mb-8">
          <div
            id="social-section"
            className="animate-on-scroll bg-gradient-to-r from-amber-800 to-orange-800 rounded-2xl shadow-xl p-8 text-center text-white overflow-hidden relative"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white"></div>
            </div>

            <div
              className={`relative z-10 transition-all duration-1000 transform ${
                isVisible["social-section"]
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              <h2 className="text-3xl font-bold mb-4">Conecta con Nosotros</h2>
              <p className="text-amber-200 mb-8 max-w-md mx-auto">
                Síguenos en nuestras redes sociales para descubrir novedades,
                eventos exclusivos y el fascinante mundo del café
              </p>

              <div className="flex justify-center space-x-8">
                <a href="#" className="group">
                  <div className="bg-white bg-opacity-10 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-opacity-20">
                    <FaInstagram className="text-3xl text-white group-hover:text-amber-200 transition-colors" />
                  </div>
                  <p className="mt-2 text-sm text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Instagram
                  </p>
                </a>
                <a href="#" className="group">
                  <div className="bg-white bg-opacity-10 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-opacity-20">
                    <FaFacebook className="text-3xl text-white group-hover:text-amber-200 transition-colors" />
                  </div>
                  <p className="mt-2 text-sm text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Facebook
                  </p>
                </a>
                <a href="#" className="group">
                  <div className="bg-white bg-opacity-10 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:bg-opacity-20">
                    <FaTwitter className="text-3xl text-white group-hover:text-amber-200 transition-colors" />
                  </div>
                  <p className="mt-2 text-sm text-amber-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Twitter
                  </p>
                </a>
              </div>

              <div className="mt-8 inline-block">
                <button className="bg-white text-amber-800 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
                  <span className="flex items-center">
                    Únete a nuestra comunidad
                    <FaArrowRight className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-amber-900 to-orange-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <FaCoffee className="text-amber-300 text-2xl mr-2" />
                <span className="font-bold text-xl">Encafeinados</span>
              </div>
              <p className="text-amber-200 text-sm mb-4">
                Transformando la experiencia del café colombiano a través de
                calidad, innovación y pasión.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-amber-300 hover:text-white transition-colors"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="text-amber-300 hover:text-white transition-colors"
                >
                  <FaFacebook />
                </a>
                <a
                  href="#"
                  className="text-amber-300 hover:text-white transition-colors"
                >
                  <FaTwitter />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-amber-200">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-amber-300 hover:text-white transition-colors"
                  >
                    Inicio
                  </a>
                </li>
                <li>
                  <a
                    href="#beneficios"
                    className="text-amber-300 hover:text-white transition-colors"
                  >
                    Beneficios
                  </a>
                </li>
                <li>
                  <a
                    href="#nosotros"
                    className="text-amber-300 hover:text-white transition-colors"
                  >
                    Nuestro Equipo
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-amber-300 hover:text-white transition-colors"
                  >
                    Blog de Café
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-amber-300 hover:text-white transition-colors"
                  >
                    Tiendas
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-amber-200">
                Contáctanos
              </h3>
              <p className="text-sm text-amber-300 mb-2">
                Calle 10 #43-21, El Poblado
              </p>
              <p className="text-sm text-amber-300 mb-2">Medellín, Colombia</p>
              <p className="text-sm text-amber-300 mb-2">
                info@encafeinados.co
              </p>
              <p className="text-sm text-amber-300">+57 (604) 123-4567</p>
            </div>
          </div>

          <div className="border-t border-amber-800 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-amber-300">
              &copy; {new Date().getFullYear()} Encafeinados. Todos los derechos
              reservados.
            </p>
            <div className="mt-4 md:mt-0">
              <a
                href="#"
                className="text-xs text-amber-300 hover:text-white transition-colors mr-4"
              >
                Términos y Condiciones
              </a>
              <a
                href="#"
                className="text-xs text-amber-300 hover:text-white transition-colors"
              >
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
