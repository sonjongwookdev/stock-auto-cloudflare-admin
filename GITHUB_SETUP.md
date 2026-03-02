# 🚀 GitHub에 올리는 완벽 가이드

## 📋 사전 준비

### 1. GitHub 계정 확인
- GitHub 계정: `sonjongwookdev@gmail.com`
- 이미 로그인되어 있는지 확인

### 2. Git 설정
```bash
# Git 설치 확인
git --version

# Git 사용자 정보 설정 (처음 사용 시)
git config --global user.name "Your Name"
git config --global user.email "sonjongwookdev@gmail.com"
```

---

## 📝 Step 1: 로컬 Git 저장소 초기화

```bash
# stock-auto-cloudflare 디렉토리로 이동
cd d:\github\stock-auto-machine\stock-auto-cloudflare

# Git 저장소 초기화 (처음 한 번만)
git init

# 모든 파일 스테이징
git add .

# 초기 커밋
git commit -m "Initial commit: Cloudflare Admin for Stock Auto Trading"
```

**예상 출력:**
```
[main (root-commit) abc1234] Initial commit
 6 files changed, 1500 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 README.md
 create mode 100644 package.json
 create mode 100644 wrangler.toml
 create mode 100644 src/index.js
```

---

## 🌐 Step 2: GitHub에서 새 저장소 생성

### 옵션 A: 웹 브라우저에서 (쉬운 방법)

1. **GitHub 로그인**
   - https://github.com 접속
   - sonjongwookdev@gmail.com 로그인

2. **새 저장소 생성**
   - 우측 상단 `+` → `New repository` 클릭
   - 또는 직접: https://github.com/new

3. **저장소 설정**
   ```
   Repository name: stock-auto-cloudflare-admin
   Description: Cloudflare Workers Admin Panel for Stock Auto Trading
   
   Visibility: Public (공개) 또는 Private (비공개) 선택
   
   ☑️ Add a .gitignore: Skip (이미 있음)
   ☑️ Add a license: MIT
   
   → Create repository 클릭
   ```

4. **복사할 URL 확인**
   ```
   https://github.com/sonjongwookdev/stock-auto-cloudflare-admin.git
   ```

---

## 🔗 Step 3: 로컬 저장소를 GitHub에 연결

```bash
# 원격 저장소 추가
git remote add origin https://github.com/sonjongwookdev/stock-auto-cloudflare-admin.git

# 원격 저장소 확인
git remote -v
# 출력:
# origin  https://github.com/sonjongwookdev/stock-auto-cloudflare-admin.git (fetch)
# origin  https://github.com/sonjongwookdev/stock-auto-cloudflare-admin.git (push)
```

---

## 📤 Step 4: GitHub에 푸시

```bash
# 메인 브랜치로 이름 변경 (main이 없을 경우)
git branch -M main

# GitHub에 푸시
git push -u origin main
```

**로그인 프롬프트가 나타나면:**

- Windows: Personal Access Token 입력
  1. GitHub Settings → Developer settings → Personal access tokens
  2. "Tokens (classic)" → Generate new token
  3. Scopes: `repo`, `workflow` 체크
  4. 생성된 토큰 복사 후 붙여넣기

- Mac/Linux: SSH 키 설정 권장
  ```bash
  ssh-keygen -t ed25519 -C "sonjongwookdev@gmail.com"
  cat ~/.ssh/id_ed25519.pub  # 내용 복사
  # GitHub → Settings → SSH and GPG keys → New SSH key → 붙여넣기
  ```

---

## ✅ Step 5: 결과 확인

```bash
# 푸시 완료 확인
git log --oneline

# GitHub에서 확인
# https://github.com/sonjongwookdev/stock-auto-cloudflare-admin
```

GitHub 저장소에 다음이 보여야 합니다:
```
📁 .gitignore
📁 src/
   └─ index.js
📄 README.md
📄 package.json
📄 wrangler.toml
```

---

## 🔄 이후 더 이상 수정할 때

파일 수정 후 GitHub에 반영:

```bash
# 1. 수정된 파일 스테이징
git add .

# 2. 커밋
git commit -m "Fix: 관리자 페이지 디버깅"

# 3. 푸시
git push origin main
```

---

## 🆘 문제 해결

### "fatal: not a git repository"
```bash
# 해결: git 초기화 다시
git init
git add .
git commit -m "Initial commit"
```

### "permission denied (publickey)"
```bash
# SSH 키 설정 문제
# 방법 1: HTTPS 사용 (권장)
git remote set-url origin https://github.com/sonjongwookdev/stock-auto-cloudflare-admin.git
git push origin main

# 방법 2: SSH 키 생성
ssh-keygen -t ed25519 -C "sonjongwookdev@gmail.com"
# GitHub에 공개 키 등록
```

### "Updates were rejected because the remote contains work that you do not have locally"
```bash
# 원격 변경 사항 수신
git pull origin main
# 충돌 해결 후 다시 푸시
git push origin main
```

### "fatal: 'origin' does not appear to be a 'git' repository"
```bash
# 원격 저장소 재설정
git remote remove origin
git remote add origin https://github.com/sonjongwookdev/stock-auto-cloudflare-admin.git
git push -u origin main
```

---

## 📊 GitHub에서의 관리

### 저장소 설정

GitHub → Settings:

1. **General**
   - Description 추가
   - Homepage URL: (Cloudflare 배포 URL)

2. **Collaborators** (선택사항)
   - 다른 개발자 초대

3. **Secrets and variables**
   - `CLOUDFLARE_API_TOKEN` 추가 (GitHub Actions 자동 배포용)

### README 배지 추가 (선택사항)

```markdown
# Stock Auto Cloudflare Admin

[![GitHub](https://img.shields.io/badge/GitHub-sonjongwookdev-blue)](https://github.com/sonjongwookdev/stock-auto-cloudflare-admin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
```

---

## 🎯 다음 단계

### Cloudflare에 배포

GitHub에 올린 후:

```bash
# 로컬에서 배포
npm run deploy

# 또는 GitHub Actions로 자동 배포 설정
# .github/workflows/deploy.yml 생성
```

### 버전 태그 생성

```bash
# 버전 태그 생성
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0

# GitHub Releases에서 보임
```

---

## 📚 유용한 명령어

```bash
# 상태 확인
git status

# 변경 이력 보기
git log --oneline

# 마지막 커밋 수정
git commit --amend -m "New message"

# 특정 파일 변경 보기
git diff src/index.js

# 커밋 되돌리기
git revert [commit-hash]

# 브랜치 생성 (개발용)
git checkout -b feature/new-feature
git push origin feature/new-feature
# → Pull Request 생성
```

---

## ✨ 완성!

```
✅ 로컬 Git 저장소 초기화
✅ GitHub 저장소 생성
✅ 원격 저장소 연결
✅ GitHub에 푸시
✅ 코드 공개 🎉
```

**GitHub 저장소 링크:**
```
https://github.com/sonjongwookdev/stock-auto-cloudflare-admin
```

---

**축하합니다! 이제 Cloudflare 관리자 페이지가 GitHub에 올라갔습니다! 🚀**
