module.exports = {
  apps: [
    {
      name: "heoquaybinhtan",
      script: "start.sh",
      interpreter: "/bin/bash",
      cwd: "/home/heoquaybinhtan/app",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      restart_delay: 3000,
      max_restarts: 10,
      exp_backoff_restart_delay: 100,
      kill_timeout: 10000,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
}
