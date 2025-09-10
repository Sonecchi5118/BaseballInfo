var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var rankingData = [
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
    var tbody = document.getElementById('ranking-body');
    if (tbody == null)
        return;
    tbody.innerHTML = '';
    for (var index = 0; index < rankingData.length; index++) {
        var row = rankingData[index];
        var upTeam = index >= 1 ? rankingData[index - 1] : undefined;
        var tr = document.createElement('tr');
        tr.innerHTML = "\n            <td>".concat(row.rank, "</td>\n            <td>").concat(row.team, "</td>\n            <td>").concat(row.win, "</td>\n            <td>").concat(row.lose, "</td>\n            <td>").concat(row.draw, "</td>\n            <td>").concat("".concat(Math.round(row.win / (row.win + row.lose) * 10000) / 10000, "0000").slice(1, 6), "</td>\n            <td>").concat(upTeam ? ((upTeam.win - upTeam.lose) - (row.win - row.lose)) / 2 : '-', "</td>\n            <td>").concat(row.win - row.lose, "</td>\n            <td>").concat(143 - (row.win + row.lose), "</td>\n        ");
        tbody.appendChild(tr);
    }
    ;
}
function getGameResult(date) {
    return __awaiter(this, void 0, void 0, function () {
        var dateStr, url, proxyUrl, targetUrl, url_1, res, htmlText, parser, doc, teamCells, scoreCells, output, i, homeTeam, visitorTeam, homeScore, visitorScore, err_1;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __generator(this, function (_o) {
            switch (_o.label) {
                case 0:
                    dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
                    url = "https://npb.jp/bis/".concat(date.getFullYear(), "/games/gm").concat(dateStr, ".html");
                    _o.label = 1;
                case 1:
                    _o.trys.push([1, 4, , 5]);
                    proxyUrl = 'https://corsproxy.io/?';
                    targetUrl = 'https://npb.jp/bis/2025/games/gm20250910.html';
                    url_1 = proxyUrl + encodeURIComponent(targetUrl);
                    return [4 /*yield*/, fetch(url_1)];
                case 2:
                    res = _o.sent();
                    return [4 /*yield*/, res.text()];
                case 3:
                    htmlText = _o.sent();
                    parser = new DOMParser();
                    doc = parser.parseFromString(htmlText, 'text/html');
                    teamCells = Array.from(doc.querySelectorAll('td.contentsTeam'));
                    scoreCells = Array.from(doc.querySelectorAll('td.contentsRuns'));
                    output = [];
                    for (i = 0; i < teamCells.length; i += 2) {
                        homeTeam = (_c = (_b = (_a = teamCells[i]) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _c !== void 0 ? _c : '';
                        visitorTeam = (_f = (_e = (_d = teamCells[i + 1]) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.trim()) !== null && _f !== void 0 ? _f : '';
                        homeScore = (_j = (_h = (_g = scoreCells[i]) === null || _g === void 0 ? void 0 : _g.textContent) === null || _h === void 0 ? void 0 : _h.trim()) !== null && _j !== void 0 ? _j : '';
                        visitorScore = (_m = (_l = (_k = scoreCells[i + 1]) === null || _k === void 0 ? void 0 : _k.textContent) === null || _l === void 0 ? void 0 : _l.trim()) !== null && _m !== void 0 ? _m : '';
                        output.push({ homeTeam: homeTeam, homeScore: homeScore, visitorScore: visitorScore, visitorTeam: visitorTeam });
                    }
                    return [2 /*return*/, output];
                case 4:
                    err_1 = _o.sent();
                    console.error('取得エラー:', err_1);
                    return [2 /*return*/, []];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var daySt = [
    '月',
    '火',
    '水',
    '木',
    '金',
    '土',
    '日'
];
function teamShortName(teamname) {
    switch (teamname) {
        case '北海道日本ハム': return 'F';
        case '福岡ソフトバンク': return 'H';
        case '東北楽天': return 'E';
        case '埼玉西武': return 'L';
        case 'オリックス': return 'B';
        case '千葉ロッテ': return 'M';
        case '阪　神': return 'T';
        case '読　売': return 'G';
        case '東京ヤクルト': return 'S';
        case '広島東洋': return 'C';
        case '横浜DeNA': return 'DB';
        case '中　日': return 'D';
    }
}
function displayLatestGame() {
    return __awaiter(this, void 0, void 0, function () {
        var today, todayResult, display, yesterday, yesterdayResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    today = new Date();
                    return [4 /*yield*/, getGameResult(today)];
                case 1:
                    todayResult = _a.sent();
                    display = function (data) {
                        var resultsDiv = document.getElementById('latest-results');
                        if (resultsDiv == null)
                            return;
                        resultsDiv.innerHTML = "<h1>\u6700\u65B0\u8A66\u5408\u7D50\u679C   ".concat(today.getMonth() + 1, "/").concat(today.getDate(), "(").concat(daySt[today.getDay()], ")</h1>");
                        var ul = document.createElement('ul');
                        data.forEach(function (game) {
                            var li = document.createElement('li');
                            li.textContent = "".concat(teamShortName(game.homeTeam), "  ").concat(game.homeScore, " - ").concat(game.visitorScore, "  ").concat(teamShortName(game.visitorTeam));
                            ul.appendChild(li);
                        });
                        resultsDiv.appendChild(ul);
                    };
                    if (!(todayResult != undefined)) return [3 /*break*/, 2];
                    display(todayResult);
                    return [3 /*break*/, 4];
                case 2:
                    yesterday = today;
                    yesterday.setDate(yesterday.getDate() - 1);
                    return [4 /*yield*/, getGameResult(yesterday)];
                case 3:
                    yesterdayResult = _a.sent();
                    if (yesterdayResult != undefined)
                        display(yesterdayResult);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    displayLatestGame();
    renderRankingTable();
});
