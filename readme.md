# Speed Dating Event Manager
A full-stack web application for organizing and managing speed dating events. This platform streamlines the entire speed dating process from registration to matches.

## Features

- Event Management: Dashboard for organizers to monitor attendee lists and manage event progress
- User Authentication: Secure login and registration system (WeChat login)
- Payment Integration: Built-in payment processing for event tickets
- Profile Management: Photo upload and personal details management (Tencent COS bucket)
- Match System: Algorithm for pairing compatible attendees
- Results Portal: Private interface for viewing and managing matches

## Development

### Start the project

- add `127.0.0.1   local.cuyuan.cc` to /etc/hosts
- run `yarn` in ./server and ./client
- in root dir, run `docker compose up -d` and `docker compose exec server yarn db:init`
- visit http://local.cuyuan.cc:3600
- view server logs, run `docker compose logs -f server`

### DB

db migration in development
```
docker compose exec server yarn prisma migrate dev
```

[postgres adminer](http://localhost:8081/?pgsql=db&username=postgres&db=matching_app&ns=public)


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

