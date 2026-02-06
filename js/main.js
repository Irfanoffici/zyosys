// Fresh Start:// Main JavaScript - Optimized

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderTracks();
    initAdvancedUI();
    initShowcaseTilt(); // Added 3D Tilt

    if (typeof gsap !== 'undefined') {
        // Parallax is handled inside initAdvancedUI or existing blocks
        // initParallax is likely defined elsewhere or inline
        // initFooterReveal(); // Ensure this is effectively called
    }

    // Initialize Smooth Scroll
    initSmoothScroll();

    // Initialize Scroll Animations
    initScrollAnimations();

    initTechTooltips();
    initNewsletter();
});

// --- Feature: Footer Newsletter (Async Simulation) ---
function initNewsletter() {
    const input = document.querySelector('.newsletter-input');
    const btn = document.querySelector('.newsletter-btn');
    // Save original button content for reset
    const originalContent = btn ? btn.innerHTML : '';

    if (input && btn) {
        const handleSubscribe = async (e) => {
            if (e) e.preventDefault();
            const email = input.value.trim();

            if (!email || !/\S+@\S+\.\S+/.test(email)) {
                input.focus();
                input.style.borderColor = '#ef4444'; // Red ERROR border
                return;
            }

            // 1. UI: Loading State
            btn.innerHTML = '<span class="loader"></span>'; // Simple loader or "..."
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none'; // Lock button
            input.disabled = true; // Lock input
            input.style.borderColor = ''; // Reset border

            try {
                // 2. Real Network Request (Formspree)
                const response = await fetch('https://formspree.io/f/mojnakzj', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                });

                if (response.ok) {
                    // 3. UI: Success State
                    btn.innerHTML = '✓';
                    btn.style.background = '#10b981'; // Green
                    btn.style.color = 'white';
                    btn.style.opacity = '1';

                    input.value = ''; // Clear input
                    input.placeholder = 'Subscribed!';

                    // Console Success
                    console.log(`[Newsletter] Sent to Formspree: ${email}`);
                } else {
                    throw new Error('Formspree submission failed');
                }

            } catch (error) {
                console.error(error);
                btn.innerHTML = '❌'; // Error state
                btn.style.background = '#ef4444';
            } finally {
                // 5. Reset UI after delay
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.style.background = ''; // Default
                    btn.style.color = '';      // Default
                    btn.style.pointerEvents = 'all';
                    input.disabled = false;
                    input.placeholder = 'email@domain.com'; // Restore placeholder
                }, 3000);
            }
        };

        btn.addEventListener('click', handleSubscribe);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSubscribe(e);
        });

        // Clear Error on typing
        input.addEventListener('input', () => {
            input.style.borderColor = '';
        });
    }
}

// --- Feature: Dynamic Tech Tooltips ---
// --- Feature: Dynamic Tech Tooltips (Optimized) ---
// --- Feature: Dynamic Tech Tooltips (Optimized) ---
function initTechTooltips() {
    const skills = document.querySelectorAll('.skill-item');
    if (!skills.length) return;

    // Create Tooltip Element
    let tooltip = document.querySelector('.tech-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'tech-tooltip';
        document.body.appendChild(tooltip);
    }

    // GSAP Setup
    let xSet, ySet;
    let isVisible = false;

    if (typeof gsap !== 'undefined') {
        xSet = gsap.quickSetter(tooltip, "x", "px");
        ySet = gsap.quickSetter(tooltip, "y", "px");
    }

    const updatePosition = (x, y) => {
        // Offset for cursor
        const offsetX = 15;
        const offsetY = 15;

        // Viewport Constraints
        const pad = 10;
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const tipRect = tooltip.getBoundingClientRect();
        const tipW = tipRect.width || 200; // Estimate if hidden
        const tipH = tipRect.height || 50;

        let finalX = x + offsetX;
        let finalY = y + offsetY;

        // Right edge check
        if (finalX + tipW > winW - pad) {
            finalX = x - tipW - offsetX;
        }

        // Bottom edge check
        if (finalY + tipH > winH - pad) {
            finalY = y - tipH - offsetY;
        }

        if (xSet && ySet) {
            xSet(finalX);
            ySet(finalY);
        } else {
            tooltip.style.transform = `translate(${finalX}px, ${finalY}px)`;
        }
    };

    skills.forEach(skill => {
        // Hover In
        skill.addEventListener('mouseenter', (e) => {
            const desc = skill.getAttribute('data-desc');
            if (desc) {
                tooltip.textContent = desc;

                // 1. Set Initial Position IMMEDIATELY before showing
                updatePosition(e.clientX, e.clientY);

                // 2. Show
                requestAnimationFrame(() => {
                    tooltip.classList.add('visible');
                    isVisible = true;
                });
            }
        });

        // Hover Out
        skill.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            isVisible = false;
        });

        // Mouse Move (updates position while visible)
        skill.addEventListener('mousemove', (e) => {
            if (isVisible) {
                updatePosition(e.clientX, e.clientY);
            }
        });

        // Click -> Open URL
        skill.addEventListener('click', () => {
            const url = skill.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    // Make skills look clickable
    skills.forEach(skill => skill.style.cursor = 'pointer');
}

// --- Service Worker Registration (Zero Latency) ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Failed', err));
    });
}

// --- Theme Management ---
function initTheme() {
    const toggleBtnFixed = document.getElementById('theme-toggle');
    const toggleBtnNav = document.getElementById('theme-toggle-nav');
    const html = document.documentElement;

    // Icons
    const moonIcon = '<svg class="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    const sunIcon = '<svg class="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

    // Load saved preference
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        const icon = theme === 'dark' ? moonIcon : sunIcon;
        const label = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';

        // Update Fixed Key
        if (toggleBtnFixed) {
            toggleBtnFixed.innerHTML = icon;
            toggleBtnFixed.setAttribute('aria-label', label);
        }
        // Update Nav Key
        if (toggleBtnNav) {
            toggleBtnNav.innerHTML = icon;
            toggleBtnNav.setAttribute('aria-label', label);
        }
    }

    // Toggle Listener Helper
    const toggleTheme = () => {
        const current = localStorage.getItem('theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    };

    if (toggleBtnFixed) toggleBtnFixed.addEventListener('click', toggleTheme);
    if (toggleBtnNav) toggleBtnNav.addEventListener('click', toggleTheme);
}

function renderTracks() {
    const container = document.getElementById('tracks-container');
    if (!container || typeof ZEOSYS_CONFIG === 'undefined') return;

    const fragment = document.createDocumentFragment();

    ZEOSYS_CONFIG.courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'card spotlight-card'; // Added spotlight-card class

        // Chips HTML
        const techHtml = course.tech.map(t =>
            `<span class="chip" title="${t.desc}">${t.name}</span>`
        ).join('');

        // Icon HTML (New)
        const iconHtml = course.icon ?
            `<div class="card-icon" style="color: var(--text-accent); margin-bottom: 1.5rem; width: 48px; height: 48px;">
                ${course.icon}
            </div>` : '';

        card.innerHTML = `
            ${iconHtml}
            <div style="font-size: 0.8rem; color: var(--text-accent); font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.1em;">
                ${course.duration}
            </div>
            <h3 style="font-size: 1.75rem; margin-bottom: 0.75rem; color: var(--text-primary); transition: color 0.2s;">${course.title}</h3>
            <p style="color: var(--text-secondary); font-size: 1rem; margin-bottom: 1.5rem; line-height: 1.6; flex-grow: 1;">${course.outcome}</p>
            <div style="margin-top: auto; display: flex; flex-direction: column; gap: 1rem;">
                <div>${techHtml}</div>
                <!-- WhatsApp Enrollment Integration -->
                <a href="${getWhatsappLink(course.title)}" target="_blank" class="btn-card">Enroll</a>
            </div>
        `;

        // Simple Interaction (Text Color)
        card.addEventListener('mouseenter', () => {
            card.querySelector('h3').style.color = 'var(--text-accent)';
        });
        card.addEventListener('mouseleave', () => {
            card.querySelector('h3').style.color = 'var(--text-primary)';
        });

        fragment.appendChild(card);
    });

    container.appendChild(fragment);

    // Initialize Spotlight Effect
    initSpotlightEffect();
}

// --- Feature: Spotlight (Glow) Effect ---
function initSpotlightEffect() {
    const container = document.getElementById('tracks-container');
    if (!container) return;

    container.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.spotlight-card');

        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}


// Helper: Generate WhatsApp Link
function getWhatsappLink(courseTitle) {
    const phone = "918870095446";
    const text = `Hi Zeosys, I am interested in joining the ${courseTitle} track.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// --- Feature: 3D Tilt Effect (Showcase) ---
// --- Feature: 3D Tilt Effect (Showcase) ---
function initShowcaseTilt() {
    // Disable on touch devices or small screens for performance & usability
    if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 900) return;

    const cards = document.querySelectorAll('.showcase-card');

    cards.forEach(card => {
        let isHovering = false;

        card.addEventListener('mouseenter', () => {
            isHovering = true;
            // Remove the reset class immediately so movement is instant
            card.classList.remove('animate-reset');
        });

        card.addEventListener('mousemove', (e) => {
            if (!isHovering) return;

            // Use rAF to decouple from mouse event rate
            requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Calculate percentage (0 to 1)
                const xPct = x / rect.width;
                const yPct = y / rect.height;

                // Calculate rotation (-15deg to 15deg)
                const rotateX = (0.5 - yPct) * 20;
                const rotateY = (xPct - 0.5) * 20;

                // Apply transform instantly (transition is removed in CSS)
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            isHovering = false;
            // Add reset class for smooth return
            card.classList.add('animate-reset');
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// --- Feature: Advanced Smooth Scroll (Lenis) ---
function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    // "Smooth" scroll with damping to limit fast scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 0.8, // Damping multiplier (Control fast scrolling)
        smoothTouch: false, // Default native for touch
        touchMultiplier: 2,
    });

    // GSAP Sync
    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    } else {
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    window.lenis = lenis;
}

function initScrollAnimations() {
    // Auto-add reveal class to key elements
    const targets = document.querySelectorAll('section:not(.hero), .feature-card, .stat-item, .hub-container, .tech-card-dark, .showcase-card, .testimonial-card, .faq-item');
    targets.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before bottom
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// Advanced UI/UX Init
function initAdvancedUI() {
    // 1. Scroll Guide (Optimized)
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollTop = window.scrollY;
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollPercent = (scrollTop / docHeight) * 100;
                    progressBar.style.height = `${scrollPercent}%`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }



    // 2. Metrics Counter Animation
    const metrics = document.querySelectorAll('.metric-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCount(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    metrics.forEach(metric => observer.observe(metric));

    function animateCount(el, target) {
        let obj = { val: 0 };
        // Use GSAP if available
        if (typeof gsap !== 'undefined') {
            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: "power2.out",
                onUpdate: function () {
                    el.innerText = Math.floor(obj.val).toLocaleString() + (target < 100 ? '%' : '+');
                }
            });
        } else {
            // Fallback
            let current = 0;
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.innerText = target.toLocaleString() + (target < 100 ? '%' : '+');
                    clearInterval(timer);
                } else {
                    el.innerText = Math.floor(current).toLocaleString();
                }
            }, 16);
        }
    }

    // 3. Parallax Effect (Orbs)
    // 3. Parallax Effect (Orbs) - Optimized with GSAP ScrollTrigger
    const orbs = document.querySelectorAll('.ambient-orb');

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        orbs.forEach(orb => {
            const speed = parseFloat(orb.getAttribute('data-speed') || 0.05);

            gsap.to(orb, {
                y: (i, target) => - (document.documentElement.scrollHeight * speed),
                ease: "none",
                scrollTrigger: {
                    trigger: document.body,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0 // Direct sync, use 0.5 or 1 for smoothing if desired
                }
            });
        });
    } else {
        // Fallback
        // Fallback (Optimized)
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    orbs.forEach(orb => {
                        const speed = orb.getAttribute('data-speed') || 0.05;
                        const yPos = -(scrolled * speed);
                        orb.style.transform = `translateY(${yPos}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // 4. GSAP Parallax Footer Reveal
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const footerBg = document.querySelector('.footer-bg');
        const spacer = document.getElementById('footer-parallax');

        function refreshFooter() {
            if (!footerBg || !spacer) return;

            // Sync spacer height to visual footer height
            const h = footerBg.offsetHeight;
            spacer.style.height = `${h}px`;

            // Standard Reveal Effect (Universal)

            // Animation Timeline
            // Linked to the scroll progress of the spacer entering the viewport
            gsap.fromTo(footerBg,
                {
                    yPercent: -50,
                    opacity: 1,       // Visible (but behind glass/blur)
                    filter: "blur(20px) brightness(0.5)" // Dim and blurry initially
                },
                {
                    yPercent: 0,
                    opacity: 1,
                    filter: "blur(0px) brightness(1)",   // Clear and bright
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: spacer,
                        start: "top bottom",
                        end: "bottom bottom",
                        scrub: 1,
                    }
                }
            );
        }

        // Init & Resize
        refreshFooter();
        // Give a moment for layouts to settle
        setTimeout(refreshFooter, 100);

        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
            refreshFooter();
        });
    }
}

