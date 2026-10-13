(() => {
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const meta = {
    reflex: { eyebrow: 'ARCADE / REACTION TEST', title: 'REFLEX RUSH.', description: 'Wait for green. Then react as fast as you can.' },
    memory: { eyebrow: 'PUZZLE / MEMORY GRID', title: 'MEMORY GRID.', description: 'Match all eight pairs with the fewest moves.' },
    quiz: { eyebrow: 'TRIVIA / CITY IQ', title: 'CITY IQ.', description: 'Five questions. Four choices. How sharp are you?' }
  };

  function open(type) {
    const info = meta[type];
    if (!info) return;
    window.LSGame.navigate('mini');
    $('#miniEyebrow').textContent = info.eyebrow;
    $('#miniTitle').innerHTML = info.title.replace(/\.$/, '<em>.</em>');
    $('#miniDescription').textContent = info.description;
    const shell = $('#miniGameShell');
    if (type === 'reflex') reflex(shell);
    if (type === 'memory') memory(shell);
    if (type === 'quiz') quiz(shell);
  }

  function reflex(shell) {
    shell.innerHTML = `<p class="eyebrow">FIVE-ROUND CHALLENGE</p><h2>Catch the signal.</h2><p>Wait for the panel to turn green, then click as quickly as possible.</p><div class="reflex-pad" id="reflexPad"><div><h2 id="reflexMessage">Ready?</h2><p id="reflexSub">Your reaction time appears here.</p><button class="btn btn-primary" id="reflexStart">START ROUND</button></div></div><div class="game-hud"><div><span>ROUND</span><strong id="reflexRound">0 / 5</strong></div><div><span>LAST TIME</span><strong id="reflexLast">—</strong></div><div><span>AVERAGE</span><strong id="reflexAvg">—</strong></div><div><span>BEST</span><strong id="reflexBest">—</strong></div></div>`;
    let round = 0, times = [], startAt = 0, timeout = null, state = 'idle';
    const pad = $('#reflexPad', shell), message = $('#reflexMessage', shell), sub = $('#reflexSub', shell), button = $('#reflexStart', shell);
    function begin() {
      clearTimeout(timeout); state = 'waiting'; pad.className = 'reflex-pad waiting';
      message.textContent = 'WAIT FOR GREEN…'; sub.textContent = 'Stay ready. Do not click yet.'; button.textContent = 'WAIT…'; button.disabled = true;
      timeout = setTimeout(() => { state = 'go'; startAt = performance.now(); pad.className = 'reflex-pad go'; message.textContent = 'NOW!'; sub.textContent = 'CLICK AS FAST AS YOU CAN'; button.textContent = 'HIT IT!'; button.disabled = false; }, 1000 + Math.random() * 2500);
    }
    function hit() {
      if (state === 'waiting') { clearTimeout(timeout); state = 'idle'; pad.className = 'reflex-pad'; message.textContent = 'FALSE START!'; sub.textContent = 'Wait until the panel turns green.'; button.textContent = 'TRY AGAIN'; button.disabled = false; return; }
      if (state !== 'go') return;
      const ms = Math.round(performance.now() - startAt); times.push(ms); round++; state = 'idle'; pad.className = 'reflex-pad';
      message.textContent = `${ms} ms`; sub.textContent = round >= 5 ? 'Challenge complete!' : 'Nice. Ready for the next round?';
      button.textContent = round >= 5 ? 'PLAY AGAIN' : 'NEXT ROUND'; button.disabled = false;
      $('#reflexRound', shell).textContent = `${round} / 5`; $('#reflexLast', shell).textContent = `${ms} ms`;
      $('#reflexAvg', shell).textContent = `${Math.round(times.reduce((a,b)=>a+b,0)/times.length)} ms`; $('#reflexBest', shell).textContent = `${Math.min(...times)} ms`;
      if (round >= 5) { const average = times.reduce((a,b)=>a+b,0)/times.length; window.LSGame.addReward({ xp: Math.max(10, Math.round(150-average/5)), cash: Math.max(25, Math.round(300-average/3)), score: Math.max(10, Math.round(1000-average)), game: 'reflex' }); sub.textContent = `Average ${Math.round(average)} ms. Rewards added to your profile.`; }
    }
    button.addEventListener('click', () => { if (round >= 5) { round=0; times=[]; $('#reflexRound',shell).textContent='0 / 5'; $('#reflexLast',shell).textContent='—'; $('#reflexAvg',shell).textContent='—'; $('#reflexBest',shell).textContent='—'; } if (state === 'go') hit(); else begin(); });
    pad.addEventListener('click', e => { if (e.target !== button && state !== 'idle') hit(); });
  }

  function memory(shell) {
    const icons = ['🚘','🎧','🌴','💎','🏁','🎮','🌆','⚡'];
    let deck = [], first = null, locked = false, moves = 0, matches = 0;
    function init() {
      deck = [...icons, ...icons].sort(() => Math.random() - .5).map((icon,id) => ({icon,id,matched:false,shown:false}));
      first=null; locked=false; moves=0; matches=0; draw();
    }
    function draw() {
      shell.innerHTML = `<div class="xp-top"><div><p class="eyebrow">MATCH THE PAIRS</p><h2>Memory Grid</h2></div><button class="btn btn-outline" id="memoryRestart">RESTART ↻</button></div><div class="game-hud"><div><span>MOVES</span><strong id="memoryMoves">0</strong></div><div><span>PAIRS</span><strong id="memoryPairs">0 / 8</strong></div><div><span>BEST MOVES</span><strong id="memoryBest">${localStorage.getItem('lsMemoryBest')||'—'}</strong></div><div><span>STATUS</span><strong id="memoryStatus">READY</strong></div></div><div class="memory-grid" id="memoryGrid"></div><p class="muted small">Tap two cards. Matching pairs stay revealed.</p>`;
      const grid = $('#memoryGrid', shell);
      deck.forEach((card,i) => { const b=document.createElement('button'); b.className='memory-card'; b.textContent='?'; b.setAttribute('aria-label','Hidden memory card'); b.addEventListener('click',()=>flip(i,b)); grid.appendChild(b); });
      $('#memoryRestart',shell).addEventListener('click',init);
    }
    function flip(i, button) {
      const card=deck[i]; if(locked||card.shown||card.matched)return; card.shown=true; button.textContent=card.icon; button.classList.add('revealed');
      if(first===null){first=i;return;} moves++; $('#memoryMoves',shell).textContent=moves; const firstCard=deck[first];
      if(firstCard.icon===card.icon){firstCard.matched=card.matched=true;$('#memoryGrid',shell).children[first].classList.add('matched');button.classList.add('matched');matches++;$('#memoryPairs',shell).textContent=`${matches} / 8`;first=null;
        if(matches===8){$('#memoryStatus',shell).textContent='COMPLETE';const points=Math.max(100,800-moves*20);const best=Number(localStorage.getItem('lsMemoryBest')||0);if(!best||moves<best)localStorage.setItem('lsMemoryBest',moves);$('#memoryBest',shell).textContent=localStorage.getItem('lsMemoryBest');window.LSGame.addReward({xp:Math.max(25,180-moves*4),cash:Math.max(50,400-moves*8),score:points,game:'memory'});window.LSGame.showToast(`Grid cleared in ${moves} moves! +${points} score.`);}
      } else {locked=true;const oldFirst=first;setTimeout(()=>{firstCard.shown=card.shown=false;$('#memoryGrid',shell).children[oldFirst].textContent='?';$('#memoryGrid',shell).children[oldFirst].classList.remove('revealed');button.textContent='?';button.classList.remove('revealed');first=null;locked=false;},700);}
    }
    init();
  }

  function quiz(shell) {
    const questions = [
      {q:'Which action earns you a better race score?',opts:['Hit every barrier','Avoid traffic and collect coins','Stay still','Close the game'],a:1},
      {q:'Which language controls game interactions on this site?',opts:['SQL','Java','JavaScript','Bash'],a:2},
      {q:'What does XP help you do?',opts:['Level up','Change browser','Increase screen size','Delete scores'],a:0},
      {q:'Where are demo profile details stored?',opts:['A remote bank','LocalStorage in your browser','A public server','Nowhere'],a:1},
      {q:'What should you do before clicking in Reflex Rush?',opts:['Click repeatedly','Wait for green','Refresh the page','Open settings'],a:1}
    ];
    let index=0, score=0, answered=false;
    function draw() {
      const q=questions[index]; shell.innerHTML=`<div class="xp-top"><div><p class="eyebrow">QUESTION ${index+1} / ${questions.length}</p><h2>${q.q}</h2></div><span class="level-badge">SCORE ${score}</span></div><div class="quiz-options">${q.opts.map((o,i)=>`<button data-answer="${i}">${o}</button>`).join('')}</div><p class="muted small" id="quizFeedback">Choose your answer.</p><button class="btn btn-primary" id="quizNext" disabled>${index===questions.length-1?'FINISH QUIZ':'NEXT QUESTION →'}</button>`; answered=false;
      $$('[data-answer]',shell).forEach(b=>b.addEventListener('click',()=>{if(answered)return;answered=true;const chosen=Number(b.dataset.answer);$$('[data-answer]',shell).forEach((opt,i)=>{opt.disabled=true;if(i===q.a)opt.classList.add('correct');});if(chosen===q.a){score+=100;$('#quizFeedback',shell).textContent='Correct! +100 points.';}else{b.classList.add('wrong');$('#quizFeedback',shell).textContent=`Not quite. ${q.opts[q.a]} is correct.`;}$('#quizNext',shell).disabled=false;}));
      $('#quizNext',shell).addEventListener('click',()=>{if(!answered)return;if(index<questions.length-1){index++;draw();return;}const final=score;shell.innerHTML=`<div class="reflex-pad"><div><span class="overlay-icon">${final>=400?'🏆':'🎯'}</span><h2>QUIZ COMPLETE</h2><p>You scored ${final} / 500.</p><p>Rewards have been added to your profile.</p><button class="btn btn-primary" id="quizAgain">PLAY AGAIN</button></div></div>`;window.LSGame.addReward({xp:Math.max(20,final/5),cash:Math.max(50,final/2),score:final,game:'quiz'});$('#quizAgain',shell).addEventListener('click',()=>{index=0;score=0;draw();});});
    }
    draw();
  }
  window.LSMiniGames = { open };
})();
