FROM buildkite/puppeteer AS puppeteer_builder
FROM node
# Some help from http://www.smartjava.org/content/using-puppeteer-in-docker-copy-2/
RUN apt-get update &&\
apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
xvfb x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps
RUN apt install -y chromium
RUN mkdir -p /usr/src/adblock
WORKDIR /usr/src/adblock
# Put any npm install lines below this one!
COPY --from=puppeteer_builder /node_modules /node_modules
COPY website_list.json .
COPY app.js .
COPY extensions ./extensions
RUN ln -s /usr/bin/chromium /usr/bin/chromium-browser
ENV DISPLAY :99
CMD Xvfb :99 -screen 0 1024x768x16 & sleep 10 && node app.js
# CMD while true; do echo .; sleep 5; done
