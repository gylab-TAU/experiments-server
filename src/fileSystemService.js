import fs from 'fs';
import jsonCreatorService from './jsonCreatorService';

export default class fileSystemService {

    static getParticipantJsonFromDirectory(basePath, experimenterName, experimentName, participantId){
        let path = this.createFilePath(basePath, experimenterName, experimentName, participantId);

        if (this.doesFileExist(path) == false){
            let message = "File " + filePath + " does not exist";

            throw message;
        }

        let fileContents = fs.readFileSync(path);

        return JSON.parse(fileContents);
    }

    static getJsonFromRequestAndInsertToDIrectory(req, basePath) {
        let experimenterName = req.body.data.experiment_info.experimenter_name;
        let experimentName = req.body.data.experiment_info.experiment_name;
        this.createExperimentFolderIfDoesNotExist(basePath, experimenterName, experimentName);

        let participantId = req.body.data.participant_info.participant_id;
        let filePath = this.createFilePath(basePath, experimenterName, experimentName, participantId);

        if (this.doesFileExist(filePath)) {
            let message = "Participant ID already exists, participantId: " + participantId;
            throw message;
        }

        let jsonToSave = req.body.data;

        jsonCreatorService.removeExperimentInfo(jsonToSave);

        this.createFile(filePath, JSON.stringify(jsonToSave));

    }

    static createFile(filePath, data) {
        fs.writeFileSync(filePath, data);
    }

    static createExperimentFolderIfDoesNotExist(basePath, experimenterName, experimentName) {
        this.createFolderIfDoesNotExist(basePath, experimenterName);

        let newBasePath = basePath + experimenterName + "/";

        this.createFolderIfDoesNotExist(newBasePath, experimentName);
    }
    static createFolderIfDoesNotExist(basePath, folderName) {
        let newFolder = basePath + folderName;

        if (!fs.existsSync(newFolder)) {
            fs.mkdirSync(newFolder);
        }
    }

    static createFilePath(basePath, experimenterName, experimentName, participantId) {
        return basePath + experimenterName + "/" + experimentName + "/" + participantId + ".json";
    }

    static doesFileExist(filePath) {
        if (fs.existsSync(filePath)) {
            return true;
        }

        return false;
    }
}