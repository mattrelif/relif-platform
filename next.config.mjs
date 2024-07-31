/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        // removeConsole: {
        //     exclude: ["error"]
        // },
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "github.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
    async redirects() {
        return [
            {
                source: "/:lang/app/:id/preferences/my-organization",
                destination: "/:lang/app/:id/preferences/my-organization/overview",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
