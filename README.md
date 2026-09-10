# U&B Gas Service Pune — Multi-Page Agency Website & Admin Panel

A high-converting, professional **multi-page website** and full-featured **Admin Operations Dashboard** for **U&B Gas Service Pune** (Gas Stove, Built-in Hob, Cooktop & Burner Repair).

---

## 🚀 Key Highlights & Architecture

### 1. Multi-Page Structure (SEO & Google Ads Ready)
Unlike single-page hash-routed websites, every section has its own dedicated HTML file. This allows distinct Google indexing, local SEO targeting for Pune & PCMC keywords, and individual landing pages for ad campaigns.

| File | Purpose |
|------|---------|
| [`index.html`](file:///c:/Users/nirod/OneDrive/Desktop/gas%20rep/index.html) | High-converting Agency Homepage with Instant Booking Widget, Trust Badges, Stats & Reviews |
| [`services.html`](file:///c:/Users/nirod/OneDrive/Desktop/gas%20rep/services.html) | Complete Services Catalog & Transparent Price Guide Table |
| [`gas-stove-repair.html`](file:///c:/Users/nirod/OneDrive/Desktop/gas%20rep/gas-stove-repair.html) | Dedicated Gas Stove Repair Landing Page (Low flame, yellow flame, stiff knobs) |
| [`hob-cooktop-repair.html`](file:///c:/Users/nirod/OneDrive/Desktop/gas%20rep/hob-cooktop-repair.html) | Built-in Glass Hob Specialist Page (Elica, Faber, Glen, Whirlpool, Bosch) |
| [`burner-ignition-repair.html`](file:///c:/Users/nirod/OneDrive/Desktop/gas%20rep/burner-ignition-repair.html) | Auto-Ignition, Spark Modules, Battery & Ignition Pins Repair Page |
| [`gas-leakage-check.html`](file:///c:/Users/nirod/OneDrive/Desktop/gas%20rep/gas-leakage-check.html) | Emergency Gas Leak Safety Inspection & Action Protocol Page |
| [`doorstep-service.html`](file:///c:/Users/nirod/OneDrive/Desktop/gas%20rep/doorstep-service.html) | 1-Visit Doorstep Service & Annual Maintenance Contracts (AMC) Page |
| [`about.html`](file:///c:/Users/nirod/OneDrive/Desktop/gas%20rep/about.html) | About Us, Brand Story, Technician Standards & Pillars |
| [`blog.html`](file:///c:/Users/nirod/OneDrive/Desktop/gas%20rep/blog.html) | Kitchen Safety Guides, Maintenance Habits & LPG Saving Tips |
| [`contact.html`](file:///c:/Users/nirod/OneDrive/Desktop/gas%20rep/contact.html) | Contact Form, Doorstep Booking & Interactive Pune Service Map |
| [`admin.html`](file:///c:/Users/nirod/OneDrive/Desktop/gas%20rep/admin.html) | Dedicated Operations & Bookings Management Admin Dashboard |

---

## ⚙️ Admin Dashboard (`admin.html`)

### Default Admin Credentials
- **Username:** `admin`
- **Password:** `ubgas@2025` *(Can be changed anytime inside Admin Settings)*

### Admin Capabilities:
1. **Live Customer Bookings Management:**
   - Every booking submitted on the homepage, contact page, or service pages is automatically saved and appears instantly in the Admin table.
   - Filter by status (`New`, `In Progress`, `Completed`, `Cancelled`).
   - Live Search by customer name, phone number, Pune locality, or booking ID.
   - **One-Click Quick Actions:** WhatsApp Customer (prefilled with booking info), Direct Phone Call, Delete booking.
   - **Export to CSV:** Download all inquiries in Excel-compatible `.csv` format.
2. **Service Areas (Pune & PCMC):**
   - View, add, or remove active Pune localities (e.g. Kothrud, Hinjewadi, Wakad, Baner, Kharadi, Aundh, etc.).
   - Adding a locality in Admin instantly updates the area badges and booking dropdowns across the website!
3. **Website Information & Contact:**
   - Modify phone numbers, WhatsApp dispatch number, top announcement bar notice, working hours, and operational address.
4. **Testimonials Manager:**
   - Add new customer reviews with star ratings or remove existing reviews.

---

## 💻 How to Test Locally

1. **Direct Browser Open:**
   - Simply double-click [`index.html`](file:///c:/Users/nirod/OneDrive/Desktop/gas%20rep/index.html) in your file explorer. It works 100% locally in any browser (Chrome, Edge, Firefox, Safari).
2. **Or with any local server:**
   - If using VS Code: Right-click `index.html` → **Open with Live Server**.
   - If using Python (optional): `python -m http.server 8000` and open `http://localhost:8000`.

---

## 🌐 Live Deployment Options

Since this is built with clean HTML5, modern CSS3, and standard vanilla JavaScript:
- **Netlify / Vercel:** Drag and drop the `gas rep` folder to deploy in 30 seconds for free with custom domain and SSL.
- **cPanel / Apache / Nginx:** Upload all files directly to your `public_html` directory.
- **GitHub Pages:** Push to a repository and enable GitHub Pages on `main` branch.
