import flights from '../../data/flights.json';
import airportsData from '../../data/airports.json';

const getArrivalAirports = async (departureAirport) => {
  const arrivalAirports = await flights.reduce((uniqueAirports, flight) => {
    if (
      flight.departureAirport === departureAirport &&
      !uniqueAirports.includes(flight.arrivalAirport)
    ) {
      uniqueAirports.push(flight.arrivalAirport);
    }
    return uniqueAirports;
  }, []);

  return arrivalAirports;
};

const getFilteredAirports = async (arrivalAirports) => {
  const filteredAirports = await airportsData
    .filter((airport) => arrivalAirports.includes(airport.iata_code))
    .sort((a, b) => {
      const countryComparison = a.country.localeCompare(b.country);
      if (countryComparison !== 0) {
        return countryComparison;
      }
      return a.city.localeCompare(b.city);
    })
    .map((airport) => ({
      name: airport.name,
      iata_code: airport.iata_code,
      country: airport.country,
      city: airport.city,
    }));

  return filteredAirports;
};

export default async function handler(req, res) {
  const departureAirport = req.query.departureAirport;

  const arrivalAirports = await getArrivalAirports(departureAirport);
  const filteredAirports = await getFilteredAirports(arrivalAirports);

  res.status(200).json(filteredAirports);
}
