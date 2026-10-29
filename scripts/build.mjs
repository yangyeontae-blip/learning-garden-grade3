import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=async p=>JSON.parse((await readFile(resolve(root,p),'utf8')).replace(/^\uFEFF/,''));
const write=async(p,d)=>writeFile(resolve(root,p),JSON.stringify(d,null,2)+'\n');
const order=['국어','수학','사회','과학','영어','도덕','체육','음악','미술'];
const batches=await Promise.all(['language-social','math-science','arts-ethics'].map(n=>read(`dist/data/${n}.json`)));
const lessons=batches.flat().sort((a,b)=>order.indexOf(a.subject)-order.indexOf(b.subject));
const standards=await read('research/mcp-standards.json');
for(const l of lessons){
 l.standardCodes=l.standardCodes.map(c=>c.replace(/[\[\]]/g,''));
 for(const v of l.verifiedStandards||[]){
  const code=v.code.replace(/[\[\]]/g,'');
  if(!standards[code])throw Error(`Unknown verified standard ${code}`);
  const old=standards[code].verified;
  if(old&&old.text!==v.text)throw Error(`Conflicting verified texts for ${code}`);
  standards[code].verified={text:v.text,url:v.url,page:v.page};
 }
}
await mkdir(resolve(root,'dist/data'),{recursive:true});
await write('dist/data/lessons.json',lessons);
await write('dist/data/standards.json',standards);
await write('dist/data/coverage.json',lessons.map(l=>({id:l.id,subject:l.subject,semester:l.semester,unit:l.unit,title:l.title,standardCodes:l.standardCodes,verifiedCodes:(l.verifiedStandards||[]).map(s=>s.code),assignmentNote:l.assignmentNote,sources:l.sources})));
await write('dist/data/manifest.json',{date:'2026-10-29',title:'배움정원',curriculum:'2022 개정 교육과정 · 3~4학년군에서 3학년 주제 선정',lessonCount:lessons.length,questionCount:lessons.length*3,subjects:order.map(subject=>({name:subject,count:lessons.filter(l=>l.subject===subject).length})),dataSource:'korean-elementary-learning-map-mcp@0.5.1'});
console.log(`Built ${lessons.length} lessons, ${lessons.length*3} questions, ${order.length} subjects.`);
