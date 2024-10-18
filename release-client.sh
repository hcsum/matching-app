#!/bin/bash

# Load environment variables
set -a
source .env
set +a

echo "Building client..."
docker compose exec client yarn build
echo "Copying build files to server..."
scp -i "$SSH_KEY_PATH" -r ./client/build/* "root@$SERVER_IP:$REMOTE_PATH"
echo "Done!"
