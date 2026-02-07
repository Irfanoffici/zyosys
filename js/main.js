document.addEventListener('DOMContentLoaded', () => {
    // Critical: Apply theme immediately to prevent flash
    initTheme();

    // Critical Content: Render immediately (don't wait for frame/idle)
    renderTracks();

    // Critical Interactivity: Initialize scroll observers early so content is visible "above fold" or just below
    initScrollAnimations();

    // Visual: Defer non-critical visuals
    requestAnimationFrame(() => {
        initShowcaseTilt();
        initNewsletter();
        initTechTooltips();
    });

    // Background: Defer heavy/optional listeners
    setTimeout(() => {
        initDraggableToggle();
        initAdvancedUI();
        initSmoothScroll();
        initLazyFooter();
    }, 50);
});
function initNewsletter() {
    const input = document.querySelector('.newsletter-input');
    const btn = document.querySelector('.newsletter-btn');
    const originalContent = btn ? btn.innerHTML : '';
    if (input && btn) {
        const handleSubscribe = async (e) => {
            if (e) e.preventDefault();
            const email = input.value.trim();
            if (!email || !/\S+@\S+\.\S+/.test(email)) {
                input.focus();
                input.style.borderColor = '#ef4444';
                return;
            }
            btn.innerHTML = '<span class="loader"></span>';
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';
            input.disabled = true;
            input.style.borderColor = '';
            try {
                const response = await fetch('https://formspree.io/f/mojnakzj', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: email })
                });
                if (response.ok) {
                    btn.innerHTML = '✓';
                    btn.style.background = '#10b981';
                    btn.style.color = 'white';
                    btn.style.opacity = '1';
                    input.value = '';
                    input.placeholder = 'Subscribed!';
                } else {
                    throw new Error('Formspree submission failed');
                }
            } catch (error) {
                // Silent error handling for production
                btn.innerHTML = '❌';
                btn.style.background = '#ef4444';
            } finally {
                setTimeout(() => {
                    btn.innerHTML = originalContent;
                    btn.style.background = '';
                    btn.style.color = '';
                    btn.style.pointerEvents = 'all';
                    input.disabled = false;
                    input.placeholder = 'email@domain.com';
                }, 3000);
            }
        };
        btn.addEventListener('click', handleSubscribe);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSubscribe(e);
        });
        input.addEventListener('input', () => {
            input.style.borderColor = '';
        });
    }
}
function initTechTooltips() {
    const skills = document.querySelectorAll('.skill-item');
    if (!skills.length) return;
    let tooltip = document.querySelector('.tech-tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.className = 'tech-tooltip';
        document.body.appendChild(tooltip);
    }
    let xSet, ySet;
    let isVisible = false;
    if (typeof gsap !== 'undefined') {
        xSet = gsap.quickSetter(tooltip, "x", "px");
        ySet = gsap.quickSetter(tooltip, "y", "px");
    }
    const updatePosition = (x, y) => {
        const offsetX = 15;
        const offsetY = 15;
        const pad = 10;
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        const tipRect = tooltip.getBoundingClientRect();
        const tipW = tipRect.width || 200;
        const tipH = tipRect.height || 50;
        let finalX = x + offsetX;
        let finalY = y + offsetY;
        if (finalX + tipW > winW - pad) {
            finalX = x - tipW - offsetX;
        }
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
        skill.addEventListener('mouseenter', (e) => {
            const desc = skill.getAttribute('data-desc');
            if (desc) {
                tooltip.textContent = desc;
                updatePosition(e.clientX, e.clientY);
                requestAnimationFrame(() => {
                    tooltip.classList.add('visible');
                    isVisible = true;
                });
            }
        });
        skill.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            isVisible = false;
        });
        skill.addEventListener('mousemove', (e) => {
            if (isVisible) {
                updatePosition(e.clientX, e.clientY);
            }
        });
        skill.addEventListener('click', () => {
            const url = skill.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
    skills.forEach(skill => skill.style.cursor = 'pointer');
}
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => { })
            .catch(err => { });
    });
}
function initTheme() {
    const toggleBtnFixed = document.getElementById('theme-toggle');
    const toggleBtnNav = document.getElementById('theme-toggle-nav');
    const html = document.documentElement;
    const moonIcon = '<svg class="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    const sunIcon = '<svg class="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        const icon = theme === 'dark' ? moonIcon : sunIcon;
        const label = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        if (toggleBtnFixed) {
            toggleBtnFixed.innerHTML = icon;
            toggleBtnFixed.setAttribute('aria-label', label);
        }
        if (toggleBtnNav) {
            toggleBtnNav.innerHTML = icon;
            toggleBtnNav.setAttribute('aria-label', label);
        }
    }
    const toggleTheme = () => {
        const current = localStorage.getItem('theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
    };
    if (toggleBtnFixed) {
        toggleBtnFixed.addEventListener('click', (e) => {
            if (toggleBtnFixed.dataset.isDragging === 'true') {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            toggleTheme();
        });
    }
    if (toggleBtnNav) toggleBtnNav.addEventListener('click', toggleTheme);
}
function initDraggableToggle() {
    const el = document.getElementById('theme-toggle');
    if (!el) return;
    let isDragging = false;
    let startX, startY, initialLeft, initialTop;
    let hasMoved = false;
    const savedPos = localStorage.getItem('themeTogglePos');
    if (savedPos) {
        const { x, y } = JSON.parse(savedPos);
        const maxX = window.innerWidth - el.offsetWidth;
        const maxY = window.innerHeight - el.offsetHeight;
        const clampX = Math.min(Math.max(0, x), maxX);
        const clampY = Math.min(Math.max(0, y), maxY);
        el.style.left = `${clampX}px`;
        el.style.top = `${clampY}px`;
        el.style.bottom = 'auto';
        el.style.right = 'auto';
    }
    const onMouseDown = (e) => {
        if (e.type === 'mousedown' && e.button !== 0) return;
        isDragging = true;
        hasMoved = false;
        el.style.transition = 'none';
        el.dataset.isDragging = 'false';
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        startX = clientX;
        startY = clientY;
        const rect = el.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchmove', onMouseMove, { passive: false });
        document.addEventListener('touchend', onMouseUp);
    };
    const onMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        const dx = clientX - startX;
        const dy = clientY - startY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            hasMoved = true;
            el.dataset.isDragging = 'true';
        }
        let newLeft = initialLeft + dx;
        let newTop = initialTop + dy;
        const maxLeft = window.innerWidth - el.offsetWidth;
        const maxTop = window.innerHeight - el.offsetHeight;
        newLeft = Math.min(Math.max(0, newLeft), maxLeft);
        newTop = Math.min(Math.max(0, newTop), maxTop);
        el.style.left = `${newLeft}px`;
        el.style.top = `${newTop}px`;
    };
    const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        el.style.transition = '';
        const rect = el.getBoundingClientRect();
        const pos = { x: rect.left, y: rect.top };
        localStorage.setItem('themeTogglePos', JSON.stringify(pos));
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchmove', onMouseMove);
        document.removeEventListener('touchend', onMouseUp);
        setTimeout(() => {
            el.dataset.isDragging = 'false';
        }, 50);
    };
    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('touchstart', onMouseDown, { passive: false });
}

function initLazyFooter() {
    // If desktop (> 1366px), footer is already visible via CSS. No JS needed.
    if (window.innerWidth > 1366) return;

    // Passive listener to reveal footer at 90% scroll
    const onScroll = () => {
        const scrolled = window.scrollY + window.innerHeight;
        const threshold = document.documentElement.scrollHeight * 0.90;

        if (scrolled >= threshold) {
            document.body.classList.add('footer-visible');

            // Force GSAP/ScrollTrigger to re-calculate positions now that footer is visible
            if (typeof ScrollTrigger !== 'undefined') {
                // Small delay to allow display:block to render layout
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 100);
            }

            // Remove listener immediately - Run Once
            window.removeEventListener('scroll', onScroll);
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
}

function renderTracks() {
    const container = document.getElementById('tracks-container');
    if (!container || typeof ZYOSYS_CONFIG === 'undefined') return;
    const fragment = document.createDocumentFragment();
    ZYOSYS_CONFIG.courses.forEach((course, index) => {
        const card = document.createElement('div');
        card.className = 'card spotlight-card reveal';
        // Stagger delay: 100ms per item
        card.style.setProperty('--reveal-delay', `${index * 100}ms`);
        const techHtml = course.tech.map(t =>
            `<span class="chip" title="${t.desc}">${t.name}</span>`
        ).join('');
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
        card.addEventListener('mouseenter', () => {
            card.querySelector('h3').style.color = 'var(--text-accent)';
        });
        card.addEventListener('mouseleave', () => {
            card.querySelector('h3').style.color = 'var(--text-primary)';
        });
        fragment.appendChild(card);
    });
    container.appendChild(fragment);
    initSpotlightEffect();
}
function initSpotlightEffect() {
    const container = document.getElementById('tracks-container');
    if (!container) return;

    // Performance: Throttle mouse events using requestAnimationFrame
    let ticking = false;

    container.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const cards = document.querySelectorAll('.spotlight-card');
                const updates = [];
                // 1. Batch Reads
                cards.forEach(card => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    updates.push({ card, x, y });
                });
                // 2. Batch Writes
                updates.forEach(({ card, x, y }) => {
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true }); // Passive listener for scrolling performance
}
function getWhatsappLink(courseTitle) {
    const phone = "918870095446";
    const text = `Hi Zyosys, I am interested in joining the ${courseTitle} track.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
function initShowcaseTilt() {
    if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 1024) return;
    const cards = document.querySelectorAll('.showcase-card');
    cards.forEach(card => {
        let isHovering = false;
        card.addEventListener('mouseenter', () => {
            isHovering = true;
            card.classList.remove('animate-reset');
        });
        card.addEventListener('mousemove', (e) => {
            if (!isHovering) return;
            requestAnimationFrame(() => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const xPct = x / rect.width;
                const yPct = y / rect.height;
                const rotateX = (0.5 - yPct) * 20;
                const rotateY = (xPct - 0.5) * 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
        });
        card.addEventListener('mouseleave', () => {
            isHovering = false;
            card.classList.add('animate-reset');
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}
function initSmoothScroll() {
    // We are using native CSS smooth scrolling for maximum performance and battery efficiency per user request.
    // This function is kept empty or for any future minimal polyfills if absolutely needed.
    // Ensure <html> has scroll-behavior: smooth in CSS.
    document.documentElement.style.scrollBehavior = 'smooth';
}
function initScrollAnimations() {
    const targets = document.querySelectorAll('section:not(.hero), .feature-card, .stat-item, .hub-container, .tech-card-dark, .showcase-card, .testimonial-card, .faq-item');
    targets.forEach(el => el.classList.add('reveal'));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        // Eager load: Trigger reveal 200px BEFORE element enters viewport
        rootMargin: "0px 0px 200px 0px"
    });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Stagger logic for grids (Testimonials, Showcase, etc.)
    const grids = document.querySelectorAll('.testimonial-bento-grid, .showcase-grid, .stats-grid');
    grids.forEach(grid => {
        const children = grid.querySelectorAll('.reveal');
        children.forEach((child, index) => {
            child.style.setProperty('--reveal-delay', `${index * 100}ms`);
        });
    });
}
function initAdvancedUI() {
    // Disable scroll progress on mobile
    if (window.innerWidth > 768) {
        const progressBar = document.getElementById('scroll-progress');
        if (progressBar) {
            let ticking = false;
            let docHeight = document.documentElement.scrollHeight - window.innerHeight;

            // Re-calculate docHeight on resize to avoid layout thrashing on scroll
            window.addEventListener('resize', () => {
                docHeight = document.documentElement.scrollHeight - window.innerHeight;
            }, { passive: true });

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const scrollTop = window.scrollY;
                        // Avoid calculating docHeight here
                        const scrollPercent = (scrollTop / docHeight) * 100;
                        progressBar.style.height = `${scrollPercent}%`;
                        ticking = false;
                    });
                    ticking = true;
                }
            }, { passive: true });
        }
    }

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
            let current = 0;
            const duration = 2000;
            const step = target / (duration / 16);
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

    // Only enable orb parallax on desktop/non-reduced-motion
    if (window.innerWidth > 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
                        scrub: 0
                    }
                });
            });
        }
    }

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        const footerBg = document.querySelector('.footer-bg');
        const spacer = document.getElementById('footer-parallax');
        function refreshFooter() {
            if (!footerBg || !spacer) return;
            const h = footerBg.offsetHeight;
            spacer.style.height = `${h}px`;

            // Potato Mode: Disable heavy parallax/blur on laptops & mobile
            if (window.innerWidth <= 1366) {
                if (gsap.getTweensOf(footerBg).length) {
                    gsap.killTweensOf(footerBg);
                    gsap.set(footerBg, { clearProps: "all" });
                }
                return;
            }

            gsap.fromTo(footerBg,
                {
                    yPercent: -50,
                    opacity: 1,
                    filter: "blur(20px) brightness(0.5)"
                },
                {
                    yPercent: 0,
                    opacity: 1,
                    filter: "blur(0px) brightness(1)",
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
        refreshFooter();
        setTimeout(refreshFooter, 100);
        window.addEventListener('resize', () => {
            ScrollTrigger.refresh();
            refreshFooter();
        });
    }
}