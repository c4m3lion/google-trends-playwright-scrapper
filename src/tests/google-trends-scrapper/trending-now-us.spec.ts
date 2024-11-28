import { test, expect } from '@playwright/test';
import axios from 'axios';
import CSVToJsonConverter from "@services/csv-json-converter.service";
import { MapperService } from "@services/mapper.service";
import { GoogleTrendUpdate } from '@interfaces/google-trend-update';

test.describe('Trending Now US', () => {
    test('get table as json and send PUT request', async ({ page }) => {
        await page.goto('https://trends.google.com/trending?geo=US&sort=search-volume&hours=2');
        await page.waitForLoadState('networkidle');

        await page.getByRole('button', { name: 'Export   ▾' }).click();
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('menuitem', { name: 'Download CSV' }).click();
        const download = await downloadPromise;
        const filePath = await download.path();
        const jsonObj: [] = await CSVToJsonConverter.convert(filePath);

        let mappedData: GoogleTrendUpdate[] = [];

        jsonObj.forEach((element: any) => {
            mappedData.push(MapperService.mapToGoogleTrendUpdate(element));
        });

        console.log('Mapped data:', mappedData);
        try {
            const response = await axios.put('https://advayo-api.azurewebsites.net/api/GoogleTrend/update', mappedData);
            console.log('PUT request successful:', response.data);
            expect(response.status).toBe(200);
        } catch (error) {
            console.error('Error in PUT request:', error);
            expect(error).toBeNull();
        }
    });
});