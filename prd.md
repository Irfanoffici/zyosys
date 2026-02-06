# Product Requirements Document (PRD)
## Zyosys Technologies – Official Website

### 1. Product Overview
- **Product Name:** Zyosys Technologies – Product Website
- **Product Type:** Static, single-page, product-grade marketing website
- **Purpose:** To present Zyosys Technologies as a premium, product-based tech training company and convert visitors into qualified enrolment enquiries through frictionless, human-centric funnels.

### 2. Problem Statement
Most training institute websites look cluttered, outdated, and fail to inspire trust.
**Goals:**
- Eliminate clutter and "banner spam".
- Inspire trust through a modern, "tech-first" aesthetic (Next.js/Firebase style).
- Improve lead quality.

### 3. Solution Statement
Build a clean, immersive, single-page website that feels like a modern developer product site.
**Key Features:**
- Single-page scrolling with "On-Site Nav".
- Smooth animations (GSAP).
- Owner-editable content (via config).
- WhatsApp & Callback funnels.

### 4. Target Audience
- **Primary:** Students (17–25), Fresh Graduates, Career Switchers.
- **Secondary:** Parents, Professionals.

### 5. Design Principles
- **Visual Direction:** Dark, Minimal, Premium. High whitespace, large typography, subtle gradients.
- **Inspiration:** nextjs.org, firebase.google.com, welocalhost.com, edutou.in.
- **UX:** One flow, no dead ends. Scroll-driven storytelling.

### 6. Functional Requirements
#### 6.1 Page Structure (Single Page)
1.  **Hero Section**: Brand statement, Value Prop, CTA.
2.  **Why Zyosys**: Differentiators, Trust indicators.
3.  **Courses**: Loaded from `config.js`. Cards with "Talk to Counselor" / "Enroll" CTAs.
4.  **Training Process**: Visual timeline of the training journey.
5.  **Testimonials/Outcomes**: Proof of success.
6.  **Footer/Enrollment**: Final CTA and links.

#### 6.2 Navigation
- **On-Site Nav**: Floating or Sticky navbar that scrolls to specific sections (Hero, Courses, Process, Contact).

#### 6.3 Interactivity
- **Animations**: GSAP ScrollTrigger for section reveals. Hover effects on cards.
- **Forms**: WhatsApp redirection (Primary), Callback Form (Secondary - Google Forms/Formspree).

### 7. Technical Architecture
- **Stack**: HTML5 (Semantic), CSS3 (Variables, Grid, Clamp), Vanilla JavaScript.
- **Libraries**: GSAP (Animation).
- **Data**: Content stored in `js/config.js` for editability.
- **Performance**: Lazy loading, optimized images/SVGs.

### 8. Content Management
- **Editable**: Text, Course details, Links (via `config.js`).
- **Non-Editable**: Layout, Core Styles, Animations.

### 9. Future Enhancements
- Payment Gateway.
- Dedicated Course Detail Pages.
- Blog/LMS.
