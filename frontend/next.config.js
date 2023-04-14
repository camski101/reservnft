/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    trailingSlash: true,
    env: {
        GRAPH_URI: process.env.GRAPH_URI,
    },
}

module.exports = nextConfig
