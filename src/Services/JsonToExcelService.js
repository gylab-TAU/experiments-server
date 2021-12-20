import JsonCreator from '../FileCreators/JsonCreator'
import moment from 'moment';
import fileSystemService from './fileSystemService';

export default class JsonToExcelService {
    static getMergedExcelObjectOfManyParticipants(basePath, experimenterName, experimentName, participantIds) {
        let headers = [];
        let lines = [];
            participantIds.forEach(participant => {
                let filePath = JsonCreator.createFilePath(basePath, experimenterName, experimentName, participant);
                let duplicatesPath = JsonCreator.createFilePath(basePath, experimenterName, experimentName +  "/Duplicates", participant);

                try {
                    let participantJson = null;
                    if (fileSystemService.doesFileExist(filePath)) {
                        participantJson = JsonCreator.getJsonFromFilePath(filePath);
                    } else {
                        participantJson = JsonCreator.getJsonFromFilePath(duplicatesPath);
                    }
                     
                    let excelObject = this.createExcelObjectFromParticipantJson(participantJson);

                    if (headers.length < 1){
                        headers = excelObject.headers.map(header => header);
                    }

                    lines = lines.concat(excelObject.lines);
                } catch {
                    throw "Failed at fetching data from participant " + participant;
                }
            });

            return {
                "headers": headers,
                "lines": lines
            }
    }

    static getExcelObjectOfOneParticipantFromFilePath(filePath) {
        try {
            let participantJson = JsonCreator.getJsonFromFilePath(filePath);

            return this.createExcelObjectFromParticipantJson(participantJson);
        }
        catch (err) {
            throw err;
        }
    }

    static createExcelObjectFromParticipantJson(participantJson) {
        let trials = participantJson.trials;
        let participantInfo = participantJson.participant_info;
        let time = participantJson.time;
        let others = participantJson.others;

        return {
            "headers": this.getHeaders(participantJson),
            "lines": this.getExcelLines(trials, participantInfo, time, others)
        }
    }

    static getExcelLines(trials, participantInfo, time, others) {
        let lines = [];

        trials.forEach(trial => {
            lines.push(this.getExcelLine(trial, participantInfo, time, others));
        });

        return lines;
    }

    static getExcelLine(trial, participantInfo, time, others) {
        let trialValues = Object.values(trial);
        let participantInfoValues = Object.values(participantInfo);

        let line = [];

        trialValues.forEach(item => {
            line.push(item);
        });

        participantInfoValues.forEach(item => {
            line.push(item);
        });

        if (time) {
            let date = new Date(time);
            let formattedTime = moment(date, "YYYY-MM-DD-HH-mm-ss").format('MM/DD/YYYY, HH:mm:ss');
            line.push(formattedTime);
        }

        if (others) {
            let otherKeys = Object.values(others);

            otherKeys.forEach(element => {
                line.push(element);
            });
        }

        return line;
    }

    static getHeaders(participantJson) {
        let headers = participantJson.headers;
        let participantInfo = Object.keys(participantJson.participant_info);

        let result = [];

        headers.forEach(element => {
            let headerItem = { "header": element, key: element, width: 20 };
            result.push(headerItem);
        });

        participantInfo.forEach(element => {
            let headerItem = { "header": element, key: element, width: 20 };
            result.push(headerItem);
        });

        if (participantJson.time) {
            let headerItem = { "header": "time", key: "time", width: 40 };
            result.push(headerItem);
        }

        if (participantJson.others) {
            let otherKeys = Object.keys(participantJson.others);

            otherKeys.forEach(element => {
                let headerItem = { "header": element, key: element, width: 20 };
                result.push(headerItem);
            });
        }

        return result;
    }
}