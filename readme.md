```
# generate migration
docker exec api npm run typeorm -- migration:generate <migration-name> -d src/dataSource.ts 

# run migrations
docker exec api npx typeorm-ts-node-commonjs migration:run -d ./src/dataSource.ts
```

### adminer
http://localhost:8080/?pgsql=db&username=postgres&db=matching_app&ns=public