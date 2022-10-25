FROM browserless/chrome
USER root
RUN mkdir /usr/src/adblock
WORKDIR /usr/src/adblock
# RUN export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
# RUN export PUPPETEER_EXECUTABLE_PATH="/usr/src/app/chromium-1028/chrome-linux/chrome"
# RUN npm install puppeteer --unsafe-perm=true --allow-root
# RUN CHROME_BIN="/usr/src/app/chromium-1028/chrome-linux/chrome"
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN npm install puppeteer
ADD website_list.json .
ADD app.js .
WORKDIR /usr/src/app
CMD ./start.sh & sleep 5 && node ../adblock/app.js && exit