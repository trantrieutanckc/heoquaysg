module.exports = {
  apps: [
    {
      name: "heoquaybinhtan",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/home/heoquaybinhtan/app",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      restart_delay: 3000,
      max_restarts: 10,
      exp_backoff_restart_delay: 100,
      max_memory_restart: "500M",
      node_args: "--max-old-space-size=450",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
}
