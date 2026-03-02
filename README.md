# 🚀 Stock Auto Cloudflare Admin

자동매매 시스템의 관리자 페이지입니다. **Cloudflare Workers**에서 실행됩니다.

## ✨ 기능

### 관리자 페이지 (`/admin`)

- ✅ **로그인/로그아웃**: 관리자 인증
- 📊 **상위종목 선택**: 6가지 기준 (거래량순, 상승순, 변동성순, 갭순, 모멘텀순, 광폭추세순)
- 🎯 **전략 관리**: 단일 전략 선택 및 활성화
- 📈 **성공률 추적**: 전략별 승률, ROI, 손익비 실시간 표시
- 🔄 **포지션 관리**: 현재 보유 종목 및 손익률
- 💰 **잔고 조회**: 총자산, 현금, 미실현 손익
- 📋 **거래 로그**: 거래 이력 및 에러 로그
- 🏥 **시스템 건강**: 자동매매 사이클 성공률 모니터링
- 🎮 **수동 제어**: 즉시 사이클 실행, 포지션 강제 청산 등

### API 프록시 (`/api/*`)

백엔드 API 호출을 프록시합니다. CORS 문제 없음.

---

## 🛠️ 설치 및 배포

### 1️⃣ 사전 준비

```bash
# Node.js 18+ 설치 확인
node --version

# Cloudflare 계정 생성 (https://dash.cloudflare.com)
```

### 2️⃣ 로컬 개발

```bash
# 저장소 클론
git clone https://github.com/sonjongwookdev/stock-auto-cloudflare.git
cd stock-auto-cloudflare

# 의존성 설치
npm install

# 로컬 개발 서버 시작
npm run dev
# → http://localhost:8787 에서 실행됨
```

### 3️⃣ 환경 설정

#### `.env.local` 파일 생성 (로컬 개발용)

```bash
# .env.local
BACKEND_BASE_URL=http://localhost:4000
```

#### `wrangler.toml` 설정 (Cloudflare 배포용)

```toml
name = "stock-auto-cloudflare-admin"
main = "src/index.js"
compatibility_date = "2026-03-02"

[vars]
BACKEND_BASE_URL = "https://api.yourdomain.com"  # 운영 서버 주소
```

### 4️⃣ Cloudflare에 배포

**첫 배포:**

```bash
# Cloudflare 로그인
npm run wrangler login
# 브라우저에서 로그인하면 자동으로 인증됨

# 배포
npm run deploy
```

**배포 후 URL:**

```
https://stock-auto-cloudflare-admin.<your-account>.workers.dev/admin
```

**도메인 연결** (선택사항):

```toml
# wrangler.toml에 추가
[env.production]
route = "admin.yourdomain.com/*"
zone_id = "your-zone-id"

# 배포 시
npm run deploy -- --env production
```

---

## 🔐 보안

### 관리자 페이지 보호

**Option A: Cloudflare Access (권장)**

1. Cloudflare Dashboard → `Access` → `Applications`
2. 새 애플리케이션 추가
   - Domain: `admin.yourdomain.com`
   - Authentication: Email OTP / Google / GitHub 등
3. Policy 설정: 승인된 이메일만 접근

**Option B: 기본 인증**

```bash
# wrangler.toml 추가
[env.production]
vars = { ADMIN_PASSWORD = "your-secure-password-hash" }
```

### 환경변수 보안

민감한 정보는 `wrangler secret`으로 관리:

```bash
# 백엔드 API 키 설정
npm run wrangler secret put BACKEND_API_KEY
# 프롬프트에 입력

# 배포
npm run deploy
```

---

## 📝 사용 방법

### 로그인

```
URL: https://admin.yourdomain.com/admin
아이디: admin
비밀번호: [.env 파일의 ADMIN_PASSWORD]
```

### 상위종목 선택 및 전략 활성화

1. **국내/해외 탭 선택**
2. **상위종목 기준 선택** (드롭다운)
   - 📊 거래량순
   - 📈 상승순
   - ⚡ 변동성순
   - 🔝 갭 상승순
   - 🚀 모멘텀순
   - 💪 광폭 추세순
3. **"탭 상위 종목 조회"** 버튼 클릭
4. **"전략 불러오기"** 클릭
5. **라디오 버튼으로 전략 선택** (성공률 표시됨)
6. **"전략 활성화"** 클릭

→ **다음 자정(00:00)에 선택된 전략으로 자동매매 시작**

### 시스템 모니터링

- **🏥 건강 상태**: 사이클별 성공률, API 에러 누적
- **📋 거래 로그**: 최근 100개 거래 기록 (역순)
- **💰 잔고**: 총자산, 현금, 미실현 손익
- **📊 포지션**: 현재 보유 종목 및 손익

---

## 🔧 관리자 페이지 커스터마이징

### 백엔드 URL 변경

**로컬:**
```javascript
// src/index.js 상단
const BACKEND_BASE = 'http://your-backend:4000'
```

**운영:**
```toml
# wrangler.toml
[vars]
BACKEND_BASE_URL = "https://api.yourdomain.com"
```

### 색상/레이아웃 수정

```javascript
// src/index.js에서 CSS 수정
.login-card {
  background: white;
  border-radius: 16px;
  /* ... */
}
```

---

## 📚 API 엔드포인트

관리자 페이지는 다음 백엔드 API를 사용합니다:

| 엔드포인트 | 메서드 | 설명 |
|-----------|--------|------|
| `/api/markets/ranking-criteria` | GET | 상위종목 기준 목록 |
| `/api/markets/domestic/top-by-criteria` | GET | 국내 상위종목 |
| `/api/markets/overseas/top-by-criteria` | GET | 해외 상위종목 |
| `/api/strategies/stats` | GET | 전략별 성공률 |
| `/api/strategies/active` | GET | 활성 전략 조회 |
| `/api/strategies/activate-single` | POST | 전략 활성화 |
| `/api/trading/balance` | GET | 잔고 조회 |
| `/api/trading/positions` | GET | 포지션 조회 |
| `/api/trading/logs` | GET | 거래 로그 |
| `/api/trading/health` | GET | 시스템 건강 |
| `/api/trading/run-cycle-v2` | POST | 수동 사이클 실행 |

---

## 🐛 트러블슈팅

### "Cannot connect to backend"

```bash
# 1. 백엔드 서버 실행 확인
curl http://localhost:4000/api/health

# 2. wrangler.toml의 BACKEND_BASE_URL 확인
# 3. Cloudflare Workers 환경변수 재설정
npm run wrangler secret delete BACKEND_BASE_URL
npm run wrangler secret put BACKEND_BASE_URL
```

### "Login failed"

```bash
# 1. 관리자 계정 확인 (기본값: admin/admin)
# 2. 쿠키 삭제 후 재시도
# 3. 네트워크 탭에서 로그인 요청 확인
```

### "Insufficient balance"

```bash
# 백엔드 거래 상태 확인
curl http://localhost:4000/api/trading/balance \
  -H "Cookie: admin_session=1"
```

---

## 📊 아키텍처

```
┌─────────────────────────────────────────┐
│      Cloudflare Workers                  │
│     (stock-auto-cloudflare-admin)        │
├─────────────────────────────────────────┤
│                                         │
│  ✓ 관리자 페이지 (HTML/CSS/JS)          │
│  ✓ API 프록시                           │
│  ✓ 인증 관리                            │
│                                         │
└────────────┬────────────────────────────┘
             │
       ↓ API 호출
             │
┌─────────────────────────────────────────┐
│    Express.js 백엔드                     │
│  (stock-auto-api-backend)               │
├─────────────────────────────────────────┤
│  ✓ KIS API 통합                         │
│  ✓ 자동매매 엔진                        │
│  ✓ 전략 관리                            │
└────────────┬────────────────────────────┘
             │
       ↓ 거래 실행
             │
┌─────────────────────────────────────────┐
│  한국투자증권 (KIS) API                  │
└─────────────────────────────────────────┘
```

---

## 📦 배포 자동화 (선택사항)

**GitHub Actions를 통한 자동 배포:**

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## 📞 지원

문제가 발생하면:

1. GitHub Issues에서 검색
2. 새 Issue 생성 (스크린샷 포함)
3. 문제 현상, 재현 방법, 시스템 정보 제공

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

---

## 🎯 다음 단계

- [ ] GitHub에 리포지토리 생성 및 푸시
- [ ] Cloudflare Workers 배포
- [ ] Cloudflare Access로 보안 설정
- [ ] 백엔드 API 주소 설정
- [ ] 관리자 페이지 접속 테스트
- [ ] 첫 자동매매 실행

**Happy Trading! 🚀**
