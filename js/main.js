// Fresh Start: Minimal & Efficient JS

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderTracks();
});

function initTheme() {
    const btnDark = document.getElementById('btn-dark');
    const btnLight = document.getElementById('btn-light');
    const html = document.documentElement;

    // Load saved preference
    const saved = localStorage.getItem('theme') || 'dark';
    setTheme(saved);

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update button states
        if (theme === 'dark') {
            btnDark.classList.add('active');
            btnLight.classList.remove('active');
        } else {
            btnLight.classList.add('active');
            btnDark.classList.remove('active');
        }
    }

    // Listeners
    if (btnDark) {
        btnDark.addEventListener('click', () => setTheme('dark'));
    }
    if (btnLight) {
        btnLight.addEventListener('click', () => setTheme('light'));
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
}
