# Instructions
We will be bind mounting the data directory so results persist.
```
mkdir data
mkdir extensions
docker build -t adblock_fingerprinting:latest .
docker run  -p 3000:3000 --mount type=bind,source="$(pwd)"/data,target=/usr/src/adblock/data adblock_fingerprinting:latest
```

You also need to download and unzip the adblocker from https://crxextractor.com/ and place it under extensions
```
extensions
|
|
------ adblock
        |
        |
        ------- ....
```

Run `npm i` to ensure that all dependencies are installed. 
Run `npx tsc` to compile TypeScript files into JS files and then run `node engine.ts` to launch the scraper.