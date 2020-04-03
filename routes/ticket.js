let express = require('express');
let router = express.Router();
let Tickets = require('../core/ticketController');
let APIResponseHandler = require('../utils/APIResponseHandler/APIResponseHandler')

router.post('/', async function(req, res) {
  let result = await new Tickets().bookNewTicket(req.body);
  return new APIResponseHandler().handle(res, result);
});

module.exports = router;