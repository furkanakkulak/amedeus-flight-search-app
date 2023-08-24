const fs = require('fs');
const airportsJson = require('./airports.json');
const airports = airportsJson;

const airlines = [
  'American Airlines',
  'Turkish Airlines',
  'Pegasus Airlines',
  'Lufthansa',
  'British Airways',
  'Air France',
  'Emirates',
  'Qatar Airways',
  'Etihad Airways',
  'Turkish Airlines',
];

const flights = [];

for (const airport of airports) {
  for (const airline of airlines) {
    for (let i = 0; i < 4; i++) {
      const flightNumber = Math.floor(Math.random() * 1000000);
      const departureAirport = airport.iata_code;
      let arrivalAirport =
        airports[Math.floor(Math.random() * airports.length)];
      while (departureAirport === arrivalAirport) {
        arrivalAirport = airports[Math.floor(Math.random() * airports.length)];
      }
      arrivalAirport = arrivalAirport.iata_code;
      const departureDate = new Date();
      departureDate.setMonth(departureDate.getMonth() + 1);
      departureDate.setDate(departureDate.getDate() + i); // Günlük uçuşlar için günü artırıyoruz
      const duration = Math.floor(Math.random() * (6 * 60)) + 30; // Uçuş süresi dakika cinsinden
      const arrivalDate = new Date(departureDate);
      arrivalDate.setMinutes(departureDate.getMinutes() + duration);
      const passengerCount = Math.floor(Math.random() * 300);
      const price = Math.floor(Math.random() * (3000 - 300 + 1)) + 300;

      flights.push({
        flightNumber,
        departureAirport,
        arrivalAirport,
        departureDate,
        arrivalDate,
        duration,
        airline,
        passengerCount,
        price,
      });
    }
  }
}

const data = JSON.stringify(flights);

fs.writeFileSync('./flights.json', data);
