const nextConfig = {
  images: {
    domains: ['example.com'], // Add your image domains here
    unoptimized: false, // Ensure images are optimized
  },
  experimental: {
    compression: true, // Enable compression
    // Enable new features here if needed
  },
};

export default nextConfig;
