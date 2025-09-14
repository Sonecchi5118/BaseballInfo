import fetch from 'node-fetch';
import * as fs from 'fs';

function teamName(teamname: string) {
    switch (teamname) {
        case '北海道日本ハム': return '日本ハム'
        case '福岡ソフトバンク': return 'ソフトバンク'
        case '東北楽天': return '楽天'
        case '埼玉西武': return '西部'
        case 'オリックス': return 'オリックス'
        case '千葉ロッテ': return 'ロッテ'
        case '阪　神': return '阪神'
        case '読　売': return '巨人'
        case '東京ヤクルト': return 'ヤクルト'
        case '広島東洋': return '広島'
        case '横浜DeNA': return 'DeNA'
        case '中　日': return '中日'
        default:  return teamname
    }
}

type TeamResult = { team: string; games: number; win: number; lose: number; draw: number };
const result: TeamResult[] = []

const url = 'https://npb.jp/bis/2025/stats/std_p.html';

async function fetchStandings() {
  const res = await fetch(url);
  const htmlText = await res.text(); // HTMLを文字列として取得
  //console.log(htmlText)

  const regex = /<td\s+class="stdTeam">(.*?)<br\s+\/>(.*?)<\/td><\/tr><\/table><\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td>/g;

  for (const info of htmlText.matchAll(regex)) {
    const team = teamName(info[1])
    if (result.find(r => r.team == team) != undefined) continue;
    result.push({team, games: Number(info[3]), win: Number(info[4]), lose: Number(info[5]), draw: Number(info[6])})
  }

}

async function main() {
  await fetchStandings();
  fs.writeFileSync('result.json', JSON.stringify(result, null, 2), 'utf-8');
  console.log('🎉 result.json を更新しました');
}

main().catch(err => {
  console.error('❌ エラー:', err);
});
