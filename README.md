`docker-compose up` -> should initialize database and start collecting service.
Collecting service runs cronjob every hour.
This comand should enouth start collect ads on new enveroment.

Adding/changing filters

Filters are stored on `src/appData/simasData/activeFilters.ts` file.
Check `src/appData/makeModels.ts` for be sure that model exist.
After edit this file need rebuild images and containers `docker-compose up --build`.

Mail sending settings

Please add mail creditionals to `src/jobs/collector.ts` and run `docker-compose up --build` for rebuild. 

