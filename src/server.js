import express from 'express';
import requestValidator from './requestValidaror';
import fileSystemService from './fileSystemService';
import bodyParser from 'body-parser';
import JsonToExcelService from './JsonToExcelService';
const ExcelJS = require('exceljs');

const app = express();

app.use(bodyParser.json());

const basePath = "C:/Users/Ron/Desktop/work/dbDirectory/";

app.post('/', (req, res) => {

    if (!requestValidator.isRequestValid(req)) {
        let err = requestValidator.getValidationErrorMessage(req);

        return res.status(400).send({ message: err });
    }


    try {
        fileSystemService.getJsonFromRequestAndInsertToDIrectory(req, basePath);

        res.status(200).send();
    }
    catch (err) {
        res.status(400).send(err);
    }
});

app.get('/getParticipantTrials/:experimenterName/:experimentName/:participantId', (req, res) => {
    let experimenterName = req.params.experimenterName;
    let experimentName = req.params.experimentName;
    let participantId = req.params.participantId;

    if (!experimentName || !experimenterName || !participantId) {
        res.status(400).send("getParticipantTrials: did not get all parameters. Make sure you sent experimenter name, experiment name and participant id");
    }

    try {
        let participantJson = fileSystemService.getParticipantJsonFromDirectory(basePath, experimenterName, experimentName, participantId);

        res.status(200).send(participantJson.trials);
    }
    catch (err) {
        res.status(400).send(err);
    }
});

app.get('/downloadExcelOfParticipant/:experimenterName/:experimentName/:participantId', (req, res) => {
    let experimenterName = req.params.experimenterName;
    let experimentName = req.params.experimentName;
    let participantId = req.params.participantId;

    if (!experimentName || !experimenterName || !participantId) {
        res.status(400).send("downloadExcelOfParticipant: did not get all parameters. Make sure you sent experimenter name, experiment name and participant id");
    }

    let data = JsonToExcelService.getExcelObjectOfOneParticipant(basePath, experimenterName, experimentName, participantId);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(participantId);

    sheet.columns = data.headers;
    sheet.addRows(data.lines);

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + participantId + ".csv"
    );

    return workbook.csv.write(res).then(() => {
        res.status(200).end();
    }).catch((error) => {
        res.status(500).send(err);
    });
});

app.get('/isAlive', (req, res) => {
    res.status(200).send({ message: "Ani Sheled" });
});

app.listen(8000, () => {
    console.log("server started on port 8000");
});