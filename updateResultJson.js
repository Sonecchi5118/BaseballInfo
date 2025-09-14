import fetch from 'node-fetch';
import * as fs from 'fs';
const RESULT_PATH = './result.json';
const PROCESSED_PATH = './processedGames.json';
const teams = [
    'オリックス', 'ソフトバンク', '楽天', '西武', 'ロッテ', '日本ハム',
    '阪神', '巨人', 'ヤクルト', '広島', 'DeNA', '中日'
];
function initResult() {
    const result = {};
    teams.forEach(team => {
        result[team] = { win: 0, lose: 0, draw: 0 };
    });
    return result;
}
function loadJson(path, fallback) {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf-8'));
    }
    catch {
        return fallback;
    }
}
const today = new Date().toISOString().slice(0, 10);
const scheduleUrl = `https://stats.npb.jp/api/dmp/v1/schedule/?startDate=${today}&endDate=${today}`;
async function updateResults() {
    const result = loadJson(RESULT_PATH, initResult());
    const processed = loadJson(PROCESSED_PATH, []);
    const scheduleRes = await fetch(scheduleUrl);
    const scheduleData = await scheduleRes.json();
    const gamePks = scheduleData.games.map((g) => g.gamePk);
    for (const gamePk of gamePks) {
        if (processed.includes(gamePk))
            continue;
        const liveUrl = `https://stats.npb.jp/api/dmp/v1.1/game/${gamePk}/feed/live?language=ja`;
        const liveRes = await fetch(liveUrl);
        const liveData = await liveRes.json();
        const status = liveData.gameData.status.abstractGameState;
        if (status !== 'Final')
            continue;
        const homeTeam = liveData.gameData.teams.home.name;
        const awayTeam = liveData.gameData.teams.away.name;
        const homeScore = liveData.liveData.linescore.teams.home.runs;
        const awayScore = liveData.liveData.linescore.teams.away.runs;
        if (homeScore > awayScore) {
            result[homeTeam].win += 1;
            result[awayTeam].lose += 1;
        }
        else if (homeScore < awayScore) {
            result[awayTeam].win += 1;
            result[homeTeam].lose += 1;
        }
        else {
            result[homeTeam].draw += 1;
            result[awayTeam].draw += 1;
        }
        processed.push(gamePk);
        console.log(`✅ 試合 ${gamePk} を反映: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`);
    }
    fs.writeFileSync(RESULT_PATH, JSON.stringify(result, null, 2));
    fs.writeFileSync(PROCESSED_PATH, JSON.stringify(processed, null, 2));
}
updateResults().catch(err => {
    console.error('❌ 更新失敗:', err);
});
