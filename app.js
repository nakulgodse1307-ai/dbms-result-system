/* ═══════════════════════════════════════════
   DBMS Result Management System
   app.js — Full GitHub API Integration
═══════════════════════════════════════════ */

'use strict';

// ─── State ────────────────────────────────────────────────────────────────────
let state = {
  students: [],
  results: [],
  github: {
    token: '',
    owner: '',
    repo: '',
    branch: 'main',
  },
  sha: {
    students: null,
    results: null,
  },
};

// ─── Seed Data ────────────────────────────────────────────────────────────────
const SEED_STUDENTS = [
  { id: 1, roll: '22CS101', name: 'Aarya Kulkarni',  div: 'A', email: 'aarya.k@college.edu',  phone: '+91 98765 43210', prn: '220110101' },
  { id: 2, roll: '22CS102', name: 'Rohan Desai',     div: 'A', email: 'rohan.d@college.edu',  phone: '+91 98765 43211', prn: '220110102' },
  { id: 3, roll: '22CS103', name: 'Priya Joshi',     div: 'B', email: 'priya.j@college.edu',  phone: '+91 98765 43212', prn: '220110103' },
  { id: 4, roll: '22CS104', name: 'Amit Patil',      div: 'B', email: 'amit.p@college.edu',   phone: '+91 98765 43213', prn: '220110104' },
  { id: 5, roll: '22CS105', name: 'Sneha Nair',      div: 'C', email: 'sneha.n@college.edu',  phone: '+91 98765 43214', prn: '220110105' },
  { id: 6, roll: '22CS106', name: 'Vikram Singh',    div: 'C', email: 'vikram.s@college.edu', phone: '+91 98765 43215', prn: '220110106' },
  { id: 7, roll: '22CS107', name: 'Divya Mehta',     div: 'D', email: 'divya.m@college.edu',  phone: '+91 98765 43216', prn: '220110107' },
  { id: 8, roll: '22CS108', name: 'Karan Shah',      div: 'D', email: 'karan.s@college.edu',  phone: '+91 98765 43217', prn: '220110108' },
  { id: 9, roll: '22CS109', name: 'Meera Iyer',      div: 'A', email: 'meera.i@college.edu',  phone: '+91 98765 43218', prn: '220110109' },
  { id: 10, roll: '22CS110', name: 'Arjun Sharma',   div: 'B', email: 'arjun.s@college.edu',  phone: '+91 98765 43219', prn: '220110110' },
];

const SEED_RESULTS = [
  { id: 1,  studentId: 1,  exam: 'Unit Test IV', practical: 23, internal: 22, theory: 44, status: 'Pass' },
  { id: 2,  studentId: 2,  exam: 'Unit Test IV', practical: 18, internal: 20, theory: 38, status: 'Pass' },
  { id: 3,  studentId: 3,  exam: 'Unit Test IV', practical: 25, internal: 24, theory: 48, status: 'Pass' },
  { id: 4,  studentId: 4,  exam: 'Unit Test IV', practical: 12, internal: 14, theory: 22, status: 'Fail' },
  { id: 5,  studentId: 5,  exam: 'Unit Test IV', practical: 20, internal: 21, theory: 40, status: 'Pass' },
  { id: 6,  studentId: 6,  exam: 'Unit Test IV', practical: 15, internal: 16, theory: 30, status: 'Pass' },
  { id: 7,  studentId: 7,  exam: 'Unit Test IV', practical: 24, internal: 23, theory: 46, status: 'Pass' },
  { id: 8,  studentId: 8,  exam: 'Unit Test IV', practical:  9, internal: 10, theory: 18, status: 'Fail' },
  { id: 9,  studentId: 9,  exam: 'Unit Test IV', practical: 22, internal: 20, theory: 42, status: 'Pass' },
  { id: 10, studentId: 10, exam: 'Unit Test IV', practical: 21, internal: 22, theory: 45, status: 'Pass' },
  { id: 11, studentId: 1,  exam: 'Unit Test III', practical: 20, internal: 19, theory: 40, status: 'Pass' },
  { id: 12, studentId: 2,  exam: 'Unit Test III', practical: 16, internal: 17, theory: 33, status: 'Pass' },
  { id: 13, studentId: 3,  exam: 'Unit Test III', practical: 24, internal: 23, theory: 47, status: 'Pass' },
  { id: 14, studentId: 4,  exam: 'Unit Test III', practical: 11, internal: 12, theory: 20, status: 'Fail' },
];

let nextStudentId = 11;
let nextResultId  = 15;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const total  = r => r.practical + r.internal + r.theory;
const pct    = r => Math.round((total(r) / 100) * 100);
const grade  = p => p >= 90 ? 'O' : p >= 80 ? 'A+' : p >= 70 ? 'A' : p >= 60 ? 'B+' : p >= 50 ? 'B' : p >= 40 ? 'C' : 'F';
const gradeCls = g => ({ 'O':'O','A+':'Ap','A':'A','B+':'Bp','B':'B','C':'C','F':'F' }[g] || 'F');
const student = id => state.students.find(s => s.id === id);
const rankBadge = i => `<span class="rank-badge ${['r1','r2','r3'][i] || 'rn'}">${i + 1}</span>`;

function showToast(msg, type = 'info') {
  const t = $('toast');
  t.textContent = msg;
  t.className = `toast show ${type}`;
  clearTimeout(t._tid);
  t._tid = setTimeout(() => (t.className = 'toast'), 2800);
}

function openModal(id)  { $(id).classList.add('open'); }
function closeModal(id) { $(id).classList.remove('open'); }

// ─── Navigation ──────────────────────────────────────────────────────────────
const PAGE_META = {
  dashboard: { title: 'Dashboard',       breadcrumb: 'DBMS · Overview · 2024' },
  students:  { title: 'Students',        breadcrumb: 'DBMS · Student Records' },
  marks:     { title: 'Marks & Grades',  breadcrumb: 'DBMS · Mark Entry' },
  results:   { title: 'Results & Report',breadcrumb: 'DBMS · Result Analysis' },
  search:    { title: 'Search & Filter', breadcrumb: 'DBMS · Search Database' },
};

function navigate(section, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  $('sec-' + section).classList.add('active');
  if (el) el.classList.add('active');
  const meta = PAGE_META[section];
  $('page-title').textContent  = meta.title;
  $('breadcrumb').textContent  = meta.breadcrumb;
  renderSection(section);
}

function renderSection(sec) {
  switch(sec) {
    case 'dashboard': renderDashboard(); break;
    case 'students':  renderStudentsTable(); break;
    case 'marks':     renderMarksTable(); break;
    case 'results':   renderResultsReport(); break;
    case 'search':    performSearch(''); break;
  }
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
function renderDashboard() {
  const res    = state.results;
  const stu    = state.students;
  const total_ = res.length;
  const passes = res.filter(r => r.status === 'Pass').length;
  const fails  = res.filter(r => r.status === 'Fail').length;
  const avg    = total_ ? Math.round(res.reduce((s, r) => s + pct(r), 0) / total_) : 0;

  // Stats
  $('stats-row').innerHTML = `
    <div class="stat-card cyan">
      <div class="stat-value" style="color:var(--cyan)">${stu.length}</div>
      <div class="stat-label">Total Students</div>
      <div class="stat-sub">Batch 2022–26</div>
    </div>
    <div class="stat-card green">
      <div class="stat-value" style="color:var(--green)">${passes}</div>
      <div class="stat-label">Passed</div>
      <div class="stat-sub up">${total_ ? Math.round((passes / total_) * 100) : 0}% pass rate</div>
    </div>
    <div class="stat-card red">
      <div class="stat-value" style="color:var(--red)">${fails}</div>
      <div class="stat-label">Failed</div>
      <div class="stat-sub down">${total_ ? Math.round((fails / total_) * 100) : 0}% fail rate</div>
    </div>
    <div class="stat-card yellow">
      <div class="stat-value" style="color:var(--yellow)">${avg}%</div>
      <div class="stat-label">Class Average</div>
      <div class="stat-sub ${avg >= 60 ? 'up' : 'down'}">${grade(avg)} grade avg</div>
    </div>
  `;

  // Grade bars
  const grades  = ['O', 'A+', 'A', 'B+', 'B', 'C', 'F'];
  const colors  = ['#00e096','#a78bfa','#00e5ff','#3d7fff','#ffcb47','#ff8c42','#ff4d6d'];
  const counts  = grades.map(g => res.filter(r => grade(pct(r)) === g).length);
  const maxC    = Math.max(...counts, 1);
  $('grade-bars').innerHTML = grades.map((g, i) => `
    <div class="bar-item">
      <div class="bar-val" style="color:${colors[i]}">${counts[i]}</div>
      <div class="bar" style="height:${Math.round((counts[i] / maxC) * 90) + 4}px;background:${colors[i]};opacity:0.85"></div>
      <div class="bar-label">${g}</div>
    </div>
  `).join('');

  // Top 5 performers
  const top5 = [...res].sort((a, b) => total(b) - total(a)).slice(0, 5);
  $('top-performers-list').innerHTML = top5.length
    ? top5.map((r, i) => {
        const s = student(r.studentId);
        return `<div class="top-performer-item">
          ${rankBadge(i)}
          <div class="tp-info">
            <div class="tp-name">${s?.name || '—'}</div>
            <div class="tp-roll">${s?.roll} · ${r.exam}</div>
          </div>
          <div class="tp-score">${total(r)}/100</div>
          <span class="pill pill-${gradeCls(grade(pct(r)))}">${grade(pct(r))}</span>
        </div>`;
      }).join('')
    : '<div class="empty-state">No results yet</div>';

  // Quick table (top 10)
  const sorted = [...res].sort((a, b) => total(b) - total(a)).slice(0, 10);
  $('dashboard-table').innerHTML = sorted.length
    ? buildResultTable(sorted)
    : '<div class="empty-state">No results recorded yet.</div>';
}

function buildResultTable(list) {
  return `<div class="table-wrap"><table>
    <thead><tr>
      <th>#</th><th>Roll</th><th>Name</th><th>Exam</th>
      <th>Prac</th><th>Int.</th><th>Theory</th>
      <th>Total</th><th>%</th><th>Grade</th><th>Status</th>
    </tr></thead>
    <tbody>
    ${list.map((r, i) => {
      const s = student(r.studentId);
      const p = pct(r); const g = grade(p);
      return `<tr>
        <td>${rankBadge(i)}</td>
        <td style="color:var(--cyan)">${s?.roll || '—'}</td>
        <td class="tname">${s?.name || 'Unknown'}</td>
        <td style="color:var(--muted)">${r.exam}</td>
        <td>${r.practical}/25</td>
        <td>${r.internal}/25</td>
        <td>${r.theory}/50</td>
        <td style="font-weight:600">${total(r)}/100</td>
        <td>${p}%</td>
        <td><span class="pill pill-${gradeCls(g)}">${g}</span></td>
        <td><span class="status-pill status-${r.status}">${r.status}</span></td>
      </tr>`;
    }).join('')}
    </tbody>
  </table></div>`;
}

// ─── Students Table ────────────────────────────────────────────────────────────
function renderStudentsTable(filter = '') {
  let list = [...state.students];
  const q = (filter || $('student-search')?.value || '').toLowerCase();
  if (q) list = list.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.roll.toLowerCase().includes(q) ||
    s.prn.toLowerCase().includes(q)
  );

  $('students-table-wrap').innerHTML = list.length
    ? `<div class="table-wrap"><table>
        <thead><tr>
          <th>#</th><th>Roll No.</th><th>Name</th><th>Div</th>
          <th>Email</th><th>Phone</th><th>PRN</th><th>Actions</th>
        </tr></thead>
        <tbody>
        ${list.map((s, i) => `
          <tr>
            <td>${i + 1}</td>
            <td style="color:var(--cyan)">${s.roll}</td>
            <td class="tname">${s.name}</td>
            <td>${s.div}</td>
            <td style="color:var(--muted)">${s.email}</td>
            <td>${s.phone}</td>
            <td style="color:var(--muted)">${s.prn}</td>
            <td>
              <button class="btn btn-sm btn-edit" onclick="editStudent(${s.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteStudent(${s.id})" style="margin-left:4px">Delete</button>
            </td>
          </tr>
        `).join('')}
        </tbody>
      </table></div>`
    : '<div class="empty-state">No students found.</div>';
}

function filterStudents(q) { renderStudentsTable(q); }

// ─── Student Modal ─────────────────────────────────────────────────────────────
function openStudentModal(id = null) {
  $('student-modal-title').textContent = id ? 'Edit Student' : 'Add Student';
  $('s-edit-id').value = id || '';
  const s = id ? student(id) : null;
  $('s-roll').value  = s?.roll  || '';
  $('s-name').value  = s?.name  || '';
  $('s-email').value = s?.email || '';
  $('s-phone').value = s?.phone || '';
  $('s-prn').value   = s?.prn   || '';
  $('s-div').value   = s?.div   || 'A';
  openModal('student-modal');
}

function editStudent(id) { openStudentModal(id); }

function saveStudent() {
  const roll = $('s-roll').value.trim();
  const name = $('s-name').value.trim();
  if (!roll || !name) { showToast('Roll number and name are required.', 'error'); return; }

  const editId = parseInt($('s-edit-id').value);
  if (!editId) {
    if (state.students.find(s => s.roll === roll)) {
      showToast('Roll number already exists!', 'error'); return;
    }
    state.students.push({
      id: nextStudentId++, roll, name,
      div:   $('s-div').value,
      email: $('s-email').value.trim(),
      phone: $('s-phone').value.trim(),
      prn:   $('s-prn').value.trim(),
    });
    showToast(`Student "${name}" added.`, 'success');
  } else {
    const s = student(editId);
    if (s) {
      s.roll  = roll; s.name  = name;
      s.div   = $('s-div').value;
      s.email = $('s-email').value.trim();
      s.phone = $('s-phone').value.trim();
      s.prn   = $('s-prn').value.trim();
    }
    showToast(`Student "${name}" updated.`, 'success');
  }
  closeModal('student-modal');
  renderStudentsTable();
  markUnsaved();
}

function deleteStudent(id) {
  const s = student(id);
  if (!confirm(`Delete "${s?.name}"? This also removes their results.`)) return;
  state.students = state.students.filter(x => x.id !== id);
  state.results  = state.results.filter(r => r.studentId !== id);
  renderStudentsTable();
  showToast('Student deleted.', 'info');
  markUnsaved();
}

// ─── Marks Table ──────────────────────────────────────────────────────────────
function renderMarksTable(examFilter = '') {
  const ef = examFilter || $('marks-exam-filter')?.value || '';
  let list = [...state.results];
  if (ef) list = list.filter(r => r.exam === ef);
  list.sort((a, b) => total(b) - total(a));

  $('marks-table-wrap').innerHTML = list.length
    ? `<div class="table-wrap"><table>
        <thead><tr>
          <th>Roll</th><th>Name</th><th>Exam</th>
          <th>Practical /25</th><th>Internal /25</th><th>Theory /50</th>
          <th>Total</th><th>%</th><th>Grade</th><th>Status</th><th>Actions</th>
        </tr></thead>
        <tbody>
        ${list.map(r => {
          const s = student(r.studentId);
          const p = pct(r); const g = grade(p);
          return `<tr>
            <td style="color:var(--cyan)">${s?.roll || '—'}</td>
            <td class="tname">${s?.name || 'Unknown'}</td>
            <td style="color:var(--muted)">${r.exam}</td>
            <td>${r.practical}</td>
            <td>${r.internal}</td>
            <td>${r.theory}</td>
            <td style="font-weight:600">${total(r)}</td>
            <td>${p}%</td>
            <td><span class="pill pill-${gradeCls(g)}">${g}</span></td>
            <td><span class="status-pill status-${r.status}">${r.status}</span></td>
            <td>
              <button class="btn btn-sm btn-edit" onclick="editMarks(${r.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteResult(${r.id})" style="margin-left:4px">Delete</button>
            </td>
          </tr>`;
        }).join('')}
        </tbody>
      </table></div>`
    : '<div class="empty-state">No marks entered yet.</div>';
}

function filterMarksByExam(val) { renderMarksTable(val); }

// ─── Marks Modal ──────────────────────────────────────────────────────────────
function openMarksModal(id = null) {
  // Populate student dropdown
  const sel = $('m-student');
  sel.innerHTML = state.students.map(s =>
    `<option value="${s.id}">${s.roll} — ${s.name}</option>`
  ).join('');

  $('marks-modal-title').textContent = id ? 'Edit Marks' : 'Add Marks';
  $('m-edit-id').value = id || '';

  if (id) {
    const r = state.results.find(x => x.id === id);
    if (r) {
      $('m-student').value   = r.studentId;
      $('m-exam').value      = r.exam;
      $('m-practical').value = r.practical;
      $('m-internal').value  = r.internal;
      $('m-theory').value    = r.theory;
      $('m-status').value    = r.status;
    }
  } else {
    $('m-practical').value = '';
    $('m-internal').value  = '';
    $('m-theory').value    = '';
    $('m-status').value    = 'Pass';
  }
  updateLivePreview();
  openModal('marks-modal');
}

function editMarks(id) { openMarksModal(id); }

function updateLivePreview() {
  const p = parseInt($('m-practical')?.value) || 0;
  const i = parseInt($('m-internal')?.value)  || 0;
  const t = parseInt($('m-theory')?.value)    || 0;
  const tot = p + i + t;
  const per = Math.round((tot / 100) * 100);
  const g   = grade(per);
  $('prev-total').textContent = `${tot}/100`;
  $('prev-pct').textContent   = `${per}%`;
  $('prev-grade').textContent = g;
}

function saveMarks() {
  const studentId  = parseInt($('m-student').value);
  const exam       = $('m-exam').value;
  const practical  = parseInt($('m-practical').value) || 0;
  const internal   = parseInt($('m-internal').value)  || 0;
  const theory     = parseInt($('m-theory').value)    || 0;
  const status     = $('m-status').value;

  if (!studentId) { showToast('Please select a student.', 'error'); return; }
  if (practical > 25) { showToast('Practical max is 25.', 'error'); return; }
  if (internal > 25)  { showToast('Internal max is 25.', 'error'); return; }
  if (theory > 50)    { showToast('Theory max is 50.', 'error'); return; }

  const editId = parseInt($('m-edit-id').value);
  if (!editId) {
    state.results.push({ id: nextResultId++, studentId, exam, practical, internal, theory, status });
    showToast('Marks saved.', 'success');
  } else {
    const r = state.results.find(x => x.id === editId);
    if (r) { r.studentId = studentId; r.exam = exam; r.practical = practical; r.internal = internal; r.theory = theory; r.status = status; }
    showToast('Marks updated.', 'success');
  }
  closeModal('marks-modal');
  renderMarksTable();
  markUnsaved();
}

function deleteResult(id) {
  if (!confirm('Delete this result?')) return;
  state.results = state.results.filter(r => r.id !== id);
  renderMarksTable();
  showToast('Result deleted.', 'info');
  markUnsaved();
}

// ─── Results Report ────────────────────────────────────────────────────────────
function renderResultsReport() {
  const res = state.results;
  const passes   = res.filter(r => r.status === 'Pass').length;
  const fails    = res.filter(r => r.status === 'Fail').length;
  const withheld = res.filter(r => r.status === 'Withheld').length;
  const avg      = res.length ? Math.round(res.reduce((s, r) => s + pct(r), 0) / res.length) : 0;
  const highest  = res.length ? Math.max(...res.map(r => pct(r))) : 0;
  const lowest   = res.length ? Math.min(...res.map(r => pct(r))) : 0;

  $('result-stats').innerHTML = `
    <div class="stat-card green">
      <div class="stat-value" style="color:var(--green)">${res.length ? Math.round((passes / res.length) * 100) : 0}%</div>
      <div class="stat-label">Pass Percentage</div>
      <div class="stat-sub up">${passes} of ${res.length} students</div>
    </div>
    <div class="stat-card cyan">
      <div class="stat-value" style="color:var(--cyan)">${avg}%</div>
      <div class="stat-label">Class Average</div>
      <div class="stat-sub">Grade ${grade(avg)}</div>
    </div>
    <div class="stat-card yellow">
      <div class="stat-value" style="color:var(--yellow)">${highest}%</div>
      <div class="stat-label">Highest Score</div>
      <div class="stat-sub up">Lowest: ${lowest}%</div>
    </div>
  `;

  const sorted = [...res].sort((a, b) => total(b) - total(a));
  $('result-report-wrap').innerHTML = sorted.length
    ? `<div class="table-wrap"><table>
        <thead><tr>
          <th>Rank</th><th>Roll</th><th>Name</th><th>Div</th><th>Exam</th>
          <th>Prac</th><th>Int.</th><th>Theory</th>
          <th>Total</th><th>%</th><th>Grade</th><th>Status</th>
        </tr></thead>
        <tbody>
        ${sorted.map((r, i) => {
          const s = student(r.studentId);
          const p = pct(r); const g = grade(p);
          return `<tr>
            <td>${rankBadge(i)}</td>
            <td style="color:var(--cyan)">${s?.roll || '—'}</td>
            <td class="tname">${s?.name || '—'}</td>
            <td>${s?.div || '—'}</td>
            <td style="color:var(--muted)">${r.exam}</td>
            <td>${r.practical}</td>
            <td>${r.internal}</td>
            <td>${r.theory}</td>
            <td style="font-weight:600">${total(r)}</td>
            <td>${p}%</td>
            <td><span class="pill pill-${gradeCls(g)}">${g}</span></td>
            <td><span class="status-pill status-${r.status}">${r.status}</span></td>
          </tr>`;
        }).join('')}
        </tbody>
      </table></div>`
    : '<div class="empty-state">No results to display.</div>';

  // Score distribution chart
  const buckets = [
    { label: '<40',   min: 0,  max: 40,  color: '#ff4d6d' },
    { label: '40–49', min: 40, max: 50,  color: '#ff8c42' },
    { label: '50–59', min: 50, max: 60,  color: '#ffcb47' },
    { label: '60–69', min: 60, max: 70,  color: '#3d7fff' },
    { label: '70–79', min: 70, max: 80,  color: '#a78bfa' },
    { label: '80–89', min: 80, max: 90,  color: '#00e5ff' },
    { label: '90+',   min: 90, max: 101, color: '#00e096' },
  ];
  const counts = buckets.map(b =>
    res.filter(r => { const p2 = pct(r); return p2 >= b.min && p2 < b.max; }).length
  );
  const maxC = Math.max(...counts, 1);
  $('score-chart').innerHTML = buckets.map((b, i) => `
    <div class="bar-item">
      <div class="bar-val" style="color:${b.color}">${counts[i]}</div>
      <div class="bar" style="height:${Math.round((counts[i] / maxC) * 110) + 4}px;background:${b.color};opacity:0.85"></div>
      <div class="bar-label">${b.label}</div>
    </div>
  `).join('');
}

// ─── Search & Filter ────────────────────────────────────────────────────────────
function performSearch(q) {
  const query    = (q || $('big-search')?.value || '').toLowerCase();
  const examF    = $('sf-exam')?.value   || '';
  const divF     = $('sf-div')?.value    || '';
  const statusF  = $('sf-status')?.value || '';
  const gradeF   = $('sf-grade')?.value  || '';

  let list = [...state.results];
  list = list.map(r => ({ ...r, _student: student(r.studentId) }));

  if (query) list = list.filter(r =>
    r._student?.name.toLowerCase().includes(query) ||
    r._student?.roll.toLowerCase().includes(query) ||
    grade(pct(r)).toLowerCase().includes(query)
  );
  if (examF)   list = list.filter(r => r.exam === examF);
  if (divF)    list = list.filter(r => r._student?.div === divF);
  if (statusF) list = list.filter(r => r.status === statusF);
  if (gradeF)  list = list.filter(r => grade(pct(r)) === gradeF);

  list.sort((a, b) => total(b) - total(a));

  $('search-count').textContent = `${list.length} result${list.length !== 1 ? 's' : ''}`;
  $('search-results-wrap').innerHTML = list.length
    ? buildResultTable(list)
    : '<div class="empty-state">No results match your filters.</div>';
}

// ─── Export CSV ────────────────────────────────────────────────────────────────
function exportCSV() {
  const headers = ['Rank','Roll No.','Name','Division','Exam','Practical','Internal','Theory','Total','Percentage','Grade','Status'];
  const rows = [...state.results]
    .sort((a, b) => total(b) - total(a))
    .map((r, i) => {
      const s = student(r.studentId);
      const p = pct(r);
      return [i + 1, s?.roll, s?.name, s?.div, r.exam, r.practical, r.internal, r.theory, total(r), p + '%', grade(p), r.status];
    });
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `dbms_results_${Date.now()}.csv`;
  a.click();
  showToast('CSV exported successfully!', 'success');
}

// ─── Unsaved indicator ─────────────────────────────────────────────────────────
let unsaved = false;
function markUnsaved() {
  unsaved = true;
  const btn = document.querySelector('.btn-primary[onclick="pushToGitHub()"]');
  if (btn) btn.textContent = '⬆ Push (unsaved)';
}
function clearUnsaved() {
  unsaved = false;
  const btn = document.querySelector('.btn-primary[onclick="pushToGitHub()"]');
  if (btn) btn.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"/></svg> Push to GitHub`;
}

// ─── GitHub Config ─────────────────────────────────────────────────────────────
function openGithubConfig() {
  $('gh-token').value  = state.github.token;
  $('gh-owner').value  = state.github.owner;
  $('gh-repo').value   = state.github.repo;
  $('gh-branch').value = state.github.branch || 'main';
  openModal('github-modal');
}

async function saveGithubConfig() {
  const token  = $('gh-token').value.trim();
  const owner  = $('gh-owner').value.trim();
  const repo   = $('gh-repo').value.trim();
  const branch = $('gh-branch').value.trim() || 'main';

  if (!token || !owner || !repo) {
    showToast('All fields are required.', 'error'); return;
  }

  showToast('Testing connection…', 'info');
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });
    if (!res.ok) throw new Error(`GitHub API: ${res.status} ${res.statusText}`);

    state.github = { token, owner, repo, branch };
    localStorage.setItem('gh_config', JSON.stringify(state.github));

    updateGHStatus(true);
    closeModal('github-modal');
    showToast(`Connected to ${owner}/${repo}`, 'success');
  } catch (e) {
    showToast(`Connection failed: ${e.message}`, 'error');
  }
}

function updateGHStatus(connected) {
  const dot  = $('gh-dot');
  const text = $('gh-status-text');
  if (connected) {
    dot.className  = 'gh-dot connected';
    text.textContent = state.github.owner + '/' + state.github.repo;
  } else {
    dot.className  = 'gh-dot disconnected';
    text.textContent = 'Not Connected';
  }
}

// ─── GitHub API Helpers ────────────────────────────────────────────────────────
const GH_API = 'https://api.github.com';

function ghHeaders() {
  return {
    Authorization: `token ${state.github.token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
}

async function ghGetFile(path) {
  const { owner, repo, branch } = state.github;
  const res = await fetch(
    `${GH_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    { headers: ghHeaders() }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET ${path}: ${res.status}`);
  const data = await res.json();
  return {
    content: JSON.parse(atob(data.content.replace(/\n/g, ''))),
    sha: data.sha,
  };
}

async function ghPutFile(path, content, sha, message) {
  const { owner, repo, branch } = state.github;
  const body = {
    message,
    content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `${GH_API}/repos/${owner}/${repo}/contents/${path}`,
    { method: 'PUT', headers: ghHeaders(), body: JSON.stringify(body) }
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `PUT ${path}: ${res.status}`);
  }
  const data = await res.json();
  return data.content.sha;
}

// ─── Sync: Pull from GitHub ────────────────────────────────────────────────────
async function syncFromGitHub() {
  if (!state.github.token) {
    showToast('Configure GitHub first (sidebar button).', 'error');
    openGithubConfig();
    return;
  }
  showSyncing(true);
  try {
    const [stuFile, resFile] = await Promise.all([
      ghGetFile('db/students.json'),
      ghGetFile('db/results.json'),
    ]);

    if (stuFile) {
      state.students     = stuFile.content;
      state.sha.students = stuFile.sha;
      nextStudentId = Math.max(...state.students.map(s => s.id), 0) + 1;
    }
    if (resFile) {
      state.results     = resFile.content;
      state.sha.results = resFile.sha;
      nextResultId = Math.max(...state.results.map(r => r.id), 0) + 1;
    }

    if (!stuFile && !resFile) {
      showToast('No data found in repo. Push to create files.', 'info');
    } else {
      showToast('Pulled latest data from GitHub!', 'success');
    }

    renderSection(currentSection());
    clearUnsaved();
  } catch (e) {
    showToast(`Pull failed: ${e.message}`, 'error');
  }
  showSyncing(false);
}

// ─── Sync: Push to GitHub ──────────────────────────────────────────────────────
async function pushToGitHub() {
  if (!state.github.token) {
    showToast('Configure GitHub first.', 'error');
    openGithubConfig();
    return;
  }
  showSyncing(true);
  const ts = new Date().toISOString().slice(0, 16).replace('T', ' ');
  try {
    const [newStuSha, newResSha] = await Promise.all([
      ghPutFile(
        'db/students.json',
        state.students,
        state.sha.students,
        `chore: update student records [${ts}]`
      ),
      ghPutFile(
        'db/results.json',
        state.results,
        state.sha.results,
        `chore: update result data [${ts}]`
      ),
    ]);
    state.sha.students = newStuSha;
    state.sha.results  = newResSha;

    showToast(`Pushed to ${state.github.owner}/${state.github.repo} ✓`, 'success');
    clearUnsaved();
  } catch (e) {
    showToast(`Push failed: ${e.message}`, 'error');
  }
  showSyncing(false);
}

function showSyncing(on) {
  const ind = $('sync-indicator');
  ind.style.display = on ? 'flex' : 'none';
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function currentSection() {
  const active = document.querySelector('.section.active');
  if (!active) return 'dashboard';
  return active.id.replace('sec-', '');
}

// ─── Persist to localStorage ───────────────────────────────────────────────────
function saveLocal() {
  localStorage.setItem('dbms_students', JSON.stringify(state.students));
  localStorage.setItem('dbms_results',  JSON.stringify(state.results));
}

function loadLocal() {
  try {
    const stu = localStorage.getItem('dbms_students');
    const res = localStorage.getItem('dbms_results');
    const ghc = localStorage.getItem('gh_config');

    if (stu) { state.students = JSON.parse(stu); nextStudentId = Math.max(...state.students.map(s => s.id), 0) + 1; }
    if (res) { state.results  = JSON.parse(res);  nextResultId  = Math.max(...state.results.map(r => r.id),  0) + 1; }
    if (ghc) {
      state.github = JSON.parse(ghc);
      updateGHStatus(true);
    }
  } catch (e) {
    console.warn('localStorage load error:', e);
  }
}

// Auto-save every 30 seconds
setInterval(saveLocal, 30000);

// ─── Init ──────────────────────────────────────────────────────────────────────
(function init() {
  loadLocal();

  // If no local data, use seed data
  if (!state.students.length) state.students = JSON.parse(JSON.stringify(SEED_STUDENTS));
  if (!state.results.length)  state.results  = JSON.parse(JSON.stringify(SEED_RESULTS));

  renderDashboard();

  // Marks preview listeners
  ['m-practical', 'm-internal', 'm-theory'].forEach(id => {
    const el = $(id);
    if (el) el.addEventListener('input', updateLivePreview);
  });
})();
