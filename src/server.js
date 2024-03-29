import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import saveFileRequestValidaror from './Services/saveFileRequestValidaror';
import JsonCreator from './FileCreators/JsonCreator';
import JsonToExcelService from './Services/JsonToExcelService';
import requestValidator from './Services/requestValidator';
import fileSystemService from './Services/fileSystemService';

import logger from './logger';

const app = express();

app.use(bodyParser.json());
app.use(cors());

// example of linux directory:
//const basePath = "/home/gali/Desktop/db/";

let basePath = "/db/";
//let basePath = "C:/Users/User/Desktop/db/"
let port = 1337;

app.post('/', (req, res) => {
    let logs = new logger(req);
    logs.logInfo("Save new file", "started saving new file");
    if (!saveFileRequestValidaror.isRequestValid(req)) {
        logs.logError("Save new file", "Failed at request validation");
        let err = saveFileRequestValidaror.getValidationErrorMessage(req);

        return res.status(400).send({ message: err });
    }


    try {
        logs.logInfo("Save new file", "creating json");
        JsonCreator.saveParticipantJsonFromRequestToDirectory(req, basePath);
        logs.logSuccess("Save new file", "");
        return res.status(200).send();
    }
    catch (err) {
        logs.logError("Save new file", err);
        return res.status(500).send(err);
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
            let duplicateFilePath = JsonCreator.createFilePath(basePath, req.params.experimenterName, req.params.experimentName + "/Duplicates", participantId)

            let participantExcelData = null;

            if (fileSystemService.doesFileExist(filePath)) {
                participantExcelData = JsonToExcelService.getExcelObjectOfOneParticipantFromFilePath(filePath);
            } else if (fileSystemService.doesFileExist(duplicateFilePath)) {
                participantExcelData = JsonToExcelService.getExcelObjectOfOneParticipantFromFilePath(duplicateFilePath);
            } else {
                throw new Error("File does not exist, participant id = " + participantId)
            }

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
    } catch (err) {
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
            let duplicatesPath = folderPath + "/Duplicates";
            let duplicatesFiles = participantFiles.includes("Duplicates") ? fileSystemService.getFilesFromFolder(duplicatesPath) : null;
            participantFiles = participantFiles.filter(item => item !== "Duplicates")

            let participantIds = [];
            let duplicates = [];

            participantFiles.forEach(file => {
                let splitFileName = file.split(".");
                splitFileName.pop();
                let participantId = splitFileName.join(".");

                participantIds.push(participantId);
            });

            if (duplicatesFiles !== null) {
                duplicatesFiles = duplicatesFiles.filter((item) => item !== "Duplicates");

                duplicatesFiles.forEach(file => {
                    let splitFileName = file.split(".");
                    splitFileName.pop();
                    let participantId = splitFileName.join(".");

                    duplicates.push(participantId);
                });
            }

            let experiment = {
                name: experimentName,
                participants: participantIds,
                duplicates: duplicates
            }

            experiments.push(experiment);
        });

        return res.status(200).send(experiments);
    } catch (err) {
        return res.status(500).send(err);
    }
});

app.get('/isAlive', (req, res) => {
    return res.status(200).send({ message: "Ani Sheled" });
});

app.listen(port, () => {
    console.log("server started on port " + port);
});