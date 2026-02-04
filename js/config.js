
const ZEOSYS_CONFIG = {
    brand: {
        name: "Zeosys",
        slogan: "Learn. Lead. Level up.",
        whatsapp: "919876543210",
        email: "admissions@zeosys.com"
    },
    courses: [
        {
            id: "fullstack",
            title: "Full Stack Mastery",
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
        // Features list if we want to make that dynamic too
    ]
};
