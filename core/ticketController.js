const UsersDbConnector = require('../dbConnector/users');
const TripsDbConnector = require('../dbConnector/trips');
const TicketLogsDbConnector = require('../dbConnector/ticket_logs');

class TicketController {
    constructor() {
        this.tripsDbConnector = new TripsDbConnector();
        this.usersDbConnector = new UsersDbConnector();
        this.ticketLogsDbConnector = new TicketLogsDbConnector();
    }

    async bookNewTicket(details) {
        try {
            let userId = await this.createUserIfNotExist(details);
            let tripCode = this.createTripCode(details);
            let seatNumber = await this.createTripIfNotExist(details, tripCode);
            if(seatNumber == -1) {
                return {
                    success: false,
                    status: 400,
                    message: 'No seats available for this trip',
                    data: []
                }
            }
            details.user_id = userId;
            details.trip_code = tripCode;
            details.seat_number = seatNumber;
            return await this.ticketLogsDbConnector.createNewTicketLog(details);
        } catch(err) {
            throw err;
        }
    }

    async createUserIfNotExist(details) {
        let existingUser = await this.usersDbConnector.selectUserWithPhone(details.phone);
        if(!existingUser.success) {
            details.type = 'traveller';
            await this.usersDbConnector.createNewUser(details);
        }
        existingUser = await this.usersDbConnector.selectUserWithPhone(details.phone);
        existingUser = existingUser.data[0];
        return existingUser.user_id;
    }

    async createTripIfNotExist(details, tripCode) {
        let tripStatus = await this.tripsDbConnector.selectTripWithCode(tripCode);
        let tripDetails;
        if(!tripStatus.success) {
            tripDetails = {
                trip_code: tripCode,
                from_city: details.from,
                to_city: details.to,
                booked_seats: [1],
                stops: ['source', 'destination'],
                trip_date: details.date
            }
            this.tripsDbConnector.createNewTrip(tripDetails);
            return 1;
        } else {
            tripDetails = tripStatus.data[0];
            let seatsBooked = tripDetails.booked_seats.length;
            if(seatsBooked < 40) {
                tripDetails.booked_seats.push(seatsBooked + 1);
                this.tripsDbConnector.updateBookedSeats(tripDetails);
                return seatsBooked + 1;
            } else {
                return -1;
            }
        }
    }

    getDateString(date) {
        let dateArray = date.split(/-/g);
        let dateString = "";
        for(let i = dateArray.length - 1; i > -1; i--) {
            dateString += dateArray[i];
        }
        return dateString;
    }

    createTripCode(details) {
        let dateString = this.getDateString(details.date);
        let route = details.from.substring(0, 2);
        route += details.to.substring(0, 2);
        return dateString + route;
    }

}

module.exports = TicketController;
