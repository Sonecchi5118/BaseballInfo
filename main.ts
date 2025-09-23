const now = new Date()

type TeamResult = { team: string; games: number; win: number; lose: number; draw: number; lastyear: number; rate: number; vs1?: vsteam, vs2?: vsteam, vs3?: vsteam, vs4?: vsteam, vs5?: vsteam, vs6?: vsteam, PossibilityRanking: number[]};
interface vsteam {
  win: number;
  lose: number;
  draw: number;
}
let rankingData: {P: TeamResult[], C: TeamResult[]} = {P: [], C: []}

async function loadResults() {
  try {
    const res = await fetch('./result.json');
    if (!res.ok) throw new Error('❌ 読み込み失敗');
    const data = await res.json();
    //console.log('✅ 勝敗データ:', data);
    rankingData = data
    return;
  } catch (err) {
    console.error(err);
  }
}

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

function renderRankingTable() {
    const tbody = document.getElementById('ranking-body');
    if (tbody == null) return;
    tbody.innerHTML = '';
    const sortedRankingData = SortTeamResult(rankingData.P)

    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>順位</td>
        <td>チーム名</td>
        <td>勝利</td>
        <td>敗戦</td>
        <td>引分</td>
        <td>勝率</td>
        <td>ゲーム差</td>
        <td>貯・借金</td>
        <td>残試合</td>
        <td>vs${teamShortName(sortedRankingData[0].team)}</td>
        <td>vs${teamShortName(sortedRankingData[1].team)}</td>
        <td>vs${teamShortName(sortedRankingData[2].team)}</td>
        <td>vs${teamShortName(sortedRankingData[3].team)}</td>
        <td>vs${teamShortName(sortedRankingData[4].team)}</td>
        <td>vs${teamShortName(sortedRankingData[5].team)}</td>
    `;
    tbody.appendChild(tr);

    for (let index = 0; index < rankingData.P.length; index++) {
        const row = sortedRankingData[index];
        const upTeam = index >= 1 ? rankingData.P[index-1] : undefined;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index+1}</td>
            <td>${row.team}</td>
            <td>${row.win}</td>
            <td>${row.lose}</td>
            <td>${row.draw}</td>
            <td>${`${Math.round(row.win/(row.win+row.lose)*10000)/10000}0000`.slice(1, 6)}</td>
            <td>${upTeam ? (((upTeam.win-upTeam.lose) - (row.win-row.lose))/2).toFixed(1) : '-'}</td>
            <td>${row.win-row.lose}</td>
            <td>${143-(row.win+row.lose+row.draw)}</td>
            <td>${row.vs1 ? `${row.vs1.win}-${row.vs1.lose}(${row.vs1.draw})` : '-'}</td>
            <td>${row.vs2 ? `${row.vs2.win}-${row.vs2.lose}(${row.vs2.draw})` : '-'}</td>
            <td>${row.vs3 ? `${row.vs3.win}-${row.vs3.lose}(${row.vs3.draw})` : '-'}</td>
            <td>${row.vs4 ? `${row.vs4.win}-${row.vs4.lose}(${row.vs4.draw})` : '-'}</td>
            <td>${row.vs5 ? `${row.vs5.win}-${row.vs5.lose}(${row.vs5.draw})` : '-'}</td>
            <td>${row.vs6 ? `${row.vs6.win}-${row.vs6.lose}(${row.vs6.draw})` : '-'}</td>
        `;
        tbody.appendChild(tr);
    };
}

function renderPossibilityOfRankingTable() {
    const tbody = document.getElementById('grid-body');
    if (tbody == null) return;
    const sortedRankingData = SortTeamResult(rankingData.P)
    let HTMLText = ''
    for (let i = 0; i < 7; i++) {
        HTMLText += `<tr><td><div class="cell"><span class="label">${i == 0 ? '' : i}</span></div></td>`
        for (let ranking = 0; ranking < sortedRankingData.length; ranking++) {
            const teamdata = sortedRankingData[ranking];
            if (i == 0) HTMLText += `<td><div class="cell"><span class="label">${teamShortName(teamdata.team)}</span></div></td>`
            else HTMLText += `<td><div class="cell" style="background: ${teamdata.PossibilityRanking[i-1] == 0 ? '#aac7afff' : i-1 == ranking ? '#ff6666': i-1 < ranking ? '#ffbd71ff': '#99d9e4ff'}"><span class="label">${teamdata.PossibilityRanking[i-1] == 0 ? '-' : `${`${(teamdata.PossibilityRanking[i-1]*100).toPrecision(4)}`.slice(0, 5)}%`}</span></div></td>`
        }
        HTMLText += '</tr>'
    }
    tbody.innerHTML = HTMLText
}

async function getGameResult(date: Date) {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');

  try {
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = `https://npb.jp/bis/${date.getFullYear()}/games/gm${dateStr}.html`;
    const url = proxyUrl + encodeURIComponent(targetUrl);

    const res = await fetch(url);
    const htmlText = await res.text();

    // HTMLをDOMとして解析
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const teamCells = Array.from(doc.querySelectorAll('td.contentsTeam'));
    const scoreCells = Array.from(doc.querySelectorAll('td.contentsRuns'));

    const output: { homeTeam: string; homeScore: string; visitorScore: string; visitorTeam: string }[] = [];

    if (scoreCells[1]?.textContent?.trim() == '') return;

    for (let i = 0; i < teamCells.length; i += 2) {
      const homeTeam = teamName(teamCells[i]?.textContent?.trim() ?? '');
      const visitorTeam = teamName(teamCells[i + 1]?.textContent?.trim() ?? '');
      const homeScore = scoreCells[i]?.textContent?.trim() ?? '';
      const visitorScore = scoreCells[i + 1]?.textContent?.trim() ?? '';

      output.push({ homeTeam, homeScore, visitorScore, visitorTeam });
    }

    return output;
  } catch (err) {
    console.error('取得エラー:', err);
    return;
  }
}


const daySt = [
  '月',
  '火',
  '水',
  '木',
  '金',
  '土',
  '日'
]

function teamShortName(teamname: string) {
    switch (teamname) {
        case '日本ハム': return 'F'
        case 'ソフトバンク': return 'H'
        case '楽天': return 'E'
        case '西武': return 'L'
        case 'オリックス': return 'B'
        case 'ロッテ': return 'M'
        case '阪神': return 'T'
        case '読売': return 'G'
        case 'ヤクルト': return 'S'
        case '広島': return 'C'
        case 'DeNA': return 'DB'
        case '中日': return 'D'
        default:  return teamname
    }
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

async function displayLatestGame() {
  const Day = new Date()
  const display = (data: {
    homeTeam: string;
    homeScore: string;
    visitorScore: string;
    visitorTeam: string;
}[], date: Date) => {
    const resultsDiv = document.getElementById('latest-results');
    if (resultsDiv == null) return;
    resultsDiv.innerHTML = `<h2>最新試合結果   ${date.getMonth()+1}/${date.getDate()}(${daySt[date.getDay()]})</h2>`;
    const ul = document.createElement('ul');
    data.forEach(game => {
        const li = document.createElement('li');
        li.textContent = `${game.homeTeam}  ${game.homeScore} - ${game.visitorScore}  ${game.visitorTeam}`;
        ul.appendChild(li);
    });
    resultsDiv.appendChild(ul);
  }
  let result = await getGameResult(Day)
  while (result == undefined) {
    Day.setDate(Day.getDate()-1)
    result = await getGameResult(Day)
  }
  display(result, Day)
}

document.addEventListener('DOMContentLoaded', async () => {
    await loadResults();
    displayLatestGame()
    renderRankingTable()
    renderPossibilityOfRankingTable()
});