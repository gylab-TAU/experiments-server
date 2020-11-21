export default class getRequestValidator {
    static isGetParticipantDataRequestValid(req) {
        let experimenterName = req.params.experimenterName;
        let experimentName = req.params.experimentName;
        let participantId = req.params.participantId;

        return (experimentName && experimenterName && participantId);
    }
}