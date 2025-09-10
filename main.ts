const rankingData = [
    {
        rank: 1,
        team: "オリックス",
        win: 71,
        lose: 50,
        draw: 5
    },
    {
        rank: 2,
        team: "ソフトバンク",
        win: 65,
        lose: 55,
        draw: 5
    },
    {
        rank: 3,
        team: "楽天",
        win: 60,
        lose: 60,
        draw: 5
    }
];

function renderRankingTable() {
    const tbody = document.getElementById('ranking-body');
    if (tbody == null) return;
    tbody.innerHTML = '';
    for (let index = 0; index < rankingData.length; index++) {
        const row = rankingData[index];
        const upTeam = index >= 1 ? rankingData[index-1] : undefined;
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.rank}</td>
            <td>${row.team}</td>
            <td>${row.win}</td>
            <td>${row.lose}</td>
            <td>${row.draw}</td>
            <td>${`${Math.round(row.win/(row.win+row.lose)*10000)/10000}0000`.slice(1, 6)}</td>
            <td>${upTeam ? ((upTeam.win-upTeam.lose) - (row.win-row.lose))/2 : '-'}</td>
            <td>${row.win-row.lose}</td>
            <td>${143-(row.win+row.lose)}</td>
        `;
        tbody.appendChild(tr);
    };
}

async function getGameResult(date: Date) {
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const url = `https://npb.jp/bis/${date.getFullYear()}/games/gm${dateStr}.html`;

  try {
    const proxyUrl = 'https://corsproxy.io/?';
    const targetUrl = 'https://npb.jp/bis/2025/games/gm20250910.html';
    const url = proxyUrl + encodeURIComponent(targetUrl);

    const res = await fetch(url);
    const htmlText = await res.text();

    // HTMLをDOMとして解析
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');

    const teamCells = Array.from(doc.querySelectorAll('td.contentsTeam'));
    const scoreCells = Array.from(doc.querySelectorAll('td.contentsRuns'));

    const output: { homeTeam: string; homeScore: string; visitorScore: string; visitorTeam: string }[] = [];

    for (let i = 0; i < teamCells.length; i += 2) {
      const homeTeam = teamCells[i]?.textContent?.trim() ?? '';
      const visitorTeam = teamCells[i + 1]?.textContent?.trim() ?? '';
      const homeScore = scoreCells[i]?.textContent?.trim() ?? '';
      const visitorScore = scoreCells[i + 1]?.textContent?.trim() ?? '';

      output.push({ homeTeam, homeScore, visitorScore, visitorTeam });
    }

    return output;
  } catch (err) {
    console.error('取得エラー:', err);
    return [];
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
    }
}

async function displayLatestGame() {
  const today = new Date()
  const todayResult = await getGameResult(today)
  const display = (data: {
    homeTeam: string;
    homeScore: string;
    visitorScore: string;
    visitorTeam: string;
}[]) => {
    const resultsDiv = document.getElementById('latest-results');
    if (resultsDiv == null) return;
    resultsDiv.innerHTML = `<h2>最新試合結果   ${today.getMonth()+1}/${today.getDate()}(${daySt[today.getDay()]})</h2>`;
    const ul = document.createElement('ul');
    data.forEach(game => {
        const li = document.createElement('li');
        li.textContent = `${teamShortName(game.homeTeam)}  ${game.homeScore} - ${game.visitorScore}  ${teamShortName(game.visitorTeam)}`;
        ul.appendChild(li);
    });
    resultsDiv.appendChild(ul);
  }
  if (todayResult != undefined) display(todayResult)
  else {
    const yesterday = today
    yesterday.setDate(yesterday.getDate()-1)
    const yesterdayResult = await getGameResult(yesterday)
    if (yesterdayResult != undefined) display(yesterdayResult)
  }
}


document.addEventListener('DOMContentLoaded', () => {
    displayLatestGame()
    renderRankingTable();
});