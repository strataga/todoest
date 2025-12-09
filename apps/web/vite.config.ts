import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: '::',
    port: 3001,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/__tests__/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/components/ui/**', // shadcn components
        'src/hooks/use-mobile.tsx', // browser API wrapper
        'src/hooks/use-toast.ts', // shadcn toast hook
        'src/types/**', // type definitions
        'src/api/index.ts', // re-exports
      ],
      thresholds: {
        statements: 80,
        branches: 70,  // Redux Toolkit async thunks generate many untestable branches
        functions: 80,
        lines: 80,
      },
    },
  },
}));
