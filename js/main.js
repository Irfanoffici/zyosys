// Fresh Start:// Main JavaScript - Optimized

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderTracks();
    initAdvancedUI();

    if (typeof gsap !== 'undefined') {
        initParallax();
        initFooterReveal();
    }

    initTechTooltips();
});

// --- Feature: Dynamic Tech Tooltips ---
// --- Feature: Dynamic Tech Tooltips (Optimized) ---
function initTechTooltips() {
    const skills = document.querySelectorAll('.skill-item');
    if (!skills.length) return;

    // Create Tooltip Element
    const tooltip = document.createElement('div');
    tooltip.className = 'tech-tooltip';
    document.body.appendChild(tooltip);

    // GSAP Setup
    let xSet, ySet;
    let isVisible = false;

    if (typeof gsap !== 'undefined') {
        xSet = gsap.quickSetter(tooltip, "x", "px");
        ySet = gsap.quickSetter(tooltip, "y", "px");
    }

    skills.forEach(skill => {
        // Hover In
        skill.addEventListener('mouseenter', () => {
            const desc = skill.getAttribute('data-desc');
            if (desc) {
                tooltip.textContent = desc;
                tooltip.classList.add('visible');
                isVisible = true;
            }
        });

        // Hover Out
        skill.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            isVisible = false;
        });

        // Click -> Open URL
        skill.addEventListener('click', () => {
            const url = skill.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    // Follow Cursor (Optimized)
    window.addEventListener('mousemove', (e) => {
        if (!isVisible) return;

        const x = e.clientX + 15;
        const y = e.clientY + 15;

        if (xSet && ySet) {
            xSet(x);
            ySet(y);
        } else {
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        }
    });

    // Mobile Ease: Tap to show is tricky with hover logic, usually better to ignore on touch
    // or rely on active state. We'll stick to hover focus for now.

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
        card.className = 'card';

        // Chips HTML
        const techHtml = course.tech.map(t =>
            `<span class="chip" title="${t.desc}">${t.name}</span>`
        ).join('');

        card.innerHTML = `
            <div style="font-size: 0.8rem; color: var(--text-accent); font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase;">
                ${course.duration}
            </div>
            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--text-primary); transition: color 0.2s;">${course.title}</h3>
            <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.6;">${course.outcome}</p>
            <div style="margin-top: auto; display: flex; flex-direction: column; gap: 1rem;">
                <div>${techHtml}</div>
                <a href="#join" class="btn-card">Enroll</a>
            </div>
        `;

        // Simple Interaction
        card.addEventListener('mouseenter', () => {
            card.querySelector('h3').style.color = 'var(--text-accent)';
        });
        card.addEventListener('mouseleave', () => {
            card.querySelector('h3').style.color = 'var(--text-primary)';
        });

        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}

// Advanced UI/UX Init
function initAdvancedUI() {
    // 1. Scroll Guide
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.height = `${scrollPercent}%`;
        });
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
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            orbs.forEach(orb => {
                const speed = orb.getAttribute('data-speed') || 0.05;
                const yPos = -(scrolled * speed);
                orb.style.transform = `translateY(${yPos}px)`;
            });
        });
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

