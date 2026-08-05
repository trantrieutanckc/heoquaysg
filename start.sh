#!/bin/bash
fuser -k 3000/tcp 2>/dev/null
sleep 1
exec node --max-old-space-size=450 /home/heoquaybinhtan/app/node_modules/.bin/next start
