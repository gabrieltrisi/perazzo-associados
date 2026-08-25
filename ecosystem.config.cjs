// Config do PM2 (gerenciador de processo) para rodar o Next em produção no VPS.
// Uso: pm2 start ecosystem.config.cjs && pm2 save
module.exports = {
  apps: [
    {
      name: 'perazzo',
      cwd: '/var/www/perazzo',
      script: './node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      max_memory_restart: '600M',
      env: {
        NODE_ENV: 'production',
        PORT: '3000',
      },
    },
  ],
};
