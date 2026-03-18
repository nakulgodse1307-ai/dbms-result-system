'use strict';
let state={students:[],results:[],github:{token:'',owner:'',repo:'',branch:'main'},sha:{students:null,results:null}};
const SEED_S=[{id:1,roll:'22CS101',name:'Aarya Kulkarni',div:'A',email:'aarya@college.edu',phone:'+91 98765 43210',prn:'220110101'},{id:2,roll:'22CS102',name:'Rohan Desai',div:'A',email:'rohan@college.edu',phone:'+91 98765 43211',prn:'220110102'},{id:3,roll:'22CS103',name:'Priya Joshi',div:'B',email:'priya@college.edu',phone:'+91 98765 43212',prn:'220110103'},{id:4,roll:'22CS104',name:'Amit Patil',div:'B',email:'amit@college.edu',phone:'+91 98765 43213',prn:'220110104'},{id:5,roll:'22CS105',name:'Sneha Nair',div:'C',email:'sneha@college.edu',phone:'+91 98765 43214',prn:'220110105'},{id:6,roll:'22CS106',name:'Vikram Singh',div:'C',email:'vikram@college.edu',phone:'+91 98765 43215',prn:'220110106'},{id:7,roll:'22CS107',name:'Divya Mehta',div:'D',email:'divya@college.edu',phone:'+91 98765 43216',prn:'220110107'},{id:8,roll:'22CS108',name:'Karan Shah',div:'D',email:'karan@college.edu',phone:'+91 98765 43217',prn:'220110108'}];
const SEED_R=[{id:1,studentId:1,exam:'Unit Test IV',practical:23,internal:22,theory:44,status:'Pass'},{id:2,studentId:2,exam:'Unit Test IV',practical:18,internal:20,theory:38,status:'Pass'},{id:3,studentId:3,exam:'Unit Test IV',practical:25,internal:24,theory:48,status:'Pass'},{id:4,studentId:4,exam:'Unit Test IV',practical:12,internal:14,theory:22,status:'Fail'},{id:5,studentId:5,exam:'Unit Test IV',practical:20,internal:21,theory:40,status:'Pass'},{id:6,studentId:6,exam:'Unit Test IV',practical:15,internal:16,theory:30,status:'Pass'},{id:7,studentId:7,exam:'Unit Test IV',practical:24,internal:23,theory:46,status:'Pass'},{id:8,studentId:8,exam:'Unit Test IV',practical:9,internal:10,theory:18,status:'Fail'}];
let nextSId=9,nextRId=9;
const $=id=>document.getElementById(id);
const tot=r=>r.practical+r.internal+r.theory;
const pct=r=>Math.round(tot(r));
const grade=p=>p>=90?'O':p>=80?'A+':p>=70?'A':p>=60?'B+':p>=50?'B':p>=40?'C':'F';
const gcls=g=>({'O':'O','A+':'Ap','A':'A','B+':'Bp','B':'B','C':'C','F':'F'}[g]||'F');
const stu=id=>state.students.find(s=>s.id===id);
const rb=i=>`<span class="rb ${['r1','r2','r3'][i]||'rn'}">${i+1}</span>`;
function showToast(msg,type='inf'){const t=$('toast');t.textContent=msg;t.className=`toast show ${type}`;clearTimeout(t._t);t._t=setTimeout(()=>t.className='toast',2800)}
function openModal(id){$(id).classList.add('open')}
function closeModal(id){$(id).classList.remove('open')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-overlay').forEach(m=>m.classList.remove('open'))});
function navigate(sec,el){
  document.querySelectorAll('.sec').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-it').forEach(n=>n.classList.remove('active'));
  const s2=$('sec-'+sec);if(s2)s2.classList.add('active');
  if(el)el.classList.add('active');
  renderSec(sec);
}
function renderSec(s){
  if(s==='dashboard')renderDash();
  else if(s==='students')renderStudents();
  else if(s==='marks')renderMarks();
  else if(s==='results')renderResults();
  else if(s==='search')doSearch('');
}
function buildTable(list){
  if(!list.length)return '<div class="empty">No results found.</div>';
  return`<div class="tw"><table><thead><tr><th>#</th><th>Roll</th><th>Name</th><th>Exam</th><th>Prac</th><th>Int</th><th>Theory</th><th>Total</th><th>%</th><th>Grade</th><th>Status</th></tr></thead><tbody>${list.map((r,i)=>{const s=stu(r.studentId);const p=pct(r);const g=grade(p);return`<tr><td>${rb(i)}</td><td style="color:var(--cyn)">${s?.roll||'-'}</td><td class="tn">${s?.name||'?'}</td><td style="color:var(--mut)">${r.exam}</td><td>${r.practical}</td><td>${r.internal}</td><td>${r.theory}</td><td style="font-weight:600">${tot(r)}</td><td>${p}%</td><td><span class="pill p${gcls(g)}">${g}</span></td><td><span class="sp s${r.status}">${r.status}</span></td></tr>`;}).join('')}</tbody></table></div>`;
}
function renderDash(){
  const res=state.results,ss=state.students;
  const tt=res.length,pass=res.filter(r=>r.status==='Pass').length,fail=res.filter(r=>r.status==='Fail').length;
  const avg=tt?Math.round(res.reduce((s,r)=>s+pct(r),0)/tt):0;
  const sg=$('stats');
  if(sg)sg.innerHTML=`<div class="stat c"><div class="sv" style="color:var(--cyn)">${ss.length}</div><div class="sl">Total Students</div><div class="ss">Batch 2022-26</div></div><div class="stat g"><div class="sv" style="color:var(--grn)">${pass}</div><div class="sl">Passed</div><div class="ss up">${tt?Math.round(pass/tt*100):0}% pass rate</div></div><div class="stat r"><div class="sv" style="color:var(--red)">${fail}</div><div class="sl">Failed</div><div class="ss dn">${tt?Math.round(fail/tt*100):0}% fail rate</div></div><div class="stat y"><div class="sv" style="color:var(--yel)">${avg}%</div><div class="sl">Class Average</div><div class="ss ${avg>=60?'up':'dn'}">${grade(avg)} grade avg</div></div>`;
  const grades=['O','A+','A','B+','B','C','F'],colors=['#00e096','#a78bfa','#00e5ff','#3d7fff','#ffcb47','#ff8c42','#ff4d6d'];
  const counts=grades.map(g=>res.filter(r=>grade(pct(r))===g).length);
  const maxC=Math.max(...counts,1);
  const gb=$('grade-bars');
  if(gb)gb.innerHTML=grades.map((g,i)=>`<div class="bi"><div class="bv" style="color:${colors[i]}">${counts[i]}</div><div class="bar" style="height:${Math.round(counts[i]/maxC*90)+4}px;background:${colors[i]};opacity:0.85"></div><div class="bl">${g}</div></div>`).join('');
  const top5=[...res].sort((a,b)=>tot(b)-tot(a)).slice(0,5);
  const tl=$('top-list');
  if(tl)tl.innerHTML=top5.length?top5.map((r,i)=>{const s=stu(r.studentId);return`<div class="tpi">${rb(i)}<div style="flex:1"><div class="tpn">${s?.name||'?'}</div><div class="tpr">${s?.roll} · ${r.exam}</div></div><div class="tps">${tot(r)}/100</div><span class="pill p${gcls(grade(pct(r)))}">${grade(pct(r))}</span></div>`;}).join(''):'<div class="empty">No results yet</div>';
  const dt=$('dash-table');
  if(dt)dt.innerHTML=buildTable([...res].sort((a,b)=>tot(b)-tot(a)).slice(0,10));
}
function renderStudents(q=''){
  const list=state.students.filter(s=>!q||s.name.toLowerCase().includes(q.toLowerCase())||s.roll.toLowerCase().includes(q.toLowerCase()));
  const st=$('stu-table');
  if(st)st.innerHTML=list.length?`<div class="tw"><table><thead><tr><th>#</th><th>Roll</th><th>Name</th><th>Div</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead><tbody>${list.map((s,i)=>`<tr><td>${i+1}</td><td style="color:var(--cyn)">${s.roll}</td><td class="tn">${s.name}</td><td>${s.div}</td><td style="color:var(--mut)">${s.email}</td><td>${s.phone}</td><td><button class="btn btn-sm btn-e" onclick="editStu(${s.id})">Edit</button> <button class="btn btn-sm btn-d" onclick="delStu(${s.id})">Delete</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No students found.</div>';
}
function openStudentModal(id=null){
  $('stu-modal-title').textContent=id?'Edit Student':'Add Student';
  $('s-eid').value=id||'';
  const s=id?stu(id):null;
  $('s-roll').value=s?.roll||'';$('s-name').value=s?.name||'';$('s-email').value=s?.email||'';$('s-phone').value=s?.phone||'';$('s-prn').value=s?.prn||'';$('s-div').value=s?.div||'A';
  openModal('stu-modal');
}
function editStu(id){openStudentModal(id)}
function saveStudent(){
  const roll=$('s-roll').value.trim(),name=$('s-name').value.trim();
  if(!roll||!name){showToast('Roll and name required','err');return}
  const eid=parseInt($('s-eid').value);
  if(!eid){
    if(state.students.find(s=>s.roll===roll)){showToast('Roll already exists!','err');return}
    state.students.push({id:nextSId++,roll,name,div:$('s-div').value,email:$('s-email').value.trim(),phone:$('s-phone').value.trim(),prn:$('s-prn').value.trim()});
    showToast(name+' added!','ok');
  }else{
    const s=stu(eid);
    if(s){s.roll=roll;s.name=name;s.div=$('s-div').value;s.email=$('s-email').value.trim();s.phone=$('s-phone').value.trim();s.prn=$('s-prn').value.trim()}
    showToast(name+' updated!','ok');
  }
  closeModal('stu-modal');renderStudents();saveLocal();
}
function delStu(id){
  const s=stu(id);if(!confirm('Delete '+s?.name+'?'))return;
  state.students=state.students.filter(x=>x.id!==id);
  state.results=state.results.filter(r=>r.studentId!==id);
  renderStudents();showToast('Deleted','inf');saveLocal();
}
function renderMarks(ef=''){
  let list=[...state.results];
  if(ef)list=list.filter(r=>r.exam===ef);
  list.sort((a,b)=>tot(b)-tot(a));
  const mt=$('marks-table');
  if(mt)mt.innerHTML=list.length?`<div class="tw"><table><thead><tr><th>Roll</th><th>Name</th><th>Exam</th><th>Prac</th><th>Int</th><th>Theory</th><th>Total</th><th>%</th><th>Grade</th><th>Status</th><th>Actions</th></tr></thead><tbody>${list.map(r=>{const s=stu(r.studentId);const p=pct(r);const g=grade(p);return`<tr><td style="color:var(--cyn)">${s?.roll||'-'}</td><td class="tn">${s?.name||'?'}</td><td style="color:var(--mut)">${r.exam}</td><td>${r.practical}</td><td>${r.internal}</td><td>${r.theory}</td><td style="font-weight:600">${tot(r)}</td><td>${p}%</td><td><span class="pill p${gcls(g)}">${g}</span></td><td><span class="sp s${r.status}">${r.status}</span></td><td><button class="btn btn-sm btn-e" onclick="editMrk(${r.id})">Edit</button> <button class="btn btn-sm btn-d" onclick="delMrk(${r.id})">Del</button></td></tr>`;}).join('')}</tbody></table></div>`:'<div class="empty">No marks yet.</div>';
}
function openMarksModal(id=null){
  const sel=$('m-stu');
  sel.innerHTML=state.students.map(s=>`<option value="${s.id}">${s.roll} - ${s.name}</option>`).join('');
  $('mrk-modal-title').textContent=id?'Edit Marks':'Add Marks';
  $('m-eid').value=id||'';
  if(id){const r=state.results.find(x=>x.id===id);if(r){$('m-stu').value=r.studentId;$('m-exam').value=r.exam;$('m-pr').value=r.practical;$('m-in').value=r.internal;$('m-th').value=r.theory;$('m-st').value=r.status}}
  else{$('m-pr').value='';$('m-in').value='';$('m-th').value='';$('m-st').value='Pass'}
  livePreview();openModal('mrk-modal');
}
function editMrk(id){openMarksModal(id)}
function livePreview(){
  const p=parseInt($('m-pr')?.value)||0,i=parseInt($('m-in')?.value)||0,t=parseInt($('m-th')?.value)||0;
  const total=p+i+t,per=total,g=grade(per);
  $('pv-tot').textContent=total+'/100';$('pv-pct').textContent=per+'%';$('pv-gr').textContent=g;
}
function saveMarks(){
  const sId=parseInt($('m-stu').value),exam=$('m-exam').value;
  const practical=parseInt($('m-pr').value)||0,internal=parseInt($('m-in').value)||0,theory=parseInt($('m-th').value)||0;
  const status=$('m-st').value;
  if(!sId){showToast('Select a student','err');return}
  if(practical>25||internal>25||theory>50){showToast('Marks exceed limit!','err');return}
  const eid=parseInt($('m-eid').value);
  if(!eid){state.results.push({id:nextRId++,studentId:sId,exam,practical,internal,theory,status});showToast('Marks saved!','ok')}
  else{const r=state.results.find(x=>x.id===eid);if(r){r.studentId=sId;r.exam=exam;r.practical=practical;r.internal=internal;r.theory=theory;r.status=status}showToast('Updated!','ok')}
  closeModal('mrk-modal');renderMarks();saveLocal();
}
function delMrk(id){if(!confirm('Delete?'))return;state.results=state.results.filter(r=>r.id!==id);renderMarks();showToast('Deleted','inf');saveLocal()}
function renderResults(){
  const res=state.results,tt=res.length;
  const pass=res.filter(r=>r.status==='Pass').length;
  const avg=tt?Math.round(res.reduce((s,r)=>s+pct(r),0)/tt):0;
  const high=tt?Math.max(...res.map(r=>pct(r))):0,low=tt?Math.min(...res.map(r=>pct(r))):0;
  const rs=$('res-stats');
  if(rs)rs.innerHTML=`<div class="stat g"><div class="sv" style="color:var(--grn)">${tt?Math.round(pass/tt*100):0}%</div><div class="sl">Pass Percentage</div><div class="ss up">${pass} of ${tt}</div></div><div class="stat c"><div class="sv" style="color:var(--cyn)">${avg}%</div><div class="sl">Class Average</div><div class="ss">Grade ${grade(avg)}</div></div><div class="stat y"><div class="sv" style="color:var(--yel)">${high}%</div><div class="sl">Highest Score</div><div class="ss up">Lowest: ${low}%</div></div>`;
  const rt=$('res-table');
  if(rt)rt.innerHTML=buildTable([...res].sort((a,b)=>tot(b)-tot(a)));
  const buckets=[{l:'<40',min:0,max:40,c:'#ff4d6d'},{l:'40-49',min:40,max:50,c:'#ff8c42'},{l:'50-59',min:50,max:60,c:'#ffcb47'},{l:'60-69',min:60,max:70,c:'#3d7fff'},{l:'70-79',min:70,max:80,c:'#a78bfa'},{l:'80-89',min:80,max:90,c:'#00e5ff'},{l:'90+',min:90,max:101,c:'#00e096'}];
  const cnts=buckets.map(b=>res.filter(r=>{const p=pct(r);return p>=b.min&&p<b.max}).length);
  const mx=Math.max(...cnts,1);
  const sc=$('score-chart');
  if(sc)sc.innerHTML=buckets.map((b,i)=>`<div class="bi"><div class="bv" style="color:${b.c}">${cnts[i]}</div><div class="bar" style="height:${Math.round(cnts[i]/mx*110)+4}px;background:${b.c};opacity:0.85"></div><div class="bl">${b.l}</div></div>`).join('');
}
function doSearch(q){
  const ef=$('sf-exam')?.value||'',df=$('sf-div')?.value||'',sf=$('sf-st')?.value||'',gf=$('sf-gr')?.value||'';
  let list=[...state.results].map(r=>({...r,_s:stu(r.studentId)}));
  if(q)list=list.filter(r=>r._s?.name.toLowerCase().includes(q.toLowerCase())||r._s?.roll.toLowerCase().includes(q.toLowerCase())||grade(pct(r)).toLowerCase().includes(q.toLowerCase()));
  if(ef)list=list.filter(r=>r.exam===ef);
  if(df)list=list.filter(r=>r._s?.div===df);
  if(sf)list=list.filter(r=>r.status===sf);
  if(gf)list=list.filter(r=>grade(pct(r))===gf);
  list.sort((a,b)=>tot(b)-tot(a));
  const sc=$('s-count');if(sc)sc.textContent=list.length+' result'+(list.length!==1?'s':'');
  const sr=$('s-results');if(sr)sr.innerHTML=buildTable(list);
}
function exportCSV(){
  const rows=[['Rank','Roll','Name','Div','Exam','Practical','Internal','Theory','Total','Pct','Grade','Status']];
  [...state.results].sort((a,b)=>tot(b)-tot(a)).forEach((r,i)=>{const s=stu(r.studentId);const p=pct(r);rows.push([i+1,s?.roll,s?.name,s?.div,r.exam,r.practical,r.internal,r.theory,tot(r),p+'%',grade(p),r.status])});
  const csv=rows.map(r=>r.join(',')).join('\n');
  const a=document.createElement('a');a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csv);a.download='dbms_results.csv';a.click();
  showToast('CSV exported!','ok');
}
function saveLocal(){localStorage.setItem('dbms_s',JSON.stringify(state.students));localStorage.setItem('dbms_r',JSON.stringify(state.results))}
function loadLocal(){
  try{
    const s=localStorage.getItem('dbms_s'),r=localStorage.getItem('dbms_r'),g=localStorage.getItem('gh_cfg');
    if(s){state.students=JSON.parse(s);nextSId=Math.max(...state.students.map(x=>x.id),0)+1}
    if(r){state.results=JSON.parse(r);nextRId=Math.max(...state.results.map(x=>x.id),0)+1}
    if(g){state.github=JSON.parse(g);updateGHDot(true)}
  }catch(e){}
}
function updateGHDot(on){
  const d=$('gh-dot'),t=$('gh-st-txt');
  if(d&&t){if(on){d.className='gh-dot on';t.textContent=state.github.owner+'/'+state.github.repo}else{d.className='gh-dot off';t.textContent='Not Connected'}}
}
async function saveGHConfig(){
  const token=$('gh-tok').value.trim(),owner=$('gh-own').value.trim(),repo=$('gh-rep').value.trim(),branch=$('gh-br').value.trim()||'main';
  if(!token||!owner||!repo){showToast('All fields required','err');return}
  showToast('Testing...','inf');
  try{
    const res=await fetch('https://api.github.com/repos/'+owner+'/'+repo,{headers:{Authorization:'token '+token,Accept:'application/vnd.github.v3+json'}});
    if(!res.ok)throw new Error(res.statusText);
    state.github={token,owner,repo,branch};localStorage.setItem('gh_cfg',JSON.stringify(state.github));
    updateGHDot(true);closeModal('gh-modal');showToast('Connected to '+owner+'/'+repo,'ok');
  }catch(e){showToast('Failed: '+e.message,'err')}
}
async function ghGet(path){
  const{owner,repo,branch}=state.github;
  const res=await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/contents/'+path+'?ref='+branch,{headers:{Authorization:'token '+state.github.token,Accept:'application/vnd.github.v3+json'}});
  if(res.status===404)return null;
  const d=await res.json();
  return{content:JSON.parse(atob(d.content.replace(/\n/g,''))),sha:d.sha};
}
async function ghPut(path,content,sha,msg){
  const{owner,repo,branch}=state.github;
  const body={message:msg,content:btoa(unescape(encodeURIComponent(JSON.stringify(content,null,2)))),branch};
  if(sha)body.sha=sha;
  const res=await fetch('https://api.github.com/repos/'+owner+'/'+repo+'/contents/'+path,{method:'PUT',headers:{Authorization:'token '+state.github.token,Accept:'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify(body)});
  if(!res.ok){const e=await res.json();throw new Error(e.message)}
  const d=await res.json();return d.content.sha;
}
async function pullGH(){
  if(!state.github.token){showToast('Configure GitHub first','err');openModal('gh-modal');return}
  showToast('Pulling...','inf');
  try{
    const sf=await ghGet('db/students.json');
    const rf=await ghGet('db/results.json');
    if(sf){state.students=sf.content;state.sha.students=sf.sha;nextSId=Math.max(...state.students.map(s=>s.id),0)+1}
    if(rf){state.results=rf.content;state.sha.results=rf.sha;nextRId=Math.max(...state.results.map(r=>r.id),0)+1}
    showToast('Pulled from GitHub!','ok');
    renderDash();saveLocal();
  }catch(e){showToast('Pull failed: '+e.message,'err')}
}
async function pushGH(){
  if(!state.github.token){showToast('Configure GitHub first','err');openModal('gh-modal');return}
  showToast('Pushing...','inf');
  const ts=new Date().toISOString().slice(0,16).replace('T',' ');
  try{
    const sf=await ghGet('db/students.json');
    const rf=await ghGet('db/results.json');
    const sSha=sf?sf.sha:null;
    const rSha=rf?rf.sha:null;
    await ghPut('db/students.json',state.students,sSha,'update students ['+ts+']');
    await ghPut('db/results.json',state.results,rSha,'update results ['+ts+']');
    showToast('Pushed to GitHub!','ok');
  }catch(e){showToast('Push failed: '+e.message,'err')}
}
setInterval(saveLocal,30000);
(function init(){
  loadLocal();
  if(!state.students.length)state.students=JSON.parse(JSON.stringify(SEED_S));
  if(!state.results.length)state.results=JSON.parse(JSON.stringify(SEED_R));
  renderDash();
})();
