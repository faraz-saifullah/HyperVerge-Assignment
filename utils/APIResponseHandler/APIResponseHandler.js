let ResponseCodes = require ('./HttpResponseCodes');
let HTTPResponseCodes = new ResponseCodes();

class APIResponseHandler {
    handle(response, result){
        if (result.status) {
            return response.status(result.status).send(result);
        } else {
            return response.status(HTTPResponseCodes.INTERNAL_SERVER_ERROR()).send(result);
        }
    }
}

module.exports = APIResponseHandler;