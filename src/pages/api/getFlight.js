import fs from 'fs/promises';
import path from 'path';

const flightsFilePath = path.join(process.cwd(), 'src/data', 'flights.json');

export default async function handler(req, res) {
  try {
    const flightsData = await fs.readFile(flightsFilePath, 'utf-8');
    const flights = JSON.parse(flightsData);

    const {
      departureAirport,
      arrivalAirport,
      departureDate,
      returnDate,
      oneway,
    } = req.query;

    const formatDate = (date) => {
      return date ? new Date(date).toISOString().split('T')[0] : null; // Sadece gün, ay ve yıl
    };

    const filteredFlights = await asyncFilter(flights, async (flight) => {
      if (
        flight.departureAirport === departureAirport &&
        flight.arrivalAirport === arrivalAirport &&
        (!departureDate ||
          formatDate(flight.departureDate) === formatDate(departureDate))
      ) {
        return true;
      }
      return false;
    });

    let returnWayFlights = [];
    if (oneway === 'false') {
      returnWayFlights = await asyncFilter(flights, async (flight) => {
        if (
          flight.departureAirport === arrivalAirport &&
          flight.arrivalAirport === departureAirport &&
          (!returnDate ||
            formatDate(flight.departureDate) === formatDate(returnDate))
        ) {
          return true;
        }
        return false;
      });
    }

    const journeyData = {
      oneway: filteredFlights,
      returnWay: returnWayFlights,
    };

    if (journeyData.oneway.length === 0 && journeyData.returnWay.length === 0) {
      return res.status(404).json({ message: 'No flights found' });
    }

    res.status(200).json(journeyData);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'An error occurred' });
  }
}

async function asyncFilter(array, predicate) {
  const results = await Promise.all(array.map(predicate));
  return array.filter((_, index) => results[index]);
}
