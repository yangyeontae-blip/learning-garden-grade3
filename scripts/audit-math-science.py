"""Independent arithmetic/unit-conversion checks and official-PDF provenance checks."""
import json, math, re, hashlib
from fractions import Fraction
from pathlib import Path
import pymupdf
root=Path(__file__).resolve().parents[1]
lessons=json.loads((root/'dist/data/math-science.json').read_text('utf-8'))
by_id={l['id']:l for l in lessons}
def ans(n,q):return by_id[f'math-{n:02}']['questions'][q-1]['answer']
def check(n,q,v):assert ans(n,q)==str(v),(n,q,ans(n,q),v)
def time(s):return f'{s//60}분 {s%60}초'
checks=[(1,1,326+241),(1,2,f'{268+157}권'),(2,1,563-241),(2,2,f'{600-275}장'),
 (6,1,f'{18//3}개'),(6,2,f'{24//4}묶음'),(7,1,48//8),(7,2,54//9),
 (8,1,30*4),(8,2,f'{21*4}개'),(9,1,36*2),(9,2,f'{48*3}개'),
 (10,1,f'{5*10}mm'),(10,2,f'{3*1000+250}m'),(11,1,'60초'),(11,2,f'{3*60+20}초'),
 (12,1,time((60+40)+(2*60+35))),(12,2,time((5*60+10)-(2*60+30))),
 (12,3,time((7*60+5)-(5*60+20))),(13,1,str(Fraction(3,8))),
 (14,1,str(max(Fraction(2,5),Fraction(4,5)))),(14,2,str(max(Fraction(1,3),Fraction(1,9)))),
 (15,1,3/10),(15,2,max(1.4,1.7)),(16,1,123*3),(16,2,f'{208*4}장'),
 (17,1,12*14),(17,2,f'{23*12}자루'),(18,1,f'몫 {23//4}, 나머지 {23%4}'),
 (18,2,5),(19,1,248//4),(19,2,f'{math.ceil(125/4)}대'),(20,1,f'{5*2}cm'),
 (20,2,f'{14//2}cm'),(21,1,'4cm'),(21,2,f'{2*2}cm'),
 (22,2,f'{8//3}와 {8%3}/3'),(22,3,str(1+Fraction(3,4))),
 (23,1,f'{20//4}개'),(23,2,f'{18//3*2}cm'),(24,1,f'{2*1000+450}mL'),
 (24,2,f'{1600-900}mL'),(25,1,f'{4*1000+80}g'),(25,2,f'{3000//1000}t'),
 (26,1,f'{(1700+800)//1000}kg {(1700+800)%1000}g'),
 (26,2,f'{(4100-2600)//1000}kg {(4100-2600)%1000}g'),
 (26,3,f'{(1200+900)//1000}kg {(1200+900)%1000}g'),
 (27,1,f'{5*4}개'),(27,2,f'{10*3+2}명'),(28,1,f'{14//2}개'),(28,2,f'{12-8}명')]
for n,q,v in checks:check(n,q,v)
assert len(by_id)==53
assert all(len(l['questions'])==3 for l in lessons)
assert all(len(q['criteria'])>=8 for l in lessons for q in l['questions'] if q['type']=='activity')
for l in lessons:
    assert len(l['verifiedStandards'])==len(l['standardCodes'])
    stem='math' if l['subject']=='수학' else 'science'
    with pymupdf.open(root/f'research/math-science-sources/{stem}-official.pdf') as doc:
        for s in l['verifiedStandards']:
            page=re.sub(r'\s+',' ',doc[s['page']-1].get_text())
            assert s['text'] in page,(l['id'],s['code'])
    for q in l['questions']:
        assert q['answer'] and q['explanation']
        if q['type']=='choice':assert q['options'].count(q['answer'])==1
print('PASS:',len(checks),'independent numeric/units answers; 53 lesson shapes; all PDF statement locators; activity criteria >=8 chars.')
for stem in ['math','science']:
    print(stem,'sha256',hashlib.sha256((root/f'research/math-science-sources/{stem}-official.pdf').read_bytes()).hexdigest())
