import { test, expect } from '@playwright/test';
import CSVToJsonConverter from "@utils/csv-json-converter.service";


test.describe('Trending Now US', () => {
    test('get table as json', async ({ page }) => {
        await page.goto('https://trends.google.com/trending?geo=US&sort=search-volume&hours=24&status=active');
        await page.waitForLoadState('networkidle');

        await page.getByRole('button', { name: 'Export   ▾' }).click();
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('menuitem', { name: 'Download CSV' }).click();
        const download = await downloadPromise;
        const filePath = await download.path();
        const jsonObj = await CSVToJsonConverter.convert(filePath);
        console.log(jsonObj);

    });
});