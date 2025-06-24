import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "m1.spitogatos.gr",  // Προσθήκη του νέου host
      "m3.spitogatos.gr",
      "m2.spitogatos.gr" ,
      "m4.spitogatos.gr" ,
      "m5.spitogatos.gr"   // Υπάρχον host
    ],
    
    // ALTERNATIVA (Next.js 13+):
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: '**.spitogatos.gr', // Wildcard για όλους τους subdomains
    //   }
    // ]
  },
};

export default nextConfig;