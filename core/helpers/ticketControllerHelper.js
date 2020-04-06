const UsersDbConnector = require('../../dbConnector/users');
const TripsDbConnector = require('../../dbConnector/trips');

class TicketControllerHelper {
    constructor() {
        this.tripsDbConnector = new TripsDbConnector();
        this.usersDbConnector = new UsersDbConnector();
    }

    async checkIfAdminExist(phone, password) {
        let result = await this.usersDbConnector.selectAdminWithCredentials(phone, password);
        return result.success;
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
            await this.tripsDbConnector.createNewTrip(tripDetails);
            return 1;
        } else {
            tripDetails = tripStatus.data[0];
            if(tripDetails.booked_seats.length < 40) {
                let seatNumber = this.findFirstAvailable(tripDetails.booked_seats)
                tripDetails.booked_seats.push(seatNumber);
                tripDetails.booked_seats.sort();
                this.tripsDbConnector.updateBookedSeats(tripDetails);
                return seatNumber;
            } else {
                return -1;
            }
        }
    }

    async removeBookedSeatFromTrip(ticketDetails) {
        ticketDetails = ticketDetails.data[0];
        let tripDetails = await this.tripsDbConnector.selectTripWithCode(ticketDetails.trip_code);
        tripDetails = tripDetails.data[0];
        tripDetails.booked_seats.splice(ticketDetails.seat_number - 1, 1);
        this.tripsDbConnector.updateBookedSeats(tripDetails);
    }

    findFirstAvailable(seats) {
        let low = 0;
        let high = seats.length - 1;
        let mid = low + Math.floor((high - low) / 2);
        while(low <= high) {
            if(mid + 1 < seats.length && mid + 1 == seats[mid] && seats[mid + 1] == mid + 3) {
                return mid + 2;
            }
            if(mid + 1 == seats[mid]) {
                low = mid + 1;
            } else if(mid + 2 == seats[mid]) {
                high = mid - 1;
            }
            mid = low + Math.floor((high - low) / 2);
        }
        return mid + 2;
    }

    getDateString(date) {
        let dateArray = date.split(/-/g);
        let dateString = "";
        for(let i = dateArray.length - 1; i > -1; i--) {
            dateString += dateArray[i];
        }
        return dateString;
    }

    createTripCode(date, from, to) {
        let dateString = this.getDateString(date);
        let route = from.substring(0, 2);
        route += to.substring(0, 2);
        return dateString + route;
    }
}

module.exports = TicketControllerHelper;