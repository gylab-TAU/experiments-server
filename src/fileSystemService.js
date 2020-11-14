import fs from 'fs';

export default class fileSystemService{

    static createFile(filePath, data){
        fs.writeFileSync(filePath,data);
    }

    static createExperimentFolderIfDoesNotExist(basePath, experimenterName, experimentName){
        this.createFolderIfDoesNotExist(basePath, experimenterName);
        
        let newBasePath = basePath + experimenterName + "/";

        this.createFolderIfDoesNotExist(newBasePath, experimentName);
    }
    static createFolderIfDoesNotExist(basePath, folderName){
        let newFolder = basePath + folderName;

        if(!fs.existsSync(newFolder)){
            fs.mkdirSync(newFolder);
        }
    }

    static createExperimentPath(basePath, experimenterName, experimentName, participantId){
        return basePath + experimenterName + "/" + experimentName + "/"+participantId + ".json";
    }

    static doesFileExist(filePath){
        if (fs.existsSync(filePath)){
            return true;
        }

        return false;
    }
}