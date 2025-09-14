const now = new Date()

type TeamResult = { team: string, games: number; win: number; lose: number; draw: number };
let rankingData: TeamResult[]

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

function renderRankingTable() {
    const tbody = document.getElementById('ranking-body');
    if (tbody == null) return;
    tbody.innerHTML = '';
    for (let index = 0; index < rankingData.length; index++) {
        const row = rankingData.sort((a, b) => {
            return b.win/b.games - a.win/a.games
        })[index];
        const upTeam = index >= 1 ? rankingData[index-1] : undefined;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index+1}</td>
            <td>${row.team}</td>
            <td>${row.win}</td>
            <td>${row.lose}</td>
            <td>${row.draw}</td>
            <td>${`${Math.round(row.win/(row.win+row.lose)*10000)/10000}0000`.slice(1, 6)}</td>
            <td>${upTeam ? `${((upTeam.win-upTeam.lose) - (row.win-row.lose))/2}.0`.slice(0, 3) : '-'}</td>
            <td>${row.win-row.lose}</td>
            <td>${143-(row.win+row.lose)}</td>
        `;
        tbody.appendChild(tr);
    };
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
        case '北海道日本ハム': return 'F'
        case '福岡ソフトバンク': return 'H'
        case '東北楽天': return 'E'
        case '埼玉西武': return 'L'
        case 'オリックス': return 'B'
        case '千葉ロッテ': return 'M'
        case '阪　神': return 'T'
        case '読　売': return 'G'
        case '東京ヤクルト': return 'S'
        case '広島東洋': return 'C'
        case '横浜DeNA': return 'DB'
        case '中　日': return 'D'
        default:  return teamname
    }
}

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
});