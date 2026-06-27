import { MenuItem } from './types';

// ─── Rutas base ────────────────────────────────────────────────────────────────
const C = '/img/catalogo';

export const MENU_ITEMS: MenuItem[] = [

  // ════════════════════════════════════
  // BEBIDAS CALIENTES
  // ════════════════════════════════════
  {
    id: 'americano',
    title: 'Americano',
    price: 4000,
    category: 'Bebidas Calientes',
    description: 'Espresso suavizado con agua caliente. Clásico y limpio, perfecto para apreciar el origen.',
    image: `${C}/bebidas_calientes/americano.PNG`,
    details: {
      origin: 'Granos de origen San Agustín, Huila',
      intensity: 'Suave, notas cítricas y a nuez',
      allergens: 'Sin alérgenos',
    },
  },
  {
    id: 'capuchino',
    title: 'Capuchino',
    price: 8000,
    category: 'Bebidas Calientes',
    description: 'Espresso equilibrado cubierto con espuma de leche sedosa y aroma inconfundible.',
    image: `${C}/bebidas_calientes/capuchino 1.PNG`,
    images: [
      `${C}/bebidas_calientes/capuchino 1.PNG`,
      `${C}/bebidas_calientes/capuchino 2.PNG`,
    ],
    details: {
      origin: 'Finca El Trébol, San Agustín',
      intensity: 'Media-alta, notas a cacao',
      allergens: 'Lácteos',
    },
  },
  {
    id: 'espresso-sencillo',
    title: 'Espresso Sencillo',
    price: 3500,
    category: 'Bebidas Calientes',
    description: 'Un shot concentrado que captura toda la esencia del café de especialidad en su forma más pura.',
    image: `${C}/bebidas_calientes/espresso sencillo.PNG`,
    details: {
      origin: 'Huila, Colombia',
      intensity: 'Alta, cuerpo robusto',
      allergens: 'Sin alérgenos',
    },
  },
  {
    id: 'espresso-doble',
    title: 'Espresso Doble',
    price: 6000,
    category: 'Bebidas Calientes',
    description: 'Doble extracción para los que buscan más intensidad sin perder la fineza del origen.',
    image: `${C}/bebidas_calientes/espresso doble.PNG`,
    details: {
      origin: 'Huila, Colombia',
      intensity: 'Muy alta, crema densa',
      allergens: 'Sin alérgenos',
    },
  },
  {
    id: 'mocachino',
    title: 'Mocachino',
    price: 9000,
    category: 'Bebidas Calientes',
    description: 'La deliciosa combinación de espresso artesanal, chocolate oscuro y leche vaporizada.',
    image: `${C}/bebidas_calientes/mocachino.PNG`,
    details: {
      origin: 'Granos tostados en casa',
      intensity: 'Media, chocolatada y cremosa',
      allergens: 'Lácteos',
    },
  },

  // ════════════════════════════════════
  // BEBIDAS FRÍAS
  // ════════════════════════════════════
  {
    id: 'margarita-del-bosque',
    title: 'Margarita del Bosque',
    price: 25000,
    category: 'Bebidas Frías',
    description: 'Cóctel artesanal de frutos rojos frescos del Huila con un toque secreto de la casa.',
    image: `${C}/bebidas_frias/margarita_del_bosque.PNG`,
    details: {
      origin: 'Frutos rojos locales del Huila',
      intensity: 'Refrescante, semi-seco',
      allergens: 'Contiene alcohol',
    },
  },
  {
    id: 'bebida-de-la-casa',
    title: 'Bebida de la Casa',
    price: 13000,
    category: 'Bebidas Frías',
    description: 'Creación exclusiva de Trébol Café, una sorpresa de sabores que cambia según la temporada.',
    image: `${C}/bebidas_frias/bebida de la casa.PNG`,
    details: {
      origin: 'Receta exclusiva Trébol',
      intensity: 'Variable según temporada',
      allergens: 'Consultar al barista',
    },
  },
  {
    id: 'cafe-irlandes',
    title: 'Café Irlandés',
    price: 25000,
    category: 'Bebidas Frías',
    description: 'Espresso de especialidad, whisky artesanal y crema batida en perfecta armonía.',
    image: `${C}/bebidas_frias/café irlandés.PNG`,
    details: {
      origin: 'Espresso + whisky seleccionado',
      intensity: 'Alta, cálida y compleja',
      allergens: 'Contiene alcohol, Lácteos',
    },
  },
  {
    id: 'cerveza-michelada',
    title: 'Cerveza Michelada',
    price: 0,
    category: 'Bebidas Frías',
    description: 'Michelada artesanal preparada con cerveza fría, limón y especias de la casa. Pregunta por la disponibilidad.',
    image: `${C}/bebidas_frias/cerveza michelada.PNG`,
    details: {
      nota: 'Precio sujeto a disponibilidad. Consultar en barra.',
      allergens: 'Contiene alcohol, Gluten',
    },
  },
  {
    id: 'latte-frio',
    title: 'Latte Frío',
    price: 10000,
    category: 'Bebidas Frías',
    description: 'Espresso sobre hielo con leche fría cremosa. Refrescante en cualquier momento del día.',
    image: `${C}/bebidas_frias/latte frio.PNG`,
    details: {
      origin: 'Granos de Huila',
      intensity: 'Suave y cremosa',
      allergens: 'Lácteos',
    },
  },
  {
    id: 'nevado-cafe-oreo-arequipe',
    title: 'Nevado de Café, Oreo o Arequipe',
    price: 14000,
    category: 'Bebidas Frías',
    description: 'Batido helado en tres opciones irresistibles: café, Oreo o el dulce colombiano de arequipe.',
    image: `${C}/bebidas_frias/nevado de cafe, oreo o arequipe.PNG`,
    details: {
      origin: 'Receta artesanal de la casa',
      intensity: 'Dulce, cremosa y helada',
      allergens: 'Lácteos, Gluten (Oreo)',
    },
  },
  {
    id: 'aromatica-frutas-naturales',
    title: 'Aromática de Frutas Naturales',
    price: 10000,
    category: 'Bebidas Frías',
    description: 'Infusión de frutas naturales del Huila en dos opciones: frutos rojos o frutos amarillos.',
    image: `${C}/bebidas_frias/aromática de frutas naturales (frutos rojos o amarillos).PNG`,
    details: {
      origin: 'Frutas locales del Huila',
      intensity: 'Suave y frutal',
      allergens: 'Sin alérgenos',
    },
  },
  {
    id: 'soda-saborizada',
    title: 'Soda Saborizada',
    price: 13000,
    category: 'Bebidas Frías',
    description: 'Agua con gas saborizada en dos opciones: frutos rojos o frutos amarillos. Burbujeante y refrescante.',
    image: `${C}/bebidas_frias/soda saborizada (frutos rojos o amarillos).PNG`,
    details: {
      origin: 'Frutas naturales + agua carbonatada',
      intensity: 'Efervescente y ligera',
      allergens: 'Sin alérgenos',
    },
  },
  {
    id: 'tinto-de-verano',
    title: 'Tinto de Verano',
    price: 12000,
    category: 'Bebidas Frías',
    description: 'Refrescante mezcla de vino y gaseosa de limón, perfecta para los días cálidos en San Agustín.',
    image: `${C}/bebidas_frias/tinto de verano.PNG`,
    details: {
      origin: 'Combinado artesanal',
      intensity: 'Ligera y refrescante',
      allergens: 'Contiene alcohol',
    },
  },

  // ════════════════════════════════════
  // DESAYUNOS
  // ════════════════════════════════════
  {
    id: 'desayuno-de-la-casa',
    title: 'Desayuno de la Casa',
    price: 16000,
    category: 'Desayunos',
    description: 'Desayuno completo preparado con amor: huevos, acompañamientos y bebida incluida. El clásico de Trébol.',
    image: `${C}/desayunos/desayuno de la casa 1.PNG`,
    images: [
      `${C}/desayunos/desayuno de la casa 1.PNG`,
      `${C}/desayunos/desayuno de la casa 2.PNG`,
    ],
    details: {
      origin: 'Ingredientes locales frescos',
      intensity: 'Completo y nutritivo',
      allergens: 'Huevos, Lácteos, Gluten',
    },
  },

  // ════════════════════════════════════
  // POSTRES
  // ════════════════════════════════════
  {
    id: 'postre-frutos-rojos',
    title: 'Postre Cuchareable de Frutos Rojos',
    price: 12000,
    category: 'Postres',
    description: 'Postre cremoso de frutos rojos para comer con cuchara. Textura suave con la acidez natural de la fruta.',
    image: `${C}/postre/postre cuchareable de frutos rojos.PNG`,
    details: {
      origin: 'Frutos rojos del Huila',
      intensity: 'Suave, frutal y cremoso',
      allergens: 'Lácteos',
    },
  },

  // ════════════════════════════════════
  // TORTAS
  // ════════════════════════════════════
  {
    id: 'torta-zanahoria-naranja',
    title: 'Torta de Zanahoria con Naranja',
    price: 12000,
    category: 'Tortas',
    description: 'Torta húmeda y esponjosa de zanahoria con un glaseado aromático de naranja. Receta artesanal de la casa.',
    image: `${C}/tortas/torta de zanahoria con naranja 1.PNG`,
    images: [
      `${C}/tortas/torta de zanahoria con naranja 1.PNG`,
      `${C}/tortas/torta de zanahoria con naranja 2.PNG`,
    ],
    details: {
      origin: 'Receta artesanal de la casa',
      intensity: 'Suave y aromática',
      allergens: 'Gluten, Huevos, Lácteos',
    },
  },
  {
    id: 'torta-vasca',
    title: 'Torta Vasca',
    price: 12000,
    category: 'Tortas',
    description: 'Cremosa por dentro, perfectamente tostada por fuera. Receta original inspirada en San Sebastián.',
    image: `${C}/tortas/torta vasca 1.PNG`,
    images: [
      `${C}/tortas/torta vasca 1.PNG`,
      `${C}/tortas/torta vasca 2.PNG`,
      `${C}/tortas/torta vasca 3.PNG`,
    ],
    details: {
      origin: 'Receta de San Sebastián, adaptada con quesos locales',
      intensity: 'Textura suave y fundente',
      allergens: 'Lácteos, Huevos, Gluten',
    },
  },

  // ════════════════════════════════════
  // MÉTODOS DE CAFÉ ESPECIALIDAD
  // ════════════════════════════════════
  {
    id: 'metodo-bourbon-rosado',
    title: 'Bourbon Rosado',
    price: 6000,
    category: 'Métodos Especialidad',
    description: 'Variedad Bourbon Rosado preparada en Chemex, V60 o Prensa Francesa. Floral y delicada.',
    image: `${C}/metodos_de_café_especialidad/metodo de café especialidad 1.PNG`,
    details: {
      origin: 'Variedad Bourbon Rosado — San Agustín, Huila',
      intensity: 'Suave, notas florales y a fruta',
      nota: 'Disponible en Chemex · V60 · Prensa Francesa',
    },
  },
  {
    id: 'metodo-bourbon-aji',
    title: 'Bourbon Ají',
    price: 8000,
    category: 'Métodos Especialidad',
    description: 'Café con notas picantes y dulces únicas. Procesado en Chemex, V60 o Prensa Francesa.',
    image: `${C}/metodos_de_café_especialidad/metodo de café especialidad 2.PNG`,
    details: {
      origin: 'Variedad Bourbon Ají — Huila',
      intensity: 'Media, notas especiadas y frutales',
      nota: 'Disponible en Chemex · V60 · Prensa Francesa',
    },
  },
  {
    id: 'metodo-geisha',
    title: 'Geisha',
    price: 10000,
    category: 'Métodos Especialidad',
    description: 'La variedad más codiciada del mundo. Notas a jazmín, té de limón y una acidez incomparable.',
    image: `${C}/metodos_de_café_especialidad/metodo de café especialidad 3.PNG`,
    details: {
      origin: 'Variedad Geisha — San Agustín, Huila',
      intensity: 'Sutil y compleja, notas a jazmín y cítricos',
      nota: 'Disponible en Chemex · V60 · Prensa Francesa',
    },
  },

  // ════════════════════════════════════
  // COWORKING
  // ════════════════════════════════════
  {
    id: 'coworking-personal',
    title: 'Coworking Personal',
    price: 12000,
    category: 'Coworking',
    description: 'Pase personal por hora. Incluye una bebida fría o caliente de cortesía. WiFi de alta velocidad.',
    image: `${C}/coworking/Coworking  personal $12.000 la hora, incluye una bebida fría o caliente.jpeg`,
    details: {
      wifi: 'Alta velocidad — fibra óptica',
      compañía: '1 bebida fría o caliente incluida',
      nota: '$12.000 / hora',
    },
  },
  {
    id: 'coworking-grupal',
    title: 'Coworking Grupal',
    price: 100000,
    category: 'Coworking',
    description: 'Espacio grupal para 5 a 19 personas por hora. Incluye americano por persona. Ideal para equipos.',
    image: `${C}/coworking/Espacio de coworking grupal: 5 a 19 personas $100.000 la hora, incluye una bebida  (americano) por persona.PNG`,
    details: {
      wifi: 'Alta velocidad — fibra óptica',
      compañía: 'Americano por persona incluido (5 a 19 personas)',
      nota: '$100.000 / hora',
    },
  },
];
