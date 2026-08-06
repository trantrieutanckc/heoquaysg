#!/bin/bash
pkill -f "node.*next" 2>/dev/null
sleep 1
fuser -k 3000/tcp 2>/dev/null
sleep 1
chmod 644 /home/heoquaybinhtan/app/ecosystem.config.js
exec node --max-old-space-size=450 /home/heoquaybinhtan/app/node_modules/.bin/next start
