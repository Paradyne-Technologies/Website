# Paradyne Landing Page — Remaining Tasks

## Context

The landing page for paradyne.tech is live and deployed on Vercel. The site is a static HTML page with a single Vercel serverless function (`api/contact.js`) that handles form submissions via Resend. The contact form is working end to end (form → serverless function → Resend → contact@paradyne.tech via Proton).

The site passed a WCAG 2.1 AA audit (contrast ratios, semantic HTML, skip-to-content link, landmark elements, form accessibility). Copy was reviewed for em-dash overuse and trimmed to a single instance.

## Tech Stack

- Static HTML/CSS (single file: `index.html`)
- Vercel serverless function (`api/contact.js`) using Resend for email delivery
- Deployed on Vercel with custom domain `paradyne.tech`
- Brand fonts: Archivo (headings), Literata (body) via Google Fonts
- Brand colors defined as CSS custom properties in `:root`

## Outstanding Tasks

### 1. Favicon

Add a favicon so the site has a proper icon in browser tabs and bookmarks. The glyph SVGs already exist in `images/` and could be adapted. Needs at minimum:
- `favicon.ico` or `favicon.svg` in the root
- Apple touch icon (`apple-touch-icon.png`, 180x180)
- Consider `site.webmanifest` for PWA-style metadata

### 2. Open Graph / Social Meta Tags

Add OG and Twitter Card meta tags so the site previews properly when shared on LinkedIn, Slack, etc. This is important since outreach targets will likely share or preview the link. Needs:
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- An OG image (1200x630 recommended) — could be a branded card with the Paradyne logo and tagline

### 3. App Store / Google Play Badge Assets

The DE Dictionary product card currently uses plain text buttons ("App Store" / "Google Play") linking to the stores. Replace these with official badge images:
- Apple: https://developer.apple.com/app-store/marketing/guidelines/
- Google: https://play.google.com/intl/en_us/badges/

Ben said he would track down the official assets.

### 4. Spam Protection for Contact Form (Low Priority)

The form currently has no bot protection beyond server-side validation. If spam becomes an issue, consider adding:
- A honeypot field (hidden input that bots fill but humans don't)
- Rate limiting via Vercel edge middleware
- Resend's built-in suppression list will help with repeated abuse

Not urgent at current traffic levels.

## Reference

- **Brand guide**: `Paradyne-Brand-Guide.pdf` in the parent project folder
- **Color palette**: Cinnabar #722f37, Bearing #3d4f5f, Cranberry #8b3a44, Steel #5a7186, Deep Slate #2c3a44, Fathom #1e4d4d, Near Black #1a1f20, Graphite #4a5258, Pewter #8a9298, Silver #c8cccf, Off-White #f7f8f8, Copper #b87333, Brass #c9a962
- **Adjusted brass for accessibility**: #d4b76e (used in hero data-line and team role labels for WCAG AA compliance on Fathom backgrounds)
- **Typography**: Archivo 500/600/700 (headings), Literata 400/500 (body)
- **Resend config**: from `noreply@paradyne.tech`, to `contact@paradyne.tech`, reply-to set to visitor's email
