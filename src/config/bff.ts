const BFFConfig = {
    host: process.env.NODE_ENV === 'development' 
        ? (typeof window !== 'undefined' ? '/api/proxy' : 'http://localhost:8080/api/v1')
        : "https://api.relifaid.org/api/v1",
    localhost: "http://localhost:8080/api/v1",
    production: "https://api.relifaid.org/api/v1",
};

export { BFFConfig };
