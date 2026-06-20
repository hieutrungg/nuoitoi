/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Pixel/display dùng Pixelify Sans, nhưng luôn có Be Vietnam Pro phía sau
        // làm fallback phủ đủ dấu tiếng Việt -> không bao giờ lỗi glyph.
        pixel: ['"Pixelify Sans"', '"Be Vietnam Pro"', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(2px)' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-40px)', opacity: '0' },
        },
      },
      animation: {
        breathe: 'breathe 2.5s ease-in-out infinite',
        floatUp: 'floatUp 1.2s ease-out forwards',
      },
    },
  },
  plugins: [],
};
