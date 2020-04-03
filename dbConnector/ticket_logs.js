let DataService = require('../utils/datasource/DataService');

class TicketLogsDbConnector {
    async createNewTicketLog(ticketDetails) {
        const sqlQuery = {
            text: `INSERT INTO ticket_logs 
            (from_city, to_city, traveller_id, seat_number, booking_status, trip_code) 
            values ($1, $2, $3, $4, $5, $6)`,
            values: [ticketDetails.from, ticketDetails.to, ticketDetails.user_id, 
            ticketDetails.seat_number, 'confirmed', ticketDetails.trip_code]
        };
        console.log(sqlQuery);
        return await new DataService().executeQueryAsPromise(sqlQuery, true);
    }
    
    async selectTripWithCode(tripCode) {

        const sqlQuery = {
            text: `SELECT * FROM trips where trip_code = ($1)`,
            values: [tripCode]
        }
        return await new DataService().executeQueryAsPromise(sqlQuery);
    }

    async updateBookedSeats(tripDetails) {
        const sqlQuery = {
            text: `UPDATE trips SET (booked_seats) = ($1) where trip_code = ($2)`,
            values: [tripDetails.booked_seats, tripDetails.trip_code]
        };
        return await new DataService().executeQueryAsPromise(sqlQuery, true);
    }
}

module.exports = TicketLogsDbConnector;
