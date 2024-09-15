## Development

### Start the project

- add `127.0.0.1   local.luudii.com` to /etc/hosts
- run `yarn` in ./server and ./client
- in root dir, run `docker compose up -d` and `docker compose exec server yarn db:init`
- visit http://local.luudii.com:3600
- view server logs, run `docker compose logs -f server`

### DB

db migration in development
```
docker compose exec server yarn prisma migrate dev
```

[postgres adminer](http://localhost:8081/?pgsql=db&username=postgres&db=matching_app&ns=public)


### VS Code extensions

Install VS Code extension:

1. ESLint - to show lint messages on the fly
2. Prettier - to format code on save

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```

## Deployment

```
# build backend
docker compose -f docker-compose.prod.yml up -d --build --force-recreate

# upload client files
./release-client.sh
```

### Testing (outdated)

```
# Enter test container
dev/enter-test-container

# init DB
npm run db:init

# run test
npm run test
```

### Todo

- photo upload
- 先填写资料，提醒用户支付，再人工审核资料
- 消息提醒
- 照片筛选
