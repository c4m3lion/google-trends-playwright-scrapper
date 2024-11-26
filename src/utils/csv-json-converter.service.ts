import csv = require('csvtojson');

export default class CSVToJsonConverter {
    public static async convert(csvFilePath: string): Promise<any> {
        return csv().fromFile(csvFilePath);
    }
}
