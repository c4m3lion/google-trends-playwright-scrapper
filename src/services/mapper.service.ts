import { GoogleTrendUpdate } from '../interfaces/google-trend-update';

export class MapperService {

    public static convertToISO(dateString: string): string {
        // Match the date components using a regex
        if(!dateString || dateString === '') {
            return new Date().toISOString();
        }
        const dateRegex = /^(\w+)\s(\d+),\s(\d+)\sat\s(\d+):(\d+):(\d+)\s(\w+)\sUTC([+-]\d+)$/;
        const match = dateString.match(dateRegex);

        if (!match) {
            throw new Error("Invalid date string format");
        }

        // Extract matched components
        const [, monthName, day, year, hour, minute, second, period, utcOffset] = match;

        // Map month names to zero-based month index
        const months: { [key: string]: number } = {
            January: 0,
            February: 1,
            March: 2,
            April: 3,
            May: 4,
            June: 5,
            July: 6,
            August: 7,
            September: 8,
            October: 9,
            November: 10,
            December: 11,
        };

        const month = months[monthName];
        if (month === undefined) {
            throw new Error("Invalid month name");
        }

        // Adjust hour for AM/PM
        let hourNumber = parseInt(hour, 10);
        if (period === "PM" && hourNumber !== 12) {
            hourNumber += 12;
        } else if (period === "AM" && hourNumber === 12) {
            hourNumber = 0;
        }

        // Convert UTC offset to hours
        const offsetHours = parseInt(utcOffset, 10);

        // Create the date in UTC, adjusting for the offset
        const date = new Date(Date.UTC(
            parseInt(year, 10),
            month,
            parseInt(day, 10),
            hourNumber - offsetHours,
            parseInt(minute, 10),
            parseInt(second, 10),
        ));

        // Return the ISO string
        return date.toISOString();
    }

    public static mapToGoogleTrendUpdate(data: any): GoogleTrendUpdate {

        return {
            trendText: data.Trends,
            stared: this.convertToISO(data.Started),
            ended: this.convertToISO(data.Ended),
            traffic: data['Search volume']
        };
    }
}