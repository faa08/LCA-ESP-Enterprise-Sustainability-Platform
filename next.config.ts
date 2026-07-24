import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/lca", destination: "/dashboard/lca", permanent: false },
      { source: "/carbon-accounting", destination: "/dashboard/carbon-accounting", permanent: false },
      { source: "/carbon-credit", destination: "/dashboard/carbon-credit", permanent: false },
      { source: "/environmental-monitoring", destination: "/dashboard/environmental-monitoring", permanent: false },
      { source: "/energy-monitoring", destination: "/dashboard/energy-monitoring", permanent: false },
      { source: "/water-monitoring", destination: "/dashboard/water-monitoring", permanent: false },
      { source: "/waste-management", destination: "/dashboard/waste-management", permanent: false },
      { source: "/data-hub", destination: "/dashboard/data-hub", permanent: false },
      { source: "/input", destination: "/dashboard/input", permanent: false },
      { source: "/compliance-management", destination: "/dashboard/compliance", permanent: false },
      { source: "/documents", destination: "/dashboard/documents", permanent: false },
      { source: "/ai-insights", destination: "/dashboard/ai-insights", permanent: false },
      { source: "/settings", destination: "/dashboard/settings", permanent: false },
      { source: "/esg-reporting", destination: "/dashboard/esg-reporting", permanent: false },
    ];
  },
};

export default nextConfig;
