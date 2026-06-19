const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ============================================================
// 라운드별 뉴스 기사 데이터 (서버에 직접 내장 — PPT 불필요)
// ============================================================
const ROUNDS = [
  {
    title: '1라운드 — 연예 / 스포츠',
    articles: {
      A: {
        headline: "손흥민, 조별리그 내내 '부상 은폐' 파문… 팀닥터 익명 제보 공개",
        source: '풋볼인사이더코리아',
        date: '2026.06.16',
        body: '한국 대표팀 손흥민이 무릎 부상을 숨긴 채 월드컵 조별리그에 출전하고 있다는 충격적인 내부 제보가 공개됐다. 팀닥터로 알려진 관계자에 따르면 손흥민의 무릎 상태가 생각보다 심각한 것으로 전해진다. 이 소식이 알려지자 팬들은 경악했으며 대표팀 내부가 발칵 뒤집혔다는 후문이다.',
        isReal: false
      },
      B: {
        headline: 'BTS 뷔, 열애 충격 포착… 상대는 외국 유명 모델',
        source: '스타위클리뉴스',
        date: '2026.05.22',
        body: "방탄소년단 뷔가 외국인 모델과 교제 중인 사실이 충격적으로 포착됐다. 엔터테인먼트 소식통에 의하면 두 사람은 이미 수개월째 진지하게 만나고 있는 것으로 알려졌다. 국내외 팬들은 '믿을 수 없다'며 큰 충격에 빠졌고, 관련 게시물이 폭발적으로 쏟아지고 있다.",
        isReal: false
      },
      C: {
        headline: "르세라핌, 정규 2집 'PUREFLOW pt.1' 첫날 43만 장 판매… 한터차트 1위",
        source: '스포츠경향',
        date: '2026.05.23',
        body: "걸그룹 르세라핌이 22일 발매한 정규 2집 'PUREFLOW pt.1'이 발매 첫날 43만 5675장의 판매고를 올리며 한터차트 음반 차트 1위에 올랐다. 소속사 쏘스뮤직에 따르면 이는 2026년 발매된 4세대 K팝 걸그룹 앨범 중 최고 기록이며, 역대 전 세대를 통틀어도 블랙핑크에 이어 두 번째로 높은 수치다. 신보는 아이튠즈 월드와이드 앨범 차트 3위에도 진입했다.",
        isReal: true
      }
    }
  },
  {
    title: '2라운드 — 스포츠 / 과학',
    articles: {
      A: {
        headline: 'PSG, 챔피언스리그 2연패 달성… 이강인, 아시아 선수 최초 대기록',
        source: '스포츠조선',
        date: '2026.06.01',
        body: "파리 생제르맹(PSG)이 2026 UEFA 챔피언스리그 결승에서 승부차기 끝에 우승하며 2년 연속 정상에 올랐다. 이로써 PSG 소속 이강인은 아시아 선수 최초로 UEFA 챔피언스리그 2연패를 달성한 선수가 됐다. 이강인은 이번 시즌 주로 교체 멤버로 활약했지만 11월에는 PSG 팬 투표로 '이달의 골'에 선정되는 등 인상적인 활약을 보였다. 여름 이적시장에서 추진되던 SSC 나폴리행은 끝내 무산됐다.",
        isReal: true
      },
      B: {
        headline: '국내 연구진, 고양이가 인간 말을 100% 이해한다는 사실 세계 최초 증명',
        source: '사이언스투데이코리아',
        date: '2026.05.01',
        body: '국내 한 대학 연구팀이 고양이가 인간의 언어를 완벽하게 이해할 수 있다는 사실을 세계 최초로 밝혀냈다. 연구 결과에 따르면 고양이는 500개 이상의 단어를 인식하며, 고의로 무시하는 것에 불과하다고 한다. 전문가들은 "동물 연구 역사를 뒤집는 발견"이라며 경악을 금치 못했다.',
        isReal: false
      },
      C: {
        headline: '서울대 연구팀, 자체 개발 장치로 고양이 동맥혈전증 혈전 제거 성공',
        source: '데일리벳',
        date: '2026.06.12',
        body: '서울대학교 수의과대학 김민수 교수 연구팀이 의료기기 기업 피앤지메드텍과 공동 개발한 혈전 제거 디바이스로 고양이 동맥 혈전색전증(FATE) 환자의 혈전을 성공적으로 제거하는 데 성공했다. 혈전용해제 치료에 반응하지 않던 환자는 증상 발생 15시간 만에 응급 시술을 받았고, 2주 후에는 스스로 걸을 수 있을 정도로 회복했다.',
        isReal: true
      }
    }
  },
  {
    title: '3라운드 — 학교 / 교육 (보스 라운드)',
    articles: {
      A: {
        headline: "정부, 2030년부터 전국 '오전 10시 등교' 의무화",
        source: '미래교육일보',
        date: '2026.06.16',
        body: '교육부 관계자에 따르면 2030년부터 전국 모든 초중고교의 등교 시간이 오전 10시로 일괄 조정될 예정인 것으로 전해졌다. 학생들의 수면 부족 문제가 심각하다는 지적에 따른 조치로 알려졌으며, 학부모들 사이에서는 큰 혼란이 일고 있다는 후문이다.',
        isReal: false
      },
      B: {
        headline: '수업 중 스마트기기 사용 전면 금지… 초중등교육법 개정안 3월 시행',
        source: '교육언론창',
        date: '2025.12.23',
        body: '2026년 3월 1일부터 전국 초·중·고 수업 중 스마트기기 사용이 법으로 전면 금지됐다. 교육부의 생활지도 고시로 출발한 이 정책은 국가인권위원회의 판단 변화와 국회 본회의 의결을 거쳐 법적 근거를 확보했다. 학교장과 교사는 학칙에 따라 학생의 스마트기기 사용과 소지를 제한할 수 있으며, 정당한 생활지도 행위는 아동학대 적용에서 배제하는 조항도 함께 신설됐다.',
        isReal: true
      },
      C: {
        headline: "프랑스, 중학교 '디지털 쉼표' 정책 전국 확대… 등교 후 스마트폰 전면 수거",
        source: '전자신문',
        date: '2024.11.20',
        body: "프랑스 교육부가 중학교 스마트폰 사용을 제한하는 '디지털 쉼표' 정책을 전국으로 확대 시행했다. 학생들은 등교 후 스마트폰을 사물함에 보관하고 하교 시 돌려받는 방식이다. 알렉상드르 포르티에 교육부 장관은 새 학기부터 전국 시행을 추진하겠다고 밝혔으며, 시범 운영 학교에서는 학습 몰입도가 높아지는 효과가 확인됐다고 설명했다.",
        isReal: true
      }
    }
  }
];

// ============================================================
// 게임 상태 및 유저 세션 관리
// ============================================================
let gameState = {
  currentRoundIndex: -1,   // -1 = 아직 라운드 시작 전
  bettingOpen: false,
  teams: {}                // { teamName: { teamName, score, currentBet:{target,amount}, socketIds:Set } }
};

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>뉴스 리터러시 실시간 배팅 게임</title>
    <style>
        * { box-sizing: border-box; }
        body { font-family: 'Malgun Gothic', sans-serif; background: #f1f5f9; margin: 0; padding: 20px; color: #334155; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 25px; border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        h1, h2, h3 { color: #1e3a8a; text-align: center; }

        .guide-box { background: #eff6ff; border-left: 5px solid #2563eb; padding: 15px; border-radius: 8px; margin-bottom: 25px; }
        .guide-box h3 { margin-top: 0; color: #1d4ed8; text-align: left; }
        .guide-box ul { padding-left: 20px; line-height: 1.6; }
        .tip { font-size: 0.9em; color: #475569; background: #f8fafc; padding: 8px; border-radius: 4px; margin-top: 5px; border: 1px dashed #cbd5e1; }

        .input-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
        input, select { padding: 12px; border: 2px solid #cbd5e1; border-radius: 8px; font-size: 1em; width: 100%; }
        .btn { background: #2563eb; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 1em; transition: 0.2s; }
        .btn:hover { background: #1d4ed8; }
        .btn:disabled { background: #94a3b8; cursor: not-allowed; }

        .hidden { display: none; }
        .flex-container { display: flex; gap: 20px; flex-wrap: wrap; }
        .panel { flex: 1; min-width: 300px; background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .team-tag { background: #e2e8f0; padding: 8px; border-radius: 6px; margin: 5px 0; display: flex; justify-content: space-between; align-items: center; }
        .score-badge { font-weight: bold; color: #16a34a; }
        .status-dot { width: 10px; height: 10px; border-radius: 5px; display: inline-block; }
        .online { background: #16a34a; }
        .offline { background: #94a3b8; }

        /* 기사 카드 */
        .article-card { border: 2px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 12px; cursor: pointer; transition: 0.15s; background: white; }
        .article-card:hover { border-color: #93c5fd; }
        .article-card.selected { border-color: #2563eb; background: #eff6ff; }
        .article-letter { display: inline-block; width: 26px; height: 26px; line-height: 26px; text-align: center; background: #1e3a8a; color: white; border-radius: 50%; font-weight: bold; margin-right: 8px; }
        .article-meta { font-size: 0.8em; color: #64748b; margin: 6px 0; }
        .article-headline { font-weight: bold; font-size: 1.05em; margin: 4px 0; }
        .article-body { font-size: 0.9em; color: #475569; line-height: 1.5; }

        /* TV/관리자용 큰 기사 표시 */
        .tv-article { border: 3px solid #1e3a8a; border-radius: 12px; padding: 18px; margin-bottom: 14px; background: #f8fafc; }
        .tv-article.is-real-debug { border-color: #16a34a; }
        .round-banner { background: #1e3a8a; color: white; text-align: center; padding: 14px; border-radius: 10px; font-size: 1.3em; font-weight: bold; margin-bottom: 16px; }
        .round-nav { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 16px; }
        .round-nav button { background: #475569; }
        .round-nav button.active { background: #16a34a; }
        .settle-zone { background: #fef3c7; border: 2px dashed #f59e0b; border-radius: 10px; padding: 14px; margin-top: 16px; }
        .settle-zone label { display: inline-flex; align-items: center; gap: 6px; margin-right: 16px; font-weight: bold; }
    </style>
    <script src="/socket.io/socket.io.js"></script>
</head>
<body>
    <div class="container">
        <!-- [화면 1] 로그인 및 설명서 -->
        <div id="introView">
          <h1>📰 뉴스 배팅 게임 스테이션</h1>
          <div class="guide-box">
            <h3>🎮 게임 방법 안내 (필독!)</h3>
            <ul>
              <li>모든 모둠은 기본 자금 <strong>1,000점</strong>을 가지고 시작합니다.</li>
              <li>화면에 제시되는 3개의 뉴스 기사(A, B, C)를 분석하고 팀원들과 상의하세요.</li>
              <li><strong>[진짜 뉴스]</strong>라고 생각하는 기사에 점수를 배팅합니다.</li>
              <li><strong>정산 결과:</strong> 진짜 뉴스에 걸면 배팅액의 <strong>2배(+)</strong>, 가짜 뉴스에 걸면 <strong>전액 소멸(-)</strong>됩니다!</li>
            </ul>
            <div class="tip">
              💡 <strong>6학년 꿀팁:</strong> 진짜 뉴스는 구체적인 수치, 날짜, 공인된 기관명, 책임자 실명이 명확합니다! 자극적인 단어(충격, 발칵, 경악)에 낚이지 마세요!
            </div>
          </div>

          <div class="input-group">
            <label style="font-weight: bold;">이름 또는 모둠명을 입력하세요:</label>
            <input type="text" id="teamNameInput" placeholder="예: 3모둠 (선생님은 '관리자' 입력)">
            <button class="btn" onclick="joinGame()">게임 입장하기</button>
          </div>
        </div>

        <!-- [화면 2] 학생 배팅 창 -->
        <div id="studentView" class="hidden">
            <h2 id="myTeamTitle">모둠 화면</h2>
            <div style="text-align: center; font-size: 1.5em; margin: 15px 0;">
                내 보유 점수: <span id="myScore" style="color:#2563eb; font-weight:bold;">1,000</span> 점
            </div>
            <hr>
            <div id="studentRoundWait" style="text-align:center; color:#64748b; padding: 20px;">
                선생님이 라운드를 시작하면 기사가 표시됩니다...
            </div>
            <div id="studentArticles" class="hidden"></div>
            <div id="studentBetForm" class="hidden">
                <h3>배팅할 점수 입력</h3>
                <div class="input-group">
                    <input type="number" id="betAmount" placeholder="점수를 입력하세요" min="1">
                    <button class="btn" style="background:#16a34a;" onclick="submitBet()">배팅 제출 완료</button>
                </div>
            </div>
            <div id="betStatus" style="text-align:center; color:#e11d48; font-weight:bold; margin-top:10px;"></div>
        </div>

        <!-- [화면 3] 선생님 대시보드 (TV 중계용) -->
        <div id="adminView" class="hidden">
            <h2>👨‍🏫 실시간 게임 대시보드 (교실 화면용)</h2>

            <div class="round-nav" id="roundNav"></div>

            <div id="adminCurrentRound"></div>

            <div class="settle-zone hidden" id="settleZone">
                <div style="text-align:center; font-weight:bold; margin-bottom:8px;">✅ 정답(진짜 뉴스) 체크 후 정산하세요</div>
                <div style="text-align:center;" id="settleCheckboxes"></div>
                <div style="text-align:center; margin-top:10px;">
                    <button class="btn" style="background:#16a34a; width:auto; padding:10px 24px;" onclick="triggerSettle()">정산하기</button>
                </div>
            </div>

            <hr style="margin: 20px 0;">
            <div class="flex-container">
                <div class="panel">
                    <h3>📢 실시간 배팅 현황</h3>
                    <div id="bettingDashboard">선택 대기 중...</div>
                </div>
                <div class="panel">
                    <h3>🏆 실시간 점수 랭킹</h3>
                    <div id="leaderboard">참여 모둠 없음</div>
                </div>
            </div>
            <div style="text-align:center; margin-top: 16px;">
                <button class="btn" style="background:#64748b; width:auto; padding:10px 24px;" onclick="clearBets()">이번 턴 배팅 비우기</button>
            </div>
        </div>
    </div>

    <script>
        const socket = io();
        let myRole = 'student';
        let myTeamName = '';
        let mySelectedTarget = null;
        let currentRoundArticles = null;

        // 자동 재접속 체크 (새로고침/인터넷 끊김 후에도 같은 모둠명으로 재입장)
        window.onload = () => {
            const savedName = localStorage.getItem('news_game_name');
            const savedRole = localStorage.getItem('news_game_role');
            if (savedName && savedRole) {
                document.getElementById('teamNameInput').value = savedName;
                joinGame(true);
            }
        };

        function joinGame(isReconnect = false) {
            const name = document.getElementById('teamNameInput').value.trim();
            if(!name) return alert('이름을 입력해주세요!');

            if(name === '관리자') {
                myRole = 'admin';
                localStorage.setItem('news_game_role', 'admin');
                localStorage.setItem('news_game_name', '관리자');
                document.getElementById('introView').classList.add('hidden');
                document.getElementById('adminView').classList.remove('hidden');
                socket.emit('registerAdmin');
            } else {
                myRole = 'student';
                myTeamName = name;
                localStorage.setItem('news_game_role', 'student');
                localStorage.setItem('news_game_name', name);
                document.getElementById('introView').classList.add('hidden');
                document.getElementById('studentView').classList.remove('hidden');
                document.getElementById('myTeamTitle').innerText = \`🎮 \${name} 작전실\`;
                socket.emit('registerTeam', { teamName: name });
            }
        }

        function selectArticle(letter) {
            mySelectedTarget = letter;
            document.querySelectorAll('.article-card').forEach(c => c.classList.remove('selected'));
            const el = document.getElementById('card-' + letter);
            if (el) el.classList.add('selected');
            document.getElementById('studentBetForm').classList.remove('hidden');
        }

        function submitBet() {
            if (!mySelectedTarget) return alert('먼저 기사를 선택해주세요!');
            const amount = parseInt(document.getElementById('betAmount').value) || 0;
            if(amount <= 0) return alert('1점 이상 배팅해야 합니다!');
            socket.emit('submitBet', { teamName: myTeamName, target: mySelectedTarget, amount });
        }

        function renderArticlesHTML(articles, opts) {
            opts = opts || {};
            const big = opts.big;
            return ['A','B','C'].map(letter => {
                const a = articles[letter];
                const cls = big ? 'tv-article' : 'article-card';
                const onclick = opts.clickable ? \`onclick="selectArticle('\${letter}')" id="card-\${letter}"\` : (opts.idPrefix ? \`id="\${opts.idPrefix}-\${letter}"\` : '');
                return \`<div class="\${cls}" \${onclick}>
                    <span class="article-letter">\${letter}</span>
                    <span class="article-meta">\${a.source} | \${a.date}</span>
                    <div class="article-headline">\${a.headline}</div>
                    <div class="article-body">\${a.body}</div>
                </div>\`;
            }).join('');
        }

        function startRound(idx) {
            if(confirm('이 라운드를 시작하시겠습니까? (학생 화면에 즉시 기사가 표시됩니다)')) {
                socket.emit('startRound', idx);
            }
        }

        function triggerSettle() {
            const checked = Array.from(document.querySelectorAll('.settle-check:checked')).map(c => c.value);
            if (checked.length === 0) return alert('정답으로 체크된 기사가 없습니다!');
            if (confirm(\`기사 [\${checked.join(', ')}]을(를) 진짜 뉴스로 정산하시겠습니까?\`)) {
                socket.emit('settleRound', checked);
            }
        }

        function clearBets() {
            socket.emit('clearRound');
        }

        socket.on('roundStarted', (data) => {
            currentRoundArticles = data.articles;
            if (myRole === 'student') {
                mySelectedTarget = null;
                document.getElementById('studentRoundWait').classList.add('hidden');
                document.getElementById('studentArticles').classList.remove('hidden');
                document.getElementById('studentArticles').innerHTML =
                    '<div class="round-banner">' + data.title + '</div>' +
                    renderArticlesHTML(data.articles, { clickable: true });
                document.getElementById('studentBetForm').classList.add('hidden');
                document.getElementById('betAmount').value = '';
                document.getElementById('betStatus').innerText = '';
            }
        });

        socket.on('updateState', (state) => {
            if(myRole === 'admin') {
                // 라운드 네비게이션 버튼
                const nav = document.getElementById('roundNav');
                nav.innerHTML = state.roundTitles.map((t, i) =>
                    \`<button class="\${i === state.currentRoundIndex ? 'active' : ''}" onclick="startRound(\${i})">\${t}</button>\`
                ).join('');

                // 현재 라운드 기사 표시 (TV 송출용)
                const cur = document.getElementById('adminCurrentRound');
                if (state.currentRoundIndex >= 0 && state.currentRoundArticles) {
                    cur.innerHTML = '<div class="round-banner">' + state.currentRoundTitle + '</div>' +
                        renderArticlesHTML(state.currentRoundArticles, { big: true });
                    document.getElementById('settleZone').classList.remove('hidden');
                    document.getElementById('settleCheckboxes').innerHTML = ['A','B','C'].map(letter =>
                        \`<label><input type="checkbox" class="settle-check" value="\${letter}"> 기사 \${letter}</label>\`
                    ).join('');
                } else {
                    cur.innerHTML = '<p style="text-align:center;color:#94a3b8;">아직 시작된 라운드가 없습니다. 위 버튼을 눌러 라운드를 시작하세요.</p>';
                    document.getElementById('settleZone').classList.add('hidden');
                }

                const dash = document.getElementById('bettingDashboard');
                const board = document.getElementById('leaderboard');
                dash.innerHTML = ''; board.innerHTML = '';

                const sortedTeams = Object.values(state.teams).sort((a,b) => b.score - a.score);

                Object.values(state.teams).forEach(t => {
                    const statusDot = t.online ? '<span class="status-dot online"></span>' : '<span class="status-dot offline"></span>';
                    const deviceInfo = t.deviceCount > 1 ? \` (\${t.deviceCount}기기)\` : '';
                    const betInfo = t.currentBet.target ? \`<b>기사 \${t.currentBet.target} (\${t.currentBet.amount}점)</b>\` : '고민 중...';
                    dash.innerHTML += \`<div class="team-tag"><span>\${statusDot} \${t.teamName}\${deviceInfo}</span> <span>\${betInfo}</span></div>\`;
                });

                sortedTeams.forEach(t => {
                    board.innerHTML += \`<div class="team-tag"><span>\${t.teamName}</span> <span class="score-badge">\${t.score.toLocaleString()} 점</span></div>\`;
                });
            } else {
                const myData = state.teams[myTeamName];
                if(myData) {
                    document.getElementById('myScore').innerText = myData.score.toLocaleString();
                    if(myData.currentBet.amount > 0) {
                        document.getElementById('betStatus').innerText = \`[제출완료] 기사 \${myData.currentBet.target}에 \${myData.currentBet.amount}점 배팅 완료!\`;
                    } else {
                        document.getElementById('betStatus').innerText = '';
                    }
                }
                // 재접속 시 현재 라운드 기사 다시 표시
                if (state.currentRoundIndex >= 0 && state.currentRoundArticles && !currentRoundArticles) {
                    currentRoundArticles = state.currentRoundArticles;
                    document.getElementById('studentRoundWait').classList.add('hidden');
                    document.getElementById('studentArticles').classList.remove('hidden');
                    document.getElementById('studentArticles').innerHTML =
                        '<div class="round-banner">' + state.currentRoundTitle + '</div>' +
                        renderArticlesHTML(state.currentRoundArticles, { clickable: true });
                }
            }
        });

        socket.on('settleNotice', (msg) => {
            alert(msg);
        });

        socket.on('betError', (msg) => {
            alert(msg);
        });
    </script>
</body>
</html>
    `);
});

function publicState() {
  const currentRound = gameState.currentRoundIndex >= 0 ? ROUNDS[gameState.currentRoundIndex] : null;
  // Set은 그대로 보내면 JSON 직렬화가 안 되므로 deviceCount(접속 기기 수)로 변환
  const teams = {};
  Object.entries(gameState.teams).forEach(([name, t]) => {
    teams[name] = {
      teamName: t.teamName,
      score: t.score,
      currentBet: t.currentBet,
      deviceCount: t.socketIds.size,
      online: t.socketIds.size > 0
    };
  });
  return {
    teams,
    currentRoundIndex: gameState.currentRoundIndex,
    currentRoundTitle: currentRound ? currentRound.title : null,
    currentRoundArticles: currentRound ? currentRound.articles : null,
    roundTitles: ROUNDS.map(r => r.title)
  };
}

io.on('connection', (socket) => {
  // 학생 등록: 모둠명(teamName) 기준으로 상태를 공유합니다.
  // 같은 모둠의 학생이 각자 다른 기기로 접속해도 점수·배팅이 하나로 합쳐집니다.
  socket.on('registerTeam', (data) => {
    const teamName = (data.teamName || '').trim();
    if (!teamName) return;
    socket.data.teamName = teamName; // 이 소켓이 어느 팀 소속인지 기억

    if (gameState.teams[teamName]) {
      gameState.teams[teamName].socketIds.add(socket.id);
    } else {
      gameState.teams[teamName] = {
        teamName,
        score: 1000,
        currentBet: { target: null, amount: 0 },
        socketIds: new Set([socket.id])
      };
    }
    io.emit('updateState', publicState());
  });

  socket.on('registerAdmin', () => {
    socket.emit('updateState', publicState());
  });

  // 교사: 라운드 시작 (학생/TV 화면에 기사 자동 표시)
  socket.on('startRound', (roundIndex) => {
    if (roundIndex < 0 || roundIndex >= ROUNDS.length) return;
    gameState.currentRoundIndex = roundIndex;
    gameState.bettingOpen = true;
    // 라운드 전환 시 이전 배팅 초기화
    Object.values(gameState.teams).forEach(t => {
      t.currentBet = { target: null, amount: 0 };
    });
    const round = ROUNDS[roundIndex];
    io.emit('roundStarted', { title: round.title, articles: round.articles });
    io.emit('updateState', publicState());
  });

  // 배팅 수집 — 같은 모둠의 누가 제출해도 모둠 전체 상태에 반영됨
  socket.on('submitBet', (data) => {
    const teamName = (data.teamName || '').trim();
    const team = gameState.teams[teamName];
    if (team) {
      if (data.amount > team.score) {
        socket.emit('betError', `배팅 점수가 보유 점수(${team.score}점)보다 많습니다!`);
        return;
      }
      team.currentBet = { target: data.target, amount: data.amount };
      io.emit('updateState', publicState());
      io.to(Array.from(team.socketIds)).emit('settleNotice', `기사 ${data.target}에 성공적으로 배팅되었습니다.`);
    }
  });

  // 라운드 정산 (선생님 권한) — 정답이 여러 개일 수 있음 (배열로 받음)
  socket.on('settleRound', (correctTargets) => {
    if (!Array.isArray(correctTargets)) correctTargets = [correctTargets];
    Object.values(gameState.teams).forEach(t => {
      if (t.currentBet.target) {
        if (correctTargets.includes(t.currentBet.target)) {
          t.score += t.currentBet.amount;
        } else {
          t.score -= t.currentBet.amount;
        }
        if (t.score < 0) t.score = 0;
        t.currentBet = { target: null, amount: 0 };
      }
    });
    io.emit('updateState', publicState());
    io.emit('settleNotice', `교사 정산 완료! 이번 라운드 진짜 뉴스는 [기사 ${correctTargets.join(', ')}] 이었습니다.`);
  });

  // 배팅 비우기
  socket.on('clearRound', () => {
    Object.values(gameState.teams).forEach(t => {
      t.currentBet = { target: null, amount: 0 };
    });
    io.emit('updateState', publicState());
  });

  // 연결 끊김 처리 — 모둠 전체가 아니라 끊긴 기기 하나만 제거.
  // 같은 모둠에 다른 기기가 남아있으면 점수는 그대로 유지됩니다.
  socket.on('disconnect', () => {
    const teamName = socket.data.teamName;
    if (teamName && gameState.teams[teamName]) {
      gameState.teams[teamName].socketIds.delete(socket.id);
    }
    io.emit('updateState', publicState());
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 구동 중입니다.`);
});
