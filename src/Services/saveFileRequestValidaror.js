export default class saveFileRequestValidaror{

    static isRequestValid(req){
        //return this.canCreateFile(req.body) && this.doesDataExist(req.body) && this.doTrialsMatchHeader(req.body);
        return this.canCreateFile(req.body) && this.doesDataExist(req.body);
    }

    static getValidationErrorMessage(req){
        if (!this.canCreateFile(req.body)){
            return "Missing critical info about the participant or experimenter";
        }

        if (!this.doesDataExist(req.body)){
            return "Missing experiment data. Either trials data or headers is missing.";
        }
    }

    static canCreateFile(reqBody){
        return reqBody.data &&
               reqBody.data.participant_info && 
               reqBody.data.experiment_info && 
               reqBody.data.participant_info.participant_id && 
               reqBody.data.experiment_info.experiment_name && 
               reqBody.data.experiment_info.experimenter_name 
    }

    static doesDataExist(reqBody){
        return reqBody.data.headers && reqBody.data.trials;
    }
}