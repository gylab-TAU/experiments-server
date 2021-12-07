import moment from 'moment';
import fileSystemService from './Services/fileSystemService';
import { stringify } from 'flatted';
export default class logger {
    constructor(req) {
        this.path = "/nutella-logs.json";
        this.experimenterName = req.body.data.experiment_info.experimenter_name;
        this.experimentName = req.body.data.experiment_info.experiment_name;
        this.participantId = req.body.data.participant_info.participant_id;
        this.req = req.body.data;
    }

    logInfo (action, message) {
        this.saveLog("Info", action, message);  
    }

    logSuccess(action, message) {
        this.saveLog("Success", action, message);  
    }

    logError(action, message) {
        this.saveLog("Error", action, message);  
    }

    saveLog(type, action,  message) {
        let log = {
            "type": type,
            "date": moment().format("dddd, MMMM Do YYYY, h:mm:ss a"),
            "experimentName": this.experimentName,
            "experimenterName": this.experimenterName,
            "action": action,
            "message": message,
            "participantId": this.participantId,
            "request": stringify(this.req)
        }
    
        fileSystemService.writeLog(log, this.path);
    }

    getLogs(){
        return fileSystemService.getExistingLogs(this.path);
    }
}