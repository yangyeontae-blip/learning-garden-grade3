// Editorial milestones from the repository history, in the order the garden grew.
// Add a dated entry with its source commit when a meaningful update ships.
const repository = 'https://github.com/yangyeontae-blip/learning-garden-grade3';

export const growthStory = [
  {
    date: '2026-10-29', stage: '씨앗', title: '아홉 교과의 씨앗을 심었어요',
    text: '국어부터 미술까지, 3학년을 위한 157개의 배움과 471개의 문제로 정원을 열었어요. 무엇을 배우는지 믿고 살펴볼 수 있도록 교육과정 근거도 함께 담았어요.',
    commits: [{sha: '828c5580c920b0b2966dd971231992a7c3043982', label: '정원의 첫 시작'}]
  },
  {
    date: '2026-10-29', stage: '첫잎', title: '과목마다 자기만의 얼굴이 생겼어요',
    text: '아홉 과목에 서로 다른 마법책 그림을 더했어요. 과목을 고르는 카드와 배움의 표지에서, 어떤 정원으로 들어가는지 눈으로도 알아볼 수 있게 했어요.',
    commits: [{sha: '304d18976e036001d88a388530fac79e1770aa0a', label: '교과별 마법책 추가'}]
  },
  {
    date: '2026-10-30', stage: '뿌리', title: '계산의 답에서, 그 까닭으로 한 걸음',
    text: '선생님과 함께 배움의 뿌리를 살필 수 있도록 수학 지도 자료를 보강했어요. 받아올림과 받아내림을 단계별 수 모형으로 보여 주고, 틀리기 쉬운 까닭과 다음에 도와줄 방법도 연결했어요.',
    commits: [{sha: 'd95f845c6fb0eeccc6ef103121fc047c4839d73e', label: '수학 지도 자료 보강'}]
  },
  {
    date: '2026-11-09', stage: '새싹', title: '틀려도 다시, 마치면 새싹 하나',
    text: '학생 화면과 선생님 화면을 나누고 글자와 버튼을 더 읽기 편하게 다듬었어요. 수학 답을 바로 확인하고, 틀리면 다시 생각해 볼 수 있어요. 세 문제를 마친 배움에는 이 기기에 남는 새싹 도장이 생겼어요.',
    commits: [
      {sha: 'a6f822b0501bbb517ccc96b191511a872e77597e', label: '채점·재도전·새싹 기록'},
      {sha: '84ae7d7f97dcfb5e61cdd51fea14ae295f924a6d', label: '교과 색상과 학습 화면 정돈'}
    ]
  },
  {
    date: '2026-11-09', stage: '정원', title: '나의 속도로 채워 가는 배움 노트',
    text: '크림색 종이와 초록 잉크로 정원을 새롭게 가꿨어요. 교과는 작은 책장에 모으고, 아직 만나지 않은 배움은 오늘의 노트에 담았어요. 홈에서 과목별 새싹을 살펴보고, 작은 화면에서도 나의 도전을 확인할 수 있어요.',
    commits: [{sha: '600d9feb6a7f96cd5d8574fc4bc1b1f106b4ad1c', label: '배움 노트와 교과 책장 개편'}]
  }
];

export function renderGrowthStory() {
  return `<section class="growth-story" id="growth-story" aria-labelledby="growth-story-title">
    <div class="section-heading"><div><p class="garden-label">04 &nbsp; 정원의 성장 일기</p><h2 id="growth-story-title">배움정원이 성장한 이야기</h2></div><span class="story-flower" aria-hidden="true">✳</span></div>
    <p class="story-intro">작은 씨앗에서 지금의 정원까지.<br>더 즐겁게 배우도록, 이렇게 가꿔 왔어요.</p>
    <ol class="story-timeline">${growthStory.map((entry, i) => `<li class="story-entry${i === growthStory.length - 1 ? ' is-latest' : ''}">
      <div class="story-date"><time datetime="${entry.date}">${entry.date.replaceAll('-', '.')}</time><span>${entry.stage}</span></div>
      <div class="story-content"><h3>${entry.title}${i === growthStory.length - 1 ? '<span class="story-latest">최근 변화</span>' : ''}</h3><p>${entry.text}</p><div class="story-evidence">${entry.commits.map(commit => `<a href="${repository}/commit/${commit.sha}" target="_blank" rel="noopener noreferrer">${commit.label} <span aria-hidden="true">↗</span><span class="sr-only"> 변경 기록 (새 창)</span></a>`).join('')}</div></div>
    </li>`).join('')}</ol>
    <div class="story-bottom"><p>정원의 실제 변경 기록을 바탕으로 쓴 이야기예요.</p><a href="${repository}/commits/main/" target="_blank" rel="noopener noreferrer">모든 변경 기록 보기 <span aria-hidden="true">↗</span><span class="sr-only"> (새 창)</span></a></div>
  </section>`;
}
