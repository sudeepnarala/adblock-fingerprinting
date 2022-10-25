FROM buildkite/puppeteer AS puppeteer_builder
FROM browserless/chrome
USER root
RUN mkdir /usr/src/adblock
WORKDIR /usr/src/adblock
# Put any npm install lines below this one!
COPY --from=puppeteer_builder /node_modules /node_modules=
COPY website_list.json .
COPY app.js .
# Unfortunately needs to be set back to run start.sh
WORKDIR /usr/src/app
ENV root_directory="/usr/src/adblock"
CMD ./start.sh & sleep 5 && node ../adblock/app.js && exit