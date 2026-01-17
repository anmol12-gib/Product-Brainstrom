import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // React Compiler handles manual useMemo/useCallback automatically
          ["babel-plugin-react-compiler", { target: "19" }], 
        ],
      },
    }),
    tailwindcss(), // Native v4 integration for high-speed styling
  ],
});