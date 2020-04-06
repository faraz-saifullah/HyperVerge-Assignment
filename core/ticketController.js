const TicketLogsDbConnector = require('../dbConnector/ticket_logs');
const TicketControllerHelper = require('./helpers/ticketControllerHelper');
const TripsDbConnector = require('../dbConnector/trips');
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
        this.tripsDbConnector = new TripsDbConnector();
    }

    async bookNewTicket(details) {
        try {
            let userId = await this.ticketControllerHelper.createUserIfNotExist(details);
            let tripCode = this.ticketControllerHelper.createTripCode(details.date, details.from, details.to);
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
            return await this.ticketLogsDbConnector.updateTicketStatus(ticketId, 'cancelled');
        } catch (err) {
            throw err;
        }
    }

    async getTicketInfo(ticketId) {
        return await this.ticketLogsDbConnector.selectTicketWithId(ticketId);
    }

    async cancelAllTickets(details) {
        let isAdmin =  await this.ticketControllerHelper.checkIfAdminExist(details.phone, details.password);
        if(isAdmin) {
            let tripCode = this.ticketControllerHelper.createTripCode(details.date, "", "");
            await this.tripsDbConnector.cancelTrips(tripCode);
            return await this.ticketLogsDbConnector.declineTickets(tripCode, 'declined');
        }
    }
}

module.exports = TicketController;
