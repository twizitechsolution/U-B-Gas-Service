/**
 * U&B GAS SERVICE PUNE — ADMIN DASHBOARD CONTROLLER
 * Full management for Bookings, Service Localities, Contact Info & Testimonials
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
});

function initAdminAuth() {
  const isAuth = sessionStorage.getItem('ub_admin_auth') === 'true';
  const loginSection = document.getElementById('adminLoginSection');
  const dashboardSection = document.getElementById('adminDashboardSection');

  if (!isAuth) {
    if (loginSection) loginSection.style.display = 'flex';
    if (dashboardSection) dashboardSection.style.display = 'none';
    bindLoginForm();
  } else {
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'grid';
    bootDashboard();
  }
}

function bindLoginForm() {
  const loginForm = document.getElementById('adminLoginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('adminUser').value.trim();
    const pass = document.getElementById('adminPass').value.trim();
    const settings = window.UBStore.getSettings();

    if ((user === 'admin' || user === 'ubgas') && (pass === settings.admin_pass || pass === 'UBGas@2024')) {
      sessionStorage.setItem('ub_admin_auth', 'true');
      showToast('Login successful! Welcome to U&B Admin.');
      initAdminAuth();
    } else {
      alert('Invalid username or password. Default is admin / ubgas@2025');
    }
  });
}

function bootDashboard() {
  bindTabs();
  bindLogout();
  renderMetrics();
  renderBookingsTable();
  renderAreas();
  renderSettingsForm();
  renderTestimonials();
  bindSearchAndFilters();
  bindExportCSV();
}

// 1. Navigation Tabs
function bindTabs() {
  const tabBtns = document.querySelectorAll('.admin-nav-btn[data-tab]');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.dataset.tab;
      document.querySelectorAll('.admin-tab-pane').forEach(pane => {
        pane.classList.remove('active');
        if (pane.id === targetTab) {
          pane.classList.add('active');
        }
      });
    });
  });
}

// 2. Logout
function bindLogout() {
  const logoutBtn = document.getElementById('adminLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('ub_admin_auth');
      initAdminAuth();
    });
  }
}

// 3. Render Metric Cards
function renderMetrics() {
  const bookings = window.UBStore.getBookings();
  const areas = window.UBStore.getAreas();

  const totalEl = document.getElementById('metricTotalBookings');
  const newEl = document.getElementById('metricNewBookings');
  const compEl = document.getElementById('metricCompleted');
  const areasEl = document.getElementById('metricTotalAreas');
  const badgeEl = document.getElementById('sidebarNewBadge');

  const newCount = bookings.filter(b => b.status === 'New').length;
  const compCount = bookings.filter(b => b.status === 'Completed').length;

  if (totalEl) totalEl.textContent = bookings.length;
  if (newEl) newEl.textContent = newCount;
  if (compEl) compEl.textContent = compCount;
  if (areasEl) areasEl.textContent = areas.length;
  if (badgeEl) {
    badgeEl.textContent = newCount;
    badgeEl.style.display = newCount > 0 ? 'inline-block' : 'none';
  }
}

// 4. Render Bookings Table
function renderBookingsTable(filterStatus = 'all', searchQuery = '') {
  const tbody = document.getElementById('bookingsTableBody');
  if (!tbody) return;

  let bookings = window.UBStore.getBookings();

  // Apply filters
  if (filterStatus !== 'all') {
    bookings = bookings.filter(b => b.status.toLowerCase() === filterStatus.toLowerCase());
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    bookings = bookings.filter(b => 
      (b.customerName && b.customerName.toLowerCase().includes(q)) ||
      (b.phone && b.phone.includes(q)) ||
      (b.area && b.area.toLowerCase().includes(q)) ||
      (b.id && b.id.toLowerCase().includes(q)) ||
      (b.service && b.service.toLowerCase().includes(q))
    );
  }

  if (bookings.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:30px;color:#94a3b8;">No bookings found matching criteria.</td></tr>`;
    return;
  }

  tbody.innerHTML = bookings.map(b => {
    const statusClass = 'status-' + b.status.toLowerCase().replace(/\s+/g, '-');
    const dateStr = new Date(b.createdAt).toLocaleString('en-IN', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });

    const waMsg = encodeURIComponent(`Hi ${b.customerName}, this is regarding your U&B Gas Service booking (${b.id}) for ${b.service} in ${b.area}. Our technician is ready to visit.`);
    const waUrl = `https://wa.me/91${b.phone}?text=${waMsg}`;
    const telUrl = `tel:+91${b.phone}`;

    return `
      <tr>
        <td><strong style="color:var(--gold-primary)">${b.id}</strong></td>
        <td>
          <b>${escapeHtml(b.customerName)}</b>
          <div style="font-size:0.8rem;color:#94a3b8;">${dateStr}</div>
        </td>
        <td><a href="${telUrl}" style="color:#60a5fa">📞 ${escapeHtml(b.phone)}</a></td>
        <td>📍 ${escapeHtml(b.area)}</td>
        <td>🛠️ ${escapeHtml(b.service)}</td>
        <td>
          <select class="select-filter" style="padding:4px 8px;font-size:0.8rem;" onchange="handleStatusChange('${b.id}', this.value)">
            <option value="New" ${b.status === 'New' ? 'selected' : ''}>New</option>
            <option value="In Progress" ${b.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${b.status === 'Completed' ? 'selected' : ''}>Completed</option>
            <option value="Cancelled" ${b.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td style="max-width:200px;font-size:0.82rem;color:#cbd5e1;">${escapeHtml(b.message || '—')}</td>
        <td>
          <div class="action-btn-group">
            <a href="${waUrl}" target="_blank" class="btn-icon btn-icon-wa" title="WhatsApp Customer">💬</a>
            <a href="${telUrl}" class="btn-icon" title="Call Customer">📞</a>
            <button class="btn-icon btn-icon-del" onclick="handleDeleteBooking('${b.id}')" title="Delete Booking">🗑️</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Table Status & Delete Helpers
window.handleStatusChange = function(id, newStatus) {
  window.UBStore.updateBookingStatus(id, newStatus);
  showToast(`Booking ${id} status updated to ${newStatus}`);
  renderMetrics();
  renderBookingsTable();
};

window.handleDeleteBooking = function(id) {
  if (confirm(`Are you sure you want to delete booking ${id}?`)) {
    window.UBStore.deleteBooking(id);
    showToast(`Booking ${id} removed.`);
    renderMetrics();
    renderBookingsTable();
  }
};

// 5. Search & Filters
function bindSearchAndFilters() {
  const searchInput = document.getElementById('bookingSearchInput');
  const statusFilter = document.getElementById('bookingStatusFilter');

  const triggerFilter = () => {
    const q = searchInput ? searchInput.value : '';
    const s = statusFilter ? statusFilter.value : 'all';
    renderBookingsTable(s, q);
  };

  if (searchInput) searchInput.addEventListener('input', triggerFilter);
  if (statusFilter) statusFilter.addEventListener('change', triggerFilter);
}

// 6. Service Areas Manager
function renderAreas() {
  const grid = document.getElementById('adminAreaChipsGrid');
  if (!grid) return;

  const areas = window.UBStore.getAreas();
  grid.innerHTML = areas.map(a => `
    <div class="area-admin-chip">
      <span>📍 ${escapeHtml(a)}</span>
      <button type="button" class="del-area-btn" onclick="handleRemoveArea('${escapeHtml(a)}')">&times;</button>
    </div>
  `).join('');

  // Add Area Form
  const addAreaForm = document.getElementById('addAreaForm');
  if (addAreaForm && !addAreaForm.dataset.bound) {
    addAreaForm.dataset.bound = 'true';
    addAreaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('newAreaInput');
      const val = input.value.trim();
      if (val) {
        const added = window.UBStore.addArea(val);
        if (added) {
          showToast(`Added locality "${val}" to Pune service zones.`);
          input.value = '';
          renderAreas();
          renderMetrics();
        } else {
          alert('Area already exists or invalid.');
        }
      }
    });
  }
}

window.handleRemoveArea = function(areaName) {
  if (confirm(`Remove "${areaName}" from active Pune service zones?`)) {
    window.UBStore.removeArea(areaName);
    showToast(`Removed "${areaName}" from service zones.`);
    renderAreas();
    renderMetrics();
  }
};

// 7. Settings Form (Contact, Hours, Notice, Pass)
function renderSettingsForm() {
  const form = document.getElementById('adminSettingsForm');
  if (!form) return;

  const s = window.UBStore.getSettings();
  document.getElementById('set_phone').value = s.phone || '';
  document.getElementById('set_phone_short').value = s.phone_short || '';
  document.getElementById('set_whatsapp').value = s.whatsapp || '';
  document.getElementById('set_hours').value = s.hours || '';
  document.getElementById('set_address').value = s.address || '';
  document.getElementById('set_notice').value = s.notice || '';
  document.getElementById('set_pass').value = s.admin_pass || '';

  if (!form.dataset.bound) {
    form.dataset.bound = 'true';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        phone: document.getElementById('set_phone').value.trim(),
        phone_short: document.getElementById('set_phone_short').value.trim(),
        phone_raw: document.getElementById('set_phone').value.replace(/\D/g, ''),
        whatsapp: document.getElementById('set_whatsapp').value.replace(/\D/g, ''),
        hours: document.getElementById('set_hours').value.trim(),
        address: document.getElementById('set_address').value.trim(),
        notice: document.getElementById('set_notice').value.trim(),
        admin_pass: document.getElementById('set_pass').value.trim()
      };

      window.UBStore.saveSettings(updated);
      showToast('Settings saved successfully! Site content updated.');
    });
  }
}

// 8. Testimonials Manager
function renderTestimonials() {
  const list = document.getElementById('adminTestimonialsList');
  if (!list) return;

  const testies = window.UBStore.getTestimonials();
  list.innerHTML = testies.map((t, idx) => `
    <div style="background:rgba(255,255,255,0.03);border:1px solid var(--admin-border);border-radius:12px;padding:16px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:flex-start;gap:16px;">
      <div>
        <div style="color:var(--admin-warning)">${'★'.repeat(t.rating || 5)}</div>
        <p style="font-size:0.9rem;font-style:italic;margin:6px 0;">"${escapeHtml(t.text)}"</p>
        <b style="font-size:0.85rem;">${escapeHtml(t.name)}</b> <span style="font-size:0.75rem;color:#94a3b8;">(${escapeHtml(t.area)})</span>
      </div>
      <button class="btn-icon btn-icon-del" onclick="handleDeleteTestimonial(${idx})" title="Delete Review">🗑️</button>
    </div>
  `).join('');

  const addForm = document.getElementById('addTestiForm');
  if (addForm && !addForm.dataset.bound) {
    addForm.dataset.bound = 'true';
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('testiName').value.trim();
      const area = document.getElementById('testiArea').value.trim();
      const text = document.getElementById('testiText').value.trim();
      const rating = parseInt(document.getElementById('testiRating').value) || 5;

      if (name && text) {
        const cur = window.UBStore.getTestimonials();
        cur.unshift({ id: 't-' + Date.now(), name, area, text, rating });
        window.UBStore.saveTestimonials(cur);
        showToast('New testimonial added!');
        addForm.reset();
        renderTestimonials();
      }
    });
  }
}

window.handleDeleteTestimonial = function(idx) {
  if (confirm('Delete this customer testimonial?')) {
    const cur = window.UBStore.getTestimonials();
    cur.splice(idx, 1);
    window.UBStore.saveTestimonials(cur);
    showToast('Testimonial removed.');
    renderTestimonials();
  }
};

// 9. Export to CSV for Excel
function bindExportCSV() {
  const exportBtn = document.getElementById('exportCsvBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const csv = window.UBStore.exportCSV();
      if (!csv) {
        alert('No bookings to export.');
        return;
      }
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `UB_Gas_Bookings_${new Date().toISOString().slice(0,10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('Bookings downloaded as CSV file.');
    });
  }
}

// Toast Feedback Helper
function showToast(msg) {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = 'admin-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>✓</span> <span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
