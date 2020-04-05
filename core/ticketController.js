const TicketLogsDbConnector = require('../dbConnector/ticket_logs');
const TicketControllerHelper = require('./helpers/ticketControllerHelper');
const seatsFullResponse = {
    success: false,
    status: 400,
    message: 'No seats available for this trip',
    data: []
}

class TicketController {
    constructor() {
        this.ticketControllerHelper = new TicketControllerHelper();
        this.ticketLogsDbConnector = new TicketLogsDbConnector();
    }

    async bookNewTicket(details) {
        try {
            let userId = await this.ticketControllerHelper.createUserIfNotExist(details);
            let tripCode = this.ticketControllerHelper.createTripCode(details);
            let seatNumber = await this.ticketControllerHelper.createTripIfNotExist(details, tripCode);
            if(seatNumber == -1) {
                return seatsFullResponse;
            }
            details.user_id = userId;
            details.trip_code = tripCode;
            details.seat_number = seatNumber;
            return await this.ticketLogsDbConnector.createNewTicketLog(details);
        } catch(err) {
            throw err;
        }
    }

    async cancelTicket(ticketId) {
        try {
            let result = await this.ticketLogsDbConnector.selectTicketWithId(ticketId);
            this.ticketControllerHelper.removeBookedSeatFromTrip(result);
            return await this.ticketLogsDbConnector.updateTicketStatus(ticketId);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = TicketController;
