import Color from "color";

function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  const bigint = parseInt(hex, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255
  ];
}

function rgbToHex([r, g, b]) {
  return '#' + [r, g, b]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

function mixColors(color1, color2, weight) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const w1 = weight / 100;
  const w2 = 1 - w1;

  const mixed = rgb1.map((c1, i) => Math.round(c1 * w1 + rgb2[i] * w2));
  return rgbToHex(mixed);
}

function tintColor(baseColor, weight) {
  return mixColors('#ffffff', baseColor, weight);
}

function shadeColor(baseColor, weight) {
  return mixColors('#000000', baseColor, weight);
}

/** @type {import('tailwindcss').Config} */
const generateShades = (baseColor) => ({
  DEFAULT: baseColor,
  50: tintColor(baseColor, 95),
  100: tintColor(baseColor, 80),
  400: Color(baseColor).lighten(0.2).hex(),
  500: baseColor,
  600: Color(baseColor).darken(0.2).hex(),
  800: Color(baseColor).darken(0.5).hex(),
});

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    ...[
      "primary",
      "secondary",
      "danger",
      "success",
      "warning",
      "info",
      "light",
      "dark",
    ].flatMap((v) => [
      `btn-${v}`,
      `btn-outline-${v}`,
      `alert-${v}`,
      `badge-${v}`,
      `text-${v}`,
      `bg-${v}`,
      `bg-${v}-50`,
      `bg-${v}-100`,
      `bg-${v}-800`,
      `hover:bg-${v}-800`,
    ]),
    { pattern: /^col-span-(1|2|3|4|5|6|7|8|9|10|11|12)$/ },
    { pattern: /^sm:col-span-(1|2|3|4|5|6|7|8|9|10|11|12)$/ },
    { pattern: /^md:col-span-(1|2|3|4|5|6|7|8|9|10|11|12)$/ },
    { pattern: /^lg:col-span-(1|2|3|4|5|6|7|8|9|10|11|12)$/ },
    { pattern: /^xl:col-span-(1|2|3|4|5|6|7|8|9|10|11|12)$/ },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: generateShades('#3b82f6'),
        secondary: generateShades('#6c757d'),
        success: generateShades('#10b981'),
        danger: generateShades('#ef4444'),
        warning: generateShades('#f59e0b'),
        info: generateShades('#06b6d4'),
        light: generateShades('#f9fafb'),
        dark: generateShades('#111827'),
        pink: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
