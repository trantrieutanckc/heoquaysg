module.exports = {
  apps: [
    {
      name: "heoquaybinhtan",
      script: "node_modules/.bin/next",
      args: "start",
      cwd: "/home/heoquaybinhtan/app",
      instances: 1,
      autorestart: true,
      watch: false,
      restart_delay: 3000,
      max_restarts: 10,
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
}
