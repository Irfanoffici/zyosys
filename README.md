# Zyosys Technologies

> **Engineering Your Future.** A premium, high-performance landing page for the next generation of software engineering training.

![Zyosys Banner](https://placehold.co/1200x600/0a0a0a/7c3aed?text=Zyosys+Technologies)

## 🚀 Overview

Zyosys (formerly Zeosys) is a product-grade educational platform designed to attract high-quality engineering talent. Unlike traditional "bootcamp" sites, Zyosys utilizes a **developer-first aesthetic**, inspired by tools like Next.js, Vercel, and Linear.

The site is built as a **static Single Page Application (SPA)** with a focus on performance, animations, and maintainability.

## ✨ Key Features

-   **Premium Dark UI**: A "True Pitch Black" design system with electric violet accents and glassmorphism.
-   **Draggable Theme Toggle**: A unique, persistent dark/light mode switch that users can drag anywhere on the screen.
-   **Config-Driven Content**: All curriculum and brand data is managed via `js/config.js`, separating content from code.
-   **Interactive Elements**:
    -   **3D Tilt Cards**: Mouse-responsive portfolio showcase.
    -   **Spotlight Hover**: Dynamic border glows on course cards.
    -   **Smooth Scroll**: Integrated `Lenis` for buttery smooth navigation.
-   **Performance First**:
    -   Non-blocking font loading.
    -   Zero-latency vanilla JS architecture.
    -   PWA-ready manifest.

## 🛠️ Tech Stack

-   **Core**: HTML5, CSS3 (Variables, Grid, Clamp), Vanilla JavaScript (ES6+).
-   **Animation**: GSAP (GreenSock), ScrollTrigger.
-   **Scrolling**: Lenis.js.
-   **Icons**: Hand-crafted SVGs.

## 📂 Project Structure

```bash
Zyosys/
├── css/
│   └── style.css       # Single-file CSS architecture
├── js/
│   ├── config.js       # Content Configuration (Edit this!)
│   └── main.js         # Core Application Logic
├── index.html          # Main Entry Point
├── manifest.json       # PWA Configuration
└── sw.js               # Service Worker
```

## ⚡ Quick Start

Since this is a static site, no build step is strictly required for development.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/zyosys.git
    ```
2.  **Open `index.html`** in your browser.
    -   *Recommended*: Use VS Code's "Live Server" extension for the best experience.

## ⚙️ Configuration

To update course details, phone numbers, or brand text, edit `js/config.js`:

```javascript
const ZYOSYS_CONFIG = {
    brand: {
        name: "Zyosys",
        whatsapp: "919876543210",
        // ...
    },
    courses: [
        {
            title: "Full Stack Engineering",
            // ...
        }
    ]
};
```

## 📱 Mobile Support

The site features a responsive "Dynamic Island" style navigation bar on mobile devices, ensuring critical actions (Apply/Toggle) are always accessible without clutter.

---

**© 2026 Zyosys Technologies.** All rights reserved.
