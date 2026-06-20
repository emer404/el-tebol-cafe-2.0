import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'torta-vasca',
    title: 'Torta Vasca',
    price: 12000,
    category: 'Pastelería',
    description: 'Cremosa por dentro, perfectamente tostada por fuera. Receta original de la casa.',
    image: '/img/torta1.jpg',
    details: {
      origin: 'Receta de San Sebastián, adaptada con quesos locales',
      intensity: 'Textura suave y fundente',
      allergens: 'Lácteos, Huevos, Gluten'
    }
  },
  {
    id: 'margarita-bosque',
    title: 'Margarita del Bosque',
    price: 18000,
    category: 'Bebidas Frías',
    description: 'Mezcla refrescante de frutos rojos frescos recolectados en el Huila, tequila artesanal y un toque secreto de la casa.',
    image: '/img/frias1.png',
    details: {
      origin: 'Ingredientes 100% orgánicos, frutos del Huila',
      intensity: 'Refrescante, balance semi-seco',
      allergens: 'Contiene alcohol'
    }
  },
  {
    id: 'capuchino-artesanal',
    title: 'Capuchino',
    price: 6500,
    category: 'Bebidas Calientes',
    description: 'Doble shot de espresso de variedad Borbón Rosado de la casa con leche cremosa artesanal local.',
    image: '/img/bebida3.jpeg',
    details: {
      origin: 'San Agustín, Huila (Finca El Trébol)',
      intensity: 'Media-Alta (Notas a cacao y frutos amarillos)',
      allergens: 'Lácteos (Alternativa con leche de almendras disponible)'
    }
  },
  {
    id: 'pase-diario-coworking',
    title: 'Pase Diario Coworking',
    price: 25000,
    category: 'Coworking',
    description: 'Acceso ilimitado por un día a internet de fibra óptica de alta velocidad (300+ Mbps), estaciones ergonómicas y una bebida de cortesía.',
    image: '/img/espacios1.jpeg',
    details: {
      wifi: 'Hasta 300 Mbps simétricos (Conexión redundante)',
      compañía: 'Acceso a cabinas telefónicas acústicas',
      origin: 'Soporte técnico de conexión inmediato'
    }
  },
  {
    id: 'espresso-filtrado',
    title: 'V60 Filtrado de Especialidad',
    price: 7000,
    category: 'Bebidas Calientes',
    description: 'Café gourmet extraído por goteo en V60. Resalta la acidez cítrica y notas florales de nuestra variedad Geisha local.',
    image: '/img/bedida2.jpeg',
    details: {
      origin: 'Variedad Geisha - Lavado de fermentación prolongada',
      intensity: 'Sutil y complejo (Notas a jazmín y té de limón)',
      allergens: 'Libre de alérgenos'
    }
  },
  {
    id: 'flat-white-colombia',
    title: 'Flat White',
    price: 7200,
    category: 'Bebidas Calientes',
    description: 'Shot doble de espresso corto y una capa fina de leche microcremada con sedosidad incomparable.',
    image: '/img/bebida4.jpeg',
    details: {
      origin: 'Huila Colombia - Variedad Tabi',
      intensity: 'Media, textura sumamente sedosa',
      allergens: 'Lácteos (Alternativa vegetal disponible)'
    }
  },
  {
    id: 'cold-brew-tonic',
    title: 'Cold Brew Tónica',
    price: 9500,
    category: 'Bebidas Frías',
    description: 'Infusión en frío de 18 horas sobre agua tónica Premium, rodaja de mandarina deshidratada y romero fresco de nuestra huerta.',
    image: '/img/fria2.png',
    details: {
      origin: 'Granos con tueste medio-claro floral',
      intensity: 'Baja amargura, sumamente efervescente',
      allergens: 'Ninguno'
    }
  },
  {
    id: 'croissant-almendras',
    title: 'Croissant de Almendra',
    price: 9500,
    category: 'Pastelería',
    description: 'Hojaldre artesanal de mantequilla premium relleno de crema frangipane y cubierto con almendras laminadas tostadas.',
    image: '/img/desayuno1.jpg',
    details: {
      origin: 'Elaborado diariamente por nuestro pastelero de la casa',
      intensity: 'Crujiente y aromático',
      allergens: 'Gluten, Lácteos, Frutos secos (Almendras)'
    }
  },
  {
    id: 'cookie-pistacho',
    title: 'Cookie de Pistacho & Oro Blanco',
    price: 8000,
    category: 'Pastelería',
    description: 'Galleta rústica con pistachos orgánicos, sal marina de la Guajira y trozos generosos de chocolate blanco hecho en el Huila.',
    image: '/img/postre1.jpg',
    details: {
      origin: 'Cacao local del Huila al 34%',
      intensity: 'Consistencia melosa (Chewy)',
      allergens: 'Gluten, Huevos, Frutos secos, Lácteos'
    }
  },
  {
    id: 'pase-semanal-coworking',
    title: 'Pase Semanal Premium',
    price: 110000,
    category: 'Coworking',
    description: 'Acceso por 6 días hábiles del mes. Incluye 10% de descuento en barra de café, 2 horas de sala de juntas de cortesía y casillero privado.',
    image: '/img/espacios2.jpeg',
    details: {
      wifi: 'Conexión prioritaria de alta velocidad',
      compañía: 'Casillero de seguridad + 2 horas de Meeting Room',
      origin: 'Soporte del anfitrión coworking'
    }
  }
];
