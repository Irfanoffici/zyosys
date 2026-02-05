// Fresh Start: Minimal & Efficient JS

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderTracks();
});

function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
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

        // Update Icon
        if (toggleBtn) {
            toggleBtn.innerHTML = theme === 'dark' ? moonIcon : sunIcon;
            toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        }
    }

    // Toggle Listener
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const current = localStorage.getItem('theme') || 'dark';
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });
    }
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

    // 3. Parallax Effect (Orbs)
    const orbs = document.querySelectorAll('.ambient-orb');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        orbs.forEach(orb => {
            const speed = orb.getAttribute('data-speed') || 0.05;
            const yPos = -(scrolled * speed);
            orb.style.transform = `translateY(${yPos}px)`;
        });
    });

    // 4. Footer Reveal Adjustment (Dynamic Margin)
    const footer = document.querySelector('footer');
    const mainContainer = document.querySelector('.container');

    function adjustFooterSpace() {
        if (footer && mainContainer) {
            const footerHeight = footer.offsetHeight;
            mainContainer.style.marginBottom = `${footerHeight}px`;
        }
    }

    // Run on load and resize
    adjustFooterSpace();
    window.addEventListener('resize', adjustFooterSpace);
}
