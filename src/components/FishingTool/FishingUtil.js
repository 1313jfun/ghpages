export function convertTimeStampToUSFormat(dateString) {
    // Create a new Date object from the input string
    const date = new Date(dateString);
    
    // Get the month, day, and year from the Date object
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    // Return the date in MM/DD/YYYY format
    return `${month}/${day}`;
}

export function convertAirPressureFromPascalToInHg(airPressure) {
const InHgAirPressure = (airPressure / 3386.39).toFixed(2);
return `${InHgAirPressure}`;
}