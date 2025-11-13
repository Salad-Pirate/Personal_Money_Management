/** @type {import('next').NextConfig} */
const nextConfig = {
  // เปลี่ยนชื่อ option ตาม Next.js 15
  serverExternalPackages: ['tesseract.js'],


  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/**/*.wasm', './node_modules/**/*.proto']
  },
};

export default nextConfig;
