const ZYOSYS_CONFIG = {
    brand: {
        name: "Zyosys",
        slogan: "Learn. Lead. Level up.",
        whatsapp: "919876543210",
        email: "admissions@zyosys.com"
    },
    courses: [
        {
            id: "fullstack",
            title: "Full Stack Mastery",
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
            tech: [
                { name: "React", desc: "UI Library for building interactive interfaces.", url: "https://react.dev" },
                { name: "Node.js", desc: "JavaScript runtime for scalable backend systems.", url: "https://nodejs.org" },
                { name: "PostgreSQL", desc: "Advanced open-source relational database.", url: "https://www.postgresql.org" },
                { name: "Docker", desc: "Platform for containerizing applications.", url: "https://www.docker.com" }
            ],
            outcome: "Build a production-grade SAAS platform.",
            duration: "6 Months",
            level: "Beginner to Pro"
        },
        {
            id: "mobile",
            title: "App Development",
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>`,
            tech: [
                { name: "Flutter", desc: "UI toolkit for building native apps.", url: "https://flutter.dev" },
                { name: "Firebase", desc: "Backend-as-a-Service platform.", url: "https://firebase.google.com" },
                { name: "Dart", desc: "Client-optimized language for fast apps.", url: "https://dart.dev" }
            ],
            outcome: "Deploy live apps to Play Store & App Store.",
            duration: "4 Months",
            level: "Intermediate"
        },
        {
            id: "backend",
            title: "System Design & Backend",
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
            tech: [
                { name: "Go", desc: "Statically typed, compiled language.", url: "https://go.dev" },
                { name: "Microservices", desc: "Architectural style for distributed systems.", url: "https://microservices.io" },
                { name: "AWS", desc: "Cloud computing platform.", url: "https://aws.amazon.com" },
                { name: "Redis", desc: "In-memory data structure store.", url: "https://redis.io" }
            ],
            outcome: "Architect scalable distributed systems.",
            duration: "3 Months",
            level: "Advanced"
        }
    ],
    features: [
    ]
};