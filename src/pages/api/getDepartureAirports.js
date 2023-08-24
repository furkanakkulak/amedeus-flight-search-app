import flights from '../../data/flights.json';
import airportsData from '../../data/airports.json';

const getDepartureAirports = async () => {
  const departureAirports = await flights.reduce((uniqueAirports, flight) => {
    if (!uniqueAirports.includes(flight.departureAirport)) {
      uniqueAirports.push(flight.departureAirport);
    }
    return uniqueAirports;
  }, []);

  return departureAirports;
};

const getFilteredAirports = async (departureAirports) => {
  const filteredAirports = await airportsData
    .filter((airport) => departureAirports.includes(airport.iata_code))
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
  const departureAirports = await getDepartureAirports();
  const filteredAirports = await getFilteredAirports(departureAirports);

  res.status(200).json(filteredAirports);
}
