# Doc-Scripter · Clifford Otieno

**IT consultant in Kisumu, Kenya.** IT consultancy, business intelligence, applied AI systems and business automation, plus fast, easy-to-use websites, WordPress & WooCommerce shops, booking systems and SEO for Kenyan businesses. Also open to full-time roles in IT, backend engineering, business intelligence and applied AI.

Live site: **https://doc-scripter.github.io/**

This repository is the source for that site, hosted on GitHub Pages.

---

## What the site does

A fixed-shell, single-page portfolio. Instead of one long scroll, seven panels swap in place with native back/forward support and deep links:

| Panel | Hash | What's there |
| --- | --- | --- |
| Home | `#home` | Consultancy headline, four specialism pillars, quote CTAs, stats, tech marquee |
| Previous Work | `#work` | Live client websites only: screenshots + outcomes + links |
| Services | `#services` | Twelve services (incl. WordPress/WooCommerce, BI, applied AI, automation), each with a prefilled WhatsApp quote link |
| Experience | `#experience` | Professional journey: consultancy, community speaking, GDG facilitation, technical writing |
| Blog | `#blog` | Articles auto-pulled from my DEV.to account |
| About | `#about` | Story, skills, community journey, resume download |
| Contact | `#contact` | Smart enquiry form, direct WhatsApp/email, 10-question FAQ |

**Client work shown:** Diani Hostel (booking), Twynon (online shop), Ujuzi360 (learning platform), a county bursary application platform, Euni Drip Irrigation Systems (WordPress + SEO), and Muhuga (logistics + farm-produce marketplace).

## Also looking for a role

- **Role fit:** backend engineering, business intelligence, applied AI systems and business automation.
- **Everyday stack:** Go, Python, JavaScript, PostgreSQL, Docker, Kubernetes, AWS and GCP.
- **How to reach me:** email Clifford242526@gmail.com, WhatsApp +254 741 194 375, or LinkedIn (linkedin.com/in/clifford-otieno-2a2986103). The CV is downloadable from the About panel.
- **Collaborations, speaking and workshops:** email Clifford242526@gmail.com with the subject `Collaboration request`.

## Tech stack

Vanilla HTML, CSS and JavaScript. **Zero dependencies, zero build step**: GitHub Pages serves the files as-is.

- Hash routing (`#home`, `#work`, …): deep-linkable, keyboard-friendly, back/forward native.
- Self-hosted fonts (Space Grotesk + Inter), `font-display: swap`, preloaded.
- Blog fetched client-side from the public DEV.to API, cached for an hour, with a static fallback if the network fails.
- Enquiry form composes a prefilled `mailto:` or WhatsApp message. No backend, no third-party form service.
- Responsive across three tiers: mobile (top bar + bottom tabs), tablet (icon rail), desktop (full sidebar).
- Accessibility: skip link, semantic landmarks, one visible `h1` per view, labelled controls, `:focus-visible` rings, `prefers-reduced-motion` support. Audited with axe-core (0 violations).

## Project structure

```
index.html              All markup + SEO head + JSON-LD (Person, ProfessionalService, WebSite, FAQPage)
favicon.png             Photo brand mark (64x64, rounded)
sitemap.xml             Root URL for search engines
robots.txt              Allow all + sitemap reference
static/
  styles/main.css       Single mobile-first stylesheet (design tokens + 3 tiers)
  scripts/app.js        Router, transitions, counters, blog fetch, enquiry composer
  fonts/                Self-hosted woff2
  images/
    profile.webp        Portrait
    og-cover.jpg        1200x630 social share card
    work/               Client screenshots (960w + 320w srcset, WebP)
    journey/            Community photos (WebP)
  assets/               Resume PDF
```

## Run it locally

Any static file server works. For example:

```bash
# with Bun
bunx http-server . -p 4173 -c-1

# or with Python
python -m http.server 4173
```

Then open http://localhost:4173/. No install or build step is required.

## SEO: on-page (already shipped)

- Title, meta description and canonical naming "Clifford Otieno" + services + Kisumu, Kenya.
- Open Graph / Twitter card with a branded share image.
- JSON-LD `@graph`: `Person`, `ProfessionalService` (all twelve services in an offer catalog), `WebSite` and `FAQPage` (mirrors the on-page FAQ).
- `sitemap.xml` + `robots.txt`.
- Fresh blog content pulled automatically from DEV.to.

## SEO: off-site (owner actions to finish)

On-page SEO is the foundation; these steps put it in front of Google. Ranking for a name takes a few weeks, and consistency is what wins.

1. **Google Search Console** (https://search.google.com/search-console)
   - Add the property `https://doc-scripter.github.io/`, verify (HTML tag or DNS).
   - Submit `https://doc-scripter.github.io/sitemap.xml` under *Sitemaps*.
   - Use *URL Inspection → Request Indexing* on the home URL.
2. **Bing Webmaster Tools** (https://www.bing.com/webmasters)
   - Add the site, verify, and submit the same sitemap. (You can import directly from Search Console.)
3. **Google Business Profile** (https://www.google.com/business/)
   - Create a profile named exactly **"Clifford Otieno · IT Consultant"** in **Kisumu, Kenya**.
   - Use the **same phone (+254 741 194 375) and email** as the site everywhere.
   - Add the website URL, services, and a few photos. Verify by postcard/phone.
   - This is what makes you appear in Google Maps and the local pack.
4. **Keep social bios consistent**: GitHub, X, LinkedIn and DEV.to should all use the same name, location and link back to the site. The site already links to them (`sameAs` in the JSON-LD).

## Contact

- WhatsApp: https://wa.me/254741194375
- Email: Clifford242526@gmail.com
- GitHub: https://github.com/Doc-Scripter
- LinkedIn: https://www.linkedin.com/in/clifford-otieno-2a2986103
- DEV.to: https://dev.to/clifford_otieno
- X: https://twitter.com/Clifford_001

---

*Original full-resolution photos were moved out of the web root during the revamp; a byte-for-byte backup is kept at `C:\Users\Potter\Doc-Scripter-originals-backup` on the build machine. The site serves only optimized WebP derivatives.*