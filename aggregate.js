const utils = require('./utils');

/**
 * @description Given a master map of countries to dates to attendees, return an array of events
 * @param {Map} map is the map of countries to dates to attendees
 * @returns {Array} an array of events of the form { name, attendeeCount, attendees, startDate }
 */
const getEventsFromMap = (map) => {
  const events = [];

  for (const [name, datesMap] of map) {
    const sortedDates = [...datesMap].sort((a, b) => {
      const [dateA, attendeesA] = a;
      const [dateB, attendeesB] = b;

      if (attendeesA.length === attendeesB.length) {
        return Date.parse(dateA) < Date.parse(dateB) ? -1 : 1;
      } else {
        return attendeesB.length - attendeesA.length;
      }

    });

    const eventData = {
      name,
      attendeeCount: 0,
      attendees: [],
      startDate: null,
    };

    if (sortedDates.length > 0) {
      const [earliestEventDate] = sortedDates;
      const [date, attendees] = earliestEventDate;

      eventData.startDate = date;
      eventData.attendeeCount = attendees.length;
      eventData.attendees = attendees;
    }

    events.push(eventData);
  }
  return events;
}

/**
 * @description Given an array of partners, return an object of the form { countries: ArrayOfEvents } where ArrayOfEvents is an array of events of the form { name, attendeeCount, attendees, startDate }
 * @param {Array} partners is the array of partners from the dataset
 * @returns {Object} an object of the form { countries: ArrayOfEvents } where ArrayOfEvents is an array of events of the form { name, attendeeCount, attendees, startDate }
 */
const aggregate = (partners) => {
  const masterMap = new Map();
  for (const partner of partners) {
    const { country, email, availableDates } = partner;

    if (!utils.hasAvailableDatesConditionMet(availableDates)) {
      continue;
    }

    if (!masterMap.has(country)) {
      masterMap.set(country, new Map());
    }

    const countryPartners = masterMap.get(country);
    let probableEventStartDate = null;

    for (const probableEventEndDate of availableDates.sort()) {
      if (!probableEventStartDate) {
        probableEventStartDate = probableEventEndDate;
        continue;
      }

      if (utils.dayBetweenDates({start: probableEventStartDate, end: probableEventEndDate}) === 1) {
          
        if (!countryPartners.has(probableEventStartDate)) {
          countryPartners.set(probableEventStartDate, []);
        }

        countryPartners.get(probableEventStartDate).push(email);
      }

      probableEventStartDate = probableEventEndDate;
    }
  }

  return { countries: getEventsFromMap(masterMap) };
};



module.exports = aggregate;