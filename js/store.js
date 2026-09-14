/**
 * U&B GAS SERVICE PUNE — DATA STORE & STATE ENGINE
 * Hybrid Realtime Engine: Google Cloud Firestore + LocalStorage Fail-Safe Cache
 * Ensures instant real-time sync across any device, anywhere in the world!
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
    name: 'Gas Stove Repair & Service',
    image: 'images/services/gas-stove-repair.jpg',
    short: 'Low flame, gas leaks, broken knobs, clogged burners & uneven flames fixed on the spot.',
    price: 'Starting ₹199',
    time: '30–60 min',
    page: 'gas-stove-repair.html'
  },
  {
    slug: 'hob-cooktop-repair',
    name: 'Hob & Cooktop Repair & Service',
    image: 'images/services/hob-cooktop-repair.jpg',
    short: 'Built-in hobs & glass cooktops — burner replacement, glass fitting, valve repair & deep cleaning.',
    price: 'Starting ₹299',
    time: '45–90 min',
    page: 'hob-cooktop-repair.html'
  },
  {
    slug: 'burner-ignition-repair',
    name: 'Burner & Auto Ignition Repair & Service',
    image: 'images/services/burner-ignition-repair.jpg',
    short: 'Auto-ignition not sparking? Spark modules, batteries, ignition pins & brass burners fixed.',
    price: 'Starting ₹249',
    time: '30–45 min',
    page: 'burner-ignition-repair.html'
  },
  {
    slug: 'gas-leakage-check',
    name: 'Gas Leakage Safety Check',
    image: 'images/services/gas-leakage-check.jpg',
    short: 'Emergency safety leak inspection for pipes, regulators & connections with soap-solution testing.',
    price: 'Starting ₹149',
    time: 'Priority 30 min',
    page: 'gas-leakage-check.html'
  },
  {
    slug: 'doorstep-service',
    name: 'Doorstep Service & Annual AMC',
    image: 'images/services/doorstep-service.jpg',
    short: 'Fully-equipped technicians at your home — inspect, quote & repair. Plus annual maintenance plans.',
    price: 'From ₹899 / Year',
    time: 'One-visit fix',
    page: 'doorstep-service.html'
  },
  {
    slug: 'hob-installation',
    name: 'New Hob & Pipeline Installation',
    image: 'images/services/hob-installation.jpg',
    short: 'Granite counter cutting, flush-mount cooktop fitting, gas pipeline routing and pressure testing.',
    price: 'Starting ₹399',
    time: '60–90 min',
    page: 'contact.html'
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
    service: 'Hob & Cooktop Repair & Service',
    date: '2026-09-11',
    time: 'Evening (3 PM - 7 PM)',
    message: 'Auto ignition not sparking and yellow flame on right burner.',
    status: 'In Progress',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'BK-1002',
    customerName: 'Sneha Patil',
    phone: '9890456123',
    area: 'Kothrud, Pune',
    service: 'Emergency Gas Leakage Check',
    date: '2026-09-10',
    time: 'Morning (9 AM - 12 PM)',
    message: 'Slight gas smell near regulator connection.',
    status: 'Completed',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'BK-1003',
    customerName: 'Amit Gokhale',
    phone: '9764512390',
    area: 'Baner, Pune',
    service: 'Gas Stove Repair & Service',
    date: '2026-09-11',
    time: 'Afternoon (12 PM - 3 PM)',
    message: 'Both knobs are stiff and flame is very low.',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  }
];

class Store {
  constructor() {
    this.initStore();
    this.initCloudSync();
  }

  getDb() {
    if (window.firebaseDb) return window.firebaseDb;
    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
      window.firebaseDb = firebase.firestore();
      return window.firebaseDb;
    }
    return null;
  }

  isCloudConnected() {
    return !!this.getDb();
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

  async initCloudSync() {
    const db = this.getDb();
    if (!db) return;

    try {
      // Sync CMS Settings from Cloud
      const cmsDoc = await db.collection('settings').doc('cms').get();
      if (cmsDoc.exists) {
        const cloudSettings = cmsDoc.data();
        const merged = { ...DEFAULT_SETTINGS, ...cloudSettings };
        localStorage.setItem('ubgas_settings', JSON.stringify(merged));
      }

      // Sync Localities from Cloud
      const areasDoc = await db.collection('settings').doc('localities').get();
      if (areasDoc.exists) {
        const cloudAreas = areasDoc.data().areas;
        if (Array.isArray(cloudAreas) && cloudAreas.length) {
          localStorage.setItem('ubgas_areas', JSON.stringify(cloudAreas));
        }
      }

      window.dispatchEvent(new CustomEvent('ub:store_synced'));
    } catch (err) {
      console.warn('Background cloud sync notice:', err.message);
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

  async saveSettings(newSettings) {
    const merged = { ...this.getSettings(), ...newSettings };
    localStorage.setItem('ubgas_settings', JSON.stringify(merged));

    const db = this.getDb();
    if (db) {
      try {
        await db.collection('settings').doc('cms').set(merged, { merge: true });
      } catch (err) {
        console.warn('Failed to save settings to Firestore:', err);
      }
    }
    return merged;
  }

  // Areas (Localities)
  getAreas() {
    try {
      const areas = JSON.parse(localStorage.getItem('ubgas_areas'));
      return Array.isArray(areas) && areas.length ? areas : DEFAULT_AREAS;
    } catch (e) {
      return DEFAULT_AREAS;
    }
  }

  async addArea(areaName) {
    const cleanName = areaName.trim();
    if (!cleanName) return false;
    const areas = this.getAreas();
    if (!areas.some(a => a.toLowerCase() === cleanName.toLowerCase())) {
      areas.push(cleanName);
      localStorage.setItem('ubgas_areas', JSON.stringify(areas));

      const db = this.getDb();
      if (db) {
        try {
          await db.collection('settings').doc('localities').set({ areas });
        } catch (e) {
          console.warn('Failed to sync area to Firestore:', e);
        }
      }
      return true;
    }
    return false;
  }

  async removeArea(areaName) {
    let areas = this.getAreas();
    areas = areas.filter(a => a.toLowerCase() !== areaName.toLowerCase());
    localStorage.setItem('ubgas_areas', JSON.stringify(areas));

    const db = this.getDb();
    if (db) {
      try {
        await db.collection('settings').doc('localities').set({ areas });
      } catch (e) {
        console.warn('Failed to sync area removal to Firestore:', e);
      }
    }
    return areas;
  }

  // Services Catalog
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

  async saveTestimonials(testimonials) {
    localStorage.setItem('ubgas_testimonials', JSON.stringify(testimonials));
    const db = this.getDb();
    if (db) {
      try {
        await db.collection('settings').doc('testimonials').set({ list: testimonials });
      } catch (e) {
        console.warn('Failed to sync testimonials to Firestore:', e);
      }
    }
  }

  // Bookings Management
  getBookings() {
    try {
      const b = JSON.parse(localStorage.getItem('ubgas_bookings'));
      return Array.isArray(b) ? b : [];
    } catch (e) {
      return [];
    }
  }

  async createBooking(bookingData) {
    const bookings = this.getBookings();
    const id = 'BK-' + (Math.floor(1000 + Math.random() * 9000));
    const isoNow = new Date().toISOString();

    const newBooking = {
      id,
      customerName: bookingData.name || 'Customer',
      phone: bookingData.phone || '',
      area: bookingData.area || 'Pune',
      service: bookingData.service || 'Gas Stove Repair & Service',
      date: bookingData.date || '',
      time: bookingData.time || '',
      message: bookingData.message || '',
      status: 'New',
      createdAt: isoNow
    };

    // Save locally first for offline safety
    bookings.unshift(newBooking);
    localStorage.setItem('ubgas_bookings', JSON.stringify(bookings));

    // Push to Google Cloud Firestore in Realtime
    const db = this.getDb();
    if (db) {
      try {
        await db.collection('bookings').doc(id).set({
          id,
          customerName: newBooking.customerName,
          phone: newBooking.phone,
          area: newBooking.area,
          service: newBooking.service,
          date: newBooking.date,
          time: newBooking.time,
          message: newBooking.message,
          status: 'New',
          createdAt: (typeof firebase !== 'undefined' && firebase.firestore) 
            ? firebase.firestore.FieldValue.serverTimestamp() 
            : isoNow
        });
        console.log('✓ Booking synchronized to Cloud Firestore:', id);
      } catch (err) {
        console.warn('Firestore write error (saved to local backup):', err);
      }
    }

    return newBooking;
  }

  // Realtime Live Subscription for Admin Panel
  subscribeBookings(callback) {
    // Immediately deliver current cache for zero loading delay
    callback(this.getBookings());

    const db = this.getDb();
    if (!db) {
      console.log('Firestore not connected; running in local storage mode.');
      return () => {};
    }

    try {
      return db.collection('bookings')
        .orderBy('createdAt', 'desc')
        .onSnapshot((snapshot) => {
          const cloudBookings = [];
          snapshot.forEach(doc => {
            const data = doc.data();
            let createdIso = new Date().toISOString();
            if (data.createdAt && typeof data.createdAt.toDate === 'function') {
              createdIso = data.createdAt.toDate().toISOString();
            } else if (data.createdAt) {
              createdIso = data.createdAt;
            }
            cloudBookings.push({
              id: doc.id,
              ...data,
              createdAt: createdIso
            });
          });

          // Cache in local storage
          if (cloudBookings.length > 0) {
            localStorage.setItem('ubgas_bookings', JSON.stringify(cloudBookings));
          }
          callback(cloudBookings);
        }, (err) => {
          console.warn('Firestore subscription fallback to local cache:', err.message);
          callback(this.getBookings());
        });
    } catch (err) {
      console.warn('Could not establish Firestore live listener:', err);
      callback(this.getBookings());
      return () => {};
    }
  }

  async updateBookingStatus(id, newStatus) {
    const bookings = this.getBookings();
    const target = bookings.find(b => b.id === id);
    if (target) {
      target.status = newStatus;
      localStorage.setItem('ubgas_bookings', JSON.stringify(bookings));
    }

    const db = this.getDb();
    if (db) {
      try {
        await db.collection('bookings').doc(id).update({ status: newStatus });
      } catch (e) {
        console.warn('Failed to update status on Firestore:', e);
      }
    }
    return true;
  }

  async deleteBooking(id) {
    let bookings = this.getBookings();
    bookings = bookings.filter(b => b.id !== id);
    localStorage.setItem('ubgas_bookings', JSON.stringify(bookings));

    const db = this.getDb();
    if (db) {
      try {
        await db.collection('bookings').doc(id).delete();
      } catch (e) {
        console.warn('Failed to delete booking from Firestore:', e);
      }
    }
    return bookings;
  }

  // Helper: Export to CSV
  exportCSV() {
    const bookings = this.getBookings();
    if (!bookings.length) return '';
    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Area', 'Service', 'Preferred Date', 'Preferred Time', 'Notes', 'Status', 'Created At'];
    const rows = bookings.map(b => [
      `"${b.id}"`,
      `"${(b.customerName || '').replace(/"/g, '""')}"`,
      `"${(b.phone || '').replace(/"/g, '""')}"`,
      `"${(b.area || '').replace(/"/g, '""')}"`,
      `"${(b.service || '').replace(/"/g, '""')}"`,
      `"${(b.date || '').replace(/"/g, '""')}"`,
      `"${(b.time || '').replace(/"/g, '""')}"`,
      `"${(b.message || '').replace(/"/g, '""')}"`,
      `"${b.status}"`,
      `"${new Date(b.createdAt).toLocaleString('en-IN')}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  }
}

// Global Store Instance
window.UBStore = new Store();
