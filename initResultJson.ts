import fetch from 'node-fetch';
import * as fs from 'fs';

const lastyearResult = {
  '日本ハム': 2,
  'ソフトバンク': 1,
  '楽天': 4,
  '西武': 6,
  'オリックス': 5,
  'ロッテ': 3
}

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

function teamName2(teamname: string) {
    switch (teamname) {
        case '日': return '日本ハム'
        case 'ソ': return 'ソフトバンク'
        case '楽': return '楽天'
        case '西': return '西武'
        case 'オ': return 'オリックス'
        case 'ロ': return 'ロッテ'
        case '神': return '阪神'
        case '巨': return '巨人'
        case 'ヤ': return 'ヤクルト'
        case '広': return '広島'
        case 'デ': return 'DeNA'
        case '中': return '中日'
        default:  return teamname
    }
}

type TeamResult = { team: string; games: number; win: number; lose: number; draw: number; lastyear: number; rate: number; vs1?: vsteam, vs2?: vsteam, vs3?: vsteam, vs4?: vsteam, vs5?: vsteam, vs6?: vsteam, PossibilityRanking: number[]};
interface vsteam {
  win: number;
  lose: number;
  draw: number;
}
const result: {P: TeamResult[], C: TeamResult[]} = {P: [], C: []}


const defaultRate = 1500
const K = 32
const rates = {
  'ソフトバンク': defaultRate,
  '日本ハム': defaultRate,
  'ロッテ': defaultRate, 
  'オリックス': defaultRate,
  '楽天': defaultRate,
  '西武': defaultRate,
  '広島': defaultRate,
  '阪神': defaultRate,
  '巨人': defaultRate,
  '中日': defaultRate,
  'ヤクルト': defaultRate,
  'DeNA': defaultRate
}

async function fetchStandings(league: 'P' | 'C') {
  const res = await fetch(`https://npb.jp/bis/2025/stats/std_${league.toLowerCase()}.html`);
  const htmlText = await res.text(); // HTMLを文字列として取得
  //console.log(htmlText)

  //0:? 2:チーム名 3:総試合数 4: 勝利 5:敗北 6:引分 7:勝率 8:ゲーム差 9:ホーム成績 10:ビジター成績 11:対1位成績 12:対2位成績 13:対3位成績 14:対4位成績 15:対5位成績 16: 対6位成績
  const regex = /<td\s+class="stdTeam">(.*?)<br\s+\/>(.*?)<\/td><\/tr><\/table><\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td><td\s+class="stdscore">(.*?)<\/td>/g;

  for (const info of htmlText.matchAll(regex)) {
    const team = teamName(info[1]) as keyof typeof rates
    if (result[league].find(r => r.team == team) != undefined) continue;
    //console.log(info[11])
    const vs1 = info[11].replace(/<br \/>/g, '').match(/(.*?)-(.*?)\((.*?)\)/) ?? (info[11]+'(0)').match(/(.*?)-(.*?)\((.*?)\)/)
    const vs2 = info[12].replace(/<br \/>/g, '').match(/(.*?)-(.*?)\((.*?)\)/) ?? (info[12]+'(0)').match(/(.*?)-(.*?)\((.*?)\)/)
    const vs3 = info[13].replace(/<br \/>/g, '').match(/(.*?)-(.*?)\((.*?)\)/) ?? (info[13]+'(0)').match(/(.*?)-(.*?)\((.*?)\)/)
    const vs4 = info[14].replace(/<br \/>/g, '').match(/(.*?)-(.*?)\((.*?)\)/) ?? (info[14]+'(0)').match(/(.*?)-(.*?)\((.*?)\)/)
    const vs5 = info[15].replace(/<br \/>/g, '').match(/(.*?)-(.*?)\((.*?)\)/) ?? (info[15]+'(0)').match(/(.*?)-(.*?)\((.*?)\)/)
    const vs6 = info[16].replace(/<br \/>/g, '').match(/(.*?)-(.*?)\((.*?)\)/) ?? (info[16]+'(0)').match(/(.*?)-(.*?)\((.*?)\)/)
    //console.log(vs1)
    result[league].push({team, games: Number(info[3]), win: Number(info[4]), lose: Number(info[5]), draw: Number(info[6]), 
      //@ts-ignore
      lastyear: lastyearResult[team],
      rate: rates[team],
      vs1: !vs1 ? undefined : {win: Number(vs1[1]), lose: Number(vs1[2]), draw: Number(vs1[3]??0)},
      vs2: !vs2 ? undefined : {win: Number(vs2[1]), lose: Number(vs2[2]), draw: Number(vs2[3]??0)},
      vs3: !vs3 ? undefined : {win: Number(vs3[1]), lose: Number(vs3[2]), draw: Number(vs3[3]??0)},
      vs4: !vs4 ? undefined : {win: Number(vs4[1]), lose: Number(vs4[2]), draw: Number(vs4[3]??0)},
      vs5: !vs5 ? undefined : {win: Number(vs5[1]), lose: Number(vs5[2]), draw: Number(vs5[3]??0)},
      vs6: !vs6 ? undefined : {win: Number(vs6[1]), lose: Number(vs6[2]), draw: Number(vs6[3]??0)},
      PossibilityRanking: []
    })
  }

}

async function SimulateLastGames() {
  for (let month = 4; month <= 10; month++) {
    const res = await fetch(`https://npb.jp/bis/2025/calendar/index_${`0${month}`.slice(-2)}.html`);
    const htmlText = await res.text(); // HTMLを文字列として取得
    //console.log(htmlText)
    for (const info of htmlText.matchAll(/.html">([\u3040-\u30FF\u4E00-\u9FFF]{1})\s+(\d+)\s+-\s+(\d+)\s+([\u3040-\u30FF\u4E00-\u9FFF]{1})<\/a>/g)) {
      const teamA = teamName2(info[1]) as keyof typeof rates
      const teamB = teamName2(info[4]) as keyof typeof rates
      const scoreA = info[2]
      const scoreB = info[3]
      if (scoreA == '*' || scoreB == '*') continue;
      const winA = Number(scoreA)>Number(scoreB) ? 1 : Number(scoreA)==Number(scoreB) ? 0.5 : 0
      const winB = 1-winA
      const rateA = rates[teamA]
      const rateB = rates[teamB]
      //console.log(`${team1} ${score1} - ${score2} ${team2}`)
      if (!rateA || !rateB) continue;
      const Wab = 1/(10**((rateB-rateA)/400)+1)
      const Wba = 1-Wab
      rates[teamA] = Math.round((rateA + K*(winA-Wab))*100)/100
      rates[teamB] = Math.round((rateB + K*(winB-Wba))*100)/100
    }
  }
  for (const team in rates) {
    //@ts-ignore
    const rate = rates[team];
    const info = result.C.find(r => r.team == team) ?? result.P.find(r => r.team == team)
    if (info) info.rate = rate
  }

  const simulate = (league: 'C' | 'P') => {
    const sortedResult = SortTeamResult(result[league])
    const R = {
      'C': {
        'DeNA': [0, 0, 0, 0, 0, 0],
        '阪神': [0, 0, 0, 0, 0, 0],
        '中日': [0, 0, 0, 0, 0, 0],
        'ヤクルト': [0, 0, 0, 0, 0, 0],
        '広島': [0, 0, 0, 0, 0, 0],
        '巨人': [0, 0, 0, 0, 0, 0],
      } as {[key: string]: number[]},
      'P': {
        '日本ハム': [0, 0, 0, 0, 0, 0],
        'ソフトバンク': [0, 0, 0, 0, 0, 0],
        'オリックス': [0, 0, 0, 0, 0, 0],
        '楽天': [0, 0, 0, 0, 0, 0],
        '西武': [0, 0, 0, 0, 0, 0],
        'ロッテ': [0, 0, 0, 0, 0, 0],
      } as {[key: string]: number[]}
    }
    const simulatetimes = 1000000
    for (let i = 0; i < simulatetimes; i++) { //残り試合をシミュレーション
      const simulateResult = structuredClone(sortedResult)
      //1vs2
      if (sortedResult[0].vs2) {
        const lastGames = (25-(sortedResult[0].vs2.win+sortedResult[0].vs2.lose+sortedResult[0].vs2.draw))
        //console.log(lastGames)
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[1].rate-sortedResult[0].rate)/400)+1))) win++;
        }
        simulateResult[0].win += win
        simulateResult[0].lose += lastGames-win
        simulateResult[1].win += lastGames-win
        simulateResult[1].lose += win
      }

      //1vs3
      if (sortedResult[0].vs3) {
        const lastGames = (25-(sortedResult[0].vs3.win+sortedResult[0].vs3.lose+sortedResult[0].vs3.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[2].rate-sortedResult[0].rate)/400)+1))) win++;
        }
        simulateResult[0].win += win
        simulateResult[0].lose += lastGames-win
        simulateResult[2].win += lastGames-win
        simulateResult[2].lose += win
      }

      //1vs4
      if (sortedResult[0].vs4) {
        const lastGames = (25-(sortedResult[0].vs4.win+sortedResult[0].vs4.lose+sortedResult[0].vs4.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[3].rate-sortedResult[0].rate)/400)+1))) win++;
        }
        simulateResult[0].win += win
        simulateResult[0].lose += lastGames-win
        simulateResult[3].win += lastGames-win
        simulateResult[3].lose += win
      }

      //1vs5
      if (sortedResult[0].vs5) {
        const lastGames = (25-(sortedResult[0].vs5.win+sortedResult[0].vs5.lose+sortedResult[0].vs5.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[4].rate-sortedResult[0].rate)/400)+1))) win++;
        }
        simulateResult[0].win += win
        simulateResult[0].lose += lastGames-win
        simulateResult[4].win += lastGames-win
        simulateResult[4].lose += win
      }

      //1vs6
      if (sortedResult[0].vs6) {
        const lastGames = (25-(sortedResult[0].vs6.win+sortedResult[0].vs6.lose+sortedResult[0].vs6.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[5].rate-sortedResult[0].rate)/400)+1))) win++;
        }
        simulateResult[0].win += win
        simulateResult[0].lose += lastGames-win
        simulateResult[5].win += lastGames-win
        simulateResult[5].lose += win
      }

      //2vs3
      if (sortedResult[1].vs3) {
        const lastGames = (25-(sortedResult[1].vs3.win+sortedResult[1].vs3.lose+sortedResult[1].vs3.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[2].rate-sortedResult[1].rate)/400)+1))) win++;
        }
        simulateResult[1].win += win
        simulateResult[1].lose += lastGames-win
        simulateResult[2].win += lastGames-win
        simulateResult[2].lose += win
      }

      //2vs4
      if (sortedResult[1].vs4) {
        const lastGames = (25-(sortedResult[1].vs4.win+sortedResult[1].vs4.lose+sortedResult[1].vs4.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[3].rate-sortedResult[1].rate)/400)+1))) win++;
        }
        simulateResult[1].win += win
        simulateResult[1].lose += lastGames-win
        simulateResult[3].win += lastGames-win
        simulateResult[3].lose += win
      }

      //2vs5
      if (sortedResult[1].vs5) {
        const lastGames = (25-(sortedResult[1].vs5.win+sortedResult[1].vs5.lose+sortedResult[1].vs5.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[4].rate-sortedResult[1].rate)/400)+1))) win++;
        }
        simulateResult[1].win += win
        simulateResult[1].lose += lastGames-win
        simulateResult[4].win += lastGames-win
        simulateResult[4].lose += win
      }

      //2vs6
      if (sortedResult[1].vs6) {
        const lastGames = (25-(sortedResult[1].vs6.win+sortedResult[1].vs6.lose+sortedResult[1].vs6.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[5].rate-sortedResult[1].rate)/400)+1))) win++;
        }
        simulateResult[1].win += win
        simulateResult[1].lose += lastGames-win
        simulateResult[5].win += lastGames-win
        simulateResult[5].lose += win
      }

      //3vs4
      if (sortedResult[2].vs4) {
        const lastGames = (25-(sortedResult[2].vs4.win+sortedResult[2].vs4.lose+sortedResult[2].vs4.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[3].rate-sortedResult[2].rate)/400)+1))) win++;
        }
        simulateResult[2].win += win
        simulateResult[2].lose += lastGames-win
        simulateResult[3].win += lastGames-win
        simulateResult[3].lose += win
      }

      //3vs5
      if (sortedResult[2].vs5) {
        const lastGames = (25-(sortedResult[2].vs5.win+sortedResult[2].vs5.lose+sortedResult[2].vs5.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[4].rate-sortedResult[2].rate)/400)+1))) win++;
        }
        simulateResult[2].win += win
        simulateResult[2].lose += lastGames-win
        simulateResult[4].win += lastGames-win
        simulateResult[4].lose += win
      }

      //3vs6
      if (sortedResult[2].vs6) {
        const lastGames = (25-(sortedResult[2].vs6.win+sortedResult[2].vs6.lose+sortedResult[2].vs6.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[5].rate-sortedResult[2].rate)/400)+1))) win++;
        }
        simulateResult[2].win += win
        simulateResult[2].lose += lastGames-win
        simulateResult[5].win += lastGames-win
        simulateResult[5].lose += win
      }

      //4vs5
      if (sortedResult[3].vs5) {
        const lastGames = (25-(sortedResult[3].vs5.win+sortedResult[3].vs5.lose+sortedResult[3].vs5.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[4].rate-sortedResult[3].rate)/400)+1))) win++;
        }
        simulateResult[3].win += win
        simulateResult[3].lose += lastGames-win
        simulateResult[4].win += lastGames-win
        simulateResult[4].lose += win
      }

      //4vs6
      if (sortedResult[3].vs6) {
        const lastGames = (25-(sortedResult[3].vs6.win+sortedResult[3].vs6.lose+sortedResult[3].vs6.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[5].rate-sortedResult[3].rate)/400)+1))) win++;
        }
        simulateResult[3].win += win
        simulateResult[3].lose += lastGames-win
        simulateResult[5].win += lastGames-win
        simulateResult[5].lose += win
      }

      //5vs6
      if (sortedResult[4].vs6) {
        const lastGames = (25-(sortedResult[4].vs6.win+sortedResult[4].vs6.lose+sortedResult[4].vs6.draw))
        let win = 0;
        for (let i = 0; i < lastGames; i++) {
          if (Math.random() <= (1/(10**((sortedResult[5].rate-sortedResult[4].rate)/400)+1))) win++;
        }
        simulateResult[4].win += win
        simulateResult[4].lose += lastGames-win
        simulateResult[5].win += lastGames-win
        simulateResult[5].lose += win
      }

      const simulateR = SortTeamResult(simulateResult)
      for (let index = 0; index < simulateR.length; index++) {
        const team = simulateR[index];
        R[league][team.team][index]++;
      }
    }
    for (const team in R[league]) {
      for (let i = 0; i < R[league][team].length; i++) {
        const percentage = R[league][team][i];
        R[league][team][i] = percentage/simulatetimes
      }

      const info = result[league].find(t => t.team == team)
      if (info) info.PossibilityRanking = R[league][team]
    }
    //console.log(R)
  }
  simulate('P')
}

async function main() {
  await fetchStandings('C');
  await fetchStandings('P');
  await SimulateLastGames()
  fs.writeFileSync('result.json', JSON.stringify(result, null, 2), 'utf-8');
  console.log('🎉 result.json を更新しました');
}

main().catch(err => {
  console.error('❌ エラー:', err);
});

function SortTeamResult(teamresult: TeamResult[]) {
    const RawsortedRankingData = teamresult.sort((a, b) => {
        return b.win/(b.win+b.lose) - a.win/(a.win+a.lose)
    })
    return teamresult.sort((a, b) => {
        if (b.win/(b.win+b.lose) != a.win/(a.win+a.lose)) return b.win/(b.win+b.lose) - a.win/(a.win+a.lose)
        else {
            const aind = RawsortedRankingData.findIndex(d => d.team == a.team)
            const bind = RawsortedRankingData.findIndex(d => d.team == b.team)
            //@ts-ignore
            const avsb = (a[`vs${bind}`] ?? a[`vs${aind}`] ) as vsteam
            if (avsb.win != avsb.lose) return avsb.lose-avsb.win
            else {
                return ((b.vs1?.win??0)+(b.vs2?.win??0)+(b.vs3?.win??0)+(b.vs4?.win??0)+(b.vs5?.win??0)+(b.vs6?.win??0))/((b.vs1?.win??0)+(b.vs2?.win??0)+(b.vs3?.win??0)+(b.vs4?.win??0)+(b.vs5?.win??0)+(b.vs6?.win??0)+(b.vs1?.lose??0)+(b.vs2?.lose??0)+(b.vs3?.lose??0)+(b.vs4?.lose??0)+(b.vs5?.lose??0)+(b.vs6?.lose??0))
                -((a.vs1?.win??0)+(a.vs2?.win??0)+(a.vs3?.win??0)+(a.vs4?.win??0)+(a.vs5?.win??0)+(a.vs6?.win??0))/((a.vs1?.win??0)+(a.vs2?.win??0)+(a.vs3?.win??0)+(a.vs4?.win??0)+(a.vs5?.win??0)+(a.vs6?.win??0)+(a.vs1?.lose??0)+(a.vs2?.lose??0)+(a.vs3?.lose??0)+(a.vs4?.lose??0)+(a.vs5?.lose??0)+(a.vs6?.lose??0))
            }
        }
    })
}