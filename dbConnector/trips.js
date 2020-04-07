'use strict';
let DataService = require('../utils/datasource/DataService');

class TripsDbConnector {
  async createNewTrip(tripDetails) {
    const sqlQuery = {
      text: `INSERT INTO trips 
      (trip_code, from_city, to_city, booked_seats, stops, trip_date)
      values ($1, $2, $3, $4, $5, $6)`,
      values: [tripDetails.trip_code, tripDetails.from_city,
        tripDetails.to_city, tripDetails.booked_seats,
        tripDetails.stops, tripDetails.trip_date],
    };
    return await new DataService().executeQueryAsPromise(sqlQuery, true);
  }

  async selectTripWithCode(tripCode) {
    const sqlQuery = {
      text: 'SELECT * FROM trips where trip_code = ($1)',
      values: [tripCode],
    };
    return await new DataService().executeQueryAsPromise(sqlQuery);
  }

  async updateBookedSeats(tripDetails) {
    const sqlQuery = {
      text: 'UPDATE trips SET booked_seats = ($1) where trip_code = ($2)',
      values: [tripDetails.booked_seats, tripDetails.trip_code],
    };
    return await new DataService().executeQueryAsPromise(sqlQuery, true);
  }

  async cancelTrips(tripCode) {
    const sqlQuery = {
      text: 'UPDATE trips SET booked_seats = ($1) where trip_code > ($2)',
      values: [[], tripCode],
    };
    return await new DataService().executeQueryAsPromise(sqlQuery, true);
  }
}

module.exports = TripsDbConnector;
