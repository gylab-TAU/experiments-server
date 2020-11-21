import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import 'regenerator-runtime/runtime';

import saveFileRequestValidaror from './Services/saveFileRequestValidaror';
import JsonCreator from './FileCreators/JsonCreator';
import JsonToExcelService from './JsonToExcelService';
import getRequestValidator from './Services/getRequestValidator';
const ExcelJS = require('exceljs');

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.options('/downloadMergedFileOfManyParticipants/:experimenterName/:experimentName', cors());

const basePath = "C:/Users/Ron/Desktop/work/dbDirectory/";

app.post('/', (req, res) => {

    if (!saveFileRequestValidaror.isRequestValid(req)) {
        let err = saveFileRequestValidaror.getValidationErrorMessage(req);

        return res.status(400).send({ message: err });
    }


    try {
        JsonCreator.saveParticipantJsonFromRequestToDirectory(req, basePath);

        res.status(200).send();
    }
    catch (err) {
        res.status(400).send(err);
    }
});

app.get('/getParticipantTrials/:experimenterName/:experimentName/:participantId', (req, res) => {
    if (!getRequestValidator.isGetParticipantDataRequestValid(req)) {
        res.status(400).send("getParticipantTrials: did not get all parameters. Make sure you sent experimenter name, experiment name and participant id");
    }

    try {
        let participantJson = JsonCreator.getJsonFromRequest(req, basePath);

        res.status(200).send(participantJson.trials);
    }
    catch (err) {
        res.status(400).send(err);
    }
});

app.get('/downloadExcelOfParticipant/:experimenterName/:experimentName/:participantId', async (req, res) => {
    if (!getRequestValidator.isGetParticipantDataRequestValid(req)) {
        res.status(400).send("downloadExcelOfParticipant: did not get all parameters. Make sure you sent experimenter name, experiment name and participant id");
    }
    let participantId = req.params.participantId;

    let data = JsonToExcelService.getExcelObjectOfOneParticipantFromRequest(basePath, req);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(participantId);

    sheet.columns = data.headers;
    sheet.addRows(data.lines);

    // This tells the response we're sending a csv
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=" + participantId + ".csv");

    try {
        await workbook.csv.write(res);
        res.status(200).end();
    } catch {
        res.status(500).send("Error while saving file " + participantId + "csv");
    }
});

app.post('/downloadMergedFileOfManyParticipants/:experimenterName/:experimentName', async (req, res) => {
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=" + participantId + ".csv");
    if (!req.params.experimenterName || !req.params.experimentName) {
        console.log(req.params)
        res.status(400).send("downloadMergedFileOfManyParticipants: did not get all parameters. Make sure you sent experimenter name and experiment name");
    }

    if (!req.body.participant_ids || req.body.participant_ids == []) {
        console.log("error")
        res.status(400).send("downloadMergedFileOfManyParticipants: did not get participant ids");
    }

    console.log(req.body.participant_ids)

    let participantId = req.params.experimentName;

    let data = JsonToExcelService.getMergedExcelObjectOfManyParticipants(basePath, req.params.experimenterName, req.params.experimentName, req.body.participant_ids);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(participantId);

    sheet.columns = data.headers;
    sheet.addRows(data.lines);

    console.log(sheet)

    try {
        // This tells the response we're sending a csv
        await workbook.csv.write(res);
    } catch (err) {
        console.log(err)
        res.status(500).send("Error while saving file " + participantId + "csv");
    }
    res.status(200).end();
});

app.get('/isAlive', (req, res) => {
    res.status(200).send({ message: "Ani Sheled" });
});

app.listen(8000, () => {
    console.log("server started on port 8000");
});