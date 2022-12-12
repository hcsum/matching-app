```
# generate migration
docker exec api npm run typeorm -- migration:generate fuck-you -d src/dataSource.ts 

# run migrations
docker exec api npm run typeorm -- migration:run -d src/dataSource.ts
```