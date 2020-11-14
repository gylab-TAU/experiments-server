export default class jsonCreatorService{
    static removeExperimentInfo(dataJson){
        delete dataJson.experiment_info;
    }
}