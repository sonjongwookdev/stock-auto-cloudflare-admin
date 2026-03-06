# 🚀 빠른 시작 가이드 - 관리자 페이지 ↔ 백엔드 연결

## 1️⃣ 백엔드 시작하기 (3단계)

```bash
# 1. 백엔드 디렉토리로 이동
cd d:\stock-auto-api-backend

# 2. 환경 변수 설정 (.env 파일)
# .env 파일에 다음 내용 확인:
# - ADMIN_PASSWORD=woaskshQ1@
# - PORT=4000
# - NODE_ENV=development

# 3. 서버 시작
node server.js

# 예상 출력:
# Server running on port 4000
# [健健] DB initialized
# [INFO] System ready
```

## 2️⃣ 관리자 페이지 테스트 (2단계)

```bash
# 1. 연결 테스트 실행
cd d:\stock-auto-cloudflare-admin
node test-connection.js

# 2. 결과 확인
✅ 연결 정상 → 모든 테스트 통과
⚠️ 일부 오류 → 아래 문제 해결 섹션 참조
```

## 3️⃣ 주요 기능 확인

### API 엔드포인트

```bash
# 헬스체크
curl http://localhost:4000/healthz

# 로그인
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"woaskshQ1@"}'

# 시스템 상태 (로그인 필수)
curl http://localhost:4000/api/status \
  -H "Cookie: admin_session=1"

# 자동매매 상태
curl http://localhost:4000/api/trading/auto/status \
  -H "Cookie: admin_session=1"

# 잔고 조회 (KIS API 키 필수)
curl http://localhost:4000/api/trading/balance \
  -H "Cookie: admin_session=1"
```

## 🔧 문제 해결

### 문제 1: "연결 실패" 오류
```
✗ 연결 실패: connect ECONNREFUSED
```
**해결**:
```bash
# 1. 백엔드 서버가 실행 중인지 확인
ps aux | grep "node server.js"

# 2. 포트 4000이 사용 중인지 확인
netstat -an | findstr :4000

# 3. 방화벽 확인
# Windows: 방화벽에서 port 4000 허용

# 4. 서버 재시작
# 기존 프로세스 종료 후:
node server.js
```

### 문제 2: "인증 필요" (401) 오류
```
✗ 요청 실패: 401 - unauthorized
```
**해결**:
```bash
# 1. 로그인 후 쿠키 확인
curl -v -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"woaskshQ1@"}'

# 2. Set-Cookie 헤더 확인
# "Set-Cookie: admin_session=1; ..." 있어야 함

# 3. 쿠키 전달 테스트
curl http://localhost:4000/api/status \
  -H "Cookie: admin_session=1"
```

### 문제 3: CORS 오류
```
Access-Control-Allow-Origin 헤더 없음
```
**해결**:
```bash
# 1. OPTIONS 요청 테스트
curl -v -X OPTIONS http://localhost:4000/api/status

# 2. CORS 헤더 확인
# 다음 헤더가 있어야 함:
# - Access-Control-Allow-Origin: *
# - Access-Control-Allow-Credentials: true

# 3. 서버 재시작
node server.js
```

### 문제 4: "KIS API 미설정" 오류
```
잔고를 조회할 수 없습니다
```
**해결**:
```bash
# 1. KIS API 키 상태 확인
curl http://localhost:4000/api/kis/status \
  -H "Cookie: admin_session=1"

# 2. 응답 형식:
{
  "ok": true,
  "hasKisKeys": false,  // ← false면 키 필요
  "kisKeyPreview": null
}

# 3. 관리자 페이지에서 KIS 키 설정
# ⚙️ 설정 → 🔑 KIS API 키 교체
```

## 📊 정상 작동 확인

### 1단계: 기본 연결 확인
```bash
node test-connection.js
# 모든 테스트가 ✓ 또는 ⚠ 표시되어야 함
```

### 2단계: 로그인 확인
```javascript
// 브라우저 콘솔에서:
fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'woaskshQ1@' }),
  credentials: 'include'
})
.then(r => r.json())
.then(d => console.log(d))
// 예상: { ok: true }
```

### 3단계: 상태 조회 확인
```javascript
// 로그인 후:
fetch('http://localhost:4000/api/status', {
  credentials: 'include'
})
.then(r => r.json())
.then(d => console.log(d.dbStatus))
// 예상: "healthy" 또는 "unhealthy"
```

## 🎯 주요 수정 사항 요약

| 항목 | 이전 | 현재 | 링크 |
|------|------|------|------|
| 백엔드 URL | `__BACKEND_BASE__` | `globalThis.BACKEND_BASE_URL` | [src/index.js#L1608](src/index.js#L1608) |
| 상태 조회 API | `/status` | `/api/status` | [src/index.js#L1410](src/index.js#L1410) |
| 오류 로그 API | `/errors` | `/api/errors` | [src/index.js#L1953](src/index.js#L1953) |
| CORS 헤더 | 조건부 | 항상 설정 | [server.js#L26](server.js#L26) |
| 자동매매 주문 | 단일 경로 | 다중 경로 지원 | [server.js#L1520](server.js#L1520) |

## 📚 관련 문서

- [상세 검증 보고서](VALIDATION_REPORT.md)
- [통합 수정 보고서](INTEGRATION_REPORT.md)
- [테스트 스크립트](test-connection.js)

## 💡 팁

### 배포 전 체크리스트
- [ ] 로컬에서 모든 기능 테스트
- [ ] 환경 변수 (.env) 확인
- [ ] CORS 설정 확인
- [ ] 인증 쿠키 전달 확인
- [ ] 방화벽 포트 허용

### 성능 최적화
```javascript
// 쿠키 저장으로 반복 로그인 방지
localStorage.setItem('sessionCookie', 'admin_session=1')

// 자동 갱신 주기 조정 (관리자 페이지)
// ⚙️ 설정 → 💰 잔고 갱신 설정 → 원하는 주기 선택
```

### 디버깅
```bash
# 상세 로그 확인
set DEBUG=* && node server.js

# API 응답 형식 확인
curl -v http://localhost:4000/api/status

# 쿠키 상태 확인
curl -v -c cookies.txt http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"woaskshQ1@"}'
```

---

**마지막 업데이트**: 2026년 3월 5일  
**상태**: ✅ 모든 기능 검증 및 수정 완료
