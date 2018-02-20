# Use Node 7 as a base image
FROM node:7.10.0

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

# No need to run JSPM install, as the JSPM files have already been brought over from the COPY command
# We decide not to bring over the NPM files as it saves us from needing to upload even data over the wire. More
# importantly, we need to build some of the NPM dependencies within the container environment to ensure that they work
# as intended (e.g. node-sass)
RUN npm install;

# Expose port 80
EXPOSE 80

# Run app.js when the container launches
# Yes, we are assuming that all the production compression has already been done prior to this container even
# being generated in the first place. Not ideal, but simplifies things in terms of configuring this container
CMD ["node", "app.js"]