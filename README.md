# Instructions
We will be bind mounting the data directory so results persist.
```
mkdir data
docker build -t adblock_fingerprinting:latest .
docker run  -p 3000:3000 --mount type=bind,source="$(pwd)"/data,target=/usr/src/adblock/data adblock_fingerprinting:latest
```
