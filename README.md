# DBMS Result Management System

A fully client-side **Exam Result Management System** for the DBMS subject, built with Plain HTML, CSS, and JavaScript — with real **GitHub API integration** to persist data directly in a GitHub repository.

---

## Features

| Feature | Details |
|---|---|
| Student Records | Add / Edit / Delete students with roll, name, division, email, phone, PRN |
| Marks & Grades | Enter practical, internal, theory marks with live grade preview |
| Result Report | Ranked result sheet, grade distribution, score histogram |
| Analytics | Pass %, class average, highest/lowest scores |
| Search & Filter | Search by name/roll/grade + filter by exam, division, status, grade |
| GitHub Sync | Pull from & Push to GitHub repo using Contents API |
| CSV Export | One-click export of all results |
| Auto-save | Local storage backup every 30 seconds |

---

## Getting Started

### Option 1 — Open Directly (No Server Needed)

```bash
# Just open the file in any browser
open index.html
```

### Option 2 — Serve Locally

```bash
# Python
python3 -m http.server 5500

# Node.js
npx serve .

# Then open http://localhost:5500
```

---

## GitHub Integration Setup

The app stores all data as two JSON files inside your GitHub repo:

```
your-repo/
  db/
    students.json
    results.json
```

### Step 1 — Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repo (e.g., `dbms-results`)
3. Keep it **private** (recommended for student data)

### Step 2 — Generate a Personal Access Token (PAT)

1. Go to https://github.com/settings/tokens/new
2. Give it a name (e.g., `dbms-rms`)
3. Select **repo** scope (full control of private repositories)
4. Click **Generate token** and copy it

### Step 3 — Configure Inside the App

1. Click **GitHub Config** in the sidebar footer
2. Enter:
   - **Personal Access Token** — the token you just generated
   - **GitHub Username** — your GitHub username
   - **Repository Name** — the repo you created
   - **Branch** — `main` (default)
3. Click **Connect & Test** — it will verify the connection

### Step 4 — Pull & Push

- Click **Pull from GitHub** to load data from the repo
- After making changes, click **Push to GitHub** to save back
- The app auto-creates `db/students.json` and `db/results.json` on first push

---

## Grading Scale (University Pattern)

| Grade | Marks (%) |
|---|---|
| O (Outstanding) | 90 – 100 |
| A+ | 80 – 89 |
| A | 70 – 79 |
| B+ | 60 – 69 |
| B | 50 – 59 |
| C | 40 – 49 |
| F (Fail) | Below 40 |

---

## Mark Distribution

| Component | Maximum Marks |
|---|---|
| Practical | 25 |
| Internal | 25 |
| Theory | 50 |
| **Total** | **100** |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Fonts | IBM Plex Sans + IBM Plex Mono (Google Fonts) |
| Data Storage | GitHub Contents API (v3) + localStorage (offline backup) |
| Export | Blob API → CSV |
| Auth | GitHub Personal Access Token |

---

## File Structure

```
dbms-result-system/
├── index.html       — App shell, all sections and modals
├── style.css        — Design system (dark theme, IBM Plex fonts)
├── app.js           — All logic: state, CRUD, GitHub API, rendering
└── README.md        — This file
```

---

## Security Notes

- The PAT is stored in **localStorage** — do not use this on shared/public computers
- For production, consider a backend proxy to keep the token server-side
- Use a **fine-grained token** scoped only to the specific repo for best security

---

## License

MIT — Free to use and modify for educational purposes.
