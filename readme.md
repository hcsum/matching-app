## Development

### Start the project

```
docker compose up -d
docker compose exec server yarn typeorm migration:run
docker compose exec server yarn ts ./src/seed-data/seed.ts
```

### DB

```
# 如对 model 进行了修改，需要跑以下命令让 typeorm 根据 model 的改动生成新的 db migration 文件
docker compose exec server yarn typeorm migration:generate ./src/migrations/sync -p
docker compose exec server yarn typeorm migration:run

# check if current models are align with migrations
docker compose exec server yarn typeorm schema:log
```

### URL

[postgres adminer](http://localhost:8081/?pgsql=db&username=postgres&db=matching_app&ns=public)

[server](http://localhost:4000)

[client](http://localhost:3040)

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

# run DB migration
docker compose -f docker-compose.prod.yml exec server sh
node_modules/typeorm/cli.js migration:run -d dist/data-source.js

# upload client files
./release-client.sh
```

### Testing

```
# Enter test container
dev/enter-test-container

# init DB
npm run db:init

# run test
npm run test
```

### Todo

- 先填写资料，提醒用户支付，再人工审核资料

- 用户何时跟 event 绑定
- 用户何时填 profile，bio，上传照片

- 消息提醒

- 照片筛选

- gotcha before requesting sms
- cache will be removed after redeploy?
- login user redirect to user home or event home when visited welcome
