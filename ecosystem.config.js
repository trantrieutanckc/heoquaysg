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
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
}
