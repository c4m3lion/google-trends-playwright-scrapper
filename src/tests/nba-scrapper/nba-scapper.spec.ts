import { test, expect } from '@playwright/test';
import * as fs from 'fs';

test.describe('NBA scrap', () => {
    test('get the NBA data', async ({ page }) => {
        await page.goto('https://www.nba.com/schedule');
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: 'I Accept' }).click();
        await page.goto('https://www.nba.com/schedule');
        // wait for ScheduleWeek_swBase__6wxQ7 to load
        await page.waitForSelector(".ScheduleWeek_swBase__6wxQ7");

        const weeks = page.locator(".ScheduleDay_sd__GFE_w");
        const weeksNumber = await weeks.count();
        const jsonData = [];
        for (let i = 0; i < weeksNumber; i++) {
            const week = weeks.nth(i);
            const dayText = await week.locator(".ScheduleDay_sdDay__3s2Xt").textContent();
            console.log(dayText);
            const games = week.locator(".ScheduleGame_sg__RmD9I");
            const gamesNumber = await games.count();
            const weekData = {
                dayText,
                games: []
            }
            for(let j = 0; j < gamesNumber; j++) {
                const gameTime = await games.locator(".ScheduleStatusText_base__Jgvjb").nth(j).textContent();
                const gameImg = await games.locator(".Broadcasters_icon__82MTV").nth(j).getAttribute("src");
                const gameLocalTv = await games.locator(".Broadcasters_tv__AIeZb").nth(j).textContent();
                const gameLocation = await games.locator(".ScheduleGame_sgLocationInner__xxr0Z").nth(j).textContent();
                const team1 = await games.nth(j).locator(".ScheduleGame_sgMatchup__SK1PV .Anchor_anchor__cSc3P").nth(0).textContent();
                const team2 = await games.nth(j).locator(".ScheduleGame_sgMatchup__SK1PV .Anchor_anchor__cSc3P").nth(1).textContent();
                const gameid = await games.nth(j).locator(".TabLink_tab__uKOPj .TabLink_link__f_15h").first().getAttribute("href");
                //gameid will be /game/lal-vs-cha-0022400648 give me the id and lal abd cha seperated
                const gameId = gameid.split("-")[3];
                weekData.games.push({
                    gameTime,
                    gameImg,
                    gameLocalTv,
                    gameLocation,
                    teams: {
                        team1,
                        team2
                    },
                    id: gameId,
                });
            }
            jsonData.push(weekData);

        }
        console.log(jsonData);
        //save to local json file with nba-{date}.json
        const date = new Date().toISOString().split("T")[0];
        fs.writeFileSync(`nba-${date}.json`, JSON.stringify(jsonData, null, 2));
    });
});