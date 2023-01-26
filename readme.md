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
docker exec api value=$(<src/seed.sql) & npm run typeorm query -- -d src/dataSource.ts $value
```

> matching-app@1.0.0 typeorm
> typeorm-ts-node-esm query -d src/dataSource.ts insert into "user" (name, "phoneNumber") values ('John', '13865432100');

### adminer

http://localhost:8080/?pgsql=db&username=postgres&db=matching_app&ns=public
