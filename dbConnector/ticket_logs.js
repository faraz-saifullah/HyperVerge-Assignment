let DataService = require('../utils/datasource/DataService');

class TicketLogsDbConnector {
    async createNewTicketLog(ticketDetails) {
        const sqlQuery = {
            text: `INSERT INTO ticket_logs 
            (from_city, to_city, traveller_id, seat_number, ticket_status, trip_code) 
            values ($1, $2, $3, $4, $5, $6)`,
            values: [ticketDetails.from, ticketDetails.to, ticketDetails.user_id, 
            ticketDetails.seat_number, 'confirmed', ticketDetails.trip_code]
        };
        return await new DataService().executeQueryAsPromise(sqlQuery, true);
    }

    async updateTicketStatus(ticketId, status) {
        const sqlQuery = {
            text: `UPDATE ticket_logs SET 
            (ticket_status, cancel_date, cancel_time) = ($1, 
                (select current_date), (select current_time)) WHERE id = ($2)`,
            values: [status, ticketId]
        }
        return await new DataService().executeQueryAsPromise(sqlQuery, true);
    }

    async declineTickets(tripCode, status) {
        const sqlQuery = {
            text: `UPDATE ticket_logs SET 
            (ticket_status, cancel_date, cancel_time) = ($1, 
                (select current_date), (select current_time)) WHERE trip_code > ($2) 
                and ticket_status = ($3)`,
            values: [status, tripCode, 'confirmed']
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

    async selectAllConfirmedTickets() {
        const sqlQuery = {
            text: `SELECT (id, trip_code, from_city, to_city, booking_date, traveller_id,
                seat_number) from ticket_logs WHERE ticket_status = ($1)`,
            values: ['confirmed']
        }
        return await new DataService().executeQueryAsPromise(sqlQuery);
    }
}

module.exports = TicketLogsDbConnector;
