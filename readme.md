## Development

### Start the project

```
# use correct node version
nvm use

# start DB and backend
cd ./server
npm ci
docker compose up -d
dev/reload-db
cd ./client
npm ci
npm run start

```

### DB migration

如对 model 进行了修改，需要跑以下命令让 typeorm 根据 model 的改动生成新的 db migration 文件

```
# generate migration file
docker exec api npm run typeorm -- migration:generate ./src/migrations/sync -p

# run migrations
# migration文件生成后，需要跑以下命令，typeorm会自动把未执行过的migration都执行
docker exec api npm run typeorm -- migration:run

# check if current models are align with migrations
docker exec api npm run typeorm -- schema:log
```

### URL

[postgres adminer](http://localhost:8080/?pgsql=db&username=postgres&db=matching_app&ns=public)

[api](http://localhost:4000)

[frontend](http://localhost:3000)

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

No CI/CD yet. To deploy, follow these steps,

```
# Build client
npm run build

# copy build folder to VPS
scp -r ./build ubuntu@106.53.112.233:/home/ubuntu/postgres-playground/server

# SSH into the VPS, and pull the latest repo changes
ssh ubuntu@106.53.112.233

# build backend
docker-compose -f docker-compose.prod.yml -p matching-app-prod build api

# run containers
docker-compose -f docker-compose.prod.yml -p matching-app-prod up -d --force-recreate api

# run DB migration
docker-compose -f docker-compose.prod.yml -p matching-app-prod exec api sh
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

- deal with user profile filling time. right now it is tight with event phase. there is no way knowing if user has filled in or not. also, what if user join after event pass enrolling phase
- gotcha before requesting sms
- cache will be removed after redeploy?
- login user redirect to user home or event home when visited welcome
- bug: new participant (w/o profile) after picking, still can repick
