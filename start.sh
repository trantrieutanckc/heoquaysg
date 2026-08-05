#!/bin/bash
fuser -k 3000/tcp 2>/dev/null
sleep 1
exec node /home/heoquaybinhtan/app/node_modules/.bin/next start
