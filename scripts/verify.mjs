import {readFile,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import assert from 'node:assert/strict';
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
console.log(`PASS: ${lessons.length} lessons / ${lessons.length*3} questions / 9 subjects; ${verified} PDF verification links; schema, curriculum alignment, answers, sources, and coverage checked.`);
