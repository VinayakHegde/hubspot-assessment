const utils = require('./utils');

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