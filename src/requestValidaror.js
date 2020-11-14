export default class requestValidator{
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

        trials.forEach(trial => {
            let trialKeys = Object.keys(trial);

            for(let i = 0; i < headers.length; i++){
                if (headers[i] != trialKeys[i]){
                    return false;
                }
            }
        });

        return true;
    }
}