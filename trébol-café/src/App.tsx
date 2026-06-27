import React, { useState, useEffect } from 'react';
import { 
  Menu as MenuIcon, X, Coffee, Laptop, Wifi, MapPin, Mail, Phone, Calendar, 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, CheckCircle2, 
  Sparkles, Globe, Eye, Ticket, Star, ChevronLeft, ChevronRight, Share2, Info, Check, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, MenuItem, CartItem, CoworkingBooking, ContactMessage } from './types';
import { MENU_ITEMS } from './data';

export default function App() {
  // Locale State
  const [lang, setLang] = useState<'es' | 'en'>('es');
  
  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Shopping Cart state
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Active Filter Category
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');
  
  // Product Detail Modal
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [productCustomization, setProductCustomization] = useState({
    milk: 'sin-lácteos', // 'sin-lácteos', 'entera', 'almendra', 'avena'
    sweetness: 'normal', // 'sin-azúcar', 'medio', 'normal'
    notes: ''
  });

  // Booking and Form States
  const [activeTab, setActiveTab] = useState<'booking' | 'contact'>('booking');
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    workspaceType: 'Escritorio Flexible' as CoworkingBooking['workspaceType'],
    date: '',
    slot: 'Día Completo'
  });
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    interest: 'Reserva Coworking',
    message: ''
  });
  
  // History lists stored in localStorage
  const [bookings, setBookings] = useState<CoworkingBooking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  
  // Interface alerts and toast messages
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' }[]>([]);
  
  // Loyalty Hub Open
  const [loyaltyHubOpen, setLoyaltyHubOpen] = useState(false);

  // Active Map Route Guide Details
  const [currentMapRoute, setCurrentMapRoute] = useState<'centro' | 'arqueologico' | 'pitalito'>('centro');

  // Newsletter email state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Custom feedback/review system for the coffee types
  const [reviews, setReviews] = useState<{ [key: string]: { rating: number; count: number } }>({
    'torta-vasca': { rating: 4.9, count: 48 },
    'margarita-bosque': { rating: 4.8, count: 32 },
    'capuchino-artesanal': { rating: 5.0, count: 124 },
    'pase-diario-coworking': { rating: 4.7, count: 56 },
    'espresso-filtrado': { rating: 4.9, count: 87 },
  });
  
  const [userRating, setUserRating] = useState<{ productId: string; rating: number } | null>(null);

  // Soundscape ambient audio player simulation
  const [ambientAudio, setAmbientAudio] = useState(false);

  // Load bookings and messages from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('trebol_bookings');
    const savedMessages = localStorage.getItem('trebol_messages');
    if (savedBookings) setBookings(JSON.parse(savedBookings));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  // Toast notifier helper
  const notify = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Language translation helper dictionary
  const t = {
    es: {
      subtitle: 'CAFÉ DE ORIGEN & COWORKING',
      title: 'Trébol Café',
      hero_desc: 'En el corazón de San Agustín, fusionamos la pasión por el café de alta especialidad con un entorno diseñado para la productividad y la conexión creativa.',
      btn_catalog: 'EXPLORAR CATÁLOGO',
      btn_coworking: 'ESPACIOS COWORKING',
      esencia_title: 'Nuestra Esencia',
      esencia_header: 'Donde la especialidad se encuentra con la concentración.',
      esencia_desc: 'Nacimos bajo el apoyo del Fondo Emprender y el SENA con una misión clara: elevar la cultura del café en nuestra región mientras brindamos un refugio para mentes creativas y nómadas digitales.',
      quote: '"Nuestra visión es ser el punto de referencia para el café de origen y el trabajo colaborativo en el sur del Huila."',
      stat_origin: 'Colombiano de Origen',
      stat_wifi: 'Mbps de Conexión',
      stat_hours: 'Horario Lunes a Sábado',
      cat_title: 'Nuestra Selección',
      cat_header: 'Menú Curado',
      btn_add: 'AÑADIR',
      btn_reserve: 'RESERVAR',
      contact_title: 'Contáctanos',
      contact_header: 'Hablemos sobre tu próximo proyecto o reserva.',
      form_full_name: 'Nombre Completo',
      form_email: 'Correo Electrónico',
      form_workspace: 'Tipo de Espacio',
      form_date: 'Fecha de Reserva',
      form_slot: 'Horario',
      form_interest: 'Interés',
      form_msg: 'Mensaje',
      btn_send_booking: 'Enviar Solicitud',
      btn_send_contact: 'Enviar Mensaje',
      respaldo: 'Con el respaldo institucional de',
      footer_desc: 'Cultivando excelencia, inspirando trabajo. San Agustín, Huila, Colombia. El hogar del café de especialidad y la productividad.',
      links: 'Enlaces',
      newsletter: 'Newsletter',
      newsletter_desc: 'Recibe noticias sobre nuevos lotes de café y eventos de coworking.',
      rights: '© 2026 Trébol Café.',
      cart_title: 'Tu Pedido',
      cart_empty: 'Aún no has agregado nada a tu experiencia.',
      cart_subtotal: 'Subtotal o Depósito',
      cart_tax: 'Servicio / IVA',
      cart_total: 'Total Estimado',
      btn_checkout: 'COMPLETAR PEDIDO / RESERVA',
      toast_add: '¡Producto añadido al carrito!',
      toast_booking_success: '¡Reserva generada con éxito! Revisa tu historial.',
      toast_contact_success: '¡Mensaje enviado! Nos contactaremos pronto.',
      toast_sub: '¡Te has unido a nuestra comunidad de especialidad!',
      history_title: 'Mis Reservas y Pedidos',
      history_no: 'No hay registros recientes.',
      history_badge: 'Reserva Confirmada',
      map_title: 'Cómo Llegar',
      map_desc: 'Ubicados en el sector preferente de San Agustín, a minutos de las rutas turísticas y rodeados de paz natural.'
    },
    en: {
      subtitle: 'SPECIALTY COFFEE & COWORKING',
      title: 'Trébol Café',
      hero_desc: 'In the heart of San Agustín, we fuse the passion for high specialty coffee with an environment tailored for productivity and creative connection.',
      btn_catalog: 'EXPLORE MENU',
      btn_coworking: 'COWORKING SPACES',
      esencia_title: 'Our Essence',
      esencia_header: 'Where specialty meets concentration.',
      esencia_desc: 'Born with the backing of Fondo Emprender and SENA with a clear mission: to elevate coffee culture in our region while providing a sanctuary for creative minds and digital nomads.',
      quote: '"Our vision is to be the ultimate reference for single-origin coffee and collaborative workspaces in southern Huila."',
      stat_origin: '100% Single Origin',
      stat_wifi: 'Mbps High-Speed Internet',
      stat_hours: 'Monday to Saturday Hours',
      cat_title: 'Our Selection',
      cat_header: 'Curated Menu',
      btn_add: 'ADD TO CART',
      btn_reserve: 'RESERVE',
      contact_title: 'Contact Us',
      contact_header: 'Let\'s talk about your next project or reservation.',
      form_full_name: 'Full Name',
      form_email: 'Email Address',
      form_workspace: 'Workspace Type',
      form_date: 'Reservation Date',
      form_slot: 'Time Slot',
      form_interest: 'Topic of Interest',
      form_msg: 'Message',
      btn_send_booking: 'Book My Workspace',
      btn_send_contact: 'Send Quick Message',
      respaldo: 'Supported institutionally by',
      footer_desc: 'Cultivating excellence, inspiring workspace. San Agustín, Huila, Colombia. The home of specialty coffee and focused minds.',
      links: 'Links',
      newsletter: 'Newsletter',
      newsletter_desc: 'Receive fresh updates on green micro-lots and coworking community events.',
      rights: '© 2026 Trébol Café.',
      cart_title: 'Your Order & Pass',
      cart_empty: 'Nothing added to your sensory journey yet.',
      cart_subtotal: 'Subtotal / Deposit',
      cart_tax: 'Service / VAT',
      cart_total: 'Estimated Total',
      btn_checkout: 'FIRM BOOKING & FINALIZE',
      toast_add: 'Item added to your order!',
      toast_booking_success: 'Booking confirmed! Check your History Hub.',
      toast_contact_success: 'Message sent! We will connect with you soon.',
      toast_sub: 'Welcome on board! 10% coupon code is yours.',
      history_title: 'My Passes & Booking Hub',
      history_no: 'No previous tickets found.',
      history_badge: 'Booking Confirmed',
      map_title: 'Interactive Travel Guide',
      map_desc: 'Located in the prime zone of San Agustín, minutes away from ecological walks and archeological treasures.'
    }
  };

  const currentLang = t[lang];

  // Helper mapping category filters
  const filterCategories: Category[] = ['Todos', 'Bebidas Calientes', 'Bebidas Frías', 'Pastelería', 'Coworking'];

  const filteredItems = activeCategory === 'Todos'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === activeCategory);

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { item, quantity: 1 }];
    });
    notify(`${item.title} ${currentLang.toast_add}`, 'success');
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart((prev) => 
      prev.map((i) => {
        if (i.item.id === id) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : i;
        }
        return i;
      }).filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart metrics
  const cartSubtotal = cart.reduce((acc, current) => acc + (current.item.price * current.quantity), 0);
  const cartTax = Math.round(cartSubtotal * 0.08);
  const cartTotal = cartSubtotal + cartTax;

  // Checkout simulating successful ticket generation
  const checkoutCartAndPasses = () => {
    if (cart.length === 0) return;
    
    // Auto-generate some coworking orders or coffee order confirmations based on content
    const containsCoworking = cart.find(c => c.item.category === 'Coworking');
    
    const newBooking: CoworkingBooking = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      fullName: bookingForm.fullName || 'Invitado Especial Premium',
      email: bookingForm.email || 'guest@trebolcafe.co',
      workspaceType: containsCoworking ? (containsCoworking.item.title as any) : 'Escritorio Flexible',
      date: bookingForm.date || new Date().toISOString().split('T')[0],
      slot: 'Día Completo (8:00 - 19:00)',
      price: cartTotal,
      code: `TRB-${Math.floor(10000 + Math.random() * 90000)}`
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('trebol_bookings', JSON.stringify(updatedBookings));

    notify(`${currentLang.toast_booking_success}`, 'success');
    setCart([]);
    setCartOpen(false);
    setLoyaltyHubOpen(true); // Open the tickets view so they can see it!
  };

  // Submit direct Booking Form
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.fullName || !bookingForm.email || !bookingForm.date) {
      notify(lang === 'es' ? 'Por favor completa todos los campos' : 'Please complete all required fields', 'info');
      return;
    }

    const priceMap = {
      'Escritorio Flexible': 25000,
      'Escritorio Dedicado': 35000,
      'Sala de Reunión': 40000,
      'Oficina Privada': 60000,
    };

    const price = priceMap[bookingForm.workspaceType] || 25000;

    const newBooking: CoworkingBooking = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      fullName: bookingForm.fullName,
      email: bookingForm.email,
      workspaceType: bookingForm.workspaceType,
      date: bookingForm.date,
      slot: bookingForm.slot,
      price: price,
      code: `TRB-${Math.floor(10000 + Math.random() * 90000)}`
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('trebol_bookings', JSON.stringify(updatedBookings));

    notify(currentLang.toast_booking_success, 'success');
    
    // Clear form
    setBookingForm({
      fullName: '',
      email: '',
      workspaceType: 'Escritorio Flexible',
      date: '',
      slot: 'Día Completo'
    });
    
    setLoyaltyHubOpen(true); // Open tickets panel to display receipt
  };

  // Submit contact message form
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.email || !contactForm.message) {
      notify(lang === 'es' ? 'Por favor completa los campos obligatorios' : 'Please complete all required fields', 'info');
      return;
    }

    const newMessage: ContactMessage = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      fullName: contactForm.fullName,
      email: contactForm.email,
      interest: contactForm.interest,
      message: contactForm.message,
      date: new Date().toLocaleDateString()
    };

    const updatedMessages = [newMessage, ...messages];
    setMessages(updatedMessages);
    localStorage.setItem('trebol_messages', JSON.stringify(updatedMessages));

    notify(currentLang.toast_contact_success, 'success');

    // Clear form
    setContactForm({
      fullName: '',
      email: '',
      interest: 'Reserva Coworking',
      message: ''
    });
  };

  // Newsletter Submit
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    notify(currentLang.toast_sub, 'success');
    setNewsletterEmail('');
  };

  // Handle Stars / Rating addition
  const handleProductRating = (productId: string, rating: number) => {
    setReviews((prev) => {
      const prevRating = prev[productId]?.rating || 5.0;
      const prevCount = prev[productId]?.count || 10;
      const newCount = prevCount + 1;
      const newRating = parseFloat(((prevRating * prevCount + rating) / newCount).toFixed(1));
      return {
        ...prev,
        [productId]: { rating: newRating, count: newCount }
      };
    });
    setUserRating({ productId, rating });
    notify(lang === 'es' ? '¡Gracias por calificar nuestro lote!' : 'Thank you for rating our artisanal batch!', 'success');
  };

  // Clear booking history item
  const cancelBooking = (id: string) => {
    const updated = bookings.filter((b) => b.id !== id);
    setBookings(updated);
    localStorage.setItem('trebol_bookings', JSON.stringify(updated));
    notify(lang === 'es' ? 'Reserva eliminada de tus registros' : 'Reservation removed from records', 'info');
  };

  return (
    <div className="bg-[#0A0A0A] text-[#FAFAF8] min-h-screen relative font-sans overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      
      {/* Toast Notifier */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className={`p-4 rounded-xl border pointer-events-auto flex items-center gap-3 shadow-xl ${
                toast.type === 'success' 
                  ? 'bg-bg-elevated/95 border-primary/30 text-[#FAFAF8]' 
                  : 'bg-bg-elevated/95 border-border-accent text-[#FAFAF8]'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <p className="text-sm font-medium">{toast.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Floating Coffee Ambient Noise Controller */}
      <div className="fixed bottom-6 left-6 z-40">
        <div className="bg-bg-elevated/95 backdrop-blur-md px-4 py-2 border border-border-subtle rounded-full flex items-center gap-2 shadow-lg">
          <button 
            onClick={() => {
              setAmbientAudio(!ambientAudio);
              notify(
                lang === 'es' 
                  ? (ambientAudio ? 'Música ambiental apagada' : 'Simulación de audio ambiental iniciada (Café Jazz)') 
                  : (ambientAudio ? 'Soundscape off' : 'Ambient soundscape simulation loaded (Cafe Jazz)'), 
                'info'
              );
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              ambientAudio ? 'bg-primary text-on-primary' : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
            title="Ambient Music Toggle"
            id="ambient_toggle_btn"
          >
            <Coffee size={14} className={ambientAudio ? 'animate-bounce' : ''} />
          </button>
          <span className="text-xs text-text-muted font-mono tracking-wider hidden sm:inline">
            {ambientAudio ? 'SOUNDSCAPE: ON' : 'SOUNDSCAPE: OFF'}
          </span>
          {ambientAudio && (
            <div className="flex gap-0.5 items-end h-3 w-5">
              <span className="bg-primary/70 w-0.5 animate-[pulse_1.2s_infinite] h-2"></span>
              <span className="bg-primary/70 w-0.5 animate-[pulse_0.8s_infinite] h-3"></span>
              <span className="bg-primary/70 w-0.5 animate-[pulse_1s_infinite] h-1.5"></span>
              <span className="bg-primary/70 w-0.5 animate-[pulse_0.6s_infinite] h-2.5"></span>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-45 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10">
        <nav className="flex justify-between items-center px-12 py-6 max-w-7xl mx-auto">
          
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2 group">
            <span className="font-sans text-2xl font-black tracking-tighter uppercase text-primary border-b-2 border-primary pb-0.5 transition-colors">
              TRÉBOL <span className="text-sm font-sans tracking-widest text-[#F5F5F5]">CAFÉ</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
            <a href="#inicio" className="text-primary hover:text-[#EEFF00] transition-colors">{lang === 'es' ? 'Inicio' : 'Home'}</a>
            <a href="#nosotros" className="text-white/60 hover:text-primary transition-colors">{lang === 'es' ? 'Nosotros' : 'About'}</a>
            <a href="#catalogo" className="text-white/60 hover:text-primary transition-colors">{lang === 'es' ? 'Catálogo' : 'Menu'}</a>
            <a href="#coworking" className="text-white/60 hover:text-primary transition-colors">Coworking</a>
            <a href="#contacto" className="text-white/60 hover:text-primary transition-colors">{lang === 'es' ? 'Contacto' : 'Contact'}</a>
          </div>

          {/* Actions: Languages, Booking History, Shopping Cart */}
          <div className="flex items-center gap-4">
            
            {/* Language Selection Toggle */}
            <button 
              onClick={() => {
                setLang(lang === 'es' ? 'en' : 'es');
                notify(lang === 'es' ? 'Language switched to English' : 'Idioma cambiado a Español', 'info');
              }}
              className="text-primary hover:text-[#EEFF00] p-2 rounded hover:bg-white/5 transition-colors flex items-center gap-1.5"
              title="Change Language"
              id="lang_switch_btn"
            >
              <Globe size={18} />
              <span className="text-xs font-mono font-bold tracking-widest">{lang.toUpperCase()}</span>
            </button>

            {/* Passes/Booking History Icon */}
            <button 
              onClick={() => setLoyaltyHubOpen(true)}
              className="relative p-2 rounded hover:bg-white/5 text-[#F5F5F5] hover:text-primary transition-colors"
              title="My Bookings History"
              id="history_hub_btn"
            >
              <Ticket size={20} />
              {bookings.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-black font-mono text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {bookings.length}
                </span>
              )}
            </button>

            {/* Shopping Cart button */}
            <button 
              onClick={() => setCartOpen(true)}
              className="p-2 py-1.5 border border-white/20 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-primary hover:text-black transition-all flex items-center gap-2 shrink-0 h-10"
              title="View Cart"
              id="cart_toggle_btn"
            >
              <ShoppingBag size={15} />
              {cart.length > 0 && (
                <span className="bg-primary text-black font-mono text-xs font-black min-w-5 h-5 px-1 rounded flex items-center justify-center border border-[#0A0A0A]">
                  {cart.reduce((ac, x) => ac + x.quantity, 0)}
                </span>
              )}
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-primary p-1.5"
              id="mobile_menu_btn"
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </nav>

        {/* Mobile menu panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#111111] border-t border-white/10"
            >
              <div className="flex flex-col p-6 space-y-4 text-center">
                <a href="#inicio" onClick={() => setMobileMenuOpen(false)} className="py-2 tracking-widest text-[#F5F5F5] hover:text-primary transition-colors font-bold uppercase">{currentLang.subtitle}</a>
                <a href="#nosotros" onClick={() => setMobileMenuOpen(false)} className="py-2 tracking-widest text-[#F5F5F5] hover:text-primary transition-colors">{lang === 'es' ? 'Nosotros' : 'About'}</a>
                <a href="#catalogo" onClick={() => setMobileMenuOpen(false)} className="py-2 tracking-widest text-[#F5F5F5] hover:text-primary transition-colors">{lang === 'es' ? 'Catálogo / Menú' : 'Menu & Coffee'}</a>
                <a href="#coworking" onClick={() => setMobileMenuOpen(false)} className="py-2 tracking-widest text-[#F5F5F5] hover:text-primary transition-colors">Coworking Space</a>
                <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="py-2 tracking-widest text-[#F5F5F5] hover:text-primary transition-colors">{lang === 'es' ? 'Contacto y Reservas' : 'Contact & Reserv.'}</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="pt-24">
        
        {/* Banner Announcement */}
        <div className="bg-gradient-to-r from-primary/10 via-[#111111] to-primary/10 text-center py-2.5 border-b border-white/10 text-[10px] tracking-[0.25em] font-mono text-primary flex items-center justify-center gap-2 uppercase font-black">
          <Sparkles size={12} className="animate-pulse text-[#CCFF00]" />
          {lang === 'es' 
            ? 'CULTIVANDO EXCELENCIA EN EL SUR EN ALIANZA CON SENA & FONDO EMPRENDER' 
            : 'Fostering specialty coffee alongside SENA & Fondo Emprender Huila'}
          <Sparkles size={12} className="animate-pulse text-[#CCFF00]" />
        </div>

        {/* Hero Section */}
        <section id="inicio" className="relative min-h-[90vh] flex items-center px-12 max-w-7xl mx-auto py-16 overflow-hidden">
          
          {/* Grid overlay background to reinforce standard technical design */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[130px] rounded-full pointer-events-none"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full z-10">
            
            {/* Left columnar text area */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#111111] border border-[#CCFF00]/30 mb-6">
                <span className="w-2 h-2 bg-primary animate-pulse"></span>
                <span className="font-mono text-[9px] sm:text-xs font-bold uppercase tracking-[0.25em] text-primary">
                  {currentLang.subtitle}
                </span>
              </div>

              <h1 className="text-6xl sm:text-[100px] lg:text-[120px] leading-[0.85] font-black tracking-tighter uppercase gold-gradient-text mb-6">
                TRÉBOL<br />CAFÉ
              </h1>

              <p className="text-base sm:text-lg text-white/60 max-w-xl leading-relaxed mb-8">
                {currentLang.hero_desc}
              </p>

              <div className="flex flex-wrap gap-4 w-full">
                <a 
                  href="#catalogo" 
                  className="px-8 py-4 bg-primary text-black font-black text-xs tracking-[0.2em] uppercase text-center cursor-pointer hover:bg-white hover:text-black transition-all border border-primary duration-300 min-w-[200px]"
                >
                  {currentLang.btn_catalog}
                </a>
                <a 
                  href="#contacto" 
                  onClick={() => setActiveTab('booking')}
                  className="px-8 py-4 border border-white/20 text-white font-bold text-xs tracking-[0.18em] uppercase text-center cursor-pointer hover:bg-primary hover:text-black hover:border-primary transition-all duration-300 min-w-[200px]"
                >
                  {currentLang.btn_coworking}
                </a>
              </div>

              {/* Dynamic highlights for micro-lot availability */}
              <div className="mt-12 p-5 bg-[#111111] border border-white/10 max-w-md w-full flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-[#CCFF00]/10 flex items-center justify-center shrink-0 border border-[#CCFF00]/20">
                  <Coffee className="text-[#CCFF00]" size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono font-black tracking-widest text-[#CCFF00] uppercase">
                    [ {lang === 'es' ? 'LOTE ACTIVO' : 'ACTIVE MICRO-LOT'} ]
                  </h4>
                  <p className="text-xs text-white/60 mt-1">
                    {lang === 'es' 
                      ? 'Borbón Rosado (Finca El Trébol). Cosechado a 1,750 msnm. Notas frutales intensas.' 
                      : 'Pink Bourbon (El Trébol Farm). Harvested at 1,750 masl. Rich fruity acidity.'}
                  </p>
                </div>
              </div>

            </div>

            {/* Right overlapping images mockup block */}
            <div className="lg:col-span-6 relative h-[500px] md:h-[600px] w-full mt-8 lg:mt-0">
              
              {/* Back ambient frame */}
              <div className="absolute right-0 top-4 w-3/4 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-border-subtle z-20 group">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop"
                  alt="Specialty Latte Art" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 bg-bg-elevated/90 backdrop-blur-md p-3 rounded-xl border border-border-subtle flex justify-between items-center">
                  <div>
                    <h5 className="text-xs font-bold tracking-widest uppercase text-primary">Barra de Especialidad</h5>
                    <p className="text-[10px] text-text-subtle">Huila single farms only</p>
                  </div>
                  <Coffee size={14} className="text-primary" />
                </div>
              </div>

              {/* Front Overlapping space frame */}
              <div className="absolute left-0 bottom-4 w-1/2 aspect-square rounded-2xl overflow-hidden shadow-2xl border border-border-subtle z-30 group">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600&auto=format&fit=crop"
                  alt="Modern Coworking Space in Huila" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 bg-bg-elevated/90 backdrop-blur-md p-2.5 rounded-lg border border-border-subtle flex justify-between items-center">
                  <div>
                    <h5 className="text-[10px] font-bold tracking-widest uppercase text-[#FAFAF8]">Coworking Premium</h5>
                    <p className="text-[9px] text-primary">300+ Mbps Red</p>
                  </div>
                  <Laptop size={12} className="text-primary" />
                </div>
              </div>

              {/* Tiny background accent roaster frame */}
              <div className="absolute -left-8 top-1/4 w-1/3 aspect-[4/5] rounded-xl overflow-hidden shadow-xl border border-border-subtle z-10 opacity-70 hidden sm:block">
                <img 
                  className="w-full h-full object-cover" 
                  src="https://images.unsplash.com/photo-1502462041640-b3d7e50d0662?q=80&w=400&auto=format&fit=crop"
                  alt="Coffee Roasting Lab" 
                  referrerPolicy="no-referrer"
                />
              </div>

            </div>

          </div>
        </section>

        {/* About / Esencia Section */}
        <section id="nosotros" className="py-24 px-12 max-w-7xl mx-auto border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
            
            {/* Left editorial column */}
            <div className="lg:col-span-5">
              <span className="font-mono text-xs text-[#CCFF00] uppercase tracking-[0.25em] block mb-4 font-black">
                [ {currentLang.esencia_title} ]
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-none">
                {currentLang.esencia_header}
              </h2>
              <p className="text-white/60 mb-8 leading-relaxed text-sm">
                {currentLang.esencia_desc}
              </p>
              
              <div className="p-6 bg-[#111111] border-l-4 border-[#CCFF00] rounded-none">
                <p className="italic text-[#CCFF00] text-sm font-sans font-bold">
                  {currentLang.quote}
                </p>
              </div>
            </div>

            {/* Right features grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-[#111111] p-8 rounded-none border border-white/10 hover:border-primary/40 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 group">
                <div className="w-12 h-12 rounded-none bg-[#CCFF00]/10 flex items-center justify-center text-[#CCFF00] mb-6 group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                  <Coffee size={24} />
                </div>
                <h4 className="text-lg font-black uppercase tracking-tight text-white mb-2">
                  {lang === 'es' ? 'Café de Origen Único' : 'Single Batch Specialty'}
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  {lang === 'es'
                    ? 'Seleccionamos granos premium de caficultores de San Agustín. Procesos naturales, lavados y honey que realzan tazas inimaginables.'
                    : 'Curated premium beans from local San Agustín growers. Natural, washed & honey processes highlight unimaginable tasting notes.'}
                </p>
                <button 
                  onClick={() => notify(lang === 'es' ? 'Cosechas obtenidas de fincas sobre 1700msnm' : 'All beans harvested above 1700 masl', 'info')}
                  className="mt-6 text-[10px] uppercase font-black tracking-widest text-[#CCFF00] hover:underline flex items-center gap-1.5"
                >
                  {lang === 'es' ? 'Saber más sobre el origen' : 'Tell me more about origin'}
                  <ArrowRight size={10} />
                </button>
              </div>

              <div className="bg-[#111111] p-8 rounded-none border border-white/10 hover:border-primary/40 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 group">
                <div className="w-12 h-12 rounded-none bg-[#CCFF00]/10 flex items-center justify-center text-[#CCFF00] mb-6 group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                  <Laptop size={24} />
                </div>
                <h4 className="text-lg font-black uppercase tracking-tight text-white mb-2">
                  {lang === 'es' ? 'Coworking Inteligente' : 'Seamless Coworking'}
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  {lang === 'es'
                    ? 'Fibra simétrica de alta velocidad, sillas ergonómicas, café a demanda, y aire diseñado para fluir en tus ideas.'
                    : 'High-speed symmetrical bandwidth, ergonomic seating, active beverage hub, and clean climate customized to help you work.'}
                </p>
                <button 
                  onClick={() => notify(lang === 'es' ? 'Conexión por fibra óptica con respaldo secundario' : 'Optic fiber network with failover backup', 'info')}
                  className="mt-6 text-[10px] uppercase font-black tracking-widest text-[#CCFF00] hover:underline flex items-center gap-1.5"
                >
                  {lang === 'es' ? 'Revisar infraestructura Red' : 'Check network speed info'}
                  <ArrowRight size={10} />
                </button>
              </div>

              <div className="bg-[#111111] p-8 rounded-none border border-white/10 hover:border-primary/40 hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 sm:col-span-2 group">
                <div className="w-12 h-12 rounded-none bg-[#CCFF00]/10 flex items-center justify-center text-[#CCFF00] mb-6 group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                  <Wifi size={24} />
                </div>
                <h4 className="text-lg font-black uppercase tracking-tight text-white mb-2">
                  {lang === 'es' ? 'Comunidad y Aprendizaje Co-creativo' : 'Collab Space & Academy'}
                </h4>
                <p className="text-xs text-white/50 leading-relaxed">
                  {lang === 'es'
                    ? '¿Quieres aprender sobre catación, barismo, o expandir tu red con otros profesionales? En Trébol dictamos talleres constantes respaldados por expertos y el SENA, uniendo el conocimiento caficultor del Huila con el mundo digital.'
                    : 'Interested in professional tasting, brewing, or looking to network? Trébol offers frequent hands-on academies backed by expert coffee producers and the SENA, blending local Huila heritage with global digital trends.'}
                </p>
              </div>

            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-white/10 py-10 text-center bg-[#111111] rounded-none">
            <div className="p-4 md:border-r border-white/10">
              <span className="block font-sans text-5xl font-black text-[#CCFF00] tracking-tighter mb-1">100%</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {currentLang.stat_origin}
              </span>
            </div>
            <div className="p-4 md:border-r border-white/10">
              <span className="block font-sans text-5xl font-black text-[#CCFF00] tracking-tighter mb-1">300+</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {currentLang.stat_wifi}
              </span>
            </div>
            <div className="p-4">
              <span className="block font-sans text-4xl font-black text-[#CCFF00] tracking-tighter mb-1">07:00 - 21:00</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {currentLang.stat_hours}
              </span>
            </div>
          </div>

        </section>

        {/* Curated Catalog Section */}
        <section id="catalogo" className="py-24 bg-[#0A0A0A] px-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            
            <div className="text-center mb-16">
              <span className="font-mono text-xs text-[#CCFF00] uppercase tracking-[0.25em] font-black block mb-4">
                [ {currentLang.cat_title} ]
              </span>
              <h2 className="font-sans text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-none">
                {currentLang.cat_header}
              </h2>

              {/* Filter Category Buttons */}
              <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
                {filterCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      notify(lang === 'es' ? `Filtrando por: ${cat}` : `Filtering by: ${cat}`, 'info');
                    }}
                    className={`px-6 py-3 border text-[11px] tracking-widest font-black uppercase transition-all duration-300 rounded-none cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-[#CCFF00] border-[#CCFF00] text-black scale-102 shadow-lg shadow-[#CCFF00]/10'
                        : 'bg-[#111111] border-white/10 text-white/60 hover:text-[#CCFF00] hover:border-[#CCFF00]'
                    }`}
                  >
                    {lang === 'en' && cat === 'Todos' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((product) => {
                  const itemRating = reviews[product.id] || { rating: 4.8, count: 25 };
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      key={product.id}
                      className="group relative bg-[#111111] rounded-none overflow-hidden border border-white/10 hover:border-[#CCFF00]/40 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Aspect square with subtle zoom on cover image */}
                        <div className="aspect-square overflow-hidden relative cursor-pointer" onClick={() => setSelectedProduct(product)}>
                          <img 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            src={product.image} 
                            alt={product.title} 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 right-3 bg-black/95 px-3 py-1 rounded-none border border-[#CCFF00]/30 z-10 flex items-center gap-1">
                            <Star size={12} className="text-[#CCFF00] fill-[#CCFF00]" />
                            <span className="font-mono text-[11px] font-bold text-primary">
                              {itemRating.rating}
                            </span>
                          </div>

                          {/* Quick info tag on hover */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="px-4 py-2 bg-[#CCFF00] text-black text-xs font-black uppercase tracking-widest rounded-none shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                              <Eye size={12} />
                              {lang === 'es' ? 'Ver Detalles' : 'View Spec'}
                            </span>
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h4 className="font-sans text-lg text-[#CCFF00] font-black uppercase tracking-tight hover:underline cursor-pointer leading-tight" onClick={() => setSelectedProduct(product)}>
                              {product.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 block">[ {product.category} ]</span>
                            <span className="font-mono text-sm font-black text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded-none shrink-0">
                              ${product.price.toLocaleString('es-CO')}
                            </span>
                          </div>

                          <p className="text-xs text-white/60 mb-4 line-clamp-2 h-8">
                            {product.description}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        {product.category === 'Coworking' ? (
                          <button
                            onClick={() => {
                              setBookingForm(prev => ({
                                ...prev,
                                workspaceType: product.title.includes('Semanal') ? 'Escritorio Dedicado' : 'Escritorio Flexible'
                              }));
                              const targetElement = document.getElementById('contacto');
                              if (targetElement) {
                                targetElement.scrollIntoView({ behavior: 'smooth' });
                              }
                              notify(lang === 'es' ? `Completando pase: ${product.title}` : `Setting desk: ${product.title}`, 'info');
                            }}
                            className="w-full py-2.5 font-sans text-xs font-bold border border-primary rounded-full text-primary hover:bg-primary hover:text-on-primary transition-all uppercase tracking-widest"
                          >
                            {currentLang.btn_reserve}
                          </button>
                        ) : (
                          <button
                            onClick={() => addToCart(product)}
                            className="w-full py-2.5 font-sans text-xs font-bold bg-primary/10 border border-border-accent rounded-full text-primary hover:bg-primary hover:text-on-primary hover:shadow-lg hover:shadow-primary/10 transition-all uppercase tracking-widest"
                          >
                            {currentLang.btn_add}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* Dynamic Interactive Features: Product Explorer Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-[#1A1612] max-w-3xl w-full rounded-2xl overflow-hidden border border-border-accent shadow-2xl my-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  
                  {/* Image side with quick specifications */}
                  <div className="relative aspect-square md:aspect-auto md:h-full min-h-[300px]">
                    <img 
                      className="w-full h-full object-cover" 
                      src={selectedProduct.image} 
                      alt={selectedProduct.title} 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-left">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-primary font-bold bg-black/60 px-2.5 py-1 rounded-full border border-primary/20">
                        {lang === 'es' ? 'COSECHA SELECCIONADA' : 'CURATED HARVEST'}
                      </span>
                      <h3 className="font-serif text-2xl font-bold mt-2 text-[#FAFAF8]">
                        {selectedProduct.title}
                      </h3>
                    </div>
                  </div>

                  {/* Operational Settings Side */}
                  <div className="p-6 md:p-8 flex flex-col justify-between">
                    
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold tracking-widest uppercase rounded-full border border-primary/25">
                          {selectedProduct.category}
                        </span>

                        <button 
                          onClick={() => setSelectedProduct(null)}
                          className="text-[#FAFAF8]/50 hover:text-primary p-1.5 rounded-full hover:bg-bg-elevated transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <p className="text-xl font-bold text-primary font-mono mb-4">
                        ${selectedProduct.price.toLocaleString('es-CO')}
                      </p>

                      <p className="text-xs text-text-muted leading-relaxed mb-6">
                        {selectedProduct.description}
                      </p>

                      {/* Technical Batch Specification */}
                      {selectedProduct.details && (
                        <div className="bg-[#0A0A0A]/60 rounded-xl p-4 border border-border-subtle mb-6 text-left">
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-[#FAFAF8] mb-3 flex items-center gap-1.5">
                            <Info size={12} className="text-primary" />
                            {lang === 'es' ? 'Ficha de Especialidad' : 'Specialty Datasheet'}
                          </h5>
                          <ul className="space-y-1.5 text-[11px] text-text-muted">
                            {selectedProduct.details.origin && (
                              <li>
                                <strong className="text-primary">{lang === 'es' ? 'Finca / Origen:' : 'Farm / Trace:'}</strong> {selectedProduct.details.origin}
                              </li>
                            )}
                            {selectedProduct.details.intensity && (
                              <li>
                                <strong className="text-primary">{lang === 'es' ? 'Taza:' : 'Intensity / Profile:'}</strong> {selectedProduct.details.intensity}
                              </li>
                            )}
                            {selectedProduct.details.allergens && (
                              <li>
                                <strong className="text-primary">{lang === 'es' ? 'Alérgenos:' : 'Allergens:'}</strong> {selectedProduct.details.allergens}
                              </li>
                            )}
                            {selectedProduct.details.wifi && (
                              <li>
                                <strong className="text-primary">{lang === 'es' ? 'Velocidad WiFi:' : 'Bandwidth:'}</strong> {selectedProduct.details.wifi}
                              </li>
                            )}
                            {selectedProduct.details.compañía && (
                              <li>
                                <strong className="text-primary">{lang === 'es' ? 'Inclusiones:' : 'Inclusions:'}</strong> {selectedProduct.details.compañía}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Customize Options dynamically for Drinks or Treats */}
                      {selectedProduct.category !== 'Coworking' && (
                        <div className="space-y-4 mb-6 text-left">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1">
                            {lang === 'es' ? 'Tipo de Leche / Adicional' : 'Milk options / Choice'}
                          </label>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {[
                              { key: 'sin-lácteos', label: lang === 'es' ? 'Sin Lácteos / Por defecto' : 'Oat/Almond option' },
                              { key: 'entera', label: lang === 'es' ? 'Lácteo Semidescremado' : 'Whole milk option' }
                            ].map(opt => (
                              <button
                                key={opt.key}
                                onClick={() => setProductCustomization(p => ({ ...p, milk: opt.key }))}
                                className={`p-2.5 rounded-lg border text-center transition-all ${
                                  productCustomization.milk === opt.key 
                                    ? 'border-primary bg-primary/10 text-primary font-bold' 
                                    : 'border-border-subtle bg-[#0E0E0E] text-text-muted'
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Micro-lot stars ratings */}
                      <div className="border-t border-border-subtle pt-4 text-left">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">
                          {lang === 'es' ? 'Calificar este Micro-lote' : 'Rate this Micro-lot'}
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleProductRating(selectedProduct.id, star)}
                              className="text-primary p-0.5 hover:scale-125 transition-transform"
                            >
                              <Star 
                                size={20} 
                                className={`${
                                  (userRating?.productId === selectedProduct.id && userRating?.rating >= star) || 
                                  (reviews[selectedProduct.id]?.rating >= star)
                                    ? 'fill-primary text-primary' 
                                    : 'text-text-subtle'
                                }`} 
                              />
                            </button>
                          ))}
                          <span className="text-[11px] font-mono text-text-muted ml-2">
                            ({reviews[selectedProduct.id]?.rating || 4.9} - {reviews[selectedProduct.id]?.count || 5} {lang === 'es' ? 'calificaciones' : 'rates'})
                          </span>
                        </div>
                      </div>

                    </div>

                    <div className="mt-8 flex gap-3">
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                        className="flex-1 py-3 bg-primary text-on-primary font-bold text-xs uppercase tracking-widest rounded-full hover:scale-102 transition-transform"
                      >
                        {selectedProduct.category === 'Coworking' ? currentLang.btn_reserve : currentLang.btn_add}
                      </button>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="px-6 py-3 border border-border-subtle text-text-muted hover:text-[#FAFAF8] font-bold text-xs uppercase tracking-widest rounded-full"
                      >
                        {lang === 'es' ? 'Cerrar' : 'Close'}
                      </button>
                    </div>

                  </div>

                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Contact and Coworking Booking Joint Section */}
        <section id="contacto" className="py-24 px-12 max-w-7xl mx-auto border-t border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left direct contact details */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              
              <div>
                <span className="font-mono text-xs text-[#CCFF00] uppercase tracking-[0.25em] font-black block mb-4">
                  [ {currentLang.contact_title} ]
                </span>
                <h2 className="font-sans text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                  {currentLang.contact_header}
                </h2>

                <div className="space-y-4 mb-8">
                  
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-none bg-[#CCFF00]/10 flex items-center justify-center border border-white/10 text-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">
                        {lang === 'es' ? 'Visítanos' : 'Come Over'}
                      </span>
                      <span className="text-sm text-white/70">Carrera 14 # 3-25, San Agustín, Huila</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-none bg-[#CCFF00]/10 flex items-center justify-center border border-white/10 text-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                      <Mail size={20} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">Email</span>
                      <span className="text-sm text-white/70">hola@trebolcafe.co</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-none bg-[#CCFF00]/10 flex items-center justify-center border border-white/10 text-[#CCFF00] group-hover:bg-[#CCFF00] group-hover:text-black transition-all">
                      <Phone size={20} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-[#CCFF00]">
                        {lang === 'es' ? 'Llámanos' : 'Phone'}
                      </span>
                      <span className="text-sm text-white/70">+57 312 456 7890</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Interactive map module */}
              <div className="relative rounded-none overflow-hidden border border-white/10 flex flex-col justify-end p-6 h-64 group bg-[#111111] shadow-2xl">
                
                {/* Simulated customizable route guide map */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-all bg-[radial-gradient(#CCFF00_1.3px,transparent_1.3px)] [background-size:16px_16px]"></div>
                
                <div className="z-20 relative text-left">
                  <h4 className="text-[10px] font-mono font-black tracking-widest text-[#CCFF00] uppercase mb-2">
                    [ {currentLang.map_title} ]
                  </h4>
                  <p className="text-[11px] text-white/50 mb-4 max-w-sm">
                    {currentLang.map_desc}
                  </p>
                  
                  {/* Location picker router */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <button 
                      onClick={() => {
                        setCurrentMapRoute('centro');
                        notify(lang === 'es' ? 'Ruta del Parque Principal cargada: 2 min a pie.' : 'Central Park route loaded: 2 min walk.', 'info');
                      }}
                      className={`px-3 py-1 rounded-none text-[9px] uppercase font-mono font-bold border transition-colors ${
                        currentMapRoute === 'centro' 
                          ? 'bg-[#CCFF00] border-[#CCFF00] text-black' 
                          : 'bg-[#111111] border-white/10 text-white/60 hover:text-[#CCFF00]'
                      }`}
                    >
                      Park
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentMapRoute('arqueologico');
                        notify(lang === 'es' ? 'Ruta Parque Arqueológico cargada: 10 min en coche.' : 'Archaeological Park route: 10 min drive.', 'info');
                      }}
                      className={`px-3 py-1 rounded-none text-[9px] uppercase font-mono font-bold border transition-colors ${
                        currentMapRoute === 'arqueologico' 
                          ? 'bg-[#CCFF00] border-[#CCFF00] text-black' 
                          : 'bg-[#111111] border-white/10 text-white/60 hover:text-[#CCFF00]'
                      }`}
                    >
                      Archaeology
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentMapRoute('pitalito');
                        notify(lang === 'es' ? 'Ruta desde Terminal Pitalito cargada: 45 min.' : 'From Pitalito Terminal: 45 min.', 'info');
                      }}
                      className={`px-3 py-1 rounded-none text-[9px] uppercase font-mono font-bold border transition-colors ${
                        currentMapRoute === 'pitalito' 
                          ? 'bg-[#CCFF00] border-[#CCFF00] text-black' 
                          : 'bg-[#111111] border-white/10 text-white/60 hover:text-[#CCFF00]'
                      }`}
                    >
                      Pitalito
                    </button>
                  </div>

                  <div className="bg-[#111111]/95 border border-white/10 p-2.5 rounded-none flex items-center justify-between text-[11px]">
                    <span className="font-mono text-primary flex items-center gap-1 font-bold">
                      <MapPin size={10} />
                      {currentMapRoute === 'centro' && 'Huila Centro (200m)'}
                      {currentMapRoute === 'arqueologico' && 'Parque Arqueol. (4.1km)'}
                      {currentMapRoute === 'pitalito' && 'Pitalito Ruta (32km)'}
                    </span>
                    <span className="font-bold text-[#FAFAF8]">
                      {currentMapRoute === 'centro' && '2 min'}
                      {currentMapRoute === 'arqueologico' && '10 min'}
                      {currentMapRoute === 'pitalito' && '45 min'}
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Booking & Messages central hub form */}
            <div className="lg:col-span-7">
              <div className="bg-[#111111] p-8 rounded-none border border-white/10 relative overflow-hidden text-left">
                
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#CCFF00]/5 blur-[55px] rounded-none"></div>

                {/* Switcher Form Header */}
                <div className="flex border-b border-white/10 mb-6">
                  <button
                    onClick={() => setActiveTab('booking')}
                    className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                      activeTab === 'booking' 
                        ? 'border-[#CCFF00] text-[#CCFF00]' 
                        : 'border-transparent text-white/50 hover:text-white'
                    }`}
                  >
                    {lang === 'es' ? 'Reserva Coworking' : 'Coworking Ticket'}
                  </button>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className={`flex-1 pb-3 text-xs font-black uppercase tracking-wider text-center border-b-2 transition-all cursor-pointer ${
                      activeTab === 'contact' 
                        ? 'border-[#CCFF00] text-[#CCFF00]' 
                        : 'border-transparent text-white/50 hover:text-white'
                    }`}
                  >
                    {lang === 'es' ? 'Enviar Mensaje' : 'Send Message'}
                  </button>
                </div>

                {activeTab === 'booking' ? (
                  /* Coworking Immediate booking slot */
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-white/50 tracking-widest block">
                        {currentLang.form_full_name} <span className="text-[#CCFF00]">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={bookingForm.fullName}
                        onChange={(e) => setBookingForm(p => ({ ...p, fullName: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] rounded-none px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
                        placeholder="Ana María Beltrán..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-white/50 tracking-widest block">
                          {currentLang.form_email} <span className="text-[#CCFF00]">*</span>
                        </label>
                        <input 
                          type="email"
                          required
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm(p => ({ ...p, email: e.target.value }))}
                          className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] rounded-none px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
                          placeholder="ana@ejemplo.com"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-white/50 tracking-widest block">
                          {currentLang.form_workspace}
                        </label>
                        <select
                          value={bookingForm.workspaceType}
                          onChange={(e) => setBookingForm(p => ({ ...p, workspaceType: e.target.value as any }))}
                          className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] rounded-none px-4 py-3 text-sm text-white outline-none transition-all cursor-pointer"
                        >
                          <option value="Escritorio Flexible" className="bg-[#111111]">{lang === 'es' ? 'Escritorio Flexible ($25.000/día)' : 'Hot Desk ($25.000/day)'}</option>
                          <option value="Escritorio Dedicado" className="bg-[#111111]">{lang === 'es' ? 'Escritorio Dedicado ($35.000/día)' : 'Dedicated Desk ($35.000/day)'}</option>
                          <option value="Sala de Reunión" className="bg-[#111111]">{lang === 'es' ? 'Sala de Reunión ($40.000/hora)' : 'Meeting Room ($40.000/hour)'}</option>
                          <option value="Oficina Privada" className="bg-[#111111]">{lang === 'es' ? 'Oficina Privada ($60.000/día)' : 'Private Suite ($60.000/day)'}</option>
                        </select>
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-white/50 tracking-widest block">
                          {currentLang.form_date} <span className="text-[#CCFF00]">*</span>
                        </label>
                        <input 
                          type="date"
                          required
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm(p => ({ ...p, date: e.target.value }))}
                          className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] rounded-none px-4 py-3 text-sm text-white outline-none transition-all cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-white/50 tracking-widest block">
                          {currentLang.form_slot}
                        </label>
                        <select
                          value={bookingForm.slot}
                          onChange={(e) => setBookingForm(p => ({ ...p, slot: e.target.value }))}
                          className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] rounded-none px-4 py-3 text-sm text-white outline-none transition-all cursor-pointer"
                        >
                          <option value="Mañana (8:00 - 13:00)" className="bg-[#111111]">{lang === 'es' ? 'Mañana (8:00 - 13:00)' : 'Morning (8:00 - 13:00)'}</option>
                          <option value="Tarde (13:00 - 18:00)" className="bg-[#111111]">{lang === 'es' ? 'Tarde (13:05 - 18:00)' : 'Afternoon (13:05 - 18:00)'}</option>
                          <option value="Día Completo" className="bg-[#111111]">{lang === 'es' ? 'Día Completo (8:00 - 20:00)' : 'Full Day Session (8:00 - 20:00)'}</option>
                        </select>
                      </div>

                    </div>

                    <div className="bg-[#0A0A0A]/60 rounded-none p-4 border border-white/10 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-white/40">{lang === 'es' ? 'Servicio de Internet Redundante:' : 'Internet Connection:'}</span>
                        <span className="text-[#CCFF00] font-bold">300 Mbps Symmetrical</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">{lang === 'es' ? 'Cortesía de Café en Barra:' : 'Included Coffee Drink:'}</span>
                        <span className="text-[#CCFF00] font-bold">{lang === 'es' ? '1 Bebida incluida' : '1 Free brewing'}</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#CCFF00] text-black font-sans text-xs font-black rounded-none uppercase tracking-widest hover:scale-101 transition-all mt-6 shadow-lg shadow-[#CCFF00]/10 cursor-pointer"
                    >
                      {currentLang.btn_send_booking}
                    </button>

                  </form>
                ) : (
                  /* Standard contact / help letter */
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-white/50 tracking-widest block">
                        {currentLang.form_full_name} <span className="text-[#CCFF00]">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={contactForm.fullName}
                        onChange={(e) => setContactForm(p => ({ ...p, fullName: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] rounded-none px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
                        placeholder="Juan Andrés Huila..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-white/50 tracking-widest block">
                          {currentLang.form_email} <span className="text-[#CCFF00]">*</span>
                        </label>
                        <input 
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))}
                          className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] rounded-none px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
                          placeholder="juan@ejemplo.com"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-white/50 tracking-widest block">
                          {currentLang.form_interest}
                        </label>
                        <select
                          value={contactForm.interest}
                          onChange={(e) => setContactForm(p => ({ ...p, interest: e.target.value }))}
                          className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] rounded-none px-4 py-3 text-sm text-white outline-none transition-all cursor-pointer"
                        >
                          <option value="Reserva Coworking" className="bg-[#111111]">{lang === 'es' ? 'Reserva Coworking' : 'Book Coworking'}</option>
                          <option value="Pedido Especial" className="bg-[#111111]">{lang === 'es' ? 'Pedido Especial Granos' : 'Special Batch Orders'}</option>
                          <option value="Eventos" className="bg-[#111111]">{lang === 'es' ? 'Talleres o Eventos Académicos' : 'Academy & Workshops'}</option>
                          <option value="Otros" className="bg-[#111111]">{lang === 'es' ? 'Otros temas' : 'Other queries'}</option>
                        </select>
                      </div>

                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-white/50 tracking-widest block">
                        {currentLang.form_msg} <span className="text-[#CCFF00]">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={contactForm.message}
                        onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 focus:border-[#CCFF00] rounded-none px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20 resize-none"
                        placeholder={lang === 'es' ? '¿En qué podemos ayudarte a emprender o colaborar?' : 'Tell us how we can help your remote work journey...'}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-[#CCFF00] text-black font-sans text-xs font-black rounded-none uppercase tracking-widest hover:scale-101 transition-all mt-6 shadow-lg shadow-[#CCFF00]/10 cursor-pointer"
                    >
                      {currentLang.btn_send_contact}
                    </button>

                  </form>
                )}

              </div>
            </div>

          </div>
        </section>

        {/* Co-founders & SENA / Fondo Emprender Institutional Backing */}
        <section className="py-16 border-t border-border-subtle bg-black">
          <div className="max-w-7xl mx-auto px-6 text-center">
            
            <span className="font-mono text-xs uppercase text-text-muted tracking-widest mb-8 block font-black">
              {currentLang.respaldo}
            </span>

            {/* Seamless institutional support vectors mock */}
            <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              
              <div className="flex flex-col items-center gap-2">
                <div className="h-14 w-32 bg-contain bg-no-repeat bg-center bg-[#FAFAF8]/5 rounded-xl border border-[#FAFAF8]/10 p-2 flex items-center justify-center">
                  <span className="font-serif text-lg font-black tracking-widest text-[#FAFAF8]">SENA</span>
                </div>
                <span className="font-mono text-[9px] text-[#FAFAF8]/40">Huila Regional</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="h-14 w-36 bg-contain bg-no-repeat bg-center bg-[#FAFAF8]/5 rounded-xl border border-[#FAFAF8]/10 p-2 flex items-center justify-center">
                  <span className="font-sans text-[11px] font-black tracking-widest text-[#FAFAF8]">FONDO EMPRENDER</span>
                </div>
                <span className="font-mono text-[9px] text-[#FAFAF8]/40">Huila Emprende</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="h-14 w-32 bg-contain bg-no-repeat bg-center bg-[#FAFAF8]/5 rounded-xl border border-[#FAFAF8]/10 p-2 flex items-center justify-center">
                  <span className="font-mono text-xs font-black tracking-widest text-primary">MINTIC</span>
                </div>
                <span className="font-mono text-[9px] text-[#FAFAF8]/40">Connectivity Hub</span>
              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#0E0E0E] py-16 border-t border-border-subtle">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 max-w-7xl mx-auto text-left">
          
          <div className="md:col-span-2">
            <span className="font-serif text-3xl font-bold text-primary mb-4 block">
              TRÉBOL <span className="text-sm font-sans tracking-widest text-[#FAFAF8]">CAFÉ</span>
            </span>
            <p className="text-text-muted text-sm max-w-sm mb-6 leading-relaxed">
              {currentLang.footer_desc}
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => notify(lang === 'es' ? 'Síguenos en Instagram @trebolcafeco' : 'Follow us @trebolcafeco', 'info')}
                className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
              >
                <span className="font-serif text-xs font-bold">IG</span>
              </button>
              <button 
                onClick={() => notify(lang === 'es' ? 'Comunícate con nuestro WhatsApp' : 'Open WhatsApp channel', 'info')}
                className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
              >
                <span className="font-serif text-xs font-bold">WA</span>
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  notify(lang === 'es' ? 'Enlace del sitio copiado al portapapeles' : 'Website link copied to clipboard!', 'success');
                }}
                className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                title="Share Website"
              >
                <Share2 size={14} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-sans text-xs font-black text-primary uppercase tracking-wider mb-4">
              {currentLang.links}
            </h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a href="#inicio" className="hover:text-primary transition-colors">{lang === 'es' ? 'Volver al Inicio' : 'Return to top'}</a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-primary transition-colors">{lang === 'es' ? 'Nuestra Historia' : 'Our Story'}</a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-primary transition-colors">{lang === 'es' ? 'Granos de Origen' : 'Origin Beans'}</a>
              </li>
              <li>
                <button onClick={() => setLoyaltyHubOpen(true)} className="hover:text-primary transition-colors text-left">
                  {lang === 'es' ? 'Mis Pases Coworking' : 'My Coworking Passes'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans text-xs font-black text-primary uppercase tracking-wider mb-4">
              {currentLang.newsletter}
            </h4>
            <p className="text-xs text-text-muted mb-4">
              {currentLang.newsletter_desc}
            </p>
            
            {isSubscribed ? (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-xl text-xs text-primary font-bold">
                ✓ {lang === 'es' ? '¡Suscrito! Usa el código TREBOLNY10 para tu 10% dto.' : 'Subscribed! Use code TREBOLNY10 for 10% off.'}
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex border-b border-border-accent pb-1">
                <input 
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-transparent border-none outline-none focus:ring-0 text-sm text-[#FAFAF8] px-0 flex-grow placeholder:text-[#FAFAF8]/25"
                  placeholder="nomada@email.com"
                />
                <button type="submit" className="text-primary hover:translate-x-1.5 transition-transform p-1">
                  <ArrowRight size={16} />
                </button>
              </form>
            )}

          </div>

        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border-subtle text-center">
          <p className="font-mono text-xs text-[#FAFAF8]/30">
            {currentLang.rights}
          </p>
        </div>
      </footer>

      {/* Right Drawer: Shopping Cart Panel */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
            
            {/* Background screen canceler */}
            <div className="absolute inset-0 cursor-pointer" onClick={() => setCartOpen(false)}></div>

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#1A1612] w-full max-w-md h-full shadow-2xl relative z-10 flex flex-col justify-between border-l border-border-subtle p-6 text-left"
            >
              
              <div>
                <div className="flex justify-between items-center border-b border-border-subtle pb-4 mb-6">
                  
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="text-primary" size={20} />
                    <h3 className="font-serif text-2xl font-bold text-[#FAFAF8]">
                      {currentLang.cart_title}
                    </h3>
                  </div>

                  <button 
                    onClick={() => setCartOpen(false)}
                    className="p-1.5 rounded-full hover:bg-bg-elevated text-text-muted hover:text-primary transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16 text-text-muted">
                    <Coffee size={40} className="mx-auto text-primary/20 mb-4 animate-bounce" />
                    <p className="text-sm">
                      {currentLang.cart_empty}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {cart.map(({ item, quantity }) => (
                      <div 
                        key={item.id}
                        className="bg-[#0A0A0A]/50 rounded-xl p-3 border border-border-subtle flex gap-3 justify-between items-center"
                      >
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-12 h-12 rounded-lg object-cover border border-border-subtle"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-[#FAFAF8] truncate">{item.title}</h4>
                          <span className="text-[10px] text-primary font-mono">${item.price.toLocaleString('es-CO')}</span>
                        </div>

                        {/* Quantity management */}
                        <div className="flex items-center gap-2 bg-bg-elevated rounded-lg px-2 py-1 border border-border-subtle shrink-0">
                          <button 
                            className="p-0.5 text-text-muted hover:text-primary"
                            onClick={() => updateCartQuantity(item.id, -1)}
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-mono text-xs text-[#FAFAF8] font-bold w-4 text-center">{quantity}</span>
                          <button 
                            className="p-0.5 text-text-muted hover:text-primary"
                            onClick={() => updateCartQuantity(item.id, 1)}
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Delete item button */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#FAFAF8]/30 hover:text-red-400 p-1 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>

                      </div>
                    ))}
                    
                    <button 
                      onClick={clearCart}
                      className="text-[10px] font-bold text-red-400/80 hover:text-[#FAFAF8] uppercase tracking-widest block ml-auto mt-2"
                    >
                      {lang === 'es' ? 'Vaciar Carrito' : 'Clear all'}
                    </button>
                  </div>
                )}
              </div>

              {/* Totals receipt overview and Checkout */}
              {cart.length > 0 && (
                <div className="border-t border-border-subtle pt-6 space-y-4">
                  
                  <div className="space-y-1.5 text-xs">
                    
                    <div className="flex justify-between">
                      <span className="text-text-muted">{currentLang.cart_subtotal}</span>
                      <span className="font-mono text-[#FAFAF8]">${cartSubtotal.toLocaleString('es-CO')}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-text-muted">{currentLang.cart_tax}</span>
                      <span className="font-mono text-[#FAFAF8]">${cartTax.toLocaleString('es-CO')}</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold border-t border-border-subtle/45 pt-2">
                      <span className="text-primary">{currentLang.cart_total}</span>
                      <span className="font-mono text-primary">${cartTotal.toLocaleString('es-CO')}</span>
                    </div>

                  </div>

                  <button
                    onClick={checkoutCartAndPasses}
                    className="w-full py-3.5 bg-primary text-on-primary font-black text-xs uppercase tracking-widest rounded-xl hover:scale-102 transition-transform shadow-lg shadow-primary/20 mt-2"
                  >
                    {currentLang.btn_checkout}
                  </button>

                  <p className="text-[9px] text-[#FAFAF8]/30 text-center uppercase tracking-widest">
                    {lang === 'es' 
                      ? 'Nuestros pases digitales se registran al instante en tu historial local.' 
                      : 'Digital passes are instantly saved to your browser history.'}
                  </p>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loyalty Tickets / My Bookings History Drawer */}
      <AnimatePresence>
        {loyaltyHubOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
            
            <div className="absolute inset-0 cursor-pointer" onClick={() => setLoyaltyHubOpen(false)}></div>

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#1A1612] w-full max-w-md h-full shadow-2xl relative z-10 flex flex-col justify-between border-l border-border-subtle p-6 text-left"
            >
              
              <div>
                <div className="flex justify-between items-center border-b border-border-subtle pb-4 mb-6">
                  
                  <div className="flex items-center gap-2">
                    <Ticket className="text-primary" size={20} />
                    <h3 className="font-serif text-2xl font-bold text-[#FAFAF8]">
                      {currentLang.history_title}
                    </h3>
                  </div>

                  <button 
                    onClick={() => setLoyaltyHubOpen(false)}
                    className="p-1.5 rounded-full hover:bg-bg-elevated text-text-muted hover:text-primary transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-20 text-text-muted">
                    <Ticket size={40} className="mx-auto text-primary/10 mb-4" />
                    <p className="text-sm">
                      {currentLang.history_no}
                    </p>
                    <p className="text-xs text-text-subtle mt-2">
                      {lang === 'es' ? 'Haz tu primera reserva de coworking o añade un café al pedido.' : 'Book a coworking layout or add specialty coffee to start.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
                    {bookings.map((booking) => (
                      <div 
                        key={booking.id}
                        className="bg-black/40 rounded-xl border border-primary/20 overflow-hidden relative"
                      >
                        {/* Upper ticket cut effect indicator */}
                        <div className="absolute top-1/2 -left-2 w-4 h-4 bg-[#1A1612] border-r border-primary/20 rounded-full -translate-y-1/2"></div>
                        <div className="absolute top-1/2 -right-2 w-4 h-4 bg-[#1A1612] border-l border-primary/20 rounded-full -translate-y-1/2"></div>

                        {/* Top layout */}
                        <div className="p-4 border-b border-dashed border-primary/20 flex justify-between items-start">
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded bg-primary/10 border border-primary/35 text-primary text-[9px] font-bold uppercase tracking-wider mb-1">
                              {currentLang.history_badge}
                            </span>
                            <h4 className="text-sm font-serif font-black text-[#FAFAF8]">{booking.workspaceType}</h4>
                            <p className="text-[10px] text-text-muted mt-0.5">Ref: {booking.code}</p>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-mono text-xs text-primary font-bold block">${booking.price.toLocaleString('es-CO')}</span>
                            <span className="text-[9px] text-[#FAFAF8]/30 font-mono">SENA Backed</span>
                          </div>
                        </div>

                        {/* Bottom details with simulated bar/QR codes */}
                        <div className="p-4 bg-[#1A1612]/50 space-y-2.5">
                          
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              <span className="text-text-subtle block">{lang === 'es' ? 'NÓMADA:' : 'NOMAD:'}</span>
                              <span className="text-text-muted font-bold truncate block">{booking.fullName}</span>
                            </div>
                            <div>
                              <span className="text-text-subtle block">{lang === 'es' ? 'FECHA:' : 'DATE:'}</span>
                              <span className="text-text-muted font-bold block">{booking.date}</span>
                            </div>
                            <div>
                              <span className="text-text-subtle block">{lang === 'es' ? 'BLOQUE:' : 'SESSION:'}</span>
                              <span className="text-text-muted font-bold block">{booking.slot}</span>
                            </div>
                            <div>
                              <span className="text-text-subtle block">{lang === 'es' ? 'CONEXIÓN:' : 'ACCESS:'}</span>
                              <span className="text-primary font-bold flex items-center gap-1">
                                <Wifi size={10} /> 300 Mbps Symmetrical
                              </span>
                            </div>
                          </div>

                          {/* Simulated high-end barcode for checkin checking */}
                          <div className="pt-2">
                            <div className="bg-[#FAFAF8] p-2 rounded flex flex-col items-center justify-center gap-1">
                              <div className="flex gap-0.5 h-10 w-full justify-between overflow-hidden">
                                {Array.from({ length: 45 }).map((_, i) => (
                                  <span 
                                    key={i} 
                                    className="bg-black shrink-0" 
                                    style={{ width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2)}px` }}
                                  ></span>
                                ))}
                              </div>
                              <span className="font-mono text-[9px] tracking-widest text-[#0A0A0A] font-bold">
                                {booking.code}-{booking.id}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-2 text-[10px] uppercase font-bold">
                            <button 
                              onClick={() => {
                                notify(lang === 'es' ? 'Presenta este código al ingresar a Trébol Café' : 'Present this code on entry to Trébol Café', 'info');
                              }}
                              className="text-primary hover:underline cursor-pointer"
                            >
                              {lang === 'es' ? 'Descargar PDF' : 'Save Pass'}
                            </button>
                            <span className="text-[#FAFAF8]/20">|</span>
                            <button 
                              onClick={() => cancelBooking(booking.id)}
                              className="text-red-400/80 hover:text-red-400 cursor-pointer"
                            >
                              {lang === 'es' ? 'Cancelar / Borrar' : 'Delete'}
                            </button>
                          </div>

                        </div>

                      </div>
                    ))}
                  </div>
                )}

              </div>

              <div className="border-t border-border-subtle pt-4 text-center">
                <button
                  onClick={() => setLoyaltyHubOpen(false)}
                  className="px-6 py-2.5 border border-border-subtle hover:border-primary text-text-muted hover:text-primary rounded-full text-xs uppercase tracking-wider font-bold w-full"
                >
                  {lang === 'es' ? 'Regresar a la Tienda' : 'Back to Experience'}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
