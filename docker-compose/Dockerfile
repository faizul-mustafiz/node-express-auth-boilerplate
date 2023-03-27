FROM node:18-alpine
# where will be the project files will be listed inside the dontainer
WORKDIR /app
# copy the package.json and package-lock.json first to the workdir
COPY package.json package-lock.json ./
# run npm clean install to install all the dependencies first
RUN npm ci
# then copy all the project files to the workdir except the files listed in .dockerignore
COPY . .
# run the logFile.generator.js file to generate the logfile inside the workdir
RUN node /app/src/v1/generators/logFile.generator.js
# run the npm start command to start the server
CMD npm start
# expose the 3030 port
EXPOSE 3030