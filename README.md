# Glassology — Premium Glass, Aluminum & Stainless Steel Works Website

> **"Built with Strength, Designed with Elegance"**  
> Owner: Samer Abu Saif | Amman, Jordan | +962 799 120 005

---

## 🏗️ Project Overview

A premium luxury single-page website for **Glassology**, a glass, aluminum, and stainless steel architectural works company based in Amman, Jordan. The site features a dark theme with gold accents, glass/transparency effects, smooth animations, and immersive visuals — designed to feel like visiting a luxury architectural firm's showroom online.

---

## ✅ Completed Features

### Pages
| File | Description |
|------|-------------|
| `index.html` | Main single-page website with 8 smooth-scroll sections |
| `privacy-policy.html` | Full Privacy Policy (styled to match brand) |
| `terms-of-service.html` | Full Terms of Service (13 sections) |
| `cookie-policy.html` | Full Cookie Policy with cookie reference table |

### Sections (index.html)
1. **Hero** — Full-viewport with particle canvas animation, logo, headline, CTA buttons
2. **About Us** — Company info with animated highlights and experience badge
3. **Services** — Three service pillars (Glass, Aluminum, Steel) with hover effects
4. **Portfolio** — Gallery of 19 real uploaded project images with filter tabs and lightbox
5. **Why Choose Us** — Animated count-up statistics (15+ years, 500+ projects, etc.)
6. **Testimonials** — Auto-play carousel with 3 client quotes
7. **Contact** — Form with validation, Google Maps embed, contact details
8. **Footer** — Logo, quick links, social icons, legal links, copyright

### Interactive Features
- 🌟 **Loading screen** with logo pulse & progress bar
- 🖱️ **Custom gold cursor** with smooth animated ring trail (desktop only)
- 🍪 **Cookie consent banner** with localStorage persistence
- 🧭 **Sticky navbar** — transparent on hero, solid dark on scroll, active link highlighting
- 🎆 **Particle canvas** in hero section with gold/teal animated particles and connecting lines
- 📸 **Portfolio gallery** — 19 actual project images loaded from ZIP, filter by All/Glass/Aluminum/Steel
- 🔆 **Lightbox** — Full-screen image viewer with prev/next navigation, keyboard support (←→ Escape), swipe on mobile
- 🔢 **Animated counters** (count-up on scroll intersection)
- 💬 **Testimonials slider** with auto-play, dots, and arrow navigation
- ✅ **Contact form** with real-time gold-accent validation
- 🗺️ **Google Maps embed** for Amman, Jordan (with dark theme filter)
- 📱 **WhatsApp floating button** (animated pulse, links to wa.me/962799120005)
- ⬆️ **Back-to-top button** (gold, appears after scrolling)
- 📲 **Fully responsive** with hamburger menu on mobile
- ♿ **Accessible** — ARIA labels, keyboard navigation, semantic HTML5

### Portfolio Image Loading
The portfolio section uses **JSZip** to extract the 19 actual project images directly from the uploaded ZIP archive (`images/portfolio/portfolio-zip.zip`) in the browser:
- Images extracted client-side via `JSZip.loadAsync()`
- Matched to portfolio entries by filename (number-sorted as fallback)
- Converted to blob URLs for display
- Covers: `2.jpeg` through `19.jpeg` + WhatsApp image (19 total)
- Fallback to direct file paths if ZIP extraction fails

---

## 📁 File Structure

```
index.html                          Main website
privacy-policy.html                 Privacy Policy page
terms-of-service.html               Terms of Service page
cookie-policy.html                  Cookie Policy page
css/
  style.css                         Complete stylesheet (CSS custom properties)
js/
  main.js                           All JavaScript (cursor, navbar, portfolio, lightbox, etc.)
images/
  brand/
    logo.jpeg                       Glassology brand logo (original, as-is)
  portfolio/
    portfolio-zip.zip               Archive containing all 19 portfolio project images
README.md                           This file
```

---

## 🌐 Entry URIs

| Path | Description |
|------|-------------|
| `/index.html` | Main site |
| `/index.html#about` | About section |
| `/index.html#services` | Services section |
| `/index.html#portfolio` | Portfolio gallery |
| `/index.html#why-us` | Why Choose Us |
| `/index.html#testimonials` | Testimonials |
| `/index.html#contact` | Contact form + map |
| `/privacy-policy.html` | Privacy Policy |
| `/terms-of-service.html` | Terms of Service |
| `/cookie-policy.html` | Cookie Policy |

---

## 🎨 Design System

| Token | Value | Use |
|-------|-------|-----|
| `--black-deep` | `#0A0A0A` | Primary background |
| `--black-mid` | `#111111` | Alternate section bg |
| `--gold-primary` | `#C9A84C` | Main gold accent |
| `--gold-bright` | `#D4AF37` | Gold hover state |
| `--gold-dark` | `#B8963E` | Gold gradient dark end |
| `--teal-primary` | `#2E8B8B` | Glass service accent |
| `--teal-light` | `#5BA3A3` | Eyebrow text, icons |
| `--steel-blue` | `#4A6B7C` | Aluminum accent |
| `--font-heading` | Cormorant Garamond / Playfair Display | Titles |
| `--font-body` | Montserrat / Inter | Body text |

---

## 🔧 Technology Stack

- **HTML5** — Semantic, accessible markup with ARIA labels
- **CSS3** — CSS custom properties, flexbox, grid, animations
- **Vanilla JavaScript** — No framework dependencies
- **JSZip** (CDN) — Client-side ZIP extraction for portfolio images
- **Font Awesome 6** (CDN) — Icons
- **Google Fonts** (CDN) — Cormorant Garamond + Montserrat
- **Google Maps Embed** — Amman, Jordan location

---

## 📋 Not Yet Implemented / Future Enhancements

- [ ] Backend form submission (currently simulates success after 1.5s)
- [ ] Real email integration (Formspree, EmailJS, or custom backend)
- [ ] CMS for portfolio management
- [ ] Arabic (RTL) language version
- [ ] Blog / news section
- [ ] Individual project case study pages
- [ ] Online quote calculator
- [ ] WhatsApp Business API integration for automated responses

---

## 🚀 Deployment

To publish the website live, go to the **Publish tab** in the project dashboard. Once deployed, connect your **Glassollogy.com** domain in the domain settings.

### Post-Deployment Checklist
- [ ] Update Google Maps embed with exact business address
- [ ] Connect contact form to real email service
- [ ] Update social media links (Instagram, Facebook)
- [ ] Add Google Analytics tracking code
- [ ] Set up WhatsApp Business profile
- [ ] Submit sitemap to Google Search Console

---

## 📞 Business Information

- **Company:** Glassology
- **Owner:** Samer Abu Saif
- **Phone/WhatsApp:** +962 799 120 005
- **Email:** info@glassollogy.com
- **Location:** Amman, Jordan
- **Website:** Glassollogy.com
