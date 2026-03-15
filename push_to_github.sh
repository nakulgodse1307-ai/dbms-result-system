#!/bin/bash
# ═══════════════════════════════════════════════════
#  DBMS Result Management System — GitHub Push Script
#  Run this once to push your project to GitHub
# ═══════════════════════════════════════════════════

set -e

# ── COLOURS ──────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m' # No Colour

echo ""
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}   DBMS Result System — GitHub Push Script${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# ── CHECK GIT IS INSTALLED ────────────────────────────
if ! command -v git &> /dev/null; then
  echo -e "${RED}✗ Git is not installed.${NC}"
  echo -e "  Download it from: ${CYAN}https://git-scm.com/downloads${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Git is installed:${NC} $(git --version)"

# ── PROMPT FOR DETAILS ────────────────────────────────
echo ""
echo -e "${YELLOW}Enter your GitHub details:${NC}"
echo ""

read -p "  GitHub Username       : " GH_USER
read -p "  Repository Name       : " GH_REPO
read -p "  Your Full Name (Git)  : " GIT_NAME
read -p "  Your Email (Git)      : " GIT_EMAIL
read -p "  Branch (default: main): " GH_BRANCH
GH_BRANCH=${GH_BRANCH:-main}

echo ""
echo -e "${YELLOW}Review:${NC}"
echo -e "  Repo URL : ${CYAN}https://github.com/${GH_USER}/${GH_REPO}.git${NC}"
echo -e "  Branch   : ${CYAN}${GH_BRANCH}${NC}"
echo -e "  Identity : ${CYAN}${GIT_NAME} <${GIT_EMAIL}>${NC}"
echo ""
read -p "  Proceed? (y/n): " CONFIRM
if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
  echo -e "${RED}Aborted.${NC}"
  exit 0
fi

# ── CONFIGURE GIT IDENTITY ────────────────────────────
echo ""
echo -e "${CYAN}► Configuring Git identity...${NC}"
git config --global user.name  "$GIT_NAME"
git config --global user.email "$GIT_EMAIL"
echo -e "${GREEN}  ✓ Identity set${NC}"

# ── INIT REPO IF NEEDED ───────────────────────────────
if [ ! -d ".git" ]; then
  echo -e "${CYAN}► Initializing Git repository...${NC}"
  git init
  echo -e "${GREEN}  ✓ Initialized${NC}"
else
  echo -e "${GREEN}✓ Git repository already initialized${NC}"
fi

# ── STAGE ALL FILES ───────────────────────────────────
echo -e "${CYAN}► Staging project files...${NC}"
git add .
STAGED=$(git diff --cached --name-only | wc -l | tr -d ' ')
echo -e "${GREEN}  ✓ ${STAGED} file(s) staged${NC}"
git diff --cached --name-only | while read f; do echo "    + $f"; done

# ── COMMIT ───────────────────────────────────────────
echo -e "${CYAN}► Creating commit...${NC}"
git commit -m "Initial commit: DBMS Result Management System" 2>/dev/null || {
  echo -e "${YELLOW}  ⚠ Nothing new to commit (already committed)${NC}"
}

# ── SET REMOTE ────────────────────────────────────────
echo -e "${CYAN}► Setting remote origin...${NC}"
REMOTE_URL="https://github.com/${GH_USER}/${GH_REPO}.git"
if git remote get-url origin &> /dev/null; then
  git remote set-url origin "$REMOTE_URL"
  echo -e "${GREEN}  ✓ Remote updated to: ${REMOTE_URL}${NC}"
else
  git remote add origin "$REMOTE_URL"
  echo -e "${GREEN}  ✓ Remote added: ${REMOTE_URL}${NC}"
fi

# ── RENAME BRANCH ─────────────────────────────────────
git branch -M "$GH_BRANCH"

# ── PUSH ──────────────────────────────────────────────
echo -e "${CYAN}► Pushing to GitHub...${NC}"
echo -e "${YELLOW}  (GitHub will ask for your username & password/PAT)${NC}"
echo ""
git push -u origin "$GH_BRANCH"

# ── SUCCESS ───────────────────────────────────────────
echo ""
echo -e "${BOLD}${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${GREEN}  ✓ Project successfully pushed to GitHub!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${BOLD}Repo URL:${NC}   https://github.com/${GH_USER}/${GH_REPO}"
echo -e "  ${BOLD}Pages URL:${NC}  https://${GH_USER}.github.io/${GH_REPO}/"
echo ""
echo -e "${YELLOW}  Next steps:${NC}"
echo -e "  1. Open ${CYAN}index.html${NC} in your browser"
echo -e "  2. Click ${CYAN}GitHub Config${NC} in the sidebar"
echo -e "  3. Enter your PAT token and repo details"
echo -e "  4. Click ${CYAN}Push to GitHub${NC} to save your data"
echo ""
echo -e "  Generate a PAT at: ${CYAN}https://github.com/settings/tokens/new${NC}"
echo ""
