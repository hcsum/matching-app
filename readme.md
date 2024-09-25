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

feat:
- 公众号消息推送
- demo mode
- 当活动phase为FINISHED后，未配对的人，跟配对了的人，需要有个UI. 或者不需要FINISHED的状态
- fullscreenloading
- 收钱模式

code:
- extend prisma to always return EventUser (tried, later)