import fetch from 'node-fetch';
import * as fs from 'fs';

function teamName(teamname: string) {
    switch (teamname) {
        case '北海道日本ハム': return '日本ハム'
        case '福岡ソフトバンク': return 'ソフトバンク'
        case '東北楽天': return '楽天'
        case '埼玉西武': return '西武'
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

type TeamResult = { team: string; games: number; win: number; lose: number; draw: number; vs1?: vsteam, vs2?: vsteam, vs3?: vsteam, vs4?: vsteam, vs5?: vsteam, vs6?: vsteam};
interface vsteam {
  win: number;
  lose: number;
  draw: number;
}
const result: TeamResult[] = []

const url = 'https://npb.jp/bis/2025/stats/std_p.html';

async function fetchStandings() {
  const res = await fetch(url);
  const htmlText = await res.text(); // HTMLを文字列として取得
  //console.log(htmlText)

  //0:? 2:チーム名 3:総試合数 4: 勝利 5:敗北 6:引分 7:勝率 8:ゲーム差 9:ホーム成績 10:ビジター成績 11:対1位成績 12:対2位成績 13:対3位成績 14:対4位成績 15:対5位成績 16: 対6位成績
  const regex = /<td\s+class="stdTeam">(.*?)<br\s+\/>(.*?)<\/td><\/tr><\/table><\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td>/g;

  for (const info of htmlText.matchAll(regex)) {
    const team = teamName(info[1])
    if (result.find(r => r.team == team) != undefined) continue;
    const vs1 = info[11].replace(/<br \/>/g, '').match(/(.*?)-(.*?)\((.*?)\)/) ?? info[11].replace(/<br \/>/g, '').match(/(.*?)-(.*?)/)
    const vs2 = info[12].replace(/<br \/>/g, '').match(/(.*?)-(.*?)\((.*?)\)/) ?? info[12].replace(/<br \/>/g, '').match(/(.*?)-(.*?)/)
    const vs3 = info[13].replace(/<br \/>/g, '').match(/(.*?)-(.*?)\((.*?)\)/) ?? info[13].replace(/<br \/>/g, '').match(/(.*?)-(.*?)/)
    const vs4 = info[14].replace(/<br \/>/g, '').match(/(.*?)-(.*?)\((.*?)\)/) ?? info[14].replace(/<br \/>/g, '').match(/(.*?)-(.*?)/)
    const vs5 = info[15].replace(/<br \/>/g, '').match(/(.*?)-(.*?)\((.*?)\)/) ?? info[15].replace(/<br \/>/g, '').match(/(.*?)-(.*?)/)
    const vs6 = info[16].replace(/<br \/>/g, '').match(/(.*?)-(.*?)\((.*?)\)/) ?? info[16].replace(/<br \/>/g, '').match(/(.*?)-(.*?)/)
    //console.log(vs1)
    result.push({team, games: Number(info[3]), win: Number(info[4]), lose: Number(info[5]), draw: Number(info[6]), 
      vs1: !vs1 ? undefined : {win: Number(vs1[1]), lose: Number(vs1[2]), draw: Number(vs1[3]??0)},
      vs2: !vs2 ? undefined : {win: Number(vs2[1]), lose: Number(vs2[2]), draw: Number(vs2[3]??0)},
      vs3: !vs3 ? undefined : {win: Number(vs3[1]), lose: Number(vs3[2]), draw: Number(vs3[3]??0)},
      vs4: !vs4 ? undefined : {win: Number(vs4[1]), lose: Number(vs4[2]), draw: Number(vs4[3]??0)},
      vs5: !vs5 ? undefined : {win: Number(vs5[1]), lose: Number(vs5[2]), draw: Number(vs5[3]??0)},
      vs6: !vs6 ? undefined : {win: Number(vs6[1]), lose: Number(vs6[2]), draw: Number(vs6[3]??0)},
    })
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
