// Teacher-facing unit design and base-ten exchange model.
export const exchangeModels = {
  add: {
    title: '248 + 176', operation: '덧셈',
    steps: [
      {counts:[3,11,14], title:'같은 자릿값끼리 모아요', text:'백은 2+1=3개, 십은 4+7=11개, 일은 8+6=14개예요. 아직 묶음을 바꾸지 않은 모습입니다.', note:'백 3개 + 십 11개 + 일 14개 = 424'},
      {counts:[3,12,4], title:'일 10개를 십 1개로 바꿔요', text:'일 14개 중 10개를 묶어 십 1개로 바꾸면 일은 4개, 십은 12개가 돼요. 받아올린 1은 십 1개를 뜻해요.', note:'백 3개 + 십 12개 + 일 4개 = 424'},
      {counts:[4,2,4], title:'십 10개를 백 1개로 바꿔요', text:'십 12개 중 10개를 묶어 백 1개로 바꾸면 백은 4개, 십은 2개가 돼요. 묶는 방법을 바꿔도 전체 양은 같아요.', note:'백 4개 + 십 2개 + 일 4개 = 424'},
      {counts:[4,2,4], title:'계산 결과를 읽어요', text:'백 4개, 십 2개, 일 4개이므로 248+176=424예요. 세로셈에 작게 적는 1은 바로 새로 만든 윗자리 묶음입니다.', note:'248 + 176 = 424'}
    ]
  },
  subtract: {
    title:'402 − 178', operation:'뺄셈',
    steps:[
      {counts:[4,0,2], title:'402를 자릿값으로 나타내요', text:'402는 백 4개와 일 2개예요. 일 2개에서 8개를 덜어 내려면 묶음을 바꾸어야 해요. 십의 자리에는 바로 바꿀 묶음이 없어요.', note:'백 4개 + 십 0개 + 일 2개 = 402'},
      {counts:[3,10,2], title:'백 1개를 십 10개로 풀어요', text:'백 1개를 십 10개로 바꾸면 백 3개, 십 10개, 일 2개가 돼요. 백의 자리에서 1을 줄이는 까닭을 함께 살펴보세요.', note:'백 3개 + 십 10개 + 일 2개 = 402'},
      {counts:[3,9,12], title:'십 1개를 일 10개로 풀어요', text:'십 10개 중 1개를 일 10개로 바꾸면 십은 9개, 일은 12개예요. 402의 양은 그대로이고 나타내는 방법만 달라졌어요.', note:'백 3개 + 십 9개 + 일 12개 = 402'},
      {counts:[2,2,4], title:'178을 덜어 내요', text:'백 1개, 십 7개, 일 8개를 덜면 백 2개, 십 2개, 일 4개가 남아요. 224+178=402인지 확인하며 검산해요.', note:'402 − 178 = 224 · 검산: 224 + 178 = 402'}
    ]
  }
};

let model='add', step=0;

function modelHTML() {
  const current=exchangeModels[model], state=current.steps[step];
  const names=['백','십','일'], kinds=['hundred','ten','one'];
  return `<div class="exchange-tabs" role="group" aria-label="계산 예 선택">
    ${Object.entries(exchangeModels).map(([key,value])=>`<button data-exchange-mode="${key}" aria-pressed="${key===model}" class="${key===model?'active':''}">${value.title}<span>${value.operation}</span></button>`).join('')}
    </div><div class="exchange-stage" tabindex="-1"><div class="exchange-caption"><span>${step+1} / ${current.steps.length}</span><h3>${state.title}</h3></div><p class="model-key">노란 판 1개 = 100 · 파란 막대 1개 = 10 · 초록 낱개 1개 = 1</p>
    <div class="place-board" aria-label="${names.map((name,i)=>`${name} ${state.counts[i]}개`).join(', ')}">
    ${state.counts.map((count,i)=>`<div class="place-column"><div class="place-label">${names[i]}의 자리</div><div class="base-ten-pieces" aria-hidden="true">${Array.from({length:count},()=>`<span class="base-piece ${kinds[i]}"></span>`).join('')}${count===0?'<span class="empty-place">0</span>':''}</div><strong>${names[i]} ${count}개</strong></div>`).join('')}</div>
    <p class="exchange-equation">${state.note}</p><p class="exchange-description" role="status" aria-live="polite">${state.text}</p>
    <div class="exchange-controls"><button data-exchange-move="-1" ${step===0?'disabled':''}>← 이전</button><span>묶음의 변화와 전체 양을 비교해 보세요.</span><button data-exchange-move="1" ${step===current.steps.length-1?'disabled':''}>다음 →</button></div></div>`;
}

export function handleGuideAction(event) {
  const modeButton=event.target.closest('[data-exchange-mode]');
  const moveButton=event.target.closest('[data-exchange-move]');
  if(!modeButton&&!moveButton)return false;
  if(modeButton){model=modeButton.dataset.exchangeMode;step=0;}
  else step=Math.max(0,Math.min(exchangeModels[model].steps.length-1,step+Number(moveButton.dataset.exchangeMove)));
  const host=document.getElementById('exchange-model');
  if(host){host.innerHTML=modelHTML();const focus=modeButton?host.querySelector(`[data-exchange-mode="${model}"]`):host.querySelector(`[data-exchange-move="${moveButton.dataset.exchangeMove}"]:not(:disabled)`);(focus||host.querySelector('.exchange-stage')).focus({preventScroll:true});}
  return true;
}

export function renderUnitGuide({lessons,standard,card,escape,link,breadcrumbs}) {
  model='add';step=0;
  const selected=['math-01','math-02'].map(id=>lessons.find(l=>l.id===id));
  return `<div class="container unit-guide page-top">${breadcrumbs([{label:'수학 단원 설계'}])}
    <header class="unit-cover"><p class="unit-category">수학 · 3학년 1학기 · 교사 지도 자료</p><h1>세 자리 수의<br>덧셈과 뺄셈</h1><p class="unit-deck">받아올림과 받아내림을<br class="mobile-break"> <strong>자릿값의 교환</strong>으로 이해하기</p>
      <dl class="unit-facts"><div><dt>핵심 개념</dt><dd>십진법과 단위의 교환</dd></div><div><dt>선수 학습</dt><dd>자릿값 · 10개씩 묶기</dd></div><div><dt>준비물</dt><dd>수 모형 또는 자릿값판</dd></div></dl>
      <div class="unit-actions"><a class="button button-primary" href="#lesson=math-01">덧셈 학습자료 ↗</a><a class="button button-secondary" href="#lesson=math-02">뺄셈 학습자료 ↗</a></div>
    </header>
    <nav class="guide-index" aria-label="단원 설계 목차"><a href="#design-intent" data-scroll="design-intent">설계 의도</a><a href="#exchange" data-scroll="exchange">수 모형</a><a href="#teaching-flow" data-scroll="teaching-flow">지도 흐름</a><a href="#diagnosis" data-scroll="diagnosis">오류 진단</a><a href="#assessment" data-scroll="assessment">평가 기준</a></nav>

    <section class="guide-section" id="design-intent"><div class="guide-section-head"><span>01</span><h2>계산 절차를 알지만, 그 이유도 알까요?</h2></div>
      <p>세로셈에 작은 1을 적는 방법을 익혀도, 그 1이 무엇을 뜻하는지 설명하지 못할 수 있습니다. 이 자료에서는 <strong>일 10개와 십 1개, 십 10개와 백 1개가 같은 양</strong>이라는 관계를 계산의 출발점으로 삼았습니다.</p>
      <p>덧셈은 작은 단위를 큰 단위로 묶는 과정으로, 뺄셈은 큰 단위를 작은 단위로 푸는 과정으로 연결합니다. 특히 <strong>402−178</strong>을 예로 들어 십의 자리가 0일 때 백에서 십으로, 다시 일로 바꾸는 두 번의 교환을 구별하도록 했습니다.</p>
      <div class="guide-objectives"><h3>학습 후 확인할 수 있는 행동</h3><ul><li>같은 자리끼리 수를 맞추어 계산한다.</li><li>받아올리거나 받아내린 수를 묶음의 크기와 연결해 설명한다.</li><li>뺄셈 결과를 덧셈으로 검산하고 계산이 맞는 이유를 말한다.</li></ul></div>
      <div class="curriculum-note"><span>교육과정 근거 · [4수01-03]</span><blockquote>${escape(standard.text)}</blockquote><p>${link('2022 개정 수학과 교육과정 · PDF '+standard.page+'쪽',standard.url+'#page='+standard.page)}<small>3~4학년군 기준. 3학년 배정은 공개 교과서 목차를 참고했습니다.</small></p></div>
    </section>

    <section class="guide-section" id="exchange"><div class="guide-section-head"><span>02</span><h2>묶음을 바꾸어도, 수는 같습니다</h2></div><p>다음 모형에서 단계별로 묶음의 개수를 비교해 보세요. 계산식에 적힌 숫자와 모형의 변화가 어떻게 연결되는지 함께 설명합니다.</p>
      <div id="exchange-model" class="exchange-model">${modelHTML()}</div>
      <p class="teacher-prompt"><strong>교사의 발문</strong> “십의 개수가 늘었는데 왜 전체 수는 같을까?” “받아내린 뒤 백의 자리를 그대로 두면 어떤 일이 생길까?”</p>
    </section>

    <section class="guide-section" id="teaching-flow"><div class="guide-section-head"><span>03</span><h2>모형에서 세로셈으로 연결합니다</h2></div><p>아래는 덧셈 또는 뺄셈 자료 하나를 선택하여 20~25분 동안 활용하는 지도안입니다. 실제 진도와 학생의 선수 학습에 따라 시간을 조정합니다.</p>
      <ol class="teaching-sequence"><li><span>도입 · 3분</span><div><h3>같은 양을 다르게 나타내기</h3><p>일 모형 10개를 십 모형 1개로 바꾸게 합니다. 모형의 개수와 나타내는 수가 다름을 구분할 수 있는지 살핍니다.</p></div></li><li><span>탐색 · 7분</span><div><h3>모형의 교환과 기록 연결하기</h3><p>단계별 수 모형을 보며 바뀐 자릿값을 말하게 합니다. 이어서 세로셈의 작은 1이나 고친 숫자에 각각 어느 묶음이 대응하는지 표시합니다.</p></div></li><li><span>적용 · 8분</span><div><h3>계산·상황·설명 문항 해결하기</h3><p>선택한 학습자료의 세 문항을 풉니다. 계산이 맞아도 원리 설명이 어려우면 모형으로 돌아가 설명할 기회를 줍니다.</p></div></li><li><span>정리 · 5분</span><div><h3>계산 결과와 이유를 함께 점검하기</h3><p>짝에게 교환의 뜻을 설명하거나 뺄셈 결과를 덧셈으로 검산합니다. 정답과 설명을 따로 살펴 다음 학습의 지원을 결정합니다.</p></div></li></ol>
      <div class="assignment-lessons">${selected.map(card).join('')}</div>
    </section>

    <section class="guide-section" id="diagnosis"><div class="guide-section-head"><span>04</span><h2>틀린 답에서 지도할 지점을 찾습니다</h2></div><p>아래는 오류를 점검하기 위한 예시입니다. 실제 학생에게서 수집한 응답이나 수업 효과 자료는 아닙니다.</p>
      <div class="diagnostic-grid"><article><span class="diagnostic-label">오류 예시 · 덧셈</span><h3>268 + 157 = <del>315</del></h3><p><strong>살필 점</strong> 각 자리의 합에서 윗자리로 바꾼 묶음을 빠뜨렸는지 확인합니다. 일의 자리에서 만든 십 1개, 십의 자리에서 만든 백 1개를 구분해 묻습니다.</p><p><strong>지도 제안</strong> 일 15개를 묶은 뒤 십의 묶음이 몇 개가 되었는지 세게 합니다. 새로 생긴 묶음을 세로셈의 작은 1과 연결합니다.</p><div class="diagnostic-answer">확인: 268 + 157 = 425</div></article>
      <article><span class="diagnostic-label">오류 예시 · 뺄셈</span><h3>600 − 275 = <del>475</del></h3><p><strong>살필 점</strong> 각 자리에서 큰 숫자에서 작은 숫자를 빼는 방식으로 계산했는지 묻습니다. 600에서 275를 덜어 낸다는 전체 상황을 이해하는지 살핍니다.</p><p><strong>지도 제안</strong> 백 6개를 백 5개·십 9개·일 10개로 바꾸게 합니다. 각 묶음에서 275를 덜어 낸 뒤 남은 양을 읽고 검산합니다.</p><div class="diagnostic-answer">확인: 600 − 275 = 325</div></article></div>
    </section>

    <section class="guide-section" id="assessment"><div class="guide-section-head"><span>05</span><h2>정답과 설명을 나누어 평가합니다</h2></div><p>국가 성취기준을 이 자료의 문항에 맞게 구체화한 관찰 기준입니다. 국가에서 고시한 성취수준표가 아니며, 정답 수만으로 학생의 수준을 일괄 판정하지 않습니다.</p>
      <div class="assessment-cards">${selected.map(l=>`<article><h3>${escape(l.title)}</h3><dl><div><dt>1번 · 계산 절차</dt><dd>${l.id==='math-01'?'326+241=567. 자릿값을 맞추어 각 자리의 합을 계산하는지 확인합니다.':'563−241=322. 같은 자리끼리 빼는지 확인합니다.'}</dd></div><div><dt>2번 · 상황 적용</dt><dd>${l.id==='math-01'?'268+157=425권. 상황에 맞는 덧셈식을 세우고 두 번의 받아올림을 반영하는지 확인합니다.':'600−275=325장. 남은 양을 구하는 식을 세우고 0이 있는 자리에서 단위를 교환하는지 확인합니다.'}</dd></div><div><dt>3번 · 원리와 관계</dt><dd>${l.id==='math-01'?'185+237에서 받아올린 1을 ‘일 10개를 바꾼 십 1개’로 설명하면 원리 이해의 증거로 봅니다.':'500−146=354와 354+146=500을 함께 제시하면 두 연산의 관계를 이용한 검산의 증거로 봅니다.'}</dd></div></dl></article>`).join('')}</div>
      <div class="feedback-note"><h3>응답에 따른 후속 지도</h3><p><strong>계산과 설명이 모두 어려울 때</strong>에는 수의 크기를 줄여 모형의 교환부터 확인합니다. <strong>계산은 맞지만 설명이 부족할 때</strong>에는 받아올린 1이나 받아내린 10이 어느 단위인지 가리키게 합니다. <strong>계산과 설명이 연결될 때</strong>에는 새로운 수로 바꾸거나 오류 예시를 고치며 전이 여부를 살핍니다.</p></div>
    </section>

    <details class="guide-evidence"><summary>교육과정 출처와 자료 검토 기록</summary><div><p>교육과정 탐색에는 초등 교육과정 MCP를, 설명·문항 초안 작성과 웹 구현에는 생성형 AI를 활용했습니다. 성취기준 원문은 공식 PDF와 대조하고 계산 정답을 검산했습니다.</p><ul><li>${link('수학과 교육과정 원문',standard.url+'#page='+standard.page)}</li><li>${link('초등 교육과정 MCP','https://github.com/taehyeonglim/korean-elementary-learning-map-mcp')}</li><li><a href="./data/mcp-assignment-trace.json" target="_blank" rel="noopener">MCP 조회 응답과 원문 교정 기록 ↗</a></li><li>${link('단원 설계 검토서','https://github.com/yangyeontae-blip/learning-garden-grade3/blob/main/research/assignment.md')}</li></ul><p>MCP의 원문 추출에 다음 소제목이 붙어 있던 부분을 바로잡았습니다. 3~4학년군 기준의 3학년 배정은 아이스크림·미래엔 공개 목차와 대조했습니다. 현재 검토는 내용·계산·웹 동작에 관한 것이며 실제 수업에서 학습 효과를 측정한 자료는 아닙니다.</p></div></details>
    <div class="unit-actions guide-end"><a class="button button-primary" href="#lesson=math-01">덧셈 자료 열기 ↗</a><a class="button button-secondary" href="#lesson=math-02">뺄셈 자료 열기 ↗</a></div>
  </div>`;
}
