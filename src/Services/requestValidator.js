export default class getRequestValidator {
    static isGetRequestForParticipantTrialsValid(req){
        return this.areGetParamsValid(req);
    }

    static isPostParticipantDataRequestValid(req) {
        return this.isParamsPartValid(req) && this.isBodyPartValid(req);
    }

    static areGetParamsValid(req){
        let experimenterName = req.params.experimenterName;
        let experimentName = req.params.experimentName;
        let participantId = req.params.participantId;

        return (experimentName && experimenterName && participantId);
    }

    static isParamsPartValid(req){
        let experimenterName = req.params.experimenterName;
        let experimentName = req.params.experimentName;

        return (experimentName && experimenterName);
    }

    static isBodyPartValid(req){
        return req.body && req.body.participant_ids;
    }
}