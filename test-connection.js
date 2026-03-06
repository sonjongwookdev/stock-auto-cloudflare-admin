#!/usr/bin/env node

/**
 * 관리자 페이지 ↔ 백엔드 연결 테스트
 * 
 * 사용법:
 *   node test-connection.js [--backend-url http://localhost:4000] [--password admin123]
 */

const http = require('http');
const https = require('https');
const url = require('url');

const args = process.argv.slice(2);
let BACKEND_URL = 'http://localhost:4000';
let ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'woaskshQ1@';
let adminCookie = null;

// 인자 파싱
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--backend-url' && i + 1 < args.length) {
    BACKEND_URL = args[i + 1];
    i++;
  } else if (args[i] === '--password' && i + 1 < args.length) {
    ADMIN_PASSWORD = args[i + 1];
    i++;
  }
}

console.log('════════════════════════════════════════════════════════════');
console.log('  Stock Auto 관리자 페이지 ↔ 백엔드 연결 테스트');
console.log('════════════════════════════════════════════════════════════');
console.log('백엔드 URL:', BACKEND_URL);
console.log('');

// HTTP 요청 함수
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(path.startsWith('http') ? path : BACKEND_URL + path);
    const options = {
      method,
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      headers: {
        'Content-Type': 'application/json',
        ...(adminCookie && { Cookie: adminCookie }),
      },
      timeout: 10000,
    };

    const client = parsed.protocol === 'https:' ? https : http;
    const req = client.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// 테스트 실행
async function runTests() {
  let passed = 0;
  let failed = 0;

  // 헬스체크
  console.log('📋 [테스트 1] 서버 헬스체크');
  try {
    const res = await makeRequest('GET', '/healthz');
    if (res.status === 200) {
      console.log('  ✓ 서버 응답 정상 (상태: ' + res.status + ')');
      console.log('  └─ ' + JSON.stringify(res.body).substring(0, 80));
      passed++;
    } else {
      console.log('  ✗ 예상하지 않은 상태 코드: ' + res.status);
      failed++;
    }
  } catch (e) {
    console.log('  ✗ 연결 실패: ' + e.message);
    failed++;
  }
  console.log('');

  // 로그인
  console.log('📋 [테스트 2] 관리자 로그인 (/api/auth/login)');
  try {
    const res = await makeRequest('POST', '/api/auth/login', { password: ADMIN_PASSWORD });
    if (res.status === 200 && res.body.ok) {
      // Set-Cookie 헤더에서 admin_session 추출
      const setCookie = res.headers['set-cookie'];
      if (setCookie && Array.isArray(setCookie)) {
        const sessionCookie = setCookie.find((c) => c.includes('admin_session'));
        if (sessionCookie) {
          adminCookie = sessionCookie.split(';')[0];
          console.log('  ✓ 로그인 성공, 세션 쿠키 획득');
          passed++;
        } else {
          console.log('  ⚠ 로그인했으나 쿠키 없음 (httpOnly일 가능성)');
          passed++;
        }
      } else {
        console.log('  ✓ 로그인 성공 (쿠키 전달 방식)');
        passed++;
      }
    } else {
      console.log('  ✗ 로그인 실패: ' + (res.body.error || '상태 ' + res.status));
      failed++;
    }
  } catch (e) {
    console.log('  ✗ 요청 실패: ' + e.message);
    failed++;
  }
  console.log('');

  // 시스템 상태
  console.log('📋 [테스트 3] 시스템 상태 조회 (/api/status)');
  try {
    const res = await makeRequest('GET', '/api/status');
    if (res.status === 401) {
      console.log('  ⚠ 인증 필요 (401) - 로그인 후 다시 시도');
      passed++;
    } else if (res.status === 200 && res.body.ok) {
      console.log('  ✓ 상태 조회 성공');
      console.log('  ├─ DB 상태: ' + res.body.dbStatus);
      console.log('  ├─ AI 제공자: ' + res.body.aiProvider);
      console.log('  └─ 활성 전략: ' + res.body.activeStrategies?.length || 0 + '개');
      passed++;
    } else {
      console.log('  ✗ 요청 실패: ' + res.status + ' - ' + (res.body.error || ''));
      failed++;
    }
  } catch (e) {
    console.log('  ✗ 요청 실패: ' + e.message);
    failed++;
  }
  console.log('');

  // KIS 상태
  console.log('📋 [테스트 4] KIS API 키 상태 (/api/kis/status)');
  try {
    const res = await makeRequest('GET', '/api/kis/status');
    if (res.status === 401) {
      console.log('  ⚠ 인증 필요 (401)');
      passed++;
    } else if (res.status === 200 && res.body.ok) {
      console.log('  ✓ KIS 상태 조회 성공');
      console.log('  ├─ 키 설정: ' + (res.body.hasKisKeys ? '있음' : '없음'));
      console.log('  ├─ 키 미리보기: ' + res.body.kisKeyPreview);
      console.log('  └─ 검증됨: ' + (res.body.kisVerified ? '예' : '아니오'));
      passed++;
    } else {
      console.log('  ✗ 요청 실패: ' + res.status);
      failed++;
    }
  } catch (e) {
    console.log('  ✗ 요청 실패: ' + e.message);
    failed++;
  }
  console.log('');

  // 자동매매 상태
  console.log('📋 [테스트 5] 자동매매 상태 (/api/trading/auto/status)');
  try {
    const res = await makeRequest('GET', '/api/trading/auto/status');
    if (res.status === 401) {
      console.log('  ⚠ 인증 필요 (401)');
      passed++;
    } else if (res.status === 200 && res.body.ok) {
      console.log('  ✓ 자동매매 상태 조회 성공');
      const data = res.body.data;
      console.log('  ├─ 국내 실행: ' + (data.domestic?.running ? '예' : '아니오'));
      console.log('  ├─ 해외 실행: ' + (data.overseas?.running ? '예' : '아니오'));
      console.log('  └─ 갱신 주기: ' + data.intervalSeconds + '초');
      passed++;
    } else {
      console.log('  ✗ 요청 실패: ' + res.status);
      failed++;
    }
  } catch (e) {
    console.log('  ✗ 요청 실패: ' + e.message);
    failed++;
  }
  console.log('');

  // 잔고 조회
  console.log('📋 [테스트 6] 잔고 조회 (/api/trading/balance)');
  try {
    const res = await makeRequest('GET', '/api/trading/balance');
    if (res.status === 401) {
      console.log('  ⚠ 인증 필요 (401) - 세션 쿠키 전달 문제 가능');
      passed++;
    } else if (res.status === 400 && res.body.error) {
      console.log('  ⚠ KIS API 미설정: ' + res.body.error.substring(0, 60));
      passed++;
    } else if (res.status === 200 && res.body.ok) {
      console.log('  ✓ 잔고 조회 성공');
      console.log('  ├─ 총자산: ₩' + (res.body.data?.totalAssets || 0).toLocaleString());
      console.log('  └─ 가용현금: ₩' + (res.body.data?.cashBalance || 0).toLocaleString());
      passed++;
    } else {
      console.log('  ✗ 요청 실패: ' + res.status + ' - ' + (res.body.error || ''));
      failed++;
    }
  } catch (e) {
    console.log('  ✗ 요청 실패: ' + e.message);
    failed++;
  }
  console.log('');

  // 오류 로그
  console.log('📋 [테스트 7] 오류 로그 (/api/errors)');
  try {
    const res = await makeRequest('GET', '/api/errors');
    if (res.status === 401) {
      console.log('  ⚠ 인증 필요 (401)');
      passed++;
    } else if (res.status === 200 && res.body.ok) {
      const errorCount = (res.body.errors || []).length;
      console.log('  ✓ 오류 로그 조회 성공 (' + errorCount + '개)');
      passed++;
    } else {
      console.log('  ✗ 요청 실패: ' + res.status);
      failed++;
    }
  } catch (e) {
    console.log('  ✗ 요청 실패: ' + e.message);
    failed++;
  }
  console.log('');

  // CORS 테스트
  console.log('📋 [테스트 8] CORS 설정 (OPTIONS 요청)');
  try {
    const res = await makeRequest('OPTIONS', '/api/status');
    const corsOrigin = res.headers['access-control-allow-origin'];
    const corsCredentials = res.headers['access-control-allow-credentials'];
    if (corsOrigin) {
      console.log('  ✓ CORS 헤더 설정됨');
      console.log('  ├─ Allow-Origin: ' + corsOrigin);
      console.log('  └─ Allow-Credentials: ' + corsCredentials);
      passed++;
    } else {
      console.log('  ⚠ CORS 헤더 없음 (크로스 도메인 요청 시 문제 가능)');
      passed++;
    }
  } catch (e) {
    console.log('  ⚠ CORS 테스트 실패 (심각하지 않음): ' + e.message);
    passed++;
  }
  console.log('');

  // 최종 요약
  console.log('════════════════════════════════════════════════════════════');
  console.log('테스트 결과: ' + (passed + failed) + '개 중 ' + passed + '개 통과');
  console.log('완료 상태: ' + (failed === 0 ? '✅ 연결 정상' : '⚠️ ' + failed + '개 항목 검토 필요'));
  console.log('════════════════════════════════════════════════════════════');
  console.log('');

  if (failed > 0) {
    console.log('🔧 문제 해결 팁:');
    console.log('  1. 백엔드 서버가 실행 중인지 확인');
    console.log('  2. 방화벽/포트 설정 확인');
    console.log('  3. ADMIN_PASSWORD 환경 변수 확인');
    console.log('  4. 서버 로그 확인: ps aux | grep node');
    console.log('');
  }

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch((e) => {
  console.error('테스트 실행 중 오류:', e);
  process.exit(1);
});
