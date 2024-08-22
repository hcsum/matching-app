## Development

### Start the project

```
docker compose up -d
```

### DB migration

如对 model 进行了修改，需要跑以下命令让 typeorm 根据 model 的改动生成新的 db migration 文件

```
# generate migration file
docker compose exec server yarn typeorm migration:generate ./src/migrations/sync -p

# migration文件生成后，需要跑以下命令，typeorm会自动把未执行过的migration都执行
docker compose exec server yarn typeorm migration:run

# seed data
docker compose exec server yarn ts ./src/seed-data/seed.ts

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
# Build client
npm run build

# copy build folder to VPS
scp -i ~/.ssh/my-mac-alicloud-hk.pem -r ./build root@8.217.183.255:/root/nginx-certbot/data/www/html/matching-app

# SSH into the VPS, and pull the latest repo changes

# build backend
docker compose -f docker-compose.prod.yml -p matching-app-prod build api

# run containers
docker compose -f docker-compose.prod.yml -p matching-app-prod up -d --force-recreate api

# run DB migration
docker compose -f docker-compose.prod.yml -p matching-app-prod exec api sh
node_modules/typeorm/cli.js migration:run -d dist/data-source.js
```

To try to production docker compose in local, need to `docker compose stop` first to avoid any port conflict

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
