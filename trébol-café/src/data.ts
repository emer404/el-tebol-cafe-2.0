import { MenuItem } from './types';

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'torta-vasca',
    title: 'Torta Vasca',
    price: 12000,
    category: 'Pastelería',
    description: 'Cremosa por dentro, perfectamente tostada por fuera. Receta original de la casa.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBjUPHYNnsMPhmmAb1FGNEn7W1uuji1kW-GgLVj084Sh-kyrq2YjQIO6JPvRhphbTBMdUttFYtqsXM0fDkD813znHDZSNa5jVuVGxJ7IOz3Z95_vxYx3zvrqINIqugyOEmZ0T5urlx8qQTEhaxSaHq5pot-qH8GBWdfyk5C4umIdOzD978AKc9uiZqKti8z7M_hqPuMoGQDD261w03Y681fL7RT4MPyRMvturGHOEhvdPPk1BibjY6pWidu22ihGwNsvjXjBPlLIrM',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqwyXBf6-yUWkQKZ77TByCw23HcCiq699Y8K62c-6ucAUWkYArxj0m28-dGA-DUUPDL060J-ezhAaFpPYA3w4dc5LU5bdTEzTnbiX0nkcsWBHKjgMEVyyJFa4eegrI13rHfCV_8__yrnnhWV_s58xRWM3pTKgNNF5-9lHqsri4aMzOygWsn_7EXs1QT_PJTKdzNLOE6YugVbcrs3zKgU0rhDtOCMzSoVWwxtd5M_JbyKlnrxezPKpnNtH83UZ9GRT7Q0Amg_HYVFc',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBN61nctX5KDu_-y8dyhBpXjE6DHLdnFvOfMV3PS5I2ZICEGBbifJe4v305fgl7FxxqH1-J65W8srB93F7VrD3Vo0ereQ_bdl_Y7XW04fp7lOW3j0xtyWHT9MXGt2kY1mdmFHmpihMJmplO3YWOceJ0fC5ZZ26S8oZfGoV38XuJWlu4o9D_UvT0pKDzXGPxYpAsd4ZQBxVVJG4Fi-nEr1WaoPN3VBcTUhM-JbXmLLDeshk_vPGckVBoIzWP-PdUDQd3oXiFruRy1WQ',
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBboQZhVOGtz_5iAYnV5nKSP63i9lPiBVeqDfXTm7fZEitKiIb0eYlfxYdwYFfv6yG5cpqHdFaW8bic1GbYAnAQ-IU7ffH7BTl98lyKWIxhhix0YfO7LyNTww8latdpaVIet2oz4KNb7kOrh-GUgvP0kpM5oyJe-gMGTFbBjkWRX93crGcU7ComZh1PqsRCkCZaY5DKe5LUYZVUlm11n0TnoSIqTtDDzLObepYwn_uhyjV5JNN3Y7_WIr3zXF7qOiUbBJ2xNYRMA18',
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
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?q=80&w=600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=600&auto=format&fit=crop',
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
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop',
    details: {
      wifi: 'Conexión prioritaria de alta velocidad',
      compañía: 'Casillero de seguridad + 2 horas de Meeting Room',
      origin: 'Soporte del anfitrión coworking'
    }
  }
];
