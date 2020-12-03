# experiments-server
This is a nodejs service that saves data from our expeirments

## Technology

- Nodejs
- Express
- Ecmascript 6

## Location of the data
- The data is saved as json files to our server's filesystem
- Each experimenter has his/her own directory within the main directory of the data
- Each experiment has its own directory within the experimenter's folder
- The main directory of the data is the variable basePath in server.js
