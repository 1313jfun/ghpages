    const today = new Date();
    const stringToday = today.toString();
    const phase = getMoonPhase(today);
    const moonDescription = moonPhaseDescription(phase);
    const moonEmoji = moonPhaseEmoji(phase);

export function getMoonPhase(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-11
    const day = date.getDate();

    // Adjust months so that March is 1 and February is 12
    const adjustedMonth = month < 3 ? month + 12 : month;
    const adjustedYear = month < 3 ? year - 1 : year;

    const k1 = Math.floor(365.25 * (adjustedYear + 4712));
    const k2 = Math.floor(30.6 * (adjustedMonth + 1));
    const k3 = Math.floor(Math.floor(adjustedYear / 100 + 49) * 0.75) - 38;

    // Leap year correction
    const isLeapYear =
      (adjustedYear % 4 === 0 && adjustedYear % 100 !== 0) ||
      adjustedYear % 400 === 0;
    const leapCorrection = isLeapYear && adjustedMonth < 3 ? -1 : 0;

    const julianDay = k1 + k2 + k3 + day + 59 + leapCorrection;
    const moonPhase = ((julianDay - 2451550.1) / 29.53058867) % 1;

    return Math.floor(moonPhase * 8 + 0.5) % 8;
  }

export function moonPhaseDescription(phase) {
    switch (phase) {
      case 0:
        return "New Moon";
      case 1:
        return "Waxing Crescent";
      case 2:
        return "First Quarter";
      case 3:
        return "Waxing Gibbous";
      case 4:
        return "Full Moon";
      case 5:
        return "Waning Gibbous";
      case 6:
        return "Last Quarter";
      case 7:
        return "Waning Crescent";
      default:
        return "Unknown phase";
    }
  }

  export function moonPhaseEmoji(phase) {
    switch (phase) {
      case 0:
        return "🌑";
      case 1:
        return "🌒";
      case 2:
        return "🌓";
      case 3:
        return "🌔";
      case 4:
        return "🌕";
      case 5:
        return "🌖";
      case 6:
        return "🌗";
      case 7:
        return "🌘";
      default:
        return "?";
    }
  }
