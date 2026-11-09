import {readFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import assert from 'node:assert/strict';
import {exchangeModels,renderUnitGuide} from '../dist/unit-guide.js';
import {shuffledOptions,isAutoGradable,gradeShort} from '../dist/practice.js';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=async p=>JSON.parse((await readFile(resolve(root,p),'utf8')).replace(/^\uFEFF/,''));
const lessons=await read('dist/data/lessons.json'),standards=await read('dist/data/standards.json'),manifest=await read('dist/data/manifest.json');
const expected=['국어','수학','사회','과학','영어','도덕','체육','음악','미술'];
assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length,'IDs must be unique');
assert.equal(lessons.length,manifest.lessonCount);
assert.deepEqual([...new Set(lessons.map(l=>l.subject))].sort(),[...expected].sort());
let verified=0;
const placeholder=/(TODO|TBD|lorem ipsum|추후 작성|내용 준비 중|예시를 입력)/i;
for(const l of lessons){
 const context=`${l.subject}/${l.id}`;
 assert.match(l.id,/^[a-z][a-z0-9-]*$/,context+' invalid ID');
 for(const key of ['unit','title','goal','example','assignmentNote'])assert.ok(typeof l[key]==='string'&&l[key].trim().length>=(key==='unit'?1:3),context+' missing '+key);
 assert.ok(['1','2','year'].includes(l.semester),context+' invalid term');
 assert.ok(l.paragraphs.length>=2&&l.paragraphs.length<=4,context+' explanation');
 for(const p of l.paragraphs)assert.ok(p.length>35,context+' inadequate explanation');
 assert.equal(l.questions.length,3,context+' exactly three questions');
 assert.equal(new Set(l.questions.map(q=>q.prompt)).size,3,context+' repeated question');
 for(const q of l.questions){
  assert.ok(['choice','short','activity'].includes(q.type),context+' question type');
  assert.ok(q.prompt.length>8&&q.answer.length>0&&q.explanation.length>8,context+' incomplete question');
  if(q.type==='choice'){assert.ok(q.options.length>=2,context+' options');assert.equal(new Set(q.options).size,q.options.length,context+' duplicate option');assert.ok(q.options.includes(q.answer),context+' answer not option');}
  if(q.type==='activity')assert.ok(q.criteria?.length>8,context+' activity missing criteria');
 }
 assert.ok(l.standardCodes.length>0,context+' no standards');
 for(const code of l.standardCodes)assert.ok(l.verifiedStandards?.some(v=>v.code.replace(/[\[\]]/g,'')===code),context+' missing official PDF verification: '+code);
 for(const code of l.standardCodes){const record=standards[code];assert.ok(record,context+' unknown code '+code);assert.equal(record.gradeBand,'3-4',context+' wrong grade band');assert.equal(record.subject,l.subject,context+' wrong subject');}
 for(const v of l.verifiedStandards||[]){const code=v.code.replace(/[\[\]]/g,'');assert.ok(l.standardCodes.includes(code),context+' unrelated verification');assert.ok(v.text.length>10,context+' empty text');assert.ok(Number.isInteger(v.page)&&v.page>0,context+' PDF page missing');assert.ok(new URL(v.url).hostname.endsWith('ncic.re.kr'),context+' unofficial verification source');verified++;}
 assert.ok(l.sources.some(s=>s.kind==='official'),context+' official source missing');
 assert.ok(l.sources.some(s=>s.kind==='textbook'),context+' grade3 source missing');
 for(const s of l.sources){assert.ok(s.title.length>2,context+' source title missing');assert.equal(new URL(s.url).protocol,'https:',context+' invalid source URL');}
 if(l.subject==='영어'){assert.ok(l.speech?.text.length>5,context+' English audio text missing');assert.equal(l.speech.lang,'en-US',context+' audio language');}
 assert.ok(!placeholder.test(JSON.stringify(l)),context+' unfinished content');
}
for(const subject of expected)assert.ok(lessons.filter(l=>l.subject===subject).length>=6,subject+' incomplete coverage');
for(const subject of ['국어','수학','사회','과학'])for(const term of ['1','2'])assert.ok(lessons.some(l=>l.subject===subject&&l.semester===term),subject+' missing semester '+term);
const coverage=await read('dist/data/coverage.json');assert.equal(coverage.length,lessons.length);
const heritage=lessons.find(l=>l.id==='music-11');
assert.ok(heritage.verifiedStandards.find(v=>v.code.replace(/[\[\]]/g,'')==='4음02-05').text.includes('국가유산'),'2024 music curriculum terminology regression');
for(const id of ['korean','math','social','science','english','ethics','pe','music','art'])await access(resolve(root,`dist/assets/books/${id}.webp`));
const trace=await read('dist/data/mcp-assignment-trace.json');
assert.equal(trace.calls.find(c=>c.tool==='get_standard').input.code,'4수01-03');
assert.equal(trace.correction.verifiedText,standards['4수01-03'].verified.text,'Assignment correction must match the verified official source');
for(const id of ['math-01','math-02'])assert.ok(lessons.find(l=>l.id===id).standardCodes.includes('4수01-03'),'Representative lesson must align with the declared standard');
const placeValue=counts=>counts[0]*100+counts[1]*10+counts[2];
for(const state of exchangeModels.add.steps)assert.equal(placeValue(state.counts),248+176,'Addition exchange must preserve the total');
for(const state of exchangeModels.subtract.steps.slice(0,3))assert.equal(placeValue(state.counts),402,'Regrouping must preserve 402 before subtracting');
assert.equal(placeValue(exchangeModels.subtract.steps[3].counts),402-178,'Subtraction model must match the answer');
assert.deepEqual(exchangeModels.subtract.steps[1].counts,[3,10,2]);
assert.deepEqual(exchangeModels.subtract.steps[2].counts,[3,9,12]);
const guideHTML=renderUnitGuide({lessons,standard:standards['4수01-03'].verified,card:l=>`<a href="#lesson=${l.id}">${l.title}</a>`,escape:v=>String(v),link:(t,u)=>`<a href="${u}">${t}</a>`,breadcrumbs:()=>''});
for(const unwanted of ['패들릿','딸깍','GRADUATE COURSE','PUBLIC','과제 안내'])assert.ok(!guideHTML.includes(unwanted),'Submission instructions must not appear in the teaching guide: '+unwanted);
for(const required of ['오류 진단','자릿값','교육과정 출처','실제 학생에게서 수집한 응답','생성형 AI','math-01','math-02'])assert.ok(guideHTML.includes(required),'Teaching guide missing '+required);
// Student practice: every auto-graded answer accepts itself, common variants pass, wrong answers fail.
let graded=0;const positions=[0,0,0];
for(const l of lessons)l.questions.forEach((q,i)=>{
 if(isAutoGradable(l,q)){graded++;assert.ok(gradeShort(q,q.answer),`${l.id} Q${i+1} must accept its own answer`);for(const alt of q.accept||[])assert.ok(gradeShort(q,alt),`${l.id} accept`);}
 if(q.type==='choice'){const order=shuffledOptions(l.id,i,q.options);assert.deepEqual(order.map(o=>o.option).sort(),[...q.options].sort(),l.id+' shuffle must keep options');assert.deepEqual(shuffledOptions(l.id,i,q.options),order,l.id+' shuffle must be stable');const p=order.findIndex(o=>o.option===q.answer);if(q.options.length===3)positions[p]++;}
});
assert.ok(graded>=40,'Math short answers should be auto-graded');
const total=positions.reduce((a,b)=>a+b,0);for(const n of positions)assert.ok(n/total>=.2,'Choice answers must be spread across positions: '+positions);
for(const [answer,input] of [['425권','425'],['425권',' 425 권'],['567','567 '],['4분 15초','4분15초'],['몫 5, 나머지 3','몫5 나머지3'],['3250m','3,250m'],['6','６'],['2와 2/3','2와2/3']])assert.ok(gradeShort({answer},input),`${input} should match ${answer}`);
for(const [answer,input] of [['567','576'],['425권','425명'],['4분 15초','4분'],['3250m','3250cm'],['7/4','4/7'],['567','']])assert.ok(!gradeShort({answer},input),`${input} should not match ${answer}`);
console.log(`PASS: ${lessons.length} lessons / ${lessons.length*3} questions / 9 subjects; ${verified} PDF verification links; schema, curriculum alignment, answers, sources, and coverage checked.`);
