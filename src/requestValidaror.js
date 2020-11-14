export default class requestValidator{

    static isRequestValid(req){
        return this.canCreateFile(req.body) && this.doesDataExist(req.body) && this.doTrialsMatchHeader(req.body);
    }

    static getValidationErrorMessage(req){
        if (!this.canCreateFile(req.body)){
            return "Missing critical info about the participant or experimenter";
        }

        if (!this.doesDataExist(req.body)){
            return "Missing experiment data. Either trials data or headers is missing.";
        }

        if (!this.doTrialsMatchHeader(req.body)){
            return "Trial keys don't match the headers.";
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

    static doTrialsMatchHeader(reqBody){
        let headers = reqBody.data.headers;
        let trials = reqBody.data.trials;

        if (trials.length == 0){
            return;
        }

        let isValid = true;

        trials.forEach(trial => {
            let trialKeys = Object.keys(trial);
            
            if (headers.length != trialKeys.length){
                isValid =  false;
            }

            for(let i = 0; i < headers.length; i++){
                if (headers[i] != trialKeys[i]){
                    isValid = false;
                }
            }
        });

        return isValid;
    }
}