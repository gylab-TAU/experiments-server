import fs from 'fs';

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
}