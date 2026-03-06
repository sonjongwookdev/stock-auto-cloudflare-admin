# 관리자 페이지 ↔ 백엔드 연결 검증 보고서

## 📋 검증 날짜
2026년 3월 5일

## 🔴 심각한 문제 (Critical Issues)

### 1. **백엔드 URL 플레이스홀더 미설정**
- **위치**: [src/index.js](src/index.js#L1600-L1650) 라인 1600쯤
- **문제**: `const BACKEND_BASE = '__BACKEND_BASE__'` 로 하드코딩되어 있음
- **영향**: 프로덕션 배포 시 API 호출이 실패함
- **현재 우회**: 로컬호스트 감지 후 `http://localhost:4000` 사용
  ```javascript
  let fullUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:4000' + apiPath
    : BACKEND_BASE + apiPath
  ```

### 2. **일치하지 않는 API 엔드포인트**
- **관리자 페이지에서 호출하는 API**: `/api/trading/balance`
- **백엔드 제공 엔드포인트**: 존재하지 않음 ❌
- **영향**: 상단 헤더의 "💰 잔고" 정보가 표시되지 않음
- **라인**: [src/index.js](src/index.js#L1700-L1730) 라인 1700쯤

### 3. **API 경로 불일치**
백엔드에서는 다중 경로로 같은 엔드포인트를 제공하고 있음:
```javascript
app.get(['/status', '/api/status'], ...)  // 둘 다 가능
app.get(['/trading/status', '/api/trading/status'], ...)  // 둘 다 가능
```
관리자 페이지는 `/api` 접두사를 자동 추가하는 로직이 있어 중복 호출 가능

### 4. **인증 쿠키 전달 문제**
- **Cloudflare Workers 환경**: httpOnly 쿠키가 Worker-to-Backend 간 전달되지 않음
- **현재 코드**: `credentials: 'include'` 설정되어 있음
- **문제**: Cloudflare 도메인 → localhost (또는 다른 도메인) API 호출 시 CORS + 쿠키 문제
- **라인**: [src/index.js](src/index.js#L1665)

## 🟡 경고 (Warnings)

### 5. **API 재시도 로직과 Cloudflare Workers의 타임아웃**
- **관리자 페이지**: 최대 5회 재시도, 지수 백오프 (500ms → 10s)
- **문제**: Cloudflare Workers의 요청 타임아웃(30초)과 충돌 가능
- **라인**: [src/index.js](src/index.js#L1640-L1670)

### 6. **백엔드의 CORS 정책**
```javascript
if (origin) {
  res.header('Access-Control-Allow-Origin', origin)
  res.header('Access-Control-Allow-Credentials', 'true')
}
```
- **문제**: `origin` 없이 요청하면 CORS 헤더가 없음
- **영향**: 크로스 도메인 요청 시 오류 가능

### 7. **잔고 조회 함수 미구현**
- **함수명**: `loadBalance()` 
- **호출**: [src/index.js](src/index.js#L1720)
- **백엔드 엔드포인트**: 없음 ❌
- **현재 상태**: 함수가 정의되지 않아 `ReferenceError` 발생 가능

### 8. **자동매매 상태 조회 불일치**
- **관리자 페이지**: `/api/auto-trade/status` 또는 유사 호출 예상
- **백엔드 제공**: `/api/trading/auto-trade/start`, `/api/trading/auto-trade/stop` 등
- **불일치**: 엔드포인트 경로 명확하지 않음

## ✅ 정상 항목

- ✓ 로그인 인증 로직: `/api/auth/login`, `/api/auth/logout` 일치
- ✓ KIS API 키 설정: `/api/kis/status`, `/api/kis/update` 일치
- ✓ 시스템 상태 조회: `/api/status` 일치
- ✓ CORS 정책: 기본적으로 설정됨

## 📊 문제 심각도 분석

| 우선순위 | 문제 | 심각도 | 영향도 |
|---------|------|--------|--------|
| 1 | 백엔드 URL 플레이스홀더 | 높음 | 높음 |
| 2 | `/api/trading/balance` 미제공 | 높음 | 중간 |
| 3 | 인증 쿠키 전달 | 높음 | 높음 |
| 4 | API 재시도 로직 타임아웃 | 중간 | 중간 |
| 5 | 잔고 조회 함수 | 높음 | 중간 |
| 6 | 자동매매 상태 조회 | 중간 | 중간 |

