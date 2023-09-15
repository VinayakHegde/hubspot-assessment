const hasAvailableDatesConditionMet = (availableDates) => {
  return availableDates.length > 1;
}

const dayBetweenDates = ({start, end}) => {
  return Math.floor((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
}

module.exports = {
  hasAvailableDatesConditionMet,
  dayBetweenDates
};