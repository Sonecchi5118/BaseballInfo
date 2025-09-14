import { writeFileSync } from "fs";
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
function getDateRange(start, end) {
    const dates = [];
    const current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
        dates.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
    }
    return dates;
}
async function fetchGamePks(date) {
    const url = `https://stats.npb.jp/api/dmp/v1/schedule/?startDate=${date}&endDate=${date}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.games.map((g) => g.gamePk);
}
async function fetchGameResult(gamePk) {
    const url = `https://stats.npb.jp/api/dmp/v1.1/game/${gamePk}/feed/live?language=ja`;
    const res = await fetch(url);
    const data = await res.json();
    const status = data.gameData.status.abstractGameState;
    const finished = status === 'Final';
    const homeTeam = data.gameData.teams.home.name;
    const awayTeam = data.gameData.teams.away.name;
    const homeScore = data.liveData.linescore.teams.home.runs;
    const awayScore = data.liveData.linescore.teams.away.runs;
    return { homeTeam, awayTeam, homeScore, awayScore, finished };
}
async function main() {
    const result = initResult();
    const today = new Date().toISOString().slice(0, 10);
    const seasonStart = '2025-03-29';
    const dates = getDateRange(seasonStart, today);
    for (const date of dates) {
        const gamePks = await fetchGamePks(date);
        for (const gamePk of gamePks) {
            const { homeTeam, awayTeam, homeScore, awayScore, finished } = await fetchGameResult(gamePk);
            if (!finished)
                continue;
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
            console.log(`✅ ${date} 試合反映: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`);
        }
    }
    writeFileSync('result.json', JSON.stringify(result, null, 2));
    console.log('🎉 result.json を更新しました');
}
main().catch(err => {
    console.error('❌ エラー:', err);
});
