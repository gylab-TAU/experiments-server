import express from 'express';
import requestValidator from './requestValidaror';
import fileSystemService from './fileSystemService';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

const basePath = "C:/Users/Ron/Desktop/work/dbDirectory/";

app.post('/', (req, res) => {
    if (!requestValidator.canCreateFile(req.body)){
        return res.status(400).send({message: "Missing critical info about the participant or experimenter"});
    }

    if (!requestValidator.doesDataExist(req.body)){
        return res.status(400).send({message: "Missing experiment data. Either trials data or headers is missing."});
    } 

    if (!requestValidator.doTrialsMatchHeader(req.body)){
        return res.status(400).send({message: "Trial keys don't match the headers."});
    }

    let experimenterName = req.body.data.experiment_info.experimenter_name;
    let experimentName = req.body.data.experiment_info.experiment_name;
    fileSystemService.createExperimentFolderIfDoesNotExist(basePath, experimenterName, experimentName);

    res.status(200).send();
});

app.get('/isAlive', (req, res) => {
    res.status(200).send({message:"Ani Sheled"});
});

app.listen(8000, () => {
    console.log("server started on port 8000");
});