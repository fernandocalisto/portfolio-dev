import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Populate process.env with GEMINI_API_KEY for local API dev execution
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }
  if (env.TELEGRAM_BOT_TOKEN) {
    process.env.TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
  }
  if (env.TELEGRAM_CHAT_ID) {
    process.env.TELEGRAM_CHAT_ID = env.TELEGRAM_CHAT_ID;
  }

  return {
    plugins: [
      react(),
      {
        name: 'vite-dev-api-chat',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            try {
              // Dynamically load the TypeScript API handler in Vite's runtime
              const { default: handler } = await server.ssrLoadModule('./api/chat.ts');
              await handler(req, res);
            } catch (err: any) {
              console.error('[Vite dev /api/chat error]:', err);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    error: err?.message || 'Erro interno no servidor de desenvolvimento.',
                  })
                );
              }
            }
          });

          server.middlewares.use('/api/contact', async (req, res) => {
            try {
              const { default: handler } = await server.ssrLoadModule('./api/contact.ts');
              await handler(req, res);
            } catch (err: any) {
              console.error('[Vite dev /api/contact error]:', err);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    error: err?.message || 'Erro interno no servidor de desenvolvimento.',
                  })
                );
              }
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: true,
      port: 3000,
      open: false,
    },
  };
});
