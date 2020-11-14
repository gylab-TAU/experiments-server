import fs from 'fs';

export default class fileSystemService{
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
}