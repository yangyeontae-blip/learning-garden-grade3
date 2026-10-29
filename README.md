# 배움정원 🌱

초등학교 3학년의 작은 호기심을 위한 아홉 교과 학습 웹사이트입니다.
2022 개정 교육과정 성취기준과 연결한 쉬운 설명, 학습 주제별 연습문제 3개, 정답·해설을 제공합니다.

**[웹사이트 열기](https://yangyeontae-blip.github.io/learning-garden-grade3/)** · 9개 교과 · 157개 학습자료 · 471문항 · 공식 PDF와 대조한 연결 성취기준 164개

## 대학원 과제 · 패들릿 제출

1. **Public 저장소:** https://github.com/yangyeontae-blip/learning-garden-grade3
2. **배포 페이지:** https://yangyeontae-blip.github.io/learning-garden-grade3/#assignment

대표 교과·단원은 **초등 3학년 1학기 수학 · 덧셈과 뺄셈**입니다. [과제 안내](https://yangyeontae-blip.github.io/learning-garden-grade3/#assignment)에서 실제 MCP 조회, 공식 원문 검증, 문항 연결과 자체 성취수준을 확인할 수 있습니다. MCP는 공식 성취기준과 세부 주제·발문을 제공하며, 화면의 도움 필요·도달·확장은 자료용 자체 확인 기준입니다. 국가 공식 성취수준표로 표시하지 않습니다.

[실제 MCP 입력·응답 기록](dist/data/mcp-assignment-trace.json) · [과제 설계·확인한 문제점](research/assignment.md) · [마법책 이미지 프롬프트](research/asset-prompts.md)

## 사용하기

홈에서 교과를 선택하고 1학기·2학기·연간 공통 또는 검색으로 주제를 찾습니다.
자료를 읽은 후 문제를 풀고 정답 또는 예시 답안을 확인합니다.
각 페이지의 **교육과정 근거**를 펼치면 성취기준 코드, 공식 PDF 원문·쪽수와 3학년 배정 참고 자료가 나옵니다.
영어는 기기 음성 듣기를 지원합니다. 실제 실기·탐구·표현 활동을 위한 보조 자료이며 문항만으로 성취 전체를 평가하지 않습니다.

## 실행과 검증

Node.js 20 이상과 Python 3가 필요합니다. 별도 npm 의존성 설치는 없습니다.

```sh
npm run build
npm test
npm run dev
```

`http://127.0.0.1:8765`을 엽니다. 정적 JSON을 fetch하므로 파일을 직접 더블클릭하지 말고 HTTP 서버를 사용하세요.
GitHub Actions는 데이터 빌드·검증이 통과한 `dist/`만 GitHub Pages로 배포합니다.

## 내용과 근거

- 국어·수학·사회·과학·영어·도덕·체육·음악·미술. 창의적 체험활동은 제외합니다.
- 성취기준 조회: [교육과정 MCP](https://github.com/taehyeonglim/korean-elementary-learning-map-mcp).
- 최종 원문 근거: 교과별 NCIC 공식 교육과정 PDF. 자동 추출문은 그대로 신뢰하지 않고 확인한 원문과 PDF 쪽수를 `verifiedStandards`에 보존합니다.
- 3학년 배정: 국정 교과서 구성 또는 공개 검정 교과서 목차 비교. 출판사에 따라 단원 이름과 진도는 다를 수 있습니다.
- 설명·예제·문제는 신규 작성합니다. 정답이 하나가 아닌 문항에는 예시와 확인 기준을 제공합니다.

대응표는 `dist/data/coverage.json`, 교과별 조사 기록은 `research/*.md`에서 확인할 수 있습니다.
MCP의 3~4학년군 전체를 3학년 전체로 오인하지 않도록 개별 주제 배정 근거를 관리합니다.

## 데이터 편집

교과별 원본은 `dist/data/language-social.json`, `math-science.json`, `arts-ethics.json`입니다.
수정 후 `npm run build`와 `npm test`를 실행하세요. 빌드 결과인 `lessons.json`, `standards.json`, `coverage.json`, `manifest.json`을 손으로 수정하지 않습니다.
데이터 스키마: 학습자료 ID, 교과, 학기, 단원, 제목, 목표, 설명 문단, 예제, 정확히 세 문항, 성취기준 코드, 출처, 학년 배정 설명, 대조한 원문을 포함합니다.

## 접근성과 개인정보

키보드 탐색, 가시적인 초점, 본문 건너뛰기, 폼 레이블, 반응형 레이아웃, 동작 줄이기 설정을 지원합니다.
학생 답안은 저장하거나 전송하지 않습니다. 영어 음성은 브라우저 기능이며 이용 가능 여부는 기기에 따라 다릅니다.
외부 글꼴을 사용할 수 없을 때는 시스템 글꼴로 표시합니다.

## 라이선스

사이트 코드: MIT. 기반 데이터의 저작권·라이선스는 `dist/MCP-LICENSE.txt`에 보존했습니다.
공식 교육과정 원문과 제3자 참고 자료의 권리는 각 출처를 따릅니다. `dist/NOTICE.txt`를 참고하세요.
