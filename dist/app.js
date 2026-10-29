const subjects = [
  {id:'korean',name:'국어',en:'KOREAN',tag:'말과 글로 만나는 세상',soft:'#f3e9dc',accent:'#ac8054',icon:'book'},
  {id:'math',name:'수학',en:'MATHEMATICS',tag:'생각하는 힘이 쑥쑥',soft:'#e8edfa',accent:'#788bc3',icon:'math'},
  {id:'social',name:'사회',en:'SOCIAL STUDIES',tag:'우리 곁에서 시작하는 세상',soft:'#e8f0e4',accent:'#7c9a62',icon:'globe'},
  {id:'science',name:'과학',en:'SCIENCE',tag:'왜 그럴까? 발견하는 즐거움',soft:'#f9eadf',accent:'#c58d60',icon:'flask'},
  {id:'english',name:'영어',en:'ENGLISH',tag:'새로운 말로 건네는 인사',soft:'#e6edf6',accent:'#7f9cbd',icon:'chat'},
  {id:'ethics',name:'도덕',en:'ETHICS',tag:'함께 살아가는 따뜻한 마음',soft:'#f6e7e9',accent:'#b4878e',icon:'heart'},
  {id:'pe',name:'체육',en:'PHYSICAL EDUCATION',tag:'몸도 마음도 건강하게',soft:'#ecf0d9',accent:'#94a458',icon:'ball'},
  {id:'music',name:'음악',en:'MUSIC',tag:'일상에 더하는 작은 리듬',soft:'#eee8f6',accent:'#a08bb7',icon:'music'},
  {id:'art',name:'미술',en:'ART',tag:'자유롭게 펼치는 나의 상상',soft:'#f8eddf',accent:'#c49c62',icon:'palette'}
];
const main = document.querySelector('main');
const escape = v => String(v ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const subjectOf = name => subjects.find(s => s.name === name);
const styleOf = s => `--soft:${s.soft};--accent:${s.accent}`;
const termLabel = t => t === 'year' ? '연간 공통' : `${t}학기`;
const lessonTerm = l => termLabel(l.semester)+(l.supplement ? ' · 보충' : '');
const safeURL = value => {try {const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? escape(u.href) : '#sources';} catch {return '#sources';}};
const link = (title,url) => `<a href="${safeURL(url)}" target="_blank" rel="noopener noreferrer">${escape(title)} <span aria-hidden="true">↗</span><span class="sr-only"> (새 창)</span></a>`;
let lessons = [], standards = {}, manifest = {}, state = {subject:'all',semester:'all',search:'',limit:9};
let toastTimer;

function icon(name) {
 const paths = {
  book:'<path d="M22 12C16 7 10 6 5 8v29c5-2 11-1 17 4 6-5 12-6 18-4V8c-6-2-12-1-18 4Z"/><path d="M22 12v29M10 16l7 2m-7 5 7 2m11-7 7-2m-7 9 7-2"/>',
  math:'<rect x="7" y="6" width="32" height="36" rx="8"/><path d="M14 15h18M15 25h7m-3.5-3.5v7m10-4h4m-19 10h8m7-2 5 5m0-5-5 5"/>',
  globe:'<circle cx="23" cy="23" r="17"/><ellipse cx="23" cy="23" rx="8" ry="17"/><path d="M7 17h32M7 29h32M23 6v34"/>',
  flask:'<path d="M17 7h12m-10 0v13L8 36c-2 3 0 6 4 6h23c4 0 6-3 4-6L27 20V7M14 29h19"/><path d="M19 35h1m8-1h1M34 12l2-2m-1 9h4"/>',
  chat:'<path d="M12 8h22a7 7 0 0 1 7 7v15a7 7 0 0 1-7 7H23l-10 7v-7h-1a7 7 0 0 1-7-7V15a7 7 0 0 1 7-7Z"/><path d="m13 28 6-13 6 13m-10-4h8m6-7h6m-3-3v14"/>',
  heart:'<path d="M23 39 8 25C-5 12 13 1 23 13 33 1 51 12 38 25L23 39Z"/><path d="m14 23 6 5 11-12"/>',
  ball:'<circle cx="23" cy="23" r="17"/><path d="m23 16 7 5-3 8h-8l-3-8 7-5Zm0-10v10m7 5 10-3m-13 11 6 9M19 29l-6 9m3-17-10-3"/>',
  music:'<path d="M19 33V12l20-5v22M19 18l20-5"/><ellipse cx="13" cy="35" rx="6" ry="5"/><ellipse cx="33" cy="31" rx="6" ry="5"/><path d="m7 12 3-5m-4 18H2"/>',
  palette:'<path d="M24 5C13 5 5 13 5 24c0 10 7 17 15 17 9 0 1-11 8-11h5c14 0 12-25-9-25Z"/><circle cx="15" cy="17" r="2"/><circle cx="24" cy="12" r="2"/><circle cx="33" cy="17" r="2"/><circle cx="12" cy="27" r="2"/>',
  search:'<circle cx="20" cy="20" r="12"/><path d="m29 29 10 10"/>',
  shield:'<path d="m23 5 15 6v12c0 10-15 18-15 18S8 33 8 23V11l15-6Z"/><path d="m16 23 5 5 10-11"/>',
  sprout:'<path d="M23 41V19m0 12C8 31 6 22 7 13c10-2 18 5 16 18Zm0-10C22 10 31 5 41 6c0 10-7 17-18 15Z"/>',
  play:'<path d="m17 9 23 14-23 14V9Z" fill="currentColor" stroke="none"/>',
  bulb:'<path d="M16 31C4 20 12 5 23 5s19 15 7 26v5H16v-5Zm2 11h10M23 12v3m-8 6h3m11 0h3"/>'
 };
 return `<svg viewBox="0 0 46 46" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.sprout}</svg>`;
}

function bookIcon(s) {return `<img class="magic-book" src="./assets/books/${s.id}.webp" width="384" height="384" alt="" loading="lazy" decoding="async">`;}
function subjectLabel(s) {return `<span class="subject-label" style="${styleOf(s)}">${bookIcon(s)}${s.name}</span>`;}
function toast(message) {const t=document.querySelector('.toast');t.textContent=message;t.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('visible'),3500);}
function breadcrumbs(items) {return `<nav class="breadcrumbs" aria-label="현재 위치"><a href="#home">배움정원</a>${items.map(i=>`<span aria-hidden="true">/</span>${i.href?`<a href="${i.href}">${escape(i.label)}</a>`:`<span aria-current="page">${escape(i.label)}</span>`}`).join('')}</nav>`;}
function countOf(s) {return lessons.filter(l=>l.subject===s.name).length;}

function renderHome() {
 document.title='배움정원 — 호기심이 자라는 3학년';
 main.innerHTML=`<div class="container">
  <section class="hero" aria-labelledby="hero-title">
   <div class="hero-copy reveal"><p class="eyebrow">A LITTLE CURIOSITY, A BIG DISCOVERY</p><h1 id="hero-title">작은 호기심이,<br><em>큰 배움으로.</em></h1><p class="hero-description">알아가는 즐거움으로 채우는 나의 3학년.<br>쉬운 설명과 세 가지 문제로, 오늘의 배움을 시작해요.</p><div class="hero-actions"><button class="button button-primary" data-scroll="subjects">나의 배움 시작하기 <span class="arrow" aria-hidden="true">↗</span></button><a class="button-quiet" href="#sources">어떤 교육과정인가요? <span aria-hidden="true">↗</span></a></div><div class="hero-metrics"><span><strong>9</strong>개의 교과</span><span><strong>${lessons.length}</strong>개의 배움</span><span><strong>3</strong>문제씩 차근차근</span></div></div>
   <div class="hero-art reveal"><img src="./assets/garden.svg" width="600" height="520" alt="초록 책에서 자라는 새싹과 수학 블록, 웃는 해가 있는 배움정원" fetchpriority="high"><span class="art-caption">생각의 새싹을 틔워봐!</span></div>
  </section>
  <div class="intro-strip"><div class="strip-icon">${icon('shield')}<span><strong>교육과정에 뿌리를 둔 배움.</strong> 2022 개정 성취기준과 연결했어요.</span></div><a href="#sources">근거 살펴보기 <span aria-hidden="true">↗</span></a></div>
  <a class="assignment-spotlight" href="#assignment"><span class="assignment-seal">MCP LAB</span><span><strong>이번 과제의 대표 자료: 3학년 수학 · 덧셈과 뺄셈</strong><small>실제 MCP 조회 기록, 공식 성취기준, 자체 성취수준과 문항의 연결을 확인하세요.</small></span><span class="spotlight-action">과제 살펴보기 ↗</span></a>
  <section id="subjects" style="scroll-margin-top:110px" aria-labelledby="subjects-title"><div class="section-heading"><div><p class="section-kicker">NINE WAYS TO GROW</p><h2 id="subjects-title">오늘은 무엇을 배워볼까?</h2></div><p>마음이 가는 과목부터, 가볍게.</p></div><div class="subjects-grid">${subjects.map(s=>`<a class="subject-card reveal" href="#subject=${s.id}" style="${styleOf(s)}"><span class="subject-icon">${bookIcon(s)}</span><span class="subject-text"><h3>${s.name}</h3><p>${s.tag}</p><small>${countOf(s)}개의 배움 · 3학년</small></span><span class="card-arrow" aria-hidden="true">↗</span></a>`).join('')}</div></section>
  <section class="browse-section" id="browse" aria-labelledby="browse-title"><div class="section-heading"><div><p class="section-kicker">YOUR LEARNING COLLECTION</p><h2 id="browse-title">차근차근, 배움 한 조각</h2></div><p>궁금한 주제를 찾아보세요.</p></div>${catalogControls(true)}<div id="catalog-results"></div></section>
  <section class="closing-note"><div><h2>빨리보다, 즐겁게 배우는 마음.</h2><p>모르는 건 괜찮아요. 읽고, 생각하고, 다시 도전해요.<br>작은 발견이 모여 나만의 정원이 될 거예요.</p></div><button class="button" data-scroll="subjects">다른 과목도 만나보기 <span class="arrow" aria-hidden="true">↗</span></button></section>
 </div>`;
 renderCatalog();
}

function catalogControls(includeSubjects) {
 return `<div class="catalog-toolbar"><div class="semester-tabs" role="group" aria-label="학기 선택">${[['all','전체'],['1','1학기'],['2','2학기'],['year','연간 공통']].map(([v,l])=>`<button data-term="${v}" class="${state.semester===v?'active':''}" aria-pressed="${state.semester===v}">${l}</button>`).join('')}</div><label class="search-box">${icon('search')}<span class="sr-only">학습 주제 검색</span><input type="search" id="lesson-search" placeholder="어떤 배움이 궁금한가요?" value="${escape(state.search)}" autocomplete="off"></label></div>${includeSubjects?`<div class="subject-chips" role="group" aria-label="교과 선택"><button class="chip ${state.subject==='all'?'active':''}" data-subject="all" aria-pressed="${state.subject==='all'}">모든 교과</button>${subjects.map(s=>`<button class="chip ${state.subject===s.id?'active':''}" data-subject="${s.id}" aria-pressed="${state.subject===s.id}">${s.name}</button>`).join('')}</div>`:''}`;
}

function lessonCard(l) {
 const s=subjectOf(l.subject);
 return `<a class="lesson-card reveal" href="#lesson=${escape(l.id)}"><div class="lesson-card-top">${subjectLabel(s)}<span>${lessonTerm(l)}</span></div><h3>${escape(l.title)}</h3><p>${escape(l.goal)}</p><div class="lesson-card-bottom"><span>${escape(l.unit)}</span><b>설명 + 3문제 <span aria-hidden="true">↗</span></b></div></a>`;
}

function renderCatalog() {
 const target=document.querySelector('#catalog-results'); if(!target)return;
 const s=subjects.find(s=>s.id===state.subject);
 const search=state.search.trim().normalize('NFC').toLowerCase();
 let filtered=lessons.filter(l=>(!s||l.subject===s.name)&&(state.semester==='all'||l.semester===state.semester)&&(!search||[l.title,l.goal,l.unit,l.subject,...l.standardCodes].join(' ').normalize('NFC').toLowerCase().includes(search)));
 if(!s&&!search&&state.semester==='all'){
  const buckets=subjects.map(s=>filtered.filter(l=>l.subject===s.name));
  filtered=[];for(let i=0;buckets.some(b=>b.length>i);i++)for(const b of buckets)if(b[i])filtered.push(b[i]);
 }
 target.innerHTML=`<p class="catalog-count" role="status" aria-live="polite">${s?escape(s.name)+' · ':''}<strong>${filtered.length}</strong>개의 배움${search?' · “'+escape(state.search)+'” 검색 결과':''}</p><div class="lessons-grid">${filtered.slice(0,state.limit).map(lessonCard).join('')||`<div class="empty-state"><strong>다른 씨앗을 찾아볼까요?</strong>검색어를 짧게 쓰거나 학기 선택을 바꿔보세요.</div>`}</div>${filtered.length>state.limit?`<div class="load-more"><button class="button button-secondary" data-more>배움 더 보기 <span>${Math.min(state.limit,filtered.length)} / ${filtered.length}</span><span aria-hidden="true">↓</span></button></div>`:''}`;
}

function renderSubject(s) {
 document.title=`${s.name}의 정원 — 배움정원`;
 main.innerHTML=`<div class="container page-top">${breadcrumbs([{label:s.name}])}<section class="subject-hero"><div><p class="eyebrow">${s.en} GARDEN</p><h1>${s.name}의 정원<span class="brand-dot">.</span></h1><p>${s.tag}.<br>${countOf(s)}개의 배움을 하나씩 만나봐요.</p></div><span class="subject-icon" style="${styleOf(s)}">${bookIcon(s)}</span></section><section class="subject-catalog" aria-label="${s.name} 학습자료 목록"><p class="subject-note">${s.name==='국어'?'국정 3학년 목차와 3~4학년군 성취기준을 연결했어요.':s.name==='도덕'?'국정 3학년 내용을 연간 주제로 정리했어요.':'2022 개정 3학년 교과서의 학습 주제로 구성했어요.'} 학교 교과서에 따라 단원 이름과 배우는 순서는 다를 수 있어요.</p>${catalogControls(false)}<div id="catalog-results"></div></section></div>`;
 renderCatalog();
}

function renderQuestion(q,i,l) {
 const labels=['개념을 확인해요','배운 것을 써봐요','내 생각을 펼쳐요'];
 return `<section class="question" data-question="${i}"><div class="question-top"><span class="question-number">${i+1}</span><span class="question-type">${labels[i]}${q.type==='activity'?' · 활동':''}</span></div><h3 id="prompt-${i}">${escape(q.prompt)}</h3>${q.type==='choice'?`<fieldset class="options" aria-labelledby="prompt-${i}"><legend class="sr-only">보기에서 하나를 선택하세요</legend>${q.options.map((o,j)=>`<label class="option"><input type="radio" name="q-${i}" value="${j}"><span>${escape(o)}</span></label>`).join('')}</fieldset>`:`<label for="response-${i}" class="sr-only">${i+1}번 나의 답</label><textarea class="answer-input" id="response-${i}" placeholder="${q.type==='activity'?'활동해 보고, 관찰하거나 느낀 것을 적어보세요.':'나의 생각이나 답을 적어보세요.'}" rows="2"></textarea>`}<div class="question-actions"><button data-check="${i}" aria-controls="solution-${i}" aria-expanded="false">${q.type==='choice'?'정답 확인하기':'예시 답안 보기'}</button><span id="feedback-${i}" class="answer-feedback" role="status"></span></div><div class="solution" id="solution-${i}" hidden><span class="solution-label">${q.type==='choice'?'ANSWER · 정답':'EXAMPLE · 정답 / 예시 답안'}</span><strong>${escape(q.answer)}</strong><p>${escape(q.explanation)}</p>${q.criteria?`<p class="criteria">확인 기준: ${escape(q.criteria)}</p>`:''}</div></section>`;
}

function renderEvidence(l) {
 return `<details class="source-details" id="evidence"><summary>이 배움의 교육과정 근거 <span class="sr-only">펼치기</span></summary><div class="source-content"><p>교육과정은 <strong>3~4학년군</strong> 기준이며, 아래 교과서 자료를 참고해 3학년 학습 주제로 구성했어요. 설명·문제·예시 답안은 새로 작성했습니다.</p>${l.standardCodes.map(code=>{
  const normalized=code.replace(/[\[\]]/g,'');
  const verified=l.verifiedStandards?.find(s=>s.code.replace(/[\[\]]/g,'')===normalized)||standards[normalized]?.verified;
  const record=standards[normalized];
  return `<div class="source-item"><strong>[${escape(normalized)}]</strong><span class="source-status ${verified?'':'pending'}">${verified?'공식 PDF 대조':'원문 확인 필요'}</span>${verified?`<blockquote>${escape(verified.text)}</blockquote>${link('공식 교육과정 PDF'+(verified.page?' · '+verified.page+'쪽':''),verified.url+(verified.page?'#page='+verified.page:''))}`:`<p>성취기준 코드와 주제 연결은 MCP 자료에 근거합니다. 추출 오류를 피하기 위해 대조하지 않은 원문은 표시하지 않습니다.</p>${record?.sourceURL?link('공식 교육과정에서 확인',record.sourceURL):''}`}</div>`;
 }).join('')}<div class="source-item"><strong>3학년 배정과 참고 자료</strong><p>${escape(l.assignmentNote||'2022 개정 3학년 교과서의 관련 학습 주제를 참고했습니다.')}</p><ul>${uniqueSources(l.sources).map(s=>`<li>${link(s.title,s.url)}</li>`).join('')}</ul></div><p>음악·미술·체육·말하기·실천 활동은 글로 푸는 문제와 실제 활동을 함께 해요. 예시 답안과 달라도 확인 기준에 맞으면 좋은 답이 될 수 있습니다.</p></div></details>`;
}

function renderLesson(l) {
 const s=subjectOf(l.subject);document.title=`${l.title} — ${s.name} · 배움정원`;
 const peers=lessons.filter(p=>p.subject===l.subject), index=peers.indexOf(l), prev=peers[index-1],next=peers[index+1];
 main.innerHTML=`<div class="container page-top">${breadcrumbs([{label:s.name,href:'#subject='+s.id},{label:l.unit}])}<div class="lesson-layout"><article class="lesson-content"><header class="lesson-title-wrap">${subjectLabel(s)}<h1>${escape(l.title)}</h1><p class="lesson-goal">${escape(l.goal)}</p><div class="lesson-meta"><span>3학년 · ${lessonTerm(l)}</span><span>${escape(l.unit)}</span><span>연습문제 3개</span></div></header><section class="lesson-block" id="explanation"><div class="block-heading"><span class="block-step">01</span><h2>함께 알아볼까요?</h2></div><div class="lesson-explanation">${l.paragraphs.map(p=>`<p>${escape(p)}</p>`).join('')}</div><div class="example-box"><span class="example-label">A LITTLE EXAMPLE · 예를 들어 볼게요</span><p>${escape(l.example)}</p></div>${l.speech?`<div class="audio-box"><div class="audio-top"><button class="audio-button" data-speak aria-label="영어 예시 듣기">${icon('play')}</button><div><strong>귀로 듣고, 입으로 따라 해요.</strong><small>기기의 영어 음성으로 읽어드려요.</small></div></div><p>${escape(l.speech.text)}</p><span class="audio-status" role="status"></span></div>`:''}</section><section class="lesson-block" id="practice"><div class="block-heading"><span class="block-step">02</span><h2>세 가지 문제, 나만의 도전</h2></div>${l.questions.map((q,i)=>renderQuestion(q,i,l)).join('')}<div class="question-footer"><p>생각할 시간을 충분히 가져요.<br>활동 문제는 예시와 확인 기준을 비교해요.</p><button class="button button-primary" data-reveal>정답과 해설 모두 보기 <span aria-hidden="true">↗</span></button></div></section>${renderLevels(l)}${renderEvidence(l)}<nav class="lesson-next" aria-label="다른 학습자료">${prev?`<a href="#lesson=${prev.id}">← 이전 배움<br>${escape(prev.title)}</a>`:`<a href="#subject=${s.id}">← ${s.name} 목록으로</a>`}${next?`<a href="#lesson=${next.id}">다음 배움 →<br>${escape(next.title)}</a>`:`<a href="#subject=${s.id}">${s.name} 목록으로 →</a>`}</nav></article><aside class="lesson-aside" aria-label="학습 안내"><div class="aside-card"><h2>오늘의 배움 순서</h2><nav class="lesson-toc"><a href="#explanation" data-scroll="explanation"><b>01</b>설명 읽어보기</a><a href="#practice" data-scroll="practice"><b>02</b>세 가지 문제 풀기</a><a href="#evidence" data-scroll="evidence"><b>03</b>교육과정 확인하기</a></nav></div><div class="aside-card aside-tip">${icon('sprout')}<h3>천천히 생각할수록<br>배움은 더 깊어져요.</h3><p>한 번에 다 맞히지 않아도 괜찮아요. 해설을 읽고 내 생각과 비교해 보세요.</p></div><a class="aside-back" href="#subject=${s.id}">← ${s.name}의 정원으로</a></aside></div></div>`;
}

function uniqueSources(list) {return [...new Map((list||[]).filter(s=>s?.url).map(s=>[s.url,s])).values()];}
function renderSources() {
 document.title='교육과정과 자료 출처 — 배움정원';
 const official=uniqueSources(lessons.flatMap(l=>l.sources.filter(s=>s.kind==='official')));
 const textbooks=uniqueSources(lessons.flatMap(l=>l.sources.filter(s=>s.kind==='textbook')));
 const codes=new Set(lessons.flatMap(l=>l.standardCodes.map(c=>c.replace(/[\[\]]/g,''))));
 const verifiedCodes=new Set(lessons.flatMap(l=>(l.verifiedStandards||[]).map(s=>s.code.replace(/[\[\]]/g,''))));
 main.innerHTML=`<div class="container sources-page page-top">${breadcrumbs([{label:'교육과정 근거'}])}<p class="eyebrow">ROOTED IN THE CURRICULUM</p><h1>좋은 배움에는,<br>단단한 뿌리가 있어요.</h1><p class="sources-lead">무엇을 배우는지, 왜 이 내용을 배우는지.<br>배움정원의 학습자료와 교육과정의 연결을 투명하게 안내합니다.</p><section class="source-panel"><h2>01. 교육과정 → 3학년 주제 → 학습자료</h2><p>2022 개정 교육과정의 <strong>3~4학년군 성취기준</strong>을 교육과정 MCP로 조회하고, 2022 개정 3학년 교과서의 공개 목차와 대조해 학습 주제를 선정했습니다. 교육과정의 ‘4’로 시작하는 코드는 4학년 전용이라는 뜻이 아니라 3~4학년군 코드입니다.</p><p>국정 교과서는 해당 3학년 구성을, 검정 교과서는 공개된 출판사 자료를 비교했습니다. 출판사별 순서 차이가 있는 교과는 ‘연간 공통’으로 구성했습니다. 모든 학교의 단원명·진도와 일치하는 자료는 아니며, 각 페이지에 배정 근거를 제공합니다.</p><p>현재 <strong>${lessons.length}개 학습자료 · ${codes.size}개 연결 성취기준</strong>이 있습니다. 연결 기준 중 ${verifiedCodes.size}개는 공식 PDF와 대조한 원문을 수록했습니다.</p><div class="source-alert">MCP의 자동 추출 원문에는 다음 항목의 제목이나 해설이 섞인 사례가 있어, 공식 PDF와 대조한 원문만 ‘공식 PDF 대조’로 표시합니다. 이 표시는 문항의 국가 공인이나 공식 교과서 인증을 뜻하지 않습니다.</div></section><section class="source-panel"><h2>02. 아홉 교과의 배움 지도</h2><table class="coverage-table"><caption class="sr-only">교과별 학습자료 수와 구성</caption><thead><tr><th scope="col">교과</th><th scope="col">학습자료</th><th scope="col">구성</th></tr></thead><tbody>${subjects.map(s=>{const ls=lessons.filter(l=>l.subject===s.name);return `<tr><th scope="row"><a href="#subject=${s.id}">${s.name} ↗</a></th><td>${ls.length}개 · ${ls.length*3}문제</td><td>${[...new Set(ls.map(l=>termLabel(l.semester)))].join(' / ')}</td></tr>`;}).join('')}</tbody></table><p>창의적 체험활동은 이번 버전에 포함하지 않았습니다. 학습 주제별 설명과 3문제는 실제 수업·실험·운동·표현 활동을 위한 보조 자료입니다.</p><a class="source-link" href="./data/coverage.json" target="_blank" rel="noopener">주제·성취기준 대응표 열기 ↗</a></section><section class="source-panel"><h2>03. 공식 교육과정</h2><p>최종 근거는 국가가 고시하고 NCIC가 공개한 교과별 교육과정입니다. 공식 문서의 원문을 확인할 수 있도록 출처를 연결합니다.</p><div class="source-link-row">${link('교육부 · 2022 개정 교육과정 고시','https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=141&boardSeq=93458&lev=0&m=0404')}<span>고시·별책</span></div><div class="source-link-row">${link('국가교육위원회 · 2024-3호 일부 개정 고시','https://www.law.go.kr/flDownload.do?flSeq=143731563')}<span>후속 개정</span></div><p>음악은 2024 개정본의 국가유산 용어를 반영했습니다. 원문의 쪽수는 표지부터 세는 PDF 페이지입니다.</p>${official.map(s=>`<div class="source-link-row">${link(s.title,s.url)}<span>공식 자료</span></div>`).join('')}</section><section class="source-panel"><h2>04. 학년 배정에 참고한 교과서 자료</h2><p>공개 목차와 소개 자료로 학습 범위를 확인했습니다. 교과서의 본문·문항·그림을 복사하지 않고 설명과 문제를 새로 작성했습니다. 학습페이지마다 해당 주제의 출처를 볼 수 있습니다.</p>${textbooks.map(s=>`<div class="source-link-row">${link(s.title,s.url)}<span>목차·교과서 안내</span></div>`).join('')}</section><section class="source-panel"><h2>05. 자료를 읽는 방법</h2><ul><li>선택형에는 정답과 해설을, 서술·실천·창작 활동에는 예시 답안과 관찰 가능한 확인 기준을 제공합니다. 표현이 달라도 기준을 충족하면 좋은 답이 될 수 있습니다.</li><li>음악·미술·체육·말하기·탐구는 실제 활동을 함께 해야 합니다. 세 문제를 푼 것만으로 성취기준 전체를 달성했다고 판단하지 않습니다.</li><li>영어 듣기는 브라우저의 기기 음성을 사용합니다. 음성을 사용할 수 없어도 예시 문장은 화면에서 읽을 수 있습니다.</li><li>답안은 현재 화면에만 머물며 외부로 전송하거나 저장하지 않습니다. 페이지를 벗어나면 입력 내용이 사라집니다.</li></ul></section><section class="source-panel"><h2>06. 데이터와 제작 기록</h2><p>${link('교육과정 MCP · korean-elementary-learning-map-mcp','https://github.com/taehyeonglim/korean-elementary-learning-map-mcp')}를 활용했습니다. 기반 학습지도 데이터의 저작권 고지는 ${link('DECK · Korean Elementary Learning Map','https://github.com/DECK6/korean-elementary-learning-map')}에 있습니다.</p><p>교육과정의 주제 연결 자료와 직접 작성한 학습내용을 구분해 관리합니다. 공식 원문에는 교과별 PDF 출처와 페이지를 표시합니다. 현재 자료 기준일: ${escape(manifest.date||'2026-10-29')}.</p><a class="source-link" href="./NOTICE.txt" target="_blank" rel="noopener">데이터 출처 및 라이선스 고지 ↗</a></section></div>`;
}

function levelTable(l) {
 const addition=l.id==='math-01';
 return `<div class="table-scroll"><table class="coverage-table level-table"><caption class="sr-only">이 학습자료를 위해 작성한 자체 성취수준</caption><thead><tr><th scope="col">자료용 수준</th><th scope="col">관찰할 수 있는 모습</th><th scope="col">다음 배움</th></tr></thead><tbody><tr><th scope="row">도움 필요</th><td>자릿값 맞추기나 ${addition?'받아올림':'받아내림'}에서 도움이 필요해요.</td><td>십 1개와 일 10개를 바꾸는 모습을 모형이나 그림으로 확인해요.</td></tr><tr><th scope="row">도달</th><td>1·2번을 스스로 계산하고, 3번에서 ${addition?'받아올린 1이 십 1개임을 설명':'계산 결과를 덧셈으로 검산'}할 수 있어요.</td><td>다른 세 자리 수에도 같은 원리를 적용해요.</td></tr><tr><th scope="row">확장</th><td>도달 수준에 더해 새로운 계산의 원리를 자기 말로 설명하고, 잘못된 계산을 찾아 고칠 수 있어요.</td><td>수를 바꾸어 설명하거나 생활 속 문제를 만들어 봐요.</td></tr></tbody></table></div>`;
}
function renderLevels(l) {
 if(!['math-01','math-02'].includes(l.id))return '';
 return `<details class="source-details learning-levels"><summary>이 자료의 성취수준 · 스스로 확인해요</summary><div class="source-content"><p><strong>이 자료를 위해 만든 자체 확인 기준</strong>입니다. 국가에서 고시한 공식 성취수준표가 아니며, 정답 개수만으로 수준을 자동 판정하지 않습니다. 계산 과정과 설명을 함께 살펴보세요.</p>${levelTable(l)}<p><a class="source-link" href="#assignment">MCP 근거와 과제 설계 과정 보기 ↗</a></p></div></details>`;
}
function renderAssignment() {
 document.title='대학원 과제 · MCP 활용 기록 — 배움정원';
 const featured=['math-01','math-02'].map(id=>lessons.find(l=>l.id===id));
 const verified=standards['4수01-03'].verified;
 main.innerHTML=`<div class="container sources-page assignment-page page-top">${breadcrumbs([{label:'대학원 과제 · MCP 활용 기록'}])}<header class="assignment-header"><div><p class="eyebrow">GRADUATE COURSE · MCP CODING LAB</p><h1>교육과정에서,<br>학습자료까지.</h1><p class="sources-lead">교육과정 MCP를 설치하고, 기준을 직접 조회해<br>설명·문제·정답이 있는 웹 학습자료로 연결한 실습입니다.</p></div><span class="assignment-book">${bookIcon(subjects.find(s=>s.id==='math'))}</span></header>
 <section class="submission-card" aria-labelledby="submit-title"><div class="submission-top"><h2 id="submit-title">패들릿 제출용 링크</h2><span class="public-badge">● PUBLIC</span></div><p>과제 안내에 따라 아래 두 주소를 함께 제출하면 됩니다.</p><div class="submission-row"><span class="submission-number">01</span><div><strong>GitHub 공개 저장소</strong><a href="https://github.com/yangyeontae-blip/learning-garden-grade3" target="_blank" rel="noopener">github.com/yangyeontae-blip/learning-garden-grade3 ↗</a></div><button data-copy="repo" aria-label="GitHub 저장소 주소 복사">복사</button></div><div class="submission-row"><span class="submission-number">02</span><div><strong>GitHub Pages 배포 페이지</strong><a href="https://yangyeontae-blip.github.io/learning-garden-grade3/#assignment" target="_blank" rel="noopener">yangyeontae-blip.github.io/learning-garden-grade3/#assignment ↗</a></div><button data-copy="site" aria-label="배포 페이지 주소 복사">복사</button></div></section>
 <section class="source-panel"><p class="section-kicker">01 / SELECTED SUBJECT & UNIT</p><h2>선택한 교과와 단원</h2><p><strong>초등학교 3학년 1학기 수학 · 덧셈과 뺄셈</strong>을 과제의 대표 단원으로 선정했습니다. 세 자리 수의 덧셈과 받아내림이 있는 뺄셈을 각각 하나의 학습자료로 구성했습니다.</p><div class="assignment-lessons">${featured.map(lessonCard).join('')}</div><p class="assignment-footnote">두 자료는 각각 설명·예제·연습문제 3개·정답과 해설을 포함합니다. 기존에 요청한 9개 교과 157개 자료는 확장 자료로 함께 유지했습니다.</p></section>
 <section class="source-panel"><p class="section-kicker">02 / EVIDENCE FROM MCP</p><h2>공식 성취기준을 먼저 확인했습니다</h2><div class="official-quote"><span>[4수01-03] · 수와 연산 · 3~4학년군</span><blockquote>${escape(verified.text)}</blockquote>${link('2022 개정 수학과 교육과정 · PDF '+verified.page+'쪽',verified.url+'#page='+verified.page)}</div><p>MCP의 기준은 <strong>3~4학년군</strong>이며 코드의 ‘4’는 4학년만을 뜻하지 않습니다. 3학년 1학기 배정은 아이스크림·미래엔 2022 개정 3학년 공개 목차로 별도 확인했습니다.</p><p>${link('사용한 초등 교육과정 MCP','https://github.com/taehyeonglim/korean-elementary-learning-map-mcp')} · 중등 MCP는 사용하지 않았습니다.</p></section>
 <section class="source-panel"><p class="section-kicker">03 / ACHIEVEMENT LEVELS</p><h2>성취기준과 성취수준을 구분했습니다</h2><p><strong>공식 성취기준</strong>은 무엇을 배우고 수행해야 하는지를 알려줍니다. <strong>성취수준</strong>은 그 기준에 얼마나 도달했는지를 관찰할 수 있도록 구체화한 정도입니다.</p><p>이번에 조회한 MCP 응답에는 공식 성취수준표가 없고, 기준과 세부 주제의 관찰 증거·평가 발문이 있습니다. 이를 바탕으로 다음 <strong>자료용 자체 성취수준</strong>을 작성했습니다. 아래 표를 교육부·NCIC의 공식 수준표로 표시하지 않습니다.</p>${levelTable(featured[0])}<p class="assignment-footnote">위 표는 덧셈 자료의 예시입니다. 뺄셈 자료에는 검산까지 포함한 자체 확인 기준을 제공합니다. 학습페이지에서 ‘이 자료의 성취수준’을 펼쳐 확인할 수 있습니다.</p></section>
 <section class="source-panel"><p class="section-kicker">04 / ALIGNMENT</p><h2>문제마다 확인하려는 배움이 있습니다</h2>${featured.map(l=>`<div class="alignment-group"><h3>${escape(l.title)}</h3><ol class="alignment-list">${l.questions.map((q,i)=>`<li><span>${i+1}</span><div><strong>${escape(q.prompt)}</strong><p>${i===0?'기본 계산을 통해 자릿값과 계산 절차를 확인합니다.':i===1?'생활 맥락에 맞는 식을 세우고 계산 결과를 해석합니다.':l.id==='math-01'?'받아올림의 원리를 자기 말로 설명하는 증거를 확인합니다.':'덧셈과 뺄셈의 관계를 이용해 계산 결과를 검산합니다.'}</p></div></li>`).join('')}</ol></div>`).join('')}<p>모든 문항은 [4수01-03]에 연결되며, 단순 정답뿐 아니라 계산 원리와 설명을 함께 보도록 설계했습니다. 기존 교과서 문항을 복사하지 않고 새로 작성했습니다.</p></section>
 <section class="source-panel"><p class="section-kicker">05 / ACTUAL MCP TRACE</p><h2>MCP를 어떻게 사용했나요?</h2><ol class="process-list"><li><strong>설치·연결</strong><p>초등 교육과정 MCP를 <code>curriculum-kr</code> 이름으로 Codex에 등록하고, 연결 응답과 도구 9개를 확인했습니다.</p></li><li><strong>실제 기준·주제 조회</strong><pre>get_standard({"code":"4수01-03"})\nget_topic({"topicId":"kr.mt.math.number-operations.g3-4.s4-01-03.concept"})</pre><p>코드·학년군·교과·관련 주제와 <code>assessmentPrompt</code>를 확인했습니다. ‘계산 원리를 자기 말과 간단한 예로 설명하기’라는 관찰 방향을 반영했습니다.</p></li><li><strong>원문 검증·자료 구성</strong><p>MCP 추출문 끝에 다음 제목인 ‘세 자리 수 범위의 곱셈’이 붙어 있었습니다. 공식 PDF와 대조해 해당 문장의 경계를 바로잡고, 덧셈·뺄셈 설명과 3문항씩을 구성했습니다.</p></li><li><strong>계획 → 구현 → 검증 → 공개 배포</strong><p>대화에서 범위와 화면 계획을 정한 뒤 구현했습니다. 계산 정답, 코드·출처 대응, 브라우저 동작을 확인하고 Public 저장소와 GitHub Pages로 배포했습니다.</p></li></ol><p><a class="source-link" href="./data/mcp-assignment-trace.json" target="_blank" rel="noopener">실제 MCP 입력·응답·원문 교정 기록(JSON) 열기 ↗</a></p><p><a class="source-link" href="https://github.com/yangyeontae-blip/learning-garden-grade3/blob/main/research/assignment.md" target="_blank" rel="noopener">과제 설계 및 확인한 문제점 기록 ↗</a></p></section>
 <section class="source-panel"><p class="section-kicker">06 / WHAT WE LEARNED</p><h2>‘딸깍’ 이후, 확인이 필요했던 부분</h2><ul><li><strong>학년군 ≠ 학년:</strong> MCP의 3~4학년군 기준만으로 3학년 학기 배정을 확정할 수 없어 교과서 목차를 확인했습니다.</li><li><strong>조회 결과 ≠ 검증된 원문:</strong> 추출된 기준에 다른 제목이 붙는 오류가 있어 공식 PDF 대조가 필요했습니다.</li><li><strong>성취기준 ≠ 성취수준:</strong> MCP에 없는 공식 수준표를 가져왔다고 주장하지 않고 자체 관찰 기준임을 명시했습니다.</li><li><strong>근거 조회 ≠ 완성된 문제:</strong> MCP의 주제·발문을 참고해 문제를 새로 작성하고 계산과 해설을 따로 검산했습니다.</li><li><strong>웹페이지 ≠ 실시간 MCP:</strong> MCP는 제작 과정에서 사용했습니다. 방문자는 저장된 학습자료를 읽으며, 브라우저가 MCP를 직접 실행하지 않습니다.</li></ul></section>
 <div class="assignment-bottom"><a class="button button-primary" href="#lesson=math-01">대표 학습자료 시작하기 <span aria-hidden="true">↗</span></a><a class="button button-secondary" href="#home">아홉 교과 둘러보기</a></div></div>`;
}

function route() {
 if('speechSynthesis' in window)window.speechSynthesis.cancel();
 const hash=location.hash.slice(1), params=new URLSearchParams(hash);
 document.querySelectorAll('[data-nav]').forEach(a=>{const selected=a.dataset.nav===(hash==='assignment'?'assignment':hash==='sources'?'sources':'home');a.classList.toggle('active',selected);if(selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(hash==='assignment')renderAssignment();
 else if(hash==='sources')renderSources();
 else if(params.has('lesson')){const l=lessons.find(l=>l.id===params.get('lesson'));if(l)renderLesson(l);else renderNotFound();}
 else if(params.has('subject')){const s=subjects.find(s=>s.id===params.get('subject'));if(s){state={subject:s.id,semester:'all',search:'',limit:12};renderSubject(s);}else renderNotFound();}
 else {state={subject:'all',semester:'all',search:'',limit:9};renderHome();}
 window.scrollTo({top:0,behavior:'instant'});
 main.focus({preventScroll:true});
}
function renderNotFound(){document.title='배움을 찾을 수 없어요 — 배움정원';main.innerHTML=`<div class="container page-top"><div class="empty-state"><strong>이 배움은 아직 찾을 수 없어요.</strong><p>주소를 확인하거나 다른 배움을 만나보세요.</p><a class="button button-primary" href="#home">배움정원으로 돌아가기 ↗</a></div></div>`;}

document.addEventListener('input',e=>{if(e.target.id==='lesson-search'){state.search=e.target.value;state.limit=12;renderCatalog();}});
document.addEventListener('click',e=>{
 const copy=e.target.closest('[data-copy]');if(copy){const value=copy.dataset.copy==='repo'?'https://github.com/yangyeontae-blip/learning-garden-grade3':'https://yangyeontae-blip.github.io/learning-garden-grade3/#assignment';if(navigator.clipboard?.writeText)navigator.clipboard.writeText(value).then(()=>toast('제출용 주소를 복사했습니다.')).catch(()=>toast('주소를 길게 누르거나 선택해서 복사해 주세요.'));else toast('주소를 길게 누르거나 선택해서 복사해 주세요.');return;}
 if(e.target.closest('.skip-link')){e.preventDefault();main.focus();main.scrollIntoView({block:'start'});return;}
 const scroll=e.target.closest('[data-scroll]');if(scroll){e.preventDefault();const el=document.getElementById(scroll.dataset.scroll);if(el?.tagName==='DETAILS')el.open=true;el?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});return;}
 const term=e.target.closest('[data-term]');if(term){state.semester=term.dataset.term;state.limit=12;document.querySelectorAll('[data-term]').forEach(b=>{b.classList.toggle('active',b===term);b.setAttribute('aria-pressed',b===term);});renderCatalog();return;}
 const filter=e.target.closest('[data-subject]');if(filter){state.subject=filter.dataset.subject;state.limit=12;document.querySelectorAll('[data-subject]').forEach(b=>{b.classList.toggle('active',b===filter);b.setAttribute('aria-pressed',b===filter);});renderCatalog();return;}
 if(e.target.closest('[data-more]')){state.limit+=12;renderCatalog();return;}
 const check=e.target.closest('[data-check]');if(check){checkQuestion(Number(check.dataset.check));return;}
 if(e.target.closest('[data-reveal]')){const l=currentLesson();if(l){l.questions.forEach((q,i)=>showSolution(i));toast('정답과 해설을 내 생각과 비교해 보세요.');}return;}
 if(e.target.closest('[data-speak]')){speak();return;}
});
function currentLesson(){return lessons.find(l=>l.id===new URLSearchParams(location.hash.slice(1)).get('lesson'));}
function showSolution(i){document.getElementById('solution-'+i).hidden=false;document.querySelector(`[data-check="${i}"]`).setAttribute('aria-expanded','true');}
function checkQuestion(i){
 const l=currentLesson();if(!l)return;const q=l.questions[i],feedback=document.getElementById('feedback-'+i);feedback.classList.remove('is-wrong');
 if(q.type==='choice'){
  const selection=document.querySelector(`input[name="q-${i}"]:checked`);
  if(!selection){feedback.textContent='먼저 보기를 하나 골라보세요.';return;}
  const correct=q.options[Number(selection.value)]===q.answer;
  feedback.textContent=correct?'맞았어요! 생각의 새싹이 자랐어요.':'해설을 읽고 다시 생각해 봐요.';
  feedback.classList.toggle('is-wrong',!correct);
 }else feedback.textContent='예시와 나의 답을 비교해 봐요.';
 showSolution(i);
}
function speak(){
 const l=currentLesson(),status=document.querySelector('.audio-status');if(!l?.speech)return;
 if(!('speechSynthesis' in window)){status.textContent='이 브라우저에서는 음성 재생을 사용할 수 없어요. 아래 문장을 읽어보세요.';return;}
 const synth=window.speechSynthesis;synth.cancel();const utterance=new SpeechSynthesisUtterance(l.speech.text);utterance.lang=l.speech.lang||'en-US';utterance.rate=.8;const voice=synth.getVoices().find(v=>v.lang==='en-US')||synth.getVoices().find(v=>v.lang.startsWith('en'));if(voice)utterance.voice=voice;
 utterance.onstart=()=>status.textContent='듣고 있어요. 천천히 따라 말해보세요.';
 utterance.onend=()=>status.textContent='한 번 더 듣고 싶으면 재생 버튼을 눌러요.';
 utterance.onerror=()=>status.textContent='음성을 재생하지 못했어요. 화면의 영어 문장을 읽어보세요.';
 status.textContent='영어 음성을 준비하고 있어요…';synth.speak(utterance);
}

async function start(){
 try{
  const [l,s,m]=await Promise.all(['lessons.json','standards.json','manifest.json'].map(async file=>{const r=await fetch('./data/'+file);if(!r.ok)throw Error(file+': '+r.status);return r.json();}));
  lessons=l;standards=s;manifest=m;window.addEventListener('hashchange',route);route();
 }catch(error){console.error(error);main.innerHTML=`<div class="container page-top"><div class="empty-state"><strong>배움 자료를 불러오지 못했어요.</strong><p>인터넷 연결을 확인하고 다시 열어주세요.</p><button class="button button-primary" id="retry">다시 불러오기</button></div></div>`;document.querySelector('#retry').onclick=()=>location.reload();}
}
start();
