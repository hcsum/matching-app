### Development

Start the project:

```
# build the backend image, in project root,
docker compose -f docker-compose.dev.yml build

# start backend
docker compose -f docker-compose.dev.yml up -d

# print logs
docker logs -f api

# start frontend
cd ./frontend
npm i
npm start

# initilize DB
dev/reload-db
```

DB migration:

```
# generate migration file
# 当对model进行了修改，需要跑以下命令让typeorm根据model的改动生成新的db migration文件
# 如首次跑项目，跳过此步，直接执行下一步
docker exec api npm run typeorm -- migration:generate ./src/migrations/sync -d src/data-source.ts -p

# run migrations
# migration文件生成后，需要跑以下命令，typeorm会自动把未执行过的migration都执行
docker exec api npx typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts
```

Go into api docker container for debugging

```
docker compose -f docker-compose.dev.yml exec api /bin/bash
```

### Urls

#### Local

postgres adminer: http://localhost:8080/?pgsql=db&username=postgres&db=matching_app&ns=public
api: http://localhost:4000
frontend: http://localhost:3000/matching-event/36cffe10-3f93-40f3-96be-26cb42399955

### Modeling

![modeling](./modeling.png)
