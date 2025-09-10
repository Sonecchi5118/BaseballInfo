const rankingData = [
    {
        rank: 1,
        team: "オリックス",
        win: 70,
        lose: 50,
        draw: 5,
        rate: ".583",
        diff: "-",
        plusMinus: "+20",
        remain: 18
    },
    {
        rank: 2,
        team: "ソフトバンク",
        win: 65,
        lose: 55,
        draw: 5,
        rate: ".542",
        diff: "5.0",
        plusMinus: "+10",
        remain: 18
    },
    {
        rank: 3,
        team: "楽天",
        win: 60,
        lose: 60,
        draw: 5,
        rate: ".500",
        diff: "10.0",
        plusMinus: "0",
        remain: 18
    }
];

function renderRankingTable(data) {
    const tbody = document.getElementById('ranking-body');
    tbody.innerHTML = '';
    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${row.rank}</td>
            <td>${row.team}</td>
            <td>${row.win}</td>
            <td>${row.lose}</td>
            <td>${row.draw}</td>
            <td>${row.rate}</td>
            <td>${row.diff}</td>
            <td>${row.plusMinus}</td>
            <td>${row.remain}</td>
        `;
        tbody.appendChild(tr);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderRankingTable(rankingData);
});