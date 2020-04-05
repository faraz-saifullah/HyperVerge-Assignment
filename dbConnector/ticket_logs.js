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
        return await new DataService().executeQueryAsPromise(sqlQuery, true);
    }

    async updateTicketStatus(ticketId) {
        const sqlQuery = {
            text: `UPDATE ticket_logs SET 
            (booking_status, cancel_date, cancel_time) = ($1, 
                (select current_date), (select current_time)) WHERE id = ($2)`,
            values: ['cancelled', ticketId]
        }
        return await new DataService().executeQueryAsPromise(sqlQuery, true);
    }

    async selectTicketWithId(ticketId) {
        const sqlQuery = {
            text: `SELECT * from ticket_logs WHERE id = ($1)`,
            values: [ticketId]
        }
        return await new DataService().executeQueryAsPromise(sqlQuery);
    }
}

module.exports = TicketLogsDbConnector;
