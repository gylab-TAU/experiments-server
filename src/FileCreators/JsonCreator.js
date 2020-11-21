import fileSystemService from '../Services/fileSystemService';

export default class JsonCreator{
    static getJsonFromRequest(req, basePath){
        let filePath = this.createFilePath(basePath, req.params.experimenterName, req.params.experimentName, req.params.participantId);
        
        return this.getJsonFromFilePath(filePath);
    }

    static getJsonFromFilePath(filePath){
        let fileContents = fileSystemService.readFile(filePath);
        
        let json = JSON.parse(fileContents);

        return json;
    }

    static saveParticipantJsonFromRequestToDirectory(req, basePath){
        let experimenterName = req.body.data.experiment_info.experimenter_name;
        let experimentName = req.body.data.experiment_info.experiment_name;
        this.createExperimentFolderIfDoesNotExist(basePath, experimenterName, experimentName);

        let participantId = req.body.data.participant_info.participant_id;
        let filePath = this.createFilePath(basePath, experimenterName, experimentName, participantId);

        if (fileSystemService.doesFileExist(filePath)) {
            let message = "Participant ID already exists, participantId: " + participantId;
            throw message;
        }

        let jsonToSave = req.body.data;

        this.removeExperimentInfo(jsonToSave);

        fileSystemService.createFile(filePath, JSON.stringify(jsonToSave));

    }

    static removeExperimentInfo(dataJson){
        delete dataJson.experiment_info;
    }

    static createFilePath(basePath, experimenterName, experimentName, participantId) {
        return basePath + experimenterName + "/" + experimentName + "/" + participantId + ".json";
    }

    static createExperimentFolderIfDoesNotExist(basePath, experimenterName, experimentName) {
        fileSystemService.createFolderIfDoesNotExist(basePath, experimenterName);

        let newBasePath = basePath + experimenterName + "/";

        fileSystemService.createFolderIfDoesNotExist(newBasePath, experimentName);
    }
}