const isLowEnd = checkLowEndDevice();

document.addEventListener('DOMContentLoaded', () => {
    if (isLowEnd) {
        document.documentElement.classList.add('is-low-end');
        console.log('Low-end device detected: Enabling performance mode.');
    }

    initTheme();
    initDraggableToggle();
    renderTracks();

    // Only init heavy UI on high-end devices
    if (!isLowEnd) {
        initAdvancedUI();
        initShowcaseTilt();
        initSmoothScroll();
        initScrollAnimations();
    } else {
        // Fallback for scroll animations on low-end
        document.querySelectorAll('.reveal').forEach(el => el.style.opacity = '1');
    }

    initTechTooltips();
    initNewsletter();
});

function checkLowEndDevice() {
    // 1. Check logical cores ( <= 4 usually means older/budget mobile)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return true;

    // 2. Check device memory ( <= 4GB RAM)
    if (navigator.deviceMemory && navigator.deviceMemory <= 4) return true;

    // 3. Check data saver mode
    if (navigator.connection && navigator.connection.saveData) return true;

    // 4. Check network speed (effectiveType: 'slow-2g', '2g', '3g')
    if (navigator.connection && ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType)) return true;

    // 5. Check user preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;

    return false;
}
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
                console.error(error);
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

    // Cache window dimensions to avoid excessive reads during mousemove
    let winW = window.innerWidth;
    let winH = window.innerHeight;
    window.addEventListener('resize', () => {
        winW = window.innerWidth;
        winH = window.innerHeight;
    }, { passive: true });

    let isVisible = false;
    let currentDesc = '';

    // Throttle position updates
    let mouseX = 0, mouseY = 0;
    let isTicking = false;

    const updateTooltipPos = () => {
        if (!isVisible) return;

        const offsetX = 15;
        const offsetY = 15;
        const pad = 10;

        // Use cached tip dimensions if possible, or read once
        // For dynamic content, we might need to read this, but let's assume fixed size for perf or read rarely
        // Actually, reading offsetWidth/Height is essential if content changes, but let's do it safely
        const tipW = tooltip.offsetWidth || 200;
        const tipH = tooltip.offsetHeight || 50;

        let finalX = mouseX + offsetX;
        let finalY = mouseY + offsetY;

        if (finalX + tipW > winW - pad) {
            finalX = mouseX - tipW - offsetX;
        }
        if (finalY + tipH > winH - pad) {
            finalY = mouseY - tipH - offsetY;
        }

        tooltip.style.transform = `translate3d(${finalX}px, ${finalY}px, 0)`;
        isTicking = false;
    };

    skills.forEach(skill => {
        skill.addEventListener('mouseenter', (e) => {
            currentDesc = skill.getAttribute('data-desc');
            if (currentDesc) {
                tooltip.textContent = currentDesc;
                isVisible = true;
                tooltip.classList.add('visible');
                // Initial update
                mouseX = e.clientX;
                mouseY = e.clientY;
                requestAnimationFrame(updateTooltipPos);
            }
        });

        skill.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            isVisible = false;
        });

        skill.addEventListener('mousemove', (e) => {
            if (isVisible) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                if (!isTicking) {
                    requestAnimationFrame(updateTooltipPos);
                    isTicking = true;
                }
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
        // Use transform for positioning to avoid layout thrashing
        el.style.transform = `translate3d(${clampX}px, ${clampY}px, 0)`;
        el.style.left = '0';
        el.style.top = '0';
        // Store current position for drag calculations
        el.dataset.posX = clampX;
        el.dataset.posY = clampY;
    } else {
        // Initialize default position
        const rect = el.getBoundingClientRect();
        el.dataset.posX = rect.left;
        el.dataset.posY = rect.top;
        el.style.left = '0';
        el.style.top = '0';
        el.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
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
        // Get current transform values or default to computed style
        const transform = new WebKitCSSMatrix(window.getComputedStyle(el).transform);
        initialLeft = transform.m41;
        initialTop = transform.m42;

        // Update stored position
        el.dataset.posX = initialLeft;
        el.dataset.posY = initialTop;
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

        el.style.transform = `translate3d(${newLeft}px, ${newTop}px, 0)`;
        el.dataset.posX = newLeft;
        el.dataset.posY = newTop;
    };
    const onMouseUp = () => {
        if (!isDragging) return;
        isDragging = false;
        el.style.transition = '';
        const rect = el.getBoundingClientRect();
        const pos = { x: parseFloat(el.dataset.posX), y: parseFloat(el.dataset.posY) };
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
function renderTracks() {
    const container = document.getElementById('tracks-container');
    if (!container || typeof ZYOSYS_CONFIG === 'undefined') return;
    const fragment = document.createDocumentFragment();
    ZYOSYS_CONFIG.courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'card spotlight-card';
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
    // Heavy effect: disable on low-end devices
    if (checkLowEndDevice()) return;

    const container = document.getElementById('tracks-container');
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
function getWhatsappLink(courseTitle) {
    const phone = "918870095446";
    const text = `Hi Zyosys, I am interested in joining the ${courseTitle} track.`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
function initShowcaseTilt() {
    if (window.matchMedia('(hover: none)').matches || window.innerWidth <= 900 || checkLowEndDevice()) return;
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
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 0.8,
        smoothTouch: false,
        touchMultiplier: 2,
    });
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
        rootMargin: "0px 0px -50px 0px"
    });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
function initAdvancedUI() {
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
    const metrics = document.querySelectorAll('.metric-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                // duplicate decl removed
                // Skip animation if low-end device or reduced motion
                if (checkLowEndDevice()) {
                    entry.target.innerText = target.toLocaleString() + (target < 100 ? '%' : '+');
                } else {
                    animateCount(entry.target, target);
                }
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
    const orbs = document.querySelectorAll('.ambient-orb');
    if (checkLowEndDevice()) return;

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
    } else {
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
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        const footerBg = document.querySelector('.footer-bg');
        const spacer = document.getElementById('footer-parallax');
        function refreshFooter() {
            if (!footerBg || !spacer) return;
            const h = footerBg.offsetHeight;
            spacer.style.height = `${h}px`;
            gsap.fromTo(footerBg,
                {
                    yPercent: -50,
                    opacity: 1,
                    filter: "blur(20px) brightness(0.5)" // Restored blur effect
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