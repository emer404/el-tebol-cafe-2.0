import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu as MenuIcon, X, Coffee, Laptop, Wifi, MapPin, Mail, Phone, Calendar, 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, CheckCircle2, 
  Sparkles, Globe, Eye, Ticket, ChevronLeft, ChevronRight, Share2, Info, Check, Clock,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Category, MenuItem, CartItem, CoworkingBooking, ContactMessage } from './types';
import { MENU_ITEMS } from './data';

// ── WEB AUDIO SYNTHESIZER ──
class AmbientSynth {
  ctx: AudioContext | null = null;
  gain: GainNode | null = null;
  oscillators: OscillatorNode[] = [];
  noiseGain: GainNode | null = null;

  start() {
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gain = this.ctx.createGain();
      this.gain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 2.5); // Warm fade-in
      this.gain.connect(this.ctx.destination);

      // 1. Cafe Ambient Rumbling/Breeze Noise
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 180; // Extra cozy low-frequency hum
      noiseFilter.Q.value = 1.0;

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.value = 0.12;

      noise.connect(noiseFilter);
      noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.gain);
      noise.start();

      // Slow wind modulation
      const oscLfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      oscLfo.frequency.value = 0.08; // Sweeps every ~12 seconds
      lfoGain.gain.value = 50; 
      oscLfo.connect(lfoGain);
      lfoGain.connect(noiseFilter.frequency);
      oscLfo.start();

      // 2. Specialty Coffee Chords (Pentatonic E-major/C#-minor lush chords)
      const freqs = [164.81, 220.00, 277.18, 329.63, 440.00]; // E3, A3, C#4, E4, A4
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.gain) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const oscGain = this.ctx.createGain();
        oscGain.gain.value = 0.04;

        // organic volume breathing
        const oscLfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        oscLfo.frequency.value = 0.05 + idx * 0.015;
        lfoGain.gain.value = 0.02;
        oscLfo.connect(lfoGain);
        lfoGain.connect(oscGain.gain);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 600;

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(this.gain);

        osc.start();
        oscLfo.start();

        this.oscillators.push(osc, oscLfo);
      });

    } catch (err) {
      console.warn("Failed to initialize AmbientSynth:", err);
    }
  }

  stop() {
    if (this.gain && this.ctx) {
      try {
        const curTime = this.ctx.currentTime;
        this.gain.gain.cancelScheduledValues(curTime);
        this.gain.gain.setValueAtTime(this.gain.gain.value, curTime);
        this.gain.gain.linearRampToValueAtTime(0, curTime + 0.5);
        setTimeout(() => {
          this.oscillators.forEach(osc => {
            try { osc.stop(); } catch (e) {}
          });
          if (this.ctx) {
            this.ctx.close();
          }
        }, 600);
      } catch (e) {
        console.warn("Failed to stop AmbientSynth:", e);
      }
    }
  }
}

// ── CUSTOM CHIME MICRO-INTERACTION ──
export function playChime() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    // Gentle golden organic wooden/brass chime tone
    osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // slide to A5
    
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3); // fade out
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch (e) {}
}

export default function App() {
  // Locale State
  const [lang, setLang] = useState<'es' | 'en'>('es');
  
  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Mobile actions menu toggle
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
  
  // Shopping Cart state
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Active Filter Category
  const [activeCategory, setActiveCategory] = useState<Category>('Todos');
  
  // Product Detail Modal
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);


  // Contact Form State
  const [contactForm, setContactForm] = useState({
    fullName: '',
    email: '',
    interest: 'Reserva Coworking',
    message: ''
  });
  
  // Interface alerts and toast messages
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'info' }[]>([]);

  // Active Map Route Guide Details
  const [currentMapRoute, setCurrentMapRoute] = useState<'centro' | 'arqueologico' | 'pitalito'>('centro');

  // Newsletter email state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);



  // Soundscape ambient audio player
  const [ambientAudio, setAmbientAudio] = useState(false);

  // Parallax offset state for background floating decorations
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  // Life-cycle management for AmbientSynth
  const synthRef = useRef<AmbientSynth | null>(null);
  useEffect(() => {
    if (ambientAudio) {
      if (!synthRef.current) {
        synthRef.current = new AmbientSynth();
      }
      synthRef.current.start();
    } else {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
        synthRef.current = null;
      }
    };
  }, [ambientAudio]);

  // Mouse movement tracking for parallax background decorations (only on desktop hover devices)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setParallaxOffset({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2
      });
    };
    const mediaQuery = window.matchMedia('(hover: hover)');
    if (mediaQuery.matches) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Global click chime feedback (plays warm tone when clicking links/buttons, only if soundscape is ON)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (!ambientAudio) return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a')
      ) {
        playChime();
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [ambientAudio]);

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
      hero_desc: '',
      welcome: 'Bienvenido a',
      location: 'San Agustín, Huila',
      btn_catalog: 'EXPLORAR CATÁLOGO',
      btn_coworking: 'ESPACIOS COWORKING',
      esencia_title: 'Nuestra Esencia',
      esencia_header: 'Donde la especialidad se encuentra con la concentración.',
      esencia_desc: 'Nacimos bajo el apoyo del Fondo Emprender y el SENA con una misión clara: elevar la cultura del café en nuestra región mientras brindamos un refugio para mentes creativas y nómadas digitales.',
      quote: '"Nuestra visión es ser el punto de referencia para el café de origen y el trabajo colaborativo en el sur del Huila."',
      stat_origin: 'Colombiano de Origen',
      stat_wifi: 'Horario: de lunes a domingos de 8am a 12pm y 2 a 8pm',
      stat_hours: 'Horario Lunes a Sábado',
      cat_title: 'Nuestra Selección',
      cat_header: 'Menú',
      btn_add: 'AÑADIR',
      btn_reserve: 'RESERVAR',
      contact_title: 'Contáctanos',
      contact_header: '',
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
      footer_desc: '',
      links: 'Enlaces',
      newsletter: 'Newsletter',
      newsletter_desc: 'Recibe noticias sobre nuevos lotes de café y eventos de coworking.',
      rights: '© 2024 Trébol Café. Artisanal Workspace & Roastery. Todos los derechos reservados.',
      cart_title: 'Tu Pedido',
      cart_empty: 'Aún no has agregado nada a tu experiencia.',
      cart_total: 'Total',
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
      hero_desc: '',
      welcome: 'Welcome to',
      location: 'San Agustín, Huila',
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
      cat_header: 'Menu',
      btn_add: 'ADD TO CART',
      btn_reserve: 'RESERVE',
      contact_title: 'Contact Us',
      contact_header: '',
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
      footer_desc: '',
      links: 'Links',
      newsletter: 'Newsletter',
      newsletter_desc: 'Receive fresh updates on green micro-lots and coworking community events.',
      rights: '© 2024 Trébol Café. Artisanal Workspace & Roastery. All rights reserved.',
      cart_title: 'Your Order & Pass',
      cart_empty: 'Nothing added to your sensory journey yet.',
      cart_total: 'Total',
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
  const filterCategories: Category[] = [
    'Todos',
    'Bebidas Calientes',
    'Bebidas Frías',
    'Desayunos',
    'Postres',
    'Tortas',
    'Métodos Especialidad',
    'Coworking',
  ];

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
  const cartTotal = cartSubtotal;

  // Checkout - redirect to WhatsApp with order details
  const checkoutCartAndPasses = () => {
    if (cart.length === 0) return;
    
    // Generate WhatsApp message with order details
    const orderItems = cart.map(c => 
      `${c.quantity}x ${c.item.title} - $${(c.item.price * c.quantity).toLocaleString()}`
    ).join('\n');
    
    const message = [
      'Hola Trébol Café, quiero realizar el siguiente pedido:',
      '',
      '📋 *DETALLE DEL PEDIDO*',
      orderItems,
      '',
      `💵 *Total:* $${cartSubtotal.toLocaleString()}`,
      '',
      '¿Podrían confirmar mi pedido?'
    ].join('\n');
    
    // Redirect to WhatsApp
    window.open(`https://wa.me/573213298852?text=${encodeURIComponent(message)}`, '_blank');
    
    // Clear cart after sending to WhatsApp
    setCart([]);
    setCartOpen(false);
    notify(lang === 'es' ? '¡Redirigiendo a WhatsApp con tu pedido!' : 'Redirecting to WhatsApp with your order!', 'success');
  };

  // Submit contact message form - send to WhatsApp
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.fullName || !contactForm.email || !contactForm.message) {
      notify(lang === 'es' ? 'Por favor completa los campos obligatorios' : 'Please complete all required fields', 'info');
      return;
    }

    const message = [
      'Hola Trébol Café,',
      '',
      `👤 *Nombre:* ${contactForm.fullName}`,
      `📧 *Email:* ${contactForm.email}`,
      `📋 *Interés:* ${contactForm.interest}`,
      '',
      `💬 *Mensaje:*`,
      contactForm.message
    ].join('\n');

    window.open(`https://wa.me/573213298852?text=${encodeURIComponent(message)}`, '_blank');

    notify(lang === 'es' ? '¡Redirigiendo a WhatsApp con tu mensaje!' : 'Redirecting to WhatsApp with your message!', 'success');

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


  return (
    <div className="bg-[#0A0A0A] text-[#FAFAF8] min-h-screen relative font-sans-modern overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      
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

      {/* Floating Coffee Ambient Noise Controller - Desktop only */}
      <div className="hidden sm:flex fixed bottom-6 left-6 z-40 sm:bottom-8 sm:left-8">
        <div className="bg-bg-elevated/95 backdrop-blur-md px-4 py-2 border border-border-subtle rounded-full flex items-center gap-2 shadow-lg">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setAmbientAudio(!ambientAudio);
              notify(
                lang === 'es' 
                  ? (ambientAudio ? 'Música ambiental apagada' : 'Paisaje sonoro de cafetería activado (Sintetizador Web)') 
                  : (ambientAudio ? 'Soundscape off' : 'Cozy ambient soundscape activated (Web Synthesizer)'), 
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
          </motion.button>
          <span className="text-xs text-text-muted font-mono tracking-wider">
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
      <header className="fixed top-0 w-full z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10">
        <nav className="flex justify-between items-center px-12 py-6 max-w-7xl mx-auto">
          
          {/* Logo */}
          <a href="#inicio" className="flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-[#C9A84C]/30 shadow-[0_0_0_3px_rgba(201,168,76,0.08)] transition-transform group-hover:scale-105">
              <img 
                src="/img/logo.jpg" 
                alt="Trébol Café Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-serif-display text-xl font-black tracking-tighter uppercase text-primary">
              TRÉBOL <span className="text-sm font-sans-modern tracking-widest text-[#F5F5F5]">CAFÉ</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
            <a href="#inicio" className="relative text-primary hover:text-[#F2DEAA] transition-colors group py-1">
              {lang === 'es' ? 'Inicio' : 'Home'}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C9A84C]"></span>
            </a>
            <a href="#catalogo" className="relative text-white/60 hover:text-primary transition-colors group py-1">
              {lang === 'es' ? 'Catálogo' : 'Menu'}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C9A84C] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#coworking" className="relative text-white/60 hover:text-primary transition-colors group py-1">
              Coworking
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C9A84C] transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#contacto" className="relative text-white/60 hover:text-primary transition-colors group py-1">
              {lang === 'es' ? 'Contacto' : 'Contact'}
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C9A84C] transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>

          {/* Actions: Languages, Shopping Cart */}
          <div className="flex items-center gap-4">
            
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Selection Toggle */}
              <motion.button 
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  setLang(lang === 'es' ? 'en' : 'es');
                  notify(lang === 'es' ? 'Language switched to English' : 'Idioma cambiado a Español', 'info');
                }}
                className="text-primary hover:text-[#F2DEAA] p-2 rounded hover:bg-white/5 transition-colors flex items-center gap-1.5"
                title="Change Language"
                id="lang_switch_btn"
              >
                <Globe size={18} />
                <span className="text-xs font-mono font-bold tracking-widest">{lang.toUpperCase()}</span>
              </motion.button>

              {/* Shopping Cart button */}
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              </motion.button>
            </div>

            {/* Mobile Actions Menu */}
            <div className="md:hidden relative">
              <motion.button 
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setMobileActionsOpen(!mobileActionsOpen)}
                className="text-primary p-2"
                id="mobile_actions_btn"
              >
                <ShoppingBag size={20} />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-black font-mono text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {cart.reduce((ac, x) => ac + x.quantity, 0)}
                  </span>
                )}
              </motion.button>

              {/* Mobile Actions Dropdown */}
              <AnimatePresence>
                {mobileActionsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 top-full mt-2 bg-[#0A0A0A] border border-white/10 rounded-xl shadow-2xl py-2 min-w-[160px] z-50"
                  >
                    {/* Language Toggle */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setLang(lang === 'es' ? 'en' : 'es');
                        notify(lang === 'es' ? 'Language switched to English' : 'Idioma cambiado a Español', 'info');
                        setMobileActionsOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                    >
                      <Globe size={16} />
                      <span className="text-sm text-white/80">{lang === 'es' ? 'English' : 'Español'}</span>
                    </motion.button>

                    {/* Cart */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setCartOpen(true);
                        setMobileActionsOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                    >
                      <ShoppingBag size={16} />
                      <span className="text-sm text-white/80">{lang === 'es' ? 'Carrito' : 'Cart'}</span>
                      {cart.length > 0 && (
                        <span className="ml-auto bg-primary text-black font-mono text-xs font-black px-2 py-0.5 rounded">
                          {cart.reduce((ac, x) => ac + x.quantity, 0)}
                        </span>
                      )}
                    </motion.button>

                    {/* Soundscape (Mobile) */}
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setAmbientAudio(!ambientAudio);
                        notify(
                          lang === 'es' 
                            ? (ambientAudio ? 'Música ambiental apagada' : 'Paisaje sonoro de cafetería activado (Sintetizador Web)') 
                            : (ambientAudio ? 'Soundscape off' : 'Cozy ambient soundscape activated (Web Synthesizer)'), 
                          'info'
                        );
                        setMobileActionsOpen(false);
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
                    >
                      <Coffee size={16} className={ambientAudio ? 'animate-bounce text-primary' : ''} />
                      <span className="text-sm text-white/80">
                        {ambientAudio ? 'Soundscape: ON' : 'Soundscape: OFF'}
                      </span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button 
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-primary p-1.5"
              id="mobile_menu_btn"
            >
              <MenuIcon size={24} />
            </motion.button>
          </div>
        </nav>

        {/* Close mobile actions when clicking outside */}
        {mobileActionsOpen && (
          <div 
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setMobileActionsOpen(false)}
          />
        )}
      </header>

      {/* Main Content */}
      <main className="pt-24">
        
        {/* Banner Announcement - Desktop only */}
        <div className="hidden md:flex bg-gradient-to-r from-primary/10 via-[#111111] to-primary/10 text-center py-2.5 border-b border-white/10 text-[10px] tracking-[0.25em] font-mono text-primary items-center justify-center gap-2 uppercase font-black">
          <Sparkles size={12} className="animate-pulse text-[#C9A84C]" />
          {lang === 'es' 
            ? 'CULTIVANDO EXCELENCIA EN EL SUR EN ALIANZA CON SENA & FONDO EMPRENDER' 
            : 'Fostering specialty coffee alongside SENA & Fondo Emprender Huila'}
          <Sparkles size={12} className="animate-pulse text-[#C9A84C]" />
        </div>

        {/* ════════════════════════════════════════════════════════════
             HERO SECTION — Split Layout (texto izq / imagen der)
             ════════════════════════════════════════════════════════════ */}
        <section
          id="inicio"
          className="hero-split-section relative w-full overflow-hidden flex flex-col"
          style={{ minHeight: 'calc(100vh - 5.5rem)' }}
        >
          {/* ── Imagen de fondo completa (café con bokeh) ── */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: 'url("/img/hero_bg.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.55
            }}
          />

          {/* ── Degradado lateral izquierdo para separar texto ── */}
          <div className="absolute inset-0 z-0 hero-side-gradient" />

          {/* ── Elementos Decorativos con Parallax (Hojas de trébol / granos de café) ── */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-[2]">
            {/* Parallax item 1: Coffee Bean SVG */}
            <div 
              className="absolute top-1/4 left-10 md:left-20 w-8 h-12 text-[#C9A84C]/25 transition-transform duration-300 ease-out"
              style={{
                transform: `translate(${parallaxOffset.x * -25}px, ${parallaxOffset.y * -25}px) rotate(${parallaxOffset.x * 20}deg)`
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12,2C10.5,2 9,3 8,4.5C6,7.5 7,12.5 10,16.5C12,19.2 13.5,20.8 15,20.8C16.5,20.8 18,19.8 19,18.3C21,15.3 20,10.3 17,6.3C15,3.6 13.5,2 12,2M12,3.5C13,3.5 14.1,4.5 15.6,6.5C18.1,9.8 18.9,13.8 17.6,15.7C16.8,17 15.6,17.8 14.7,17.8C13.7,17.8 12.6,16.8 11.1,14.8C8.6,11.5 7.8,7.5 9.1,5.6C9.9,4.3 11.1,3.5 12,3.5Z" />
              </svg>
            </div>
            
            {/* Parallax item 2: Clover Leaf (Trébol) SVG */}
            <div 
              className="absolute bottom-1/3 left-[45%] w-10 h-10 text-[#C9A84C]/20 transition-transform duration-300 ease-out"
              style={{
                transform: `translate(${parallaxOffset.x * 35}px, ${parallaxOffset.y * 35}px) rotate(${parallaxOffset.y * -30}deg)`
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12,9.5C11.3,9.5 10.7,9.2 10.2,8.7C9.7,8.2 9.5,7.6 9.5,6.9C9.5,5.2 10.6,4.1 12,4.1C13.4,4.1 14.5,5.2 14.5,6.9C14.5,7.6 14.3,8.2 13.8,8.7C13.3,9.2 12.7,9.5 12,9.5M12,14.5C11.3,14.5 10.7,14.2 10.2,13.7C9.7,13.2 9.5,12.6 9.5,11.9C9.5,10.2 10.6,9.1 12,9.1C13.4,9.1 14.5,10.2 14.5,11.9C14.5,12.6 14.3,13.2 13.8,13.7C13.3,14.2 12.7,14.5 12,14.5M17,12C17,11.3 16.7,10.7 16.2,10.2C15.7,9.7 15.1,9.5 14.4,9.5C12.7,9.5 11.6,10.6 11.6,12C11.6,13.4 12.7,14.5 14.4,14.5C15.1,14.5 15.7,14.3 16.2,13.8C16.7,13.3 17,12.7 17,12M7,12C7,11.3 6.7,10.7 6.2,10.2C5.7,9.7 5.1,9.5 4.4,9.5C2.7,9.5 1.6,10.6 1.6,12C1.6,13.4 2.7,14.5 4.4,14.5C5.1,14.5 5.7,14.3 6.2,13.8C6.7,13.3 7,12.7 7,12" />
              </svg>
            </div>

            {/* Parallax item 3: Coffee Bean SVG */}
            <div 
              className="absolute top-1/3 right-[15%] w-12 h-14 text-[#C9A84C]/15 transition-transform duration-300 ease-out"
              style={{
                transform: `translate(${parallaxOffset.x * -40}px, ${parallaxOffset.y * -40}px) rotate(${parallaxOffset.x * -15}deg)`
              }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12,2C10.5,2 9,3 8,4.5C6,7.5 7,12.5 10,16.5C12,19.2 13.5,20.8 15,20.8C16.5,20.8 18,19.8 19,18.3C21,15.3 20,10.3 17,6.3C15,3.6 13.5,2 12,2M12,3.5C13,3.5 14.1,4.5 15.6,6.5C18.1,9.8 18.9,13.8 17.6,15.7C16.8,17 15.6,17.8 14.7,17.8C13.7,17.8 12.6,16.8 11.1,14.8C8.6,11.5 7.8,7.5 9.1,5.6C9.9,4.3 11.1,3.5 12,3.5Z" />
              </svg>
            </div>
          </div>

          {/* ══ CONTENEDOR PRINCIPAL ══════════════════════════════════ */}
          <div className="relative z-10 max-w-[1400px] mx-auto flex flex-col lg:flex-row flex-1 w-full">

            {/* ────────────── COLUMNA IZQUIERDA: Texto ────────────── */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-14 lg:px-16 py-6 lg:py-6 lg:max-w-[54%]">

              {/* Badge Ubicación */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="hero-location-badge mb-6"
              >
                <MapPin size={13} className="text-[#C9A84C]" />
                <span>{currentLang.location}</span>
              </motion.div>

              {/* Bienvenido a */}
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                className="hero-welcome-label"
              >
                {currentLang.welcome}
              </motion.span>

              {/* Título principal TRÉBOL CAFÉ */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6, type: 'spring', stiffness: 80 }}
                className="hero-main-title"
              >
                TRÉBOL CAFÉ
              </motion.h1>

              {/* Subtítulo */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="hero-subtitle-text"
              >
                {lang === 'es'
                  ? 'Café de especialidad y coworking\nen el corazón de San Agustín.'
                  : 'Specialty coffee & coworking\nin the heart of San Agustín.'}
              </motion.p>



              {/* ── CTA Buttons ── */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="flex flex-wrap gap-3 mt-8"
              >
                {/* Explorar Catálogo */}
                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href="#catalogo"
                  className="hero-cta-primary"
                  id="hero_btn_catalogo"
                >
                  <Coffee size={15} />
                  <span>{lang === 'es' ? 'EXPLORAR CATÁLOGO' : 'EXPLORE MENU'}</span>
                </motion.a>

                {/* Espacios Coworking */}
                <motion.a
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  href="#coworking"
                  className="hero-cta-secondary"
                  id="hero_btn_coworking"
                >
                  <Laptop size={15} />
                  <span>{lang === 'es' ? 'ESPACIOS COWORKING' : 'COWORKING SPACES'}</span>
                </motion.a>
              </motion.div>
            </div>

            {/* ────────────── COLUMNA DERECHA: Imagen ────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: 'spring', stiffness: 60 }}
              className="hidden lg:flex flex-1 items-center justify-center relative"
            >
              {/* Glow detrás de la imagen */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[480px] h-[480px] rounded-full bg-[#C9A84C]/8 blur-[90px]" />
              </div>

              {/* Imagen principal del café */}
              <div className="hero-image-wrapper">
                <img
                  src="/img/hero_bg.png"
                  alt="Trébol Café — especialidad y coworking"
                  className="hero-hero-img"
                />
                {/* Overlay degradado en bordes */}
                <div className="hero-img-edge-fade" />
              </div>
            </motion.div>
          </div>

          {/* ══ FRANJA INFERIOR DE FEATURES ══════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="hero-features-bar relative z-10"
          >
            {/* Mobile: Horizontal scroll */}
            <div className="max-w-[1400px] mx-auto px-4 py-6 flex md:hidden overflow-x-auto snap-x snap-mandatory scrollbar-hide border-y border-white/5 bg-[#0A0A0A]/90 backdrop-blur-sm gap-8 rounded-t-[40px] rounded-b-[40px] my-4">

              <div className="hero-feature-item flex-shrink-0 snap-start">
                <Coffee size={20} className="hero-feature-icon" />
                <div>
                  <p className="hero-feature-title">{lang === 'es' ? 'CAFÉ DE ESPECIALIDAD' : 'SPECIALTY COFFEE'}</p>
                  <p className="hero-feature-desc">{lang === 'es' ? 'Granos 100% huilenses' : '100% single-origin beans'}</p>
                </div>
              </div>

              <div className="hero-feature-item flex-shrink-0 snap-start">
                <Wifi size={20} className="hero-feature-icon" />
                <div>
                  <p className="hero-feature-title">{lang === 'es' ? 'WIFI DE ALTA VELOCIDAD' : 'HIGH-SPEED WIFI'}</p>
                  <p className="hero-feature-desc">{lang === 'es' ? 'Ideal para trabajar y estudiar' : 'Perfect for work & study'}</p>
                </div>
              </div>

              <div className="hero-feature-item flex-shrink-0 snap-start">
                <Users size={20} className="hero-feature-icon" />
                <div>
                  <p className="hero-feature-title">{lang === 'es' ? 'ESPACIOS COWORKING' : 'COWORKING SPACES'}</p>
                  <p className="hero-feature-desc">{lang === 'es' ? 'Ambientes cómodos y modernos' : 'Comfortable & modern'}</p>
                </div>
              </div>

              <div className="hero-feature-item flex-shrink-0 snap-start">
                <svg viewBox="0 0 24 24" fill="currentColor" className="hero-feature-icon" style={{width:20,height:20}}>
                  <path d="M12 2C10.5 2 9.5 3 9.5 4.5C9.5 6 10.5 7 12 8C13.5 7 14.5 6 14.5 4.5C14.5 3 13.5 2 12 2ZM22 12C22 10.5 21 9.5 19.5 9.5C18 9.5 17 10.5 16 12C17 13.5 18 14.5 19.5 14.5C21 14.5 22 13.5 22 12ZM12 22C13.5 22 14.5 21 14.5 19.5C14.5 18 13.5 17 12 16C10.5 17 9.5 18 9.5 19.5C9.5 21 10.5 22 12 22ZM2 12C2 13.5 3 14.5 4.5 14.5C6 14.5 7 13.5 8 12C7 10.5 6 9.5 4.5 9.5C3 9.5 2 10.5 2 12Z"/>
                </svg>
                <div>
                  <p className="hero-feature-title">{lang === 'es' ? 'COMPROMISO LOCAL' : 'LOCAL COMMITMENT'}</p>
                  <p className="hero-feature-desc">{lang === 'es' ? 'Apoyamos talento y comunidad' : 'Supporting talent & community'}</p>
                </div>
              </div>

            </div>

            {/* Desktop: Original grid */}
            <div className="hidden md:block">
              <div className="max-w-[1400px] mx-auto px-14 py-11 grid grid-cols-4 gap-4">
                <div className="hero-feature-item">
                  <Coffee size={20} className="hero-feature-icon" />
                  <div>
                    <p className="hero-feature-title">{lang === 'es' ? 'CAFÉ DE ESPECIALIDAD' : 'SPECIALTY COFFEE'}</p>
                    <p className="hero-feature-desc">{lang === 'es' ? 'Granos 100% huilenses' : '100% single-origin beans'}</p>
                  </div>
                </div>

                <div className="hero-feature-item">
                  <Wifi size={20} className="hero-feature-icon" />
                  <div>
                    <p className="hero-feature-title">{lang === 'es' ? 'WIFI DE ALTA VELOCIDAD' : 'HIGH-SPEED WIFI'}</p>
                    <p className="hero-feature-desc">{lang === 'es' ? 'Ideal para trabajar y estudiar' : 'Perfect for work & study'}</p>
                  </div>
                </div>

                <div className="hero-feature-item">
                  <Users size={20} className="hero-feature-icon" />
                  <div>
                    <p className="hero-feature-title">{lang === 'es' ? 'ESPACIOS COWORKING' : 'COWORKING SPACES'}</p>
                    <p className="hero-feature-desc">{lang === 'es' ? 'Ambientes cómodos y modernos' : 'Comfortable & modern'}</p>
                  </div>
                </div>

                <div className="hero-feature-item">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="hero-feature-icon" style={{width:20,height:20}}>
                    <path d="M12 2C10.5 2 9.5 3 9.5 4.5C9.5 6 10.5 7 12 8C13.5 7 14.5 6 14.5 4.5C14.5 3 13.5 2 12 2ZM22 12C22 10.5 21 9.5 19.5 9.5C18 9.5 17 10.5 16 12C17 13.5 18 14.5 19.5 14.5C21 14.5 22 13.5 22 12ZM12 22C13.5 22 14.5 21 14.5 19.5C14.5 18 13.5 17 12 16C10.5 17 9.5 18 9.5 19.5C9.5 21 10.5 22 12 22ZM2 12C2 13.5 3 14.5 4.5 14.5C6 14.5 7 13.5 8 12C7 10.5 6 9.5 4.5 9.5C3 9.5 2 10.5 2 12Z"/>
                  </svg>
                  <div>
                    <p className="hero-feature-title">{lang === 'es' ? 'COMPROMISO LOCAL' : 'LOCAL COMMITMENT'}</p>
                    <p className="hero-feature-desc">{lang === 'es' ? 'Apoyamos talento y comunidad' : 'Supporting talent & community'}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Curated Catalog Section */}
        <section id="catalogo" className="py-24 px-2 md:px-12 border-t border-white/10 relative overflow-hidden"
  style={{
    background: `
      linear-gradient(180deg, rgba(10, 10, 10, 0.85) 0%, rgba(17, 14, 12, 0.88) 50%, rgba(10, 10, 10, 0.92) 100%),
      url("/img/hero_bg.png") center / cover no-repeat
    `
  }}
>
          <div className="w-full md:max-w-7xl md:mx-auto">
            
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 18, stiffness: 70 }}
              className="text-center mb-16 px-4"
            >
              <span className="font-mono text-xs text-[#C9A84C] uppercase tracking-[0.25em] font-black block mb-4">
                [ {currentLang.cat_title} ]
              </span>

              {/* Filter Category Buttons - Desktop only */}
              <div className="max-w-2xl mx-auto hidden md:block text-center">
                <div className="flex flex-wrap justify-center gap-3">
                  {filterCategories.map((cat) => (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        notify(lang === 'es' ? `Filtrando por: ${cat}` : `Filtering by: ${cat}`, 'info');
                      }}
                      className={`px-6 py-3 border text-[11px] tracking-widest font-black uppercase transition-all duration-300 rounded-none cursor-pointer ${
                        activeCategory === cat
                          ? 'bg-[#C9A84C] border-[#C9A84C] text-black scale-102 shadow-lg shadow-[#C9A84C]/10'
                          : 'bg-[#111111] border-white/10 text-white/60 hover:text-[#C9A84C] hover:border-[#C9A84C]'
                      }`}
                    >
                      {lang === 'en' && cat === 'Todos' ? 'All' : cat}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Menu Grid - Desktop: Grid, Mobile: Netflix style horizontal rows */}
            <div>
              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((product) => {
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.93 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.93 }}
                        whileHover={{ y: -6, borderColor: 'rgba(201, 168, 76, 0.45)' }}
                        transition={{ duration: 0.3 }}
                        className="group relative bg-[#111111] rounded-xl overflow-hidden border border-white/10 transition-all flex flex-col justify-between"
                        key={product.id}
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


                            {/* Quick info tag on hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="px-4 py-2 bg-[#C9A84C] text-black text-xs font-black uppercase tracking-widest rounded-lg shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <Eye size={12} />
                                {lang === 'es' ? 'Ver Detalles' : 'View Spec'}
                              </span>
                            </div>
                          </div>

                          <div className="p-5">
                            <div className="flex justify-between items-start gap-2 mb-2">
                              <h4 className="font-serif-elegant text-lg text-[#C9A84C] font-black uppercase tracking-tight hover:underline cursor-pointer leading-tight" onClick={() => setSelectedProduct(product)}>
                                {product.title}
                              </h4>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                              <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 block">[ {product.category} ]</span>
                              <span className="font-mono text-sm font-black text-white bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg shrink-0">
                                {product.price === 0 ? (lang === 'es' ? 'Consultar' : 'Ask us') : `$${product.price.toLocaleString('es-CO')}`}
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
                                setContactForm(prev => ({
                                  ...prev,
                                  interest: 'Reserva Coworking',
                                  message: `Hola, deseo reservar el espacio: ${product.title}.`
                                }));
                                const targetElement = document.getElementById('contacto');
                                if (targetElement) {
                                  targetElement.scrollIntoView({ behavior: 'smooth' });
                                }
                                notify(lang === 'es' ? `Completando pase: ${product.title}` : `Setting desk: ${product.title}`, 'info');
                              }}
                              className="w-full py-2.5 font-sans-modern text-xs font-bold border border-primary rounded-full text-primary hover:bg-primary hover:text-on-primary transition-all uppercase tracking-widest"
                            >
                              {currentLang.btn_reserve}
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(product)}
                              className="w-full py-2.5 font-sans-modern text-xs font-bold bg-primary/10 border border-border-accent rounded-full text-primary hover:bg-primary hover:text-on-primary hover:shadow-lg hover:shadow-primary/10 transition-all uppercase tracking-widest"
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

              {/* Mobile: Netflix style horizontal rows - 7 category rows */}
              <div className="md:hidden space-y-6">
                {filterCategories.filter(cat => cat !== 'Todos').map((category) => {
                  const categoryItems = filteredItems.filter(product => product.category === category);
                  if (categoryItems.length === 0) return null;
                  
                  return (
                    <div key={category} className="relative">
                      <h3 className="text-xs font-mono text-[#C9A84C] uppercase tracking-[0.2em] font-black mb-3 ml-1">
                        {category}
                      </h3>
                      <div className="catalog-scroll-container flex overflow-x-auto gap-3 pb-4 snap-x snap-mandatory scrollbar-hide">
                        <AnimatePresence mode="popLayout">
                          {categoryItems.map((product) => {
                            return (
                              <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.93 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.93 }}
                                whileHover={{ y: -6, borderColor: 'rgba(201, 168, 76, 0.45)' }}
                                transition={{ duration: 0.3 }}
                                className="flex-shrink-0 w-48 snap-start group relative bg-[#111111] rounded-xl overflow-hidden border border-white/10 transition-all flex flex-col justify-between"
                                key={product.id}
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


                                    {/* Quick info tag on hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <span className="px-3 py-1.5 bg-[#C9A84C] text-black text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                        <Eye size={10} />
                                        {lang === 'es' ? 'Ver' : 'View'}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="p-3">
                                    <div className="flex justify-between items-start gap-1 mb-1">
                                      <h4 className="font-serif-elegant text-sm text-[#C9A84C] font-black uppercase tracking-tight hover:underline cursor-pointer leading-tight" onClick={() => setSelectedProduct(product)}>
                                        {product.title}
                                      </h4>
                                    </div>

                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-[8px] uppercase tracking-widest font-bold text-white/40 block">{
                                        product.category === 'Bebidas Calientes' ? (lang === 'es' ? 'Caliente' : 'Hot') :
                                        product.category === 'Bebidas Frías' ? (lang === 'es' ? 'Fría' : 'Cold') :
                                        product.category === 'Desayunos' ? (lang === 'es' ? 'Desayuno' : 'Breakfast') :
                                        product.category === 'Postres' ? (lang === 'es' ? 'Postre' : 'Dessert') :
                                        product.category === 'Tortas' ? (lang === 'es' ? 'Torta' : 'Cake') :
                                        product.category === 'Métodos Especialidad' ? (lang === 'es' ? 'Especial' : 'Special') :
                                        product.category === 'Coworking' ? (lang === 'es' ? 'Coworking' : 'Coworking') :
                                        product.category
                                      }</span>
                                      <span className="font-mono text-[10px] font-black text-white bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-lg shrink-0">
                                        {product.price === 0 ? (lang === 'es' ? '?' : '?') : `$${product.price.toLocaleString('es-CO')}`}
                                      </span>
                                    </div>

                                    <p className="text-[10px] text-white/60 mb-2 line-clamp-1 h-3">
                                      {product.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="p-3 pt-0">
                                  {product.category === 'Coworking' ? (
                                    <button
                                      onClick={() => {
                                        setContactForm(prev => ({
                                          ...prev,
                                          interest: 'Reserva Coworking',
                                          message: `Hola, deseo reservar el espacio: ${product.title}.`
                                        }));
                                        const targetElement = document.getElementById('contacto');
                                        if (targetElement) {
                                          targetElement.scrollIntoView({ behavior: 'smooth' });
                                        }
                                        notify(lang === 'es' ? `Completando pase: ${product.title}` : `Setting desk: ${product.title}`, 'info');
                                      }}
                                      className="w-full py-2 font-sans-modern text-[10px] font-bold border border-primary rounded-full text-primary hover:bg-primary hover:text-on-primary transition-all uppercase tracking-widest"
                                    >
                                      {currentLang.btn_reserve}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => addToCart(product)}
                                      className="w-full py-2 font-sans-modern text-[10px] font-bold bg-primary/10 border border-border-accent rounded-full text-primary hover:bg-primary hover:text-on-primary hover:shadow-lg hover:shadow-primary/10 transition-all uppercase tracking-widest"
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
                  );
                })}
              </div>
            </div>

          </div>
        </section>

        {/* Dynamic Interactive Features: Product Explorer Modal */}
        <AnimatePresence>
          {selectedProduct && (
            <div className="fixed inset-0 bg-[#0A0A0A]/92 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto">
              <motion.div 
                initial={{ scale: 0.93, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.93, opacity: 0, y: 24 }}
                transition={{ type: 'spring', damping: 22, stiffness: 200 }}
                className="bg-[#1A1612] max-w-5xl w-full rounded-2xl overflow-hidden border border-border-accent shadow-2xl my-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  
                  {/* Image side */}
                  <div className="relative aspect-square md:aspect-auto md:h-full min-h-[420px] md:min-h-[560px]">
                    <img 
                      className="w-full h-full object-cover" 
                      src={selectedProduct.image} 
                      alt={selectedProduct.title} 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/10 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-left">
                      <span className="text-[11px] font-mono tracking-widest uppercase text-primary font-bold bg-black/70 px-3 py-1.5 rounded-full border border-primary/30">
                        {lang === 'es' ? 'COSECHA SELECCIONADA' : 'CURATED HARVEST'}
                      </span>
                      <h3 className="font-serif-display text-3xl font-bold mt-3 text-[#FAFAF8] leading-tight drop-shadow-lg">
                        {selectedProduct.title}
                      </h3>
                    </div>
                  </div>

                  {/* Info side */}
                  <div className="p-8 md:p-10 flex flex-col justify-between">
                    
                    <div>
                      {/* Header: category + close */}
                      <div className="flex justify-between items-center mb-6">
                        <span className="px-4 py-1.5 bg-primary/10 text-primary text-[11px] font-bold tracking-widest uppercase rounded-full border border-primary/25">
                          {selectedProduct.category}
                        </span>
                        <button 
                          onClick={() => setSelectedProduct(null)}
                          className="text-[#FAFAF8]/50 hover:text-primary p-2 rounded-full hover:bg-bg-elevated transition-colors"
                        >
                          <X size={22} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-3xl font-black text-primary font-mono mb-4 tracking-tight">
                        {selectedProduct.price === 0 ? (lang === 'es' ? 'Precio al consultar' : 'Price on request') : `$${selectedProduct.price.toLocaleString('es-CO')}`}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-[#FAFAF8]/75 leading-relaxed mb-7">
                        {selectedProduct.description}
                      </p>

                      {/* Technical Batch Specification */}
                      {selectedProduct.details && (
                        <div className="bg-[#0A0A0A]/60 rounded-xl p-5 border border-border-subtle mb-6 text-left">
                          <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#FAFAF8] mb-4 flex items-center gap-2">
                            <Info size={14} className="text-primary" />
                            {lang === 'es' ? 'Ficha de Especialidad' : 'Specialty Datasheet'}
                          </h5>
                          <ul className="space-y-2.5 text-xs text-text-muted">
                            {selectedProduct.details.origin && (
                              <li className="flex gap-2">
                                <strong className="text-primary shrink-0">{lang === 'es' ? 'Origen:' : 'Origin:'}</strong>
                                <span>{selectedProduct.details.origin}</span>
                              </li>
                            )}
                            {selectedProduct.details.intensity && (
                              <li className="flex gap-2">
                                <strong className="text-primary shrink-0">{lang === 'es' ? 'Perfil:' : 'Profile:'}</strong>
                                <span>{selectedProduct.details.intensity}</span>
                              </li>
                            )}
                            {selectedProduct.details.allergens && (
                              <li className="flex gap-2">
                                <strong className="text-primary shrink-0">{lang === 'es' ? 'Alérgenos:' : 'Allergens:'}</strong>
                                <span>{selectedProduct.details.allergens}</span>
                              </li>
                            )}
                            {selectedProduct.details.wifi && (
                              <li className="flex gap-2">
                                <strong className="text-primary shrink-0">{lang === 'es' ? 'WiFi:' : 'Bandwidth:'}</strong>
                                <span>{selectedProduct.details.wifi}</span>
                              </li>
                            )}
                            {selectedProduct.details.compañía && (
                              <li className="flex gap-2">
                                <strong className="text-primary shrink-0">{lang === 'es' ? 'Incluye:' : 'Includes:'}</strong>
                                <span>{selectedProduct.details.compañía}</span>
                              </li>
                            )}
                            {(selectedProduct.details as any).nota && (
                              <li className="flex gap-2">
                                <strong className="text-primary shrink-0">{lang === 'es' ? 'Nota:' : 'Note:'}</strong>
                                <span>{(selectedProduct.details as any).nota}</span>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() => {
                          addToCart(selectedProduct);
                          setSelectedProduct(null);
                        }}
                        className="flex-1 py-4 bg-primary text-on-primary font-black text-sm uppercase tracking-widest rounded-full hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                      >
                        {selectedProduct.category === 'Coworking' ? currentLang.btn_reserve : currentLang.btn_add}
                      </button>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="px-8 py-4 border border-border-subtle text-text-muted hover:text-[#FAFAF8] font-bold text-sm uppercase tracking-widest rounded-full transition-colors"
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
        <section id="contacto" className="py-24 px-12 max-w-7xl mx-auto border-t border-white/10"
  style={{
    background: 'linear-gradient(180deg, #0A0A0A 0%, #12100E 100%)'
  }}
>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left direct contact details */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 20, stiffness: 80 }}
              className="lg:col-span-5 flex flex-col justify-between"
            >
              
              <div>
                <span className="font-mono text-xs text-[#C9A84C] uppercase tracking-[0.25em] font-black block mb-4">
                  [ {currentLang.contact_title} ]
                </span>
                <h2 className="font-serif-display text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6">
                  {currentLang.contact_header}
                </h2>

                <div className="space-y-4 mb-8">
                  
                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-none bg-[#C9A84C]/10 flex items-center justify-center border border-white/10 text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-black transition-all">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-[#C9A84C]">
                        {lang === 'es' ? 'Visítanos' : 'Come Over'}
                      </span>
                      <span className="text-sm text-white/70">Vereda El Tablon, San Agustín, Huila</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-none bg-[#C9A84C]/10 flex items-center justify-center border border-white/10 text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-black transition-all">
                      <Mail size={20} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-[#C9A84C]">Email</span>
                      <span className="text-sm text-white/70">eltrebolcafecoworking@gmail.com</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-none bg-[#C9A84C]/10 flex items-center justify-center border border-white/10 text-[#C9A84C] group-hover:bg-[#C9A84C] group-hover:text-black transition-all">
                      <Phone size={20} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-[#C9A84C]">
                        {lang === 'es' ? 'Llámanos' : 'Phone'}
                      </span>
                      <span className="text-sm text-white/70">3213298852</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Google Maps Link */}
              <div className="relative rounded-none overflow-hidden border border-white/10 h-64 group bg-[#111111] shadow-2xl flex flex-col items-center justify-center p-6">
                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-all bg-[radial-gradient(#C9A84C_1.3px,transparent_1.3px)] [background-size:16px_16px]"></div>
                
                <div className="z-10 text-center">
                  <MapPin size={40} className="text-[#C9A84C] mx-auto mb-4" />
                  <h4 className="text-[10px] font-mono font-black tracking-widest text-[#C9A84C] uppercase mb-2">
                    [ {currentLang.map_title} ]
                  </h4>
                  <p className="text-[11px] text-white/50 mb-6 max-w-sm">
                    {currentLang.map_desc}
                  </p>
                  
                  <a
                    href="https://maps.app.goo.gl/iku5XDufX6TQtdCv6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#C9A84C] text-black px-6 py-3 text-xs font-bold uppercase tracking-wider rounded hover:bg-[#F2DEAA] transition-colors"
                  >
                    <MapPin size={14} />
                    {lang === 'es' ? 'Ver ubicación en Google Maps' : 'View location on Google Maps'}
                  </a>
                </div>
              </div>

            </motion.div>

            {/* Right Booking & Messages central hub form */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', damping: 20, stiffness: 80 }}
              className="lg:col-span-7"
            >
              <div className="bg-[#111111] p-8 rounded-none border border-white/10 relative overflow-hidden text-left">
                
                <div className="absolute top-0 right-0 w-36 h-36 bg-[#C9A84C]/5 blur-[55px] rounded-none"></div>

                {/* Form Header */}
                <h3 className="text-xs font-black uppercase tracking-widest text-[#C9A84C] mb-6">
                  {lang === 'es' ? 'Enviar Mensaje' : 'Send Message'}
                </h3>

                {/* Contact form */}
                <form onSubmit={handleContactSubmit} className="space-y-4">
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-white/50 tracking-widest block">
                        {currentLang.form_full_name} <span className="text-[#C9A84C]">*</span>
                      </label>
                      <input 
                        type="text"
                        required
                        value={contactForm.fullName}
                        onChange={(e) => setContactForm(p => ({ ...p, fullName: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 focus:border-[#C9A84C] rounded-none px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
                        placeholder="Juan Andrés Huila..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-white/50 tracking-widest block">
                          {currentLang.form_email} <span className="text-[#C9A84C]">*</span>
                        </label>
                        <input 
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))}
                          className="w-full bg-black/50 border border-white/10 focus:border-[#C9A84C] rounded-none px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20"
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
                          className="w-full bg-black/50 border border-white/10 focus:border-[#C9A84C] rounded-none px-4 py-3 text-sm text-white outline-none transition-all cursor-pointer"
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
                        {currentLang.form_msg} <span className="text-[#C9A84C]">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={contactForm.message}
                        onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))}
                        className="w-full bg-black/50 border border-white/10 focus:border-[#C9A84C] rounded-none px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/20 resize-none"
                        placeholder={lang === 'es' ? '¿En qué podemos ayudarte a emprender o colaborar?' : 'Tell us how we can help your remote work journey...'}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="w-full py-4 bg-[#C9A84C] text-black font-sans-modern text-xs font-black rounded-none uppercase tracking-widest transition-all mt-6 shadow-lg shadow-[#C9A84C]/10 cursor-pointer"
                    >
                      {lang === 'es' ? 'ENVIAR POR WHATSAPP' : 'SEND VIA WHATSAPP'}
                    </motion.button>

                  </form>
              </div>
            </motion.div>

          </div>
        </section>

        {/* Co-founders & SENA / Fondo Emprender Institutional Backing */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', damping: 20, stiffness: 80 }}
          className="py-16 border-t border-border-subtle bg-black"
        >
          <div className="max-w-7xl mx-auto px-6 text-center">
            
            <span className="font-mono text-xs uppercase text-text-muted tracking-widest mb-8 block font-black">
              {currentLang.respaldo}
            </span>

            {/* Institutional support logos from original brand - Horizontal scroll for all */}
            <div className="logo-institucionales flex justify-center items-center gap-6 md:gap-12 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 bg-[#0A0A0A]/90 backdrop-blur-sm">
              <div className="flex-shrink-0 snap-start">
                <img src="/img/logo_institucionales/1.jpg" alt="Colombia Potencia de la Vida" className="h-16 md:h-20 w-28 md:w-32 rounded-[8px md:rounded-[10px] object-cover border border-[#C9A84C]/30 shadow-[0_0_0_3px_rgba(201,168,76,0.08)]" />
              </div>
              <div className="flex-shrink-0 snap-start">
                <img src="/img/logo_institucionales/2.jpg" alt="SENA" className="h-16 md:h-20 w-28 md:w-32 rounded-[8px md:rounded-[10px] object-cover border border-[#C9A84C]/30 shadow-[0_0_0_3px_rgba(201,168,76,0.08)]" />
              </div>
              <div className="flex-shrink-0 snap-start">
                <img src="/img/logo_institucionales/3.jpg" alt="Fondo Emprender" className="h-16 md:h-20 w-28 md:w-32 rounded-[8px md:rounded-[10px] object-cover border border-[#C9A84C]/30 shadow-[0_0_0_3px_rgba(201,168,76,0.08)]" />
              </div>
              <div className="flex-shrink-0 snap-start">
                <img src="/img/logo_institucionales/4.jpg" alt="Institución 4" className="h-16 md:h-20 w-44 md:w-56 rounded-[8px md:rounded-[10px] object-cover border border-[#C9A84C]/30 shadow-[0_0_0_3px_rgba(201,168,76,0.08)]" />
              </div>
            </div>

          </div>
        </motion.section>

      </main>

      {/* Footer */}
      <footer className="bg-[#0E0E0E] py-16 border-t border-border-subtle">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-6 max-w-7xl mx-auto text-left">
          
          <div className="md:col-span-2 hidden md:block">
            <span className="font-serif-display text-3xl font-bold text-primary mb-4 block">
              TRÉBOL <span className="text-sm font-sans-modern tracking-widest text-[#FAFAF8]">CAFÉ</span>
            </span>
            <p className="text-text-muted text-sm max-w-sm mb-6 leading-relaxed">
              {currentLang.footer_desc}
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => notify(lang === 'es' ? 'Síguenos en Instagram @trebolcafeco' : 'Follow us @trebolcafeco', 'info')}
                className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
              >
                <span className="font-serif-elegant text-xs font-bold">IG</span>
              </button>
              <button 
                onClick={() => notify(lang === 'es' ? 'Comunícate con nuestro WhatsApp' : 'Open WhatsApp channel', 'info')}
                className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
              >
                <span className="font-serif-elegant text-xs font-bold">WA</span>
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
            <h4 className="font-sans-modern text-xs font-black text-primary uppercase tracking-wider mb-4">
              {currentLang.links}
            </h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a href="#inicio" className="hover:text-primary transition-colors">{lang === 'es' ? 'Volver al Inicio' : 'Return to top'}</a>
              </li>
              <li>
                <a href="#catalogo" className="hover:text-primary transition-colors">{lang === 'es' ? 'Granos de Origen' : 'Origin Beans'}</a>
              </li>
              <li>
                <a href="#coworking" className="hover:text-primary transition-colors text-left">
                  {lang === 'es' ? 'Mis Pases Coworking' : 'My Coworking Passes'}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-sans-modern text-xs font-black text-primary uppercase tracking-wider mb-4">
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
            © 2026 Trébol Café.
          </p>
        </div>
      </footer>

      {/* Right Drawer: Shopping Cart Panel */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-[60] flex justify-end">
            
            {/* Background screen canceler / Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />

            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-[#0A0A0A] w-full max-w-md h-full shadow-2xl relative z-10 flex flex-col justify-between border-l border-white/10 p-6 text-left"
            >
              
              <div>
                <div className="flex justify-between items-center border-b border-border-subtle pb-4 mb-6">
                  
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="text-primary" size={20} />
                    <h3 className="font-serif-display text-2xl font-bold text-[#FAFAF8]">
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

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Side menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="md:hidden fixed top-0 left-0 h-full w-72 bg-[#0A0A0A] border-r border-white/10 z-[100] flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <span className="font-serif-display text-xl font-bold text-primary">TRÉBOL CAFÉ</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5 text-white/60 hover:text-primary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 p-6 space-y-2">
                <a href="#inicio" onClick={() => setMobileMenuOpen(false)} className="block py-3 tracking-widest text-[#F5F5F5] hover:text-primary transition-colors font-bold uppercase border-b border-white/5">{currentLang.subtitle}</a>
                <a href="#catalogo" onClick={() => setMobileMenuOpen(false)} className="block py-3 tracking-widest text-[#F5F5F5] hover:text-primary transition-colors">{lang === 'es' ? 'Catálogo / Menú' : 'Menu & Coffee'}</a>
                <a href="#coworking" onClick={() => setMobileMenuOpen(false)} className="block py-3 tracking-widest text-[#F5F5F5] hover:text-primary transition-colors">Coworking Space</a>
                <a href="#contacto" onClick={() => setMobileMenuOpen(false)} className="block py-3 tracking-widest text-[#F5F5F5] hover:text-primary transition-colors">{lang === 'es' ? 'Contacto y Reservas' : 'Contact & Reserv.'}</a>
              </div>

              <div className="p-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#C9A84C]/30">
                    <img src="/img/logo.jpg" alt="Trébol Café" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40">San Agustín, Huila</p>
                    <p className="text-xs text-primary font-bold">Vereda El Tablón</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Dynamic Interactive Features: Product Explorer Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 bg-[#0A0A0A]/92 backdrop-blur-md z-[60] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.93, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.93, opacity: 0, y: 24 }}
              transition={{ type: 'spring', damping: 22, stiffness: 200 }}
              className="bg-[#1A1612] max-w-5xl w-full rounded-2xl overflow-hidden border border-border-accent shadow-2xl my-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                
                {/* Image side */}
                <div className="relative aspect-square md:aspect-auto md:h-full min-h-[420px] md:min-h-[560px]">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.title} 
                    className="absolute inset-0 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                </div>

                {/* Info side */}
                <div className="p-8 md:p-12 flex flex-col justify-between bg-[#1A1612] relative">
                  
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 text-text-muted hover:text-[#FAFAF8] transition-colors"
                  >
                    <X size={20} />
                  </button>

                  <div className="space-y-6">
                    
                    <div>
                      <span className="font-mono text-[10px] text-primary tracking-widest uppercase bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full font-bold">
                        {selectedProduct.category}
                      </span>
                      <h3 className="font-serif-display text-3xl md:text-4xl font-bold text-[#FAFAF8] mt-4 leading-tight">
                        {selectedProduct.title}
                      </h3>
                      <div className="text-xl md:text-2xl font-mono text-primary mt-2 font-bold">
                        {selectedProduct.price === 0 ? (lang === 'es' ? 'Precio al consultar' : 'Price on request') : `$${selectedProduct.price.toLocaleString('es-CO')}`}
                      </div>
                    </div>

                    <p className="text-sm text-text-muted leading-relaxed font-light">
                      {selectedProduct.description}
                    </p>

                    {/* Technical specifications details */}
                    {selectedProduct.details && (
                      <div className="pt-6 border-t border-border-subtle grid grid-cols-2 gap-4 text-xs">
                        {selectedProduct.details.origin && (
                          <div>
                            <span className="text-[#FAFAF8]/45 block mb-1 uppercase tracking-wider font-mono text-[9px]">{lang === 'es' ? 'Origen' : 'Origin'}</span>
                            <span className="font-sans-modern font-semibold text-[#FAFAF8]">{selectedProduct.details.origin}</span>
                          </div>
                        )}
                        {selectedProduct.details.intensity && (
                          <div>
                            <span className="text-[#FAFAF8]/45 block mb-1 uppercase tracking-wider font-mono text-[9px]">{lang === 'es' ? 'Intensidad' : 'Intensity'}</span>
                            <span className="font-sans-modern font-semibold text-[#FAFAF8]">{selectedProduct.details.intensity}</span>
                          </div>
                        )}
                        {selectedProduct.details.allergens && (
                          <div>
                            <span className="text-[#FAFAF8]/45 block mb-1 uppercase tracking-wider font-mono text-[9px]">{lang === 'es' ? 'Alérgenos' : 'Allergens'}</span>
                            <span className="font-sans-modern font-semibold text-red-300">{selectedProduct.details.allergens}</span>
                          </div>
                        )}
                        {selectedProduct.details.wifi && (
                          <div>
                            <span className="text-[#FAFAF8]/45 block mb-1 uppercase tracking-wider font-mono text-[9px]">{lang === 'es' ? 'Conectividad' : 'Connectivity'}</span>
                            <span className="font-sans-modern font-semibold text-primary">{selectedProduct.details.wifi}</span>
                          </div>
                        )}
                        {selectedProduct.details.compañía && (
                          <div>
                            <span className="text-[#FAFAF8]/45 block mb-1 uppercase tracking-wider font-mono text-[9px]">{lang === 'es' ? 'Compañía' : 'Company'}</span>
                            <span className="font-sans-modern font-semibold text-[#FAFAF8]">{selectedProduct.details.compañía}</span>
                          </div>
                        )}
                        {(selectedProduct.details as any).nota && (
                          <div className="col-span-2">
                            <span className="text-[#FAFAF8]/45 block mb-1 uppercase tracking-wider font-mono text-[9px]">{lang === 'es' ? 'Nota adicional' : 'Additional note'}</span>
                            <span className="font-sans-modern text-[#FAFAF8]/75 leading-relaxed font-light">{(selectedProduct.details as any).nota}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Action buttons */}
                  <div className="flex gap-4 mt-4">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 py-4 bg-primary text-on-primary font-black text-sm uppercase tracking-widest rounded-full hover:brightness-110 transition-all shadow-lg shadow-primary/20"
                    >
                      {selectedProduct.category === 'Coworking' ? currentLang.btn_reserve : currentLang.btn_add}
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="px-8 py-4 border border-border-subtle text-text-muted hover:text-[#FAFAF8] font-bold text-sm uppercase tracking-widest rounded-full transition-colors"
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

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/573213298852"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 animate-whatsapp"
        aria-label="Contact on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

    </div>
  );
}
