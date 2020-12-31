import express from 'express';
import bodyParser from 'body-parser';

import saveFileRequestValidaror from './Services/saveFileRequestValidaror';
import JsonCreator from './FileCreators/JsonCreator';
import JsonToExcelService from './Services/JsonToExcelService';
import requestValidator from './Services/requestValidator';
import fileSystemService from './Services/fileSystemService';

const app = express();

app.use(bodyParser.json());

// example of linux directory:
//const basePath = "/home/gali/Desktop/db/";

var basePath;

if (process.argv[process.argv.length - 1] == "prod"){
    basePath = "C:/Users/gali1/OneDrive/Documents/Work/db/";
} else{
    basePath = "C:/Users/gali1/OneDrive/Documents/Work/test-db/";
}

app.post('/', (req, res) => {

    if (!saveFileRequestValidaror.isRequestValid(req)) {
        let err = saveFileRequestValidaror.getValidationErrorMessage(req);

        return res.status(400).send({ message: err });
    }


    try {
        JsonCreator.saveParticipantJsonFromRequestToDirectory(req, basePath);

        return res.status(200).send();
    }
    catch (err) {
        return res.status(400).send(err);
    }
});

app.get('/getParticipantTrials/:experimenterName/:experimentName/:participantId', (req, res) => {
    if (!requestValidator.isGetRequestForParticipantTrialsValid(req)) {
        return res.status(400).send("getParticipantTrials: did not get all parameters. Make sure you sent experimenter name, experiment name and participant id");
    }

    try {
        let participantJson = JsonCreator.getJsonFromRequest(req, basePath);

        return res.status(200).send(participantJson.trials);
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

app.post("/getParticipsntsDataForExcel/:experimenterName/:experimentName", (req, res) => {
    if (!requestValidator.isPostParticipantDataRequestValid(req)) {
        return res.status(400).send("getParticipsntsDataForExcel: did not get all parameters. Make sure you sent experimenter name, experiment name and array of participant ids");
    }
    try {
        let participantExcelObjects = [];

        req.body.participant_ids.forEach(participantId => {
            let filePath = JsonCreator.createFilePath(basePath, req.params.experimenterName, req.params.experimentName, participantId);
            let participantExcelData = JsonToExcelService.getExcelObjectOfOneParticipantFromFilePath(filePath);

            let excelObject = {
                participant_id: participantId,
                participant_excel_data: participantExcelData
            }

            participantExcelObjects.push(excelObject);
        });

        return res.status(200).send(participantExcelObjects);
    } catch (err) {
        return res.status(500).send(err);
    }
});

app.post('/getUnifiedParticipantsData/:experimenterName/:experimentName', (req, res) => {
    if (!requestValidator.isPostParticipantDataRequestValid(req)) {
        return res.status(400).send("getUnifiedParticipantsData: did not get all parameters. Make sure you sent experimenter name, experiment name and array of participant ids");
    }

    try {
        let unifiedData = JsonToExcelService.getMergedExcelObjectOfManyParticipants(basePath, req.params.experimenterName, req.params.experimentName, req.body.participant_ids);

        return res.status(200).send(unifiedData);
    } catch (err) {
        return res.status(500).send(err);
    }
});

app.get('/getAllExperimenters', (req, res) => {
    try {
        let experimenters = fileSystemService.getFilesFromFolder(basePath);

        return res.status(200).send(experimenters);
    } catch (err){
        return res.status(500).send(err);
    }
});

app.get('/getExperimenterFolder/:experimenterName', (req, res) => {
    if (!req.params.experimenterName) {
        return res.status(400).send("getExperimenterFolder: did not recieve experimenter name");
    }

    if (fileSystemService.doesFileExist(basePath + req.params.experimenterName) == false) {
        return res.status(400).send("The file of experimenter " + req.params.experimenterName + " does not exist");
    }

    try {
        let experimenterFolder = basePath + req.params.experimenterName;

        let experimentNames = fileSystemService.getFilesFromFolder(experimenterFolder);

        let experiments = [];

        experimentNames.forEach(experimentName => {
            let folderPath = experimenterFolder + "/" + experimentName;
            let participantFiles = fileSystemService.getFilesFromFolder(folderPath);

            let participantIds = [];

            participantFiles.forEach(file => {
                let splitFileName = file.split(".");
                splitFileName.pop();
                let participantId = splitFileName.join(".");

                participantIds.push(participantId);
            });

            let experiment = {
                name: experimentName,
                participants: participantIds
            }

            experiments.push(experiment);

            return res.status(200).send(experiments);
        });
    } catch (err){
        return res.status(500).send(err);
    }
});

app.get('/isAlive', (req, res) => {
   return res.status(200).send({ message: "Ani Sheled" });
});

app.listen(8000, () => {
    console.log("server started on port 8000");
});