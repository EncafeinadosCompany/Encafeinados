/**
 * Utilidades para generar descripciones dinámicas de sucursales
 * basadas en sus atributos y características
 */

interface BranchAttribute {
  attributeName: string;
  value: string | null;
  category?: string;
}

interface BranchInfo {
  name: string;
  store_name?: string;
  attributes?: BranchAttribute[];
  isOpen?: boolean;
  average_rating?: string;
}

/**
 * Genera una descripción dinámica basada en los atributos de la sucursal
 */
export const generateBranchDescription = (branch: BranchInfo): string => {
  const { name, store_name, attributes = [], isOpen, average_rating } = branch;
  
  // Plantillas base para diferentes tipos de cafeterías
  const templates = {
    specialty: [
      "Especialistas en café de origen, ofrecemos una experiencia única para los amantes del buen café.",
      "Café de especialidad con métodos de preparación artesanales y granos seleccionados.",
      "Del grano a la taza, cada preparación es una obra de arte para tu paladar."
    ],
    cozy: [
      "Un rincón acogedor donde cada sorbo cuenta una historia de sabor y tradición.",
      "Ambiente cálido y familiar, perfecto para disfrutar de momentos especiales.",
      "Tu espacio ideal para relajarte y disfrutar del mejor café de la ciudad."
    ],
    modern: [
      "Experiencia moderna de café con un toque de innovación en cada preparación.",
      "Fusionamos tradición y modernidad en cada taza que servimos.",
      "Café contemporáneo para paladares exigentes y momentos únicos."
    ],
    artisan: [
      "Café artesanal preparado con técnicas tradicionales y pasión por la excelencia.",
      "Cada taza refleja el arte y la dedicación de nuestros baristas expertos.",
      "Sabores auténticos creados con amor y técnicas de preparación únicas."
    ],
    default: [
      "Descubre sabores excepcionales en un ambiente único y acogedor.",
      "Tu destino perfecto para disfrutar del mejor café con calidad garantizada.",
      "Experiencia cafetera completa con sabores que despiertan tus sentidos."
    ]
  };

  // Analizar atributos para determinar el tipo de cafetería
  const attributeNames = attributes.map(attr => attr.attributeName.toLowerCase());
  
  let category: keyof typeof templates = 'default';
  
  // Determinar categoría basada en atributos
  if (attributeNames.some(attr => 
    attr.includes('especialidad') || 
    attr.includes('origen') || 
    attr.includes('artesanal')
  )) {
    category = 'specialty';
  } else if (attributeNames.some(attr => 
    attr.includes('acogedor') || 
    attr.includes('familiar') || 
    attr.includes('tradicional')
  )) {
    category = 'cozy';
  } else if (attributeNames.some(attr => 
    attr.includes('moderno') || 
    attr.includes('innovador') || 
    attr.includes('tecnología')
  )) {
    category = 'modern';
  } else if (attributeNames.some(attr => 
    attr.includes('artesanal') || 
    attr.includes('barista') || 
    attr.includes('tradicional')
  )) {
    category = 'artisan';
  }

  // Seleccionar plantilla aleatoria de la categoría
  const categoryTemplates = templates[category];
  const baseDescription = categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];

  // Agregar información adicional basada en contexto
  const contextParts: string[] = [];

  // Agregar información de rating si está disponible
  if (average_rating && parseFloat(average_rating) >= 4.0) {
    contextParts.push("Con excelente calificación de nuestros clientes");
  }

  // Agregar atributos destacados (máximo 2-3)
  const highlightAttributes = attributes
    .filter(attr => attr.attributeName && attr.attributeName.length > 0)
    .slice(0, 2)
    .map(attr => attr.attributeName.toLowerCase());

  if (highlightAttributes.length > 0) {
    if (highlightAttributes.length === 1) {
      contextParts.push(`destacando por ${highlightAttributes[0]}`);
    } else {
      contextParts.push(`con ${highlightAttributes.join(' y ')}`);
    }
  }

  // Combinar descripción base con contexto
  let finalDescription = baseDescription;
  
  if (contextParts.length > 0) {
    finalDescription += ` ${contextParts.join(', ')}.`;
  }

  return finalDescription;
};

/**
 * Genera descripciones de fallback cuando no hay atributos disponibles
 */
export const generateFallbackDescription = (storeName?: string): string => {
  const fallbackTemplates = [
    "Café de calidad premium en un ambiente único y acogedor para todos.",
    "Tu lugar favorito para disfrutar de excelente café y momentos especiales.",
    "Experiencia cafetera auténtica con sabores que despiertan tus sentidos.",
    "Donde cada taza cuenta una historia de sabor, calidad y tradición.",
    "El punto de encuentro perfecto para amantes del buen café."
  ];

  let description = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];

  if (storeName) {
    description = `En ${storeName}, ${description.toLowerCase()}`;
  }

  return description;
};

/**
 * Descripción temporal mientras se cargan los datos
 */
export const getLoadingDescription = (): string => {
  return "Cargando información de la sucursal...";
};
