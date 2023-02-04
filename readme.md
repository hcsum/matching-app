```
# start project locally
docker compose up -d

# pring logs locally
docker logs -f api

# generate migration
docker exec api npm run typeorm -- migration:generate ./src/migrations/<migration-name> -d src/dataSource.ts -p

# run migrations
docker exec api npx typeorm-ts-node-commonjs migration:run -d ./src/dataSource.ts

# seed data
```

### adminer

http://localhost:8080/?pgsql=db&username=postgres&db=matching_app&ns=public

### todo

- wechat payment integration
- app nav flow
