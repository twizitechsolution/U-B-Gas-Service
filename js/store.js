/**
 * U&B GAS SERVICE PUNE — DATA STORE & STATE ENGINE
 * Centralized LocalStorage manager for CMS settings, Service Areas, Bookings, and Testimonials.
 */

const DEFAULT_SETTINGS = {
  phone: '+91 91852 80029',
  phone_short: '91852 80029',
  phone_raw: '9185280029',
  whatsapp: '919185280029',
  hours: 'Mon–Sun: 8:00 AM – 9:00 PM',
  address: 'Pune & PCMC, Maharashtra — Doorstep Only',
  notice: '⚡ 60–90 Min Express Doorstep Service Across All Pune & PCMC Localities!',
  admin_pass: 'ubgas@2025'
};

const DEFAULT_AREAS = [
  'Kothrud', 'Hinjewadi', 'Wakad', 'Baner', 'Aundh', 
  'Kharadi', 'Viman Nagar', 'Hadapsar', 'Katraj', 'Swargate', 
  'Pimpri-Chinchwad', 'Magarpatta', 'Bavdhan', 'Wagholi', 'Ravet', 
  'NIBM Road', 'Kalyani Nagar', 'Shivajinagar', 'Pimple Saudagar', 'Warje'
];

const DEFAULT_SERVICES = [
  {
    slug: 'gas-stove-repair',
    name: 'Gas Stove Repair',
    icon: '🔥',
    short: 'Low flame, gas leaks, broken knobs, clogged burners & uneven flames fixed on the spot.',
    price: 'Starting ₹199',
    time: '30–60 min',
    page: 'gas-stove-repair.html'
  },
  {
    slug: 'hob-cooktop-repair',
    name: 'Hob & Cooktop Repair',
    icon: '🍳',
    short: 'Built-in hobs & glass cooktops — burner replacement, glass fitting, valve repair & deep cleaning.',
    price: 'Starting ₹299',
    time: '45–90 min',
    page: 'hob-cooktop-repair.html'
  },
  {
    slug: 'burner-ignition-repair',
    name: 'Burner & Auto Ignition Repair',
    icon: '⚡',
    short: 'Auto-ignition not sparking? Spark modules, batteries, ignition pins & brass burners fixed.',
    price: 'Starting ₹249',
    time: '30–45 min',
    page: 'burner-ignition-repair.html'
  },
  {
    slug: 'gas-leakage-check',
    name: 'Gas Leakage Check',
    icon: '🛡️',
    short: 'Emergency safety leak inspection for pipes, regulators & connections with soap-solution testing.',
    price: 'Starting ₹149',
    time: 'Priority 30 min',
    page: 'gas-leakage-check.html'
  },
  {
    slug: 'doorstep-service',
    name: 'Doorstep Service & AMC',
    icon: '🏠',
    short: 'Fully-equipped technicians at your home — inspect, quote & repair. Plus annual maintenance plans.',
    price: 'Visit ₹149 (adjusted in repair)',
    time: 'One-visit fix',
    page: 'doorstep-service.html'
  }
];

const DEFAULT_TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Priya Sharma',
    area: 'Hinjewadi, Pune',
    rating: 5,
    text: "My 3-burner hob's auto ignition had failed completely. U&B technician came the same evening, replaced the spark module and it's working like new. Very professional!"
  },
  {
    id: 't-2',
    name: 'Rahul Deshmukh',
    area: 'Kothrud, Pune',
    rating: 5,
    text: "I smelled gas in my kitchen and panicked. Called them at 8 PM and they arrived within 35 minutes. Found a worn-out regulator rubber and fixed it immediately. Lifesavers."
  },
  {
    id: 't-3',
    name: 'Anita Kulkarni',
    area: 'Kharadi, Pune',
    rating: 5,
    text: "Deep-cleaned and repaired my glass-top cooktop at a very fair price. Explained everything before starting and the flame is perfectly blue now. Highly recommended."
  },
  {
    id: 't-4',
    name: 'Sameer Joshi',
    area: 'Wakad, Pune',
    rating: 5,
    text: "Excellent doorstep service. The technician came with genuine spare parts in his kit. Stove fixed in 45 minutes with a 30-day warranty card."
  }
];

const DEFAULT_INITIAL_BOOKINGS = [
  {
    id: 'BK-1001',
    customerName: 'Rohit Verma',
    phone: '9822145670',
    area: 'Wakad, Pune',
    service: 'Hob & Cooktop Repair',
    message: 'Auto ignition not sparking and yellow flame on right burner.',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'BK-1002',
    customerName: 'Sneha Patil',
    phone: '9890456123',
    area: 'Kothrud, Pune',
    service: 'Gas Leakage Check',
    message: 'Slight gas smell near regulator connection.',
    status: 'Completed',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'BK-1003',
    customerName: 'Amit Gokhale',
    phone: '9764512390',
    area: 'Baner, Pune',
    service: 'Gas Stove Repair',
    message: 'Both knobs are stiff and flame is very low.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

class Store {
  constructor() {
    this.initStore();
  }

  initStore() {
    if (!localStorage.getItem('ubgas_settings')) {
      localStorage.setItem('ubgas_settings', JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem('ubgas_areas')) {
      localStorage.setItem('ubgas_areas', JSON.stringify(DEFAULT_AREAS));
    }
    if (!localStorage.getItem('ubgas_testimonials')) {
      localStorage.setItem('ubgas_testimonials', JSON.stringify(DEFAULT_TESTIMONIALS));
    }
    if (!localStorage.getItem('ubgas_bookings')) {
      localStorage.setItem('ubgas_bookings', JSON.stringify(DEFAULT_INITIAL_BOOKINGS));
    }
  }

  // Settings
  getSettings() {
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem('ubgas_settings') || '{}') };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(newSettings) {
    const merged = { ...this.getSettings(), ...newSettings };
    localStorage.setItem('ubgas_settings', JSON.stringify(merged));
    return merged;
  }

  // Areas
  getAreas() {
    try {
      const areas = JSON.parse(localStorage.getItem('ubgas_areas'));
      return Array.isArray(areas) && areas.length ? areas : DEFAULT_AREAS;
    } catch (e) {
      return DEFAULT_AREAS;
    }
  }

  addArea(areaName) {
    const cleanName = areaName.trim();
    if (!cleanName) return false;
    const areas = this.getAreas();
    if (!areas.some(a => a.toLowerCase() === cleanName.toLowerCase())) {
      areas.push(cleanName);
      localStorage.setItem('ubgas_areas', JSON.stringify(areas));
      return true;
    }
    return false;
  }

  removeArea(areaName) {
    let areas = this.getAreas();
    areas = areas.filter(a => a.toLowerCase() !== areaName.toLowerCase());
    localStorage.setItem('ubgas_areas', JSON.stringify(areas));
    return areas;
  }

  // Services
  getServices() {
    return DEFAULT_SERVICES;
  }

  // Testimonials
  getTestimonials() {
    try {
      const t = JSON.parse(localStorage.getItem('ubgas_testimonials'));
      return Array.isArray(t) && t.length ? t : DEFAULT_TESTIMONIALS;
    } catch (e) {
      return DEFAULT_TESTIMONIALS;
    }
  }

  saveTestimonials(testimonials) {
    localStorage.setItem('ubgas_testimonials', JSON.stringify(testimonials));
  }

  // Bookings
  getBookings() {
    try {
      const b = JSON.parse(localStorage.getItem('ubgas_bookings'));
      return Array.isArray(b) ? b : [];
    } catch (e) {
      return [];
    }
  }

  createBooking(bookingData) {
    const bookings = this.getBookings();
    const id = 'BK-' + (Math.floor(1000 + Math.random() * 9000));
    const newBooking = {
      id,
      customerName: bookingData.name || 'Customer',
      phone: bookingData.phone || '',
      area: bookingData.area || 'Pune',
      service: bookingData.service || 'Gas Stove Repair',
      message: bookingData.message || '',
      status: 'New',
      createdAt: new Date().toISOString()
    };
    bookings.unshift(newBooking);
    localStorage.setItem('ubgas_bookings', JSON.stringify(bookings));
    return newBooking;
  }

  updateBookingStatus(id, newStatus) {
    const bookings = this.getBookings();
    const target = bookings.find(b => b.id === id);
    if (target) {
      target.status = newStatus;
      localStorage.setItem('ubgas_bookings', JSON.stringify(bookings));
      return true;
    }
    return false;
  }

  deleteBooking(id) {
    let bookings = this.getBookings();
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem('ubgas_bookings', JSON.stringify(bookings));
    return bookings;
  }

  // Helper: Export to CSV
  exportCSV() {
    const bookings = this.getBookings();
    if (!bookings.length) return '';
    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Area', 'Service', 'Notes', 'Status', 'Date Time'];
    const rows = bookings.map(b => [
      `"${b.id}"`,
      `"${(b.customerName || '').replace(/"/g, '""')}"`,
      `"${(b.phone || '').replace(/"/g, '""')}"`,
      `"${(b.area || '').replace(/"/g, '""')}"`,
      `"${(b.service || '').replace(/"/g, '""')}"`,
      `"${(b.message || '').replace(/"/g, '""')}"`,
      `"${b.status}"`,
      `"${new Date(b.createdAt).toLocaleString('en-IN')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  }
}

// Global Store Instance
window.UBStore = new Store();
