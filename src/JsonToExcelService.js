import fileSystemService from './fileSystemService';

export default class JsonToExcelService {
    static getExcelObjectOfOneParticipant(basePath, experimenterName, experimentName, participantId){
        try{
            let participantJson = fileSystemService.getParticipantJsonFromDirectory(basePath, experimenterName, experimentName, participantId);
            let trials = participantJson.trials;
            let participantInfo = participantJson.participant_info;
            let time = participantJson.time;

            return {
                "headers": this.mergeHeadersWithParticipantInfo(participantJson),
                "lines": this.getExcelLines(trials, participantInfo, time)
            }
        }
        catch(err){
            throw err;
        }
    }

    static getExcelLines(trials, participantInfo, time){
        let lines = [];

        trials.forEach(trial => {
            lines.push(this.getExcelLine(trial, participantInfo, time));
        });

        return lines;
    }

    static getExcelLine(trial, participantInfo, time){
        let trialValues = Object.values(trial);
        let participantInfoValues = Object.values(participantInfo);

        let line = [];

        trialValues.forEach(item => {
            line.push(item);
        });

        participantInfoValues.forEach(item => {
            line.push(item);
        });

        if (time){
            line.push(time);
        }

        return line;
    }

    static mergeHeadersWithParticipantInfo(participantJson){
        let headers = participantJson.headers;
        let participantInfo = Object.keys(participantJson.participant_info);

        let result = [];

        headers.forEach(element => {
            result.push(element);
        });

        participantInfo.forEach(element => {
            result.push(element);
        });

        if (participantJson.time){
            result.push("time");
        }

        return result;
    }
}