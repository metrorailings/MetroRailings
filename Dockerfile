# Use Node 7 as a base image
FROM node:7.10.0

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents (minus the files relating to any Node dependencies) into the container at /app
ADD . /app

# No need to run JSPM install, as the JSPM files have already been brought over from the ADD command
# We decide not to bring over the NPM files as it saves us from needing to upload even data over the wire. More
# importantly, we need to build some of the NPM dependencies within the container environment to ensure that they work
# as intended (e.g. node-sass)
RUN cd app; npm install;

# Expose port 80
EXPOSE 80

# Run app.js when the container launches
# Yes, we are assuming that all the production compression has already been done prior to this container even
# being generated in the first place. Not ideal, but simplifies things in terms of configuring this container
CMD ["node", "app.js"]