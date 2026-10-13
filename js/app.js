(() => {
  const DEFAULTS = {name:'StreetKing', avatar:'😎', level:1, xp:0, cash:5000, score:0, races:0, best:0, owned:[], gamesPlayed:0, achievements:[]};
  const STORAGE_KEY = 'losSantosGaming_v1';
  let user = loadUser();
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  let toastTimer;
  function loadUser(){try{return {...DEFAULTS,...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{return {...DEFAULTS}}}
  function saveUser(){localStorage.setItem(STORAGE_KEY,JSON.stringify(user));renderUser()}
  function money(value){return '$'+Math.max(0,Math.floor(value)).toLocaleString('en-US')}
  function showToast(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2400)}
  function navigate(page){$$('.page').forEach(p=>p.classList.toggle('active',p.id===`page-${page}`));$$('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.page===page));$('#nav').classList.remove('open');window.scrollTo({top:0,behavior:'smooth'});if(page==='race'&&window.LSRace)window.LSRace.resize();if(page==='profile')renderUser()}
  document.addEventListener('click',e=>{const pageButton=e.target.closest('[data-page]');if(pageButton){e.preventDefault();navigate(pageButton.dataset.page)}const gameButton=e.target.closest('[data-game]');if(gameButton){openMiniGame(gameButton.dataset.game)}});
  $('#mobileMenu').addEventListener('click',()=>$('#nav').classList.toggle('open'));

  const items=[
    {id:'comet',name:'Comet GT',type:'vehicle',label:'SPORTS CAR',price:1800,icon:'🏎️',description:'A sharp, quick ride for the downtown streets.'},
    {id:'streetbike',name:'Street Bike',type:'vehicle',label:'MOTORBIKE',price:1200,icon:'🏍️',description:'Lightweight, nimble, and built for tight corners.'},
    {id:'goldchain',name:'Gold Chain',type:'style',label:'ACCESSORY',price:650,icon:'📿',description:'A little shine for your city identity.'},
    {id:'nightfit',name:'Night Runner',type:'style',label:'OUTFIT',price:900,icon:'🧥',description:'A clean look for after-hours missions.'},
    {id:'nitro',name:'Nitro Boost',type:'boost',label:'RACE BOOST',price:500,icon:'💨',description:'A virtual garage collectible for your profile.'},
    {id:'headphones',name:'Street Beats',type:'style',label:'GEAR',price:400,icon:'🎧',description:'Set the mood before the next run.'},
    {id:'rally',name:'Rally Kit',type:'vehicle',label:'UPGRADE',price:1500,icon:'🛞',description:'A performance-inspired collectible kit.'},
    {id:'trophy',name:'Gold Trophy',type:'boost',label:'COLLECTIBLE',price:2200,icon:'🏆',description:'Show the city you came to compete.'}
  ];
  function renderShop(filter='all'){
    const grid=$('#shopGrid');grid.innerHTML='';items.filter(item=>filter==='all'||item.type===filter).forEach(item=>{
      const owned=user.owned.includes(item.id);const article=document.createElement('article');article.className='shop-item';
      article.innerHTML=`<div class="item-art" aria-hidden="true">${item.icon}</div><div class="item-body"><span class="item-type">${item.label}</span><h3>${item.name}</h3><p>${item.description}</p><div class="item-buy"><span class="item-price">${money(item.price)}</span><button class="btn btn-outline ${owned?'owned':''}" data-buy="${item.id}" ${owned?'disabled':''}>${owned?'✓ OWNED':'BUY ITEM'}</button></div></div>`;grid.appendChild(article);
    });
  }
  $$('.filter').forEach(button=>button.addEventListener('click',()=>{$$('.filter').forEach(b=>b.classList.toggle('active',b===button));renderShop(button.dataset.filter)}));
  $('#shopGrid').addEventListener('click',e=>{const button=e.target.closest('[data-buy]');if(!button)return;const item=items.find(i=>i.id===button.dataset.buy);if(!item||user.owned.includes(item.id))return;if(user.cash<item.price){showToast('Not enough cash. Play a game to earn more!');return}user.cash-=item.price;user.owned.push(item.id);saveUser();renderShop($('.filter.active')?.dataset.filter||'all');checkAchievements();showToast(`${item.name} added to your collection.`)});

  const locations={garage:{icon:'🚘',name:'Downtown Garage',description:'Your ride starts here. Tune up, check your stats, and get ready for the streets.',type:'VEHICLE HUB',page:'race'},club:{icon:'🎵',name:'Afterhours Club',description:'A fictional nightlife hotspot where the city slows down after midnight.',type:'NIGHTLIFE',page:'games'},shop:{icon:'🛍️',name:'Vespucci Market',description:'Pick up new virtual collectibles and customize your player identity.',type:'VIRTUAL SHOP',page:'shop'},hills:{icon:'🌴',name:'Vinewood Hills',description:'Take in the skyline and plan your next challenge above the city.',type:'SCENIC LOOKOUT',page:'games'},pier:{icon:'🎡',name:'Pacific Pier',description:'A breezy waterfront destination for a break between missions.',type:'WATERFRONT',page:'games'}};
  $$('.map-pin').forEach(pin=>pin.addEventListener('click',()=>{const item=locations[pin.dataset.location];if(!item)return;$$('.map-pin').forEach(p=>p.classList.toggle('selected',p===pin));$('#locationIcon').textContent=item.icon;$('#locationName').textContent=item.name;$('#locationDescription').textContent=item.description;$('#locationType').textContent=item.type;$('#visitLocation').dataset.page=item.page;$('#visitLocation').textContent=`VISIT ${item.name.toUpperCase()} ↗`}));

  function renderUser(){
    $('#navPlayer').textContent=user.name;$('#navLevel').textContent=`LV ${user.level}`;$('#heroBest').textContent=String(user.best).padStart(3,'0');$('#heroCash').textContent=money(user.cash);$('#shopCash').textContent=money(user.cash);
    $('#profileName').textContent=user.name;$('#profileAvatar').textContent=user.avatar;$('#profileRank').textContent=`${rankName(user.level)} • Level ${user.level}`;$('#profileXP').textContent=user.xp;$('#profileLevel').textContent=`LV ${user.level}`;$('#nextXP').textContent=user.level*500;$('#xpFill').style.width=`${Math.min(100,user.xp/(user.level*500)*100)}%`;$('#xpHint').textContent=`${Math.max(0,user.level*500-user.xp)} XP until your next level.`;
    $('#statScore').textContent=user.score.toLocaleString();$('#statRaces').textContent=user.races;$('#statItems').textContent=user.owned.length;$('#statCash').textContent=money(user.cash);$('#raceBest').textContent=String(user.best).padStart(4,'0');$('#raceRecordBig').textContent=String(user.best).padStart(4,'0');
    $('#leaderboard').innerHTML='';const rows=[{name:user.name,score:user.best,me:true},{name:'NeonViper',score:860},{name:'TurboFox',score:720},{name:'MidnightAce',score:540}].sort((a,b)=>b.score-a.score);rows.forEach((r,i)=>{const row=document.createElement('div');row.className='leaderboard-row';row.innerHTML=`<span class="rank-number">${String(i+1).padStart(2,'0')}</span><span class="leaderboard-name">${escapeHTML(r.name)}${r.me?' (YOU)':''}</span><span class="leaderboard-score">${r.score.toLocaleString()}</span>`;$('#leaderboard').appendChild(row)});
    const achievements=[{id:'first',icon:'🎮',name:'First Steps',desc:'Play your first game.',ok:user.gamesPlayed>0},{id:'racer',icon:'🏁',name:'Road Rookie',desc:'Finish your first race.',ok:user.races>0},{id:'highscore',icon:'🔥',name:'On the Board',desc:'Score 500 points in a race.',ok:user.best>=500},{id:'collector',icon:'🛍️',name:'Collector',desc:'Own your first item.',ok:user.owned.length>0},{id:'rich',icon:'💵',name:'Pocket Change',desc:'Hold $6,000 or more.',ok:user.cash>=6000},{id:'veteran',icon:'⭐',name:'City Regular',desc:'Reach level 3.',ok:user.level>=3}];
    $('#achievementGrid').innerHTML=achievements.map(a=>`<div class="achievement ${a.ok?'':'locked'}"><span class="ach-icon">${a.icon}</span><strong>${a.name}</strong><p>${a.desc}</p><small>${a.ok?'✓ UNLOCKED':'🔒 LOCKED'}</small></div>`).join('');
  }
  function rankName(level){return level>=10?'City Legend':level>=5?'Street Veteran':level>=3?'Rising Star':'Rookie Driver'}
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function addReward({xp=0,cash=0,score=0,game='game'}={}){user.xp+=xp;user.cash+=cash;user.score+=score;user.gamesPlayed++;while(user.xp>=user.level*500){user.xp-=user.level*500;user.level++;showToast(`LEVEL UP! You're now level ${user.level}.`)}saveUser();checkAchievements();showToast(`+${xp} XP  •  +${money(cash)} cash`)}
  function recordRace(score,coins,seconds){user.races++;user.gamesPlayed++;user.best=Math.max(user.best,score);user.score+=score;user.xp+=Math.max(10,Math.floor(score/10));user.cash+=coins+Math.floor(score/20);while(user.xp>=user.level*500){user.xp-=user.level*500;user.level++}saveUser();checkAchievements();}
  function checkAchievements(){renderUser()}
  $('#saveName').addEventListener('click',()=>{const name=$('#playerNameInput').value.trim().slice(0,18);if(!name){showToast('Enter a player name first.');return}user.name=name;saveUser();showToast('Player name updated.')});
  $('#editProfile').addEventListener('click',()=>{ $('#dialogName').value=user.name;$('#dialogAvatar').value=user.avatar;$('#editDialog').showModal() });
  $('#editForm').addEventListener('submit',e=>{if(e.submitter?.id==='saveProfile'){e.preventDefault();user.name=$('#dialogName').value.trim().slice(0,18)||user.name;user.avatar=$('#dialogAvatar').value;saveUser();$('#editDialog').close();showToast('Profile saved.')}});
  $('#resetProgress').addEventListener('click',()=>{if(confirm('Reset all local progress, cash, items, and scores? This cannot be undone.')){user={...DEFAULTS};saveUser();renderShop();$('#playerNameInput').value='';showToast('Local progress reset.')}});

  function openMiniGame(type){ navigate('mini'); window.LSMiniGames?.open(type); }

  // Public hooks used by the racing module.
  window.LSGame={getUser:()=>({...user}),recordRace,addReward,showToast,navigate,renderUser};
  renderShop();renderUser();
})();
