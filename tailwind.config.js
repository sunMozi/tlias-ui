export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'bg-pulse': 'bgPulse 12s ease-in-out infinite',
      },
      colors: {
        primary: '#409EFF', // Element Plus 默认主色
        success: '#67C23A',
        warning: '#E6A23C',
        danger: '#F56C6C',
        info: '#909399',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Arial', 'sans-serif'],
        serif: ['KaiTi', 'STKaiti', 'serif'],
      },
      keyframes: {
        bgPulse: {
          '0%, 100%': { backgroundColor: '#0d1b2a' },
          '50%': { backgroundColor: '#132238' },
        },
      },
    },
  },
  plugins: [],
}
