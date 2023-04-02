## Development

### Start the project

```
# use correct node version
nvm use

# start DB and backend
docker compose up -d

# initilize DB
dev/reload-db

# start client
cd ./client && npm run start

```

### DB migration

如对 model 进行了修改，需要跑以下命令让 typeorm 根据 model 的改动生成新的 db migration 文件

```
# generate migration file
docker exec api npm run typeorm -- migration:generate ./server/src/migrations/sync -d ./server/src/data-source.ts -p

# run migrations
# migration文件生成后，需要跑以下命令，typeorm会自动把未执行过的migration都执行
docker exec api npx typeorm-ts-node-commonjs migration:run -d ./server/src/data-source.ts
```

### Docker 相关

```
# print logs
docker logs -f api

# if made change to Dockerfile, need to rebuild image to take effect

# if made change to docker-compose.yml, no need to rebuild image, just remove and start container again

# go into api docker container for debugging
docker compose exec api bash
```

### URL

[postgres adminer](http://localhost:8080/?pgsql=db&username=postgres&db=matching_app&ns=public)

[api](http://localhost:4000)

[frontend](http://localhost:3000/matching-event/36cffe10-3f93-40f3-96be-26cb42399955)

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

## Production

```
# start
docker compose -f docker-compose.prod.yml -d up

# db migration
docker compose -f docker-compose.prod.yml exec api-prod sh
node_modules/typeorm/cli.js migration:run -d dist/data-source.js
```

