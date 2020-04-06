let express = require('express');
let router = express.Router();
let Tickets = require('../core/ticketController');
let APIResponseHandler = require('../utils/APIResponseHandler/APIResponseHandler')

router.post('/', async function(req, res) {
  let result = await new Tickets().bookNewTicket(req.body);
  return new APIResponseHandler().handle(res, result);
});

router.delete('/:id', async function(req, res) {
  let result = await new Tickets().cancelTicket(req.params.id);
  return new APIResponseHandler().handle(res, result);
});

router.get('/:id', async function(req, res) {
  let result = await new Tickets().getTicketInfo(req.params.id);
  return new APIResponseHandler().handle(res, result);
});

router.delete('/', async function(req, res) {
  let result = await new Tickets().cancelAllTickets(req.body);
  return new APIResponseHandler().handle(res, result);
});

router.get('/', async function(req, res) {
  let result = await new Tickets().getAllClosedTickets();
  return new APIResponseHandler().handle(res, result);
});

module.exports = router;