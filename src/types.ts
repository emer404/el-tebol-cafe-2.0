export type Category =
  | 'Todos'
  | 'Bebidas Calientes'
  | 'Bebidas Frías'
  | 'Desayunos'
  | 'Postres'
  | 'Tortas'
  | 'Métodos Especialidad'
  | 'Coworking';

export interface MenuItem {
  id: string;
  title: string;
  price: number;
  category: Category;
  description: string;
  image: string;
  images?: string[]; // gallery when multiple shots exist
  details?: {
    origin?: string;
    intensity?: string;
    allergens?: string;
    wifi?: string;
    compañía?: string;
    nota?: string;
  };
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface CoworkingBooking {
  id: string;
  fullName: string;
  email: string;
  workspaceType: 'Escritorio Flexible' | 'Escritorio Dedicado' | 'Sala de Reunión' | 'Oficina Privada';
  date: string;
  slot: string; // e.g. "Mañana (8:00 - 13:00)", "Tarde (13:00 - 18:00)", "Día Completo"
  price: number;
  code: string; // Confirmation code e.g. "TRB-34289"
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  interest: string;
  message: string;
  date: string;
}
