/**
 * U&B GAS SERVICE PUNE — MAIN FRONTEND CONTROLLER
 * Inspired by PuneGasWala.com: Dynamic CMS sync, Problem Tabs, Area expansion, WhatsApp direct booking
 */

document.addEventListener('DOMContentLoaded', () => {
  initCMS();
  initAreas();
  initNav();
  initProblemTabs();
  initShowMoreAreas();
  initBookingForms();
  initCounters();
  initFAQ();
});

// 1. Sync CMS fields across the page
function initCMS() {
  if (!window.UBStore) return;
  const settings = window.UBStore.getSettings();

  // Populate textual CMS placeholders
  document.querySelectorAll('[data-cms]').forEach(el => {
    const key = el.dataset.cms;
    if (settings[key]) {
      el.textContent = settings[key];
    }
  });

  // Populate phone links
  const telHref = 'tel:+' + settings.phone_raw;
  document.querySelectorAll('[data-tel]').forEach(a => {
    a.href = telHref;
  });

  // Populate WhatsApp links
  const defaultWAMsg = encodeURIComponent('Hi U&B Gas Service Pune, I need expert doorstep repair for my gas stove / hob.');
  const waHref = `https://wa.me/${settings.whatsapp}?text=${defaultWAMsg}`;
  document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = waHref;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // Dynamic prefill WhatsApp links from buttons with data-prob-name
  document.querySelectorAll('[data-wa-problem]').forEach(btn => {
    const probName = btn.getAttribute('data-wa-problem') || 'Gas appliance issue';
    const msg = encodeURIComponent(`Hi U&B Gas Service, I have this problem with my gas stove/hob in Pune: "${probName}". Please arrange a technician visit.`);
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(`https://wa.me/${settings.whatsapp}?text=${msg}`, '_blank');
    });
  });

  // Copyright Year
  const yrEl = document.getElementById('currentYear');
  if (yrEl) yrEl.textContent = new Date().getFullYear();
}

// 2. Populate Pune Service Area Chips & Select Dropdowns
function initAreas() {
  if (!window.UBStore) return;
  const areas = window.UBStore.getAreas();

  // Populate Area select dropdowns in booking forms
  document.querySelectorAll('select.area-select').forEach(sel => {
    const currentVal = sel.value;
    sel.innerHTML = '<option value="">Select Your Area in Pune / PCMC</option>' + 
      areas.map(a => `<option value="${a}">${a}</option>`).join('') +
      '<option value="Other Area in Pune">Other Location in Pune</option>';
    if (currentVal) sel.value = currentVal;
  });
}

// 3. Problem Solver Tabs (Gas Hob vs Gas Stove)
function initProblemTabs() {
  const tabs = document.querySelectorAll('.prob-tab');
  const panels = document.querySelectorAll('.prob-col');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-prob-target');

      tabs.forEach(t => t.classList.remove('prob-tab--active'));
      tab.classList.add('prob-tab--active');

      panels.forEach(p => {
        if (p.id === targetId) {
          p.style.display = 'block';
        } else {
          // On mobile, hide inactive panel; on desktop, both are visible side-by-side if in grid
          if (window.innerWidth <= 768) {
            p.style.display = 'none';
          }
        }
      });
    });
  });

  // Handle responsive tab visibility on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      panels.forEach(p => p.style.display = 'block');
    } else {
      const activeTab = document.querySelector('.prob-tab.prob-tab--active');
      if (activeTab) {
        const targetId = activeTab.getAttribute('data-prob-target');
        panels.forEach(p => {
          p.style.display = p.id === targetId ? 'block' : 'none';
        });
      }
    }
  });

  // Initial trigger for mobile
  if (window.innerWidth <= 768 && tabs.length > 0) {
    const firstTarget = tabs[0].getAttribute('data-prob-target');
    panels.forEach(p => {
      p.style.display = p.id === firstTarget ? 'block' : 'none';
    });
  }
}

// 4. "Show More Areas" Toggle
function initShowMoreAreas() {
  const showMoreBtn = document.getElementById('btnShowMoreAreas') || document.getElementById('areas-show-more');
  if (!showMoreBtn) return;

  showMoreBtn.addEventListener('click', () => {
    const areasMore = document.getElementById('areasMore');
    const hiddenChips = document.querySelectorAll('.area-chip-hidden');
    const isExpanded = showMoreBtn.getAttribute('data-expanded') === 'true';

    if (isExpanded) {
      if (areasMore) areasMore.style.display = 'none';
      hiddenChips.forEach(chip => chip.style.display = 'none');
      showMoreBtn.textContent = '🗺️ Show More Areas (+22 Localities)';
      showMoreBtn.setAttribute('data-expanded', 'false');
    } else {
      if (areasMore) areasMore.style.display = 'flex';
      hiddenChips.forEach(chip => chip.style.display = 'inline-flex');
      showMoreBtn.textContent = '🗺️ Show Fewer Areas ▴';
      showMoreBtn.setAttribute('data-expanded', 'true');
    }
  });
}

// 5. Navigation & Mobile Drawer
function initNav() {
  const hamBtn = document.getElementById('hamburgerBtn') || document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobileMenu') || document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobileOverlay') || document.getElementById('mobile-overlay');
  const mobileClose = document.getElementById('mobileCloseBtn') || document.getElementById('mobile-close-btn');

  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    if (hamBtn) hamBtn.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    if (hamBtn) hamBtn.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamBtn) hamBtn.addEventListener('click', openMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

  // Close when clicking internal links
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Active path detection
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .nav-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// 6. Booking Forms Submission & Modal Dialog
function initBookingForms() {
  document.querySelectorAll('form[data-booking-form], #enquiry-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="customerName"]') || form.querySelector('#name') || form.querySelector('[name="name"]');
      const phoneInput = form.querySelector('[name="phone"]') || form.querySelector('#phone');
      const areaInput = form.querySelector('[name="area"]') || form.querySelector('#area');
      const serviceInput = form.querySelector('[name="service"]') || form.querySelector('#service');
      const msgInput = form.querySelector('[name="message"]') || form.querySelector('#message');

      const name = nameInput ? nameInput.value.trim() : 'Customer';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const area = areaInput ? areaInput.value.trim() : 'Pune';
      const service = serviceInput ? serviceInput.value.trim() : 'Gas Stove Repair';
      const message = msgInput ? msgInput.value.trim() : '';

      if (!phone || phone.length < 10) {
        alert('Please enter a valid 10-digit mobile number.');
        return;
      }

      // Save to Store
      const newBooking = window.UBStore ? window.UBStore.createBooking({
        name,
        phone,
        area,
        service,
        message
      }) : { id: 'BK-' + Math.floor(1000 + Math.random() * 9000), customerName: name, phone, area, service, message };

      // Show confirmation modal
      showBookingModal(newBooking);

      // Reset form
      form.reset();
    });
  });
}

// Show Clean High-Trust Success Modal
function showBookingModal(booking) {
  let modal = document.getElementById('bookingConfirmModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'bookingConfirmModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const settings = window.UBStore ? window.UBStore.getSettings() : { whatsapp: '919185280029' };
  const waMsg = encodeURIComponent(
    `🔥 *URGENT SERVICE BOOKING [${booking.id}]*\n\n` +
    `👤 *Name:* ${booking.customerName}\n` +
    `📞 *Phone:* ${booking.phone}\n` +
    `📍 *Area:* ${booking.area}\n` +
    `🛠️ *Service:* ${booking.service}\n` +
    (booking.message ? `📝 *Issue:* ${booking.message}\n\n` : '\n') +
    `Please confirm the technician arrival time.`
  );
  const waUrl = `https://wa.me/${settings.whatsapp}?text=${waMsg}`;

  modal.innerHTML = `
    <div class="booking-success-modal">
      <div class="modal-check-icon">✓</div>
      <h3 style="font-size:1.4rem;margin-bottom:8px;color:var(--secondary)">Doorstep Booking Confirmed!</h3>
      <p style="font-size:0.95rem;color:var(--text-light);margin-bottom:12px;">Thank you <b>${booking.customerName}</b>. Your booking ID is:</p>
      
      <div class="booking-id-badge">${booking.id}</div>

      <div style="background:var(--bg-alt);border:1px solid var(--border);border-radius:12px;padding:16px;margin-bottom:20px;text-align:left;font-size:0.9rem;">
        <div style="margin-bottom:4px;"><b>🛠️ Service:</b> ${booking.service}</div>
        <div style="margin-bottom:4px;"><b>📍 Area:</b> ${booking.area}</div>
        <div><b>📞 Phone:</b> ${booking.phone}</div>
      </div>

      <div style="display:flex;flex-direction:column;gap:12px">
        <a href="${waUrl}" target="_blank" class="btn-whatsapp" style="width:100%">
          💬 Open in WhatsApp for 10-Min Fast Dispatch
        </a>
        <button type="button" class="btn-outline" id="closeModalBtn" style="width:100%">
          Close Window
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');

  modal.querySelector('#closeModalBtn').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

// 7. Counters Animation
function initCounters() {
  const counters = document.querySelectorAll('.counter-num, .stat-count');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.getAttribute('data-target');
        let count = 0;
        const speed = target / 50;

        const update = () => {
          count += speed;
          if (count < target) {
            el.innerText = Math.ceil(count).toLocaleString('en-IN') + '+';
            requestAnimationFrame(update);
          } else {
            el.innerText = target.toLocaleString('en-IN') + '+';
          }
        };
        update();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

// 8. FAQ Accordion
function initFAQ() {
  document.querySelectorAll('.faq-item summary').forEach(summary => {
    summary.addEventListener('click', (e) => {
      // Native HTML5 <details> handles toggle automatically
    });
  });
}
