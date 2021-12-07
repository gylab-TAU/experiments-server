import fs from 'fs';
import moment from 'moment';
export default class fileSystemService{
    static readFile(path){
        if (this.doesFileExist(path) == false){
            let message = "File " + path + " does not exist";

            throw message;
        }

        return fs.readFileSync(path);
    }
    static getFilesFromFolder(folderPath){
    
        if (!fs.existsSync(folderPath)){
            throw "Folder " + folderPath + "does not exist";
        }

        return fs.readdirSync(folderPath);
    }

    static createFile(filePath, fileContent) {
        fs.writeFileSync(filePath, fileContent);
    }
    static createFolderIfDoesNotExist(basePath, folderName) {
        let newFolder = basePath + folderName;

        if (!fs.existsSync(newFolder)) {
            fs.mkdirSync(newFolder);
        }
    }

    static doesFileExist(filePath) {
        if (fs.existsSync(filePath)) {
            return true;
        }

        return false;
    }

    static writeLog(log, path) {
        let logs = this.getExistingLogs(path);
    
        logs = this.cleanOldLogs(logs);
        logs.push(log);
    
        let stringLogs = JSON.stringify(logs)
    
        fs.writeFileSync(path, stringLogs);
    }

    static getExistingLogs(path) {
        let rawLogs = fs.readFileSync(path);
    
        return JSON.parse(rawLogs);
    }

    static cleanOldLogs(logs) {
        let newLogs = [];
    
        for (let i = 0; i < logs.length; i++){
            if (!this.shouldDeleteLog(logs[i])){
                newLogs.push(logs[i]);
            }
        }
    
        return newLogs;
    }

    static shouldDeleteLog(log) {
        let date = moment(log.date, "dddd, MMMM Do YYYY, h:mm:ss a");
    
        return moment().diff(date, 'months') > 1;
    }
}