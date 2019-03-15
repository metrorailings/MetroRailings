# Use Node 11 as a base image
FROM node:11

# Set the working directory to /app
WORKDIR /app

# Copy all necessary files into the container at /app
COPY /client/images /app/client/images/
COPY /client/styles /app/client/styles/
COPY /client/views /app/client/views/
COPY /client/scripts/plugins /app/client/scripts/plugins
COPY /client/scripts/jspm_packages /app/client/scripts/jspm_packages
COPY /client/scripts/jspm_config.js /app/client/scripts/jspm_config.js
COPY /client/scripts/systemConfig.js /app/client/scripts/systemConfig.js
COPY /config /app/config
COPY /controllers /app/controllers
COPY /data /app/data
COPY /prod /app/prod
COPY /quotes /app/quotes
COPY /shared /app/shared
COPY /utility /app/utility
COPY /validators /app/validators
COPY /app.js /app/app.js
COPY /Dockerfile /app/Dockerfile
COPY /favicon.ico /app/favicon.ico
COPY /package.json /app/package.json
COPY /robots.txt /app/robots.txt
COPY /.ssl /app/.ssl
COPY /external /app/external
COPY /external/processGallery.sh /etc/cron.daily/processGallery.sh

# Only uncomment the below should we're testing in a local dev environment
# COPY /client/scripts/ /app/client/scripts

RUN  apt-get update
     # See https://crbug.com/795759
RUN apt-get install -yq libgconf-2-4
     # Install latest chrome dev package, which installs the necessary libs to
     # make the bundled version of Chromium that Puppeteer installs work.
RUN apt-get install -y wget --no-install-recommends
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update
RUN apt-get install -y google-chrome-unstable --no-install-recommends
RUN rm -rf /var/lib/apt/lists/*
RUN wget --quiet https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh -O /usr/sbin/wait-for-it.sh
RUN chmod +x /usr/sbin/wait-for-it.sh

# No need to run JSPM install, as the JSPM files have already been brought over from the COPY command
# We decide not to bring over the NPM files as it saves us from needing to upload even more data over the wire. More
# importantly, we need to build some of the NPM dependencies within the container environment to ensure that they work
# as intended (e.g. node-sass)
RUN npm install;

# Expose port 80
EXPOSE 80

# Run app.js when the container launches
# Yes, we are assuming that all the production compression has already been done prior to this container even
# being generated in the first place. Not ideal, but simplifies things in terms of configuring this container
CMD ["node", "app.js"]