const BASE_URL = typeof globalThis !== 'undefined' && globalThis.BACKEND_BASE_URL
  ? globalThis.BACKEND_BASE_URL
  : process.env.BACKEND_BASE_URL || 'http://localhost:4000';
const ORIGIN = 'https://stock-auto-cloudflare-admin.sonjongwook123.workers.dev';

async function testSingleEndpoint(method, path, body = null, timeout = 3000) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    
    const options = {
      method: method || 'GET',
      headers: {
        'Origin': ORIGIN,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    };
    
    if (body) options.body = JSON.stringify(body);
    if (typeof cookie !== 'undefined') options.headers.Cookie = cookie;
    
    const start = Date.now();
    const res = await fetch(`${BASE_URL}${path}`, options);
    const elapsed = Date.now() - start;
    
    clearTimeout(timer);
    
    let response = 'OK';
    try {
      response = await res.json();
    } catch { response = await res.text(); }
    
    return { status: res.status, time: elapsed, response: JSON.stringify(response).substring(0, 80) };
  } catch (e) {
    return { error: e.name === 'AbortError' ? 'TIMEOUT' : e.message };
  }
}

async function diagnosticTest() {
  console.log('🔧 엔드포인트 진단 - 각 요청 시간 측정\n');
  
  let cookie = '';
  
  // 로그인
  console.log('1️⃣ 로그인 테스트 (timeout: 5초)');
  let res = await testSingleEndpoint('POST', '/api/auth/login', { password: 'woaskshQ1@' }, 5000);
  console.log(`   ${res.error ? '✗ ' + res.error : '✓ ' + res.status + ' (' + res.time + 'ms)'}`);
  
  if (!res.error && res.status === 200) {
    // 쿠키 얻기
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': ORIGIN },
      body: JSON.stringify({ password: 'woaskshQ1@' })
    });
    const setCookie = loginRes.headers.get('set-cookie');
    cookie = setCookie ? setCookie.split(';')[0] : '';
    
    console.log(`\n2️⃣ GET 엔드포인트 진단 (각 3초 타임아웃)`);
    const getTests = [
      '/api/auth/init-check',
      '/api/trading/auto/status',
      '/api/trading/balance',
      '/api/trading/dashboard-overview',
      '/api/kis/status',
      '/api/errors',
      '/api/status'
    ];
    
    for (const path of getTests) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);
      try {
        const start = Date.now();
        const res = await fetch(`${BASE_URL}${path}`, {
          headers: { 'Origin': ORIGIN, 'Cookie': cookie },
          signal: controller.signal
        });
        const time = Date.now() - start;
        clearTimeout(timer);
        
        console.log(`   ${path}: ✓ ${res.status} (${time}ms)`);
      } catch (e) {
        clearTimeout(timer);
        console.log(`   ${path}: ${e.name === 'AbortError' ? '⏱️ TIMEOUT' : '❌ ' + e.message}`);
      }
    }
    
    console.log(`\n3️⃣ POST 엔드포인트 진단 (각 5초 타임아웃)`);
    const postTests = [
      { path: '/api/auth/logout', body: {} },
    ];
    
    for (const test of postTests) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      try {
        const start = Date.now();
        const res = await fetch(`${BASE_URL}${test.path}`, {
          method: 'POST',
          headers: { 'Origin': ORIGIN, 'Cookie': cookie, 'Content-Type': 'application/json' },
          body: JSON.stringify(test.body),
          signal: controller.signal
        });
        const time = Date.now() - start;
        clearTimeout(timer);
        
        console.log(`   ${test.path}: ✓ ${res.status} (${time}ms)`);
      } catch (e) {
        clearTimeout(timer);
        console.log(`   ${test.path}: ${e.name === 'AbortError' ? '⏱️ TIMEOUT' : '❌ ' + e.message}`);
      }
    }
    
    console.log(`\n⚠️ 느린 엔드포인트 진단 (각 15초 타임아웃)`);
    const slowTests = [
      { path: '/api/trading/auto/start', method: 'POST', body: { market: 'domestic' } },
      { path: '/api/trading/auto/stop-all', method: 'POST', body: {} }
    ];
    
    // 새로운 세션 필요 (로그아웃했을 수 있음)
    const newLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Origin': ORIGIN },
      body: JSON.stringify({ password: 'woaskshQ1@' })
    });
    const newCookie = newLoginRes.headers.get('set-cookie');
    cookie = newCookie ? newCookie.split(';')[0] : cookie;
    
    for (const test of slowTests) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      try {
        const start = Date.now();
        const res = await fetch(`${BASE_URL}${test.path}`, {
          method: test.method || 'GET',
          headers: { 'Origin': ORIGIN, 'Cookie': cookie, 'Content-Type': 'application/json' },
          body: test.body ? JSON.stringify(test.body) : undefined,
          signal: controller.signal
        });
        const time = Date.now() - start;
        clearTimeout(timer);
        
        const data = await res.json();
        console.log(`   ${test.path}: ✓ ${res.status} (${time}ms) - ok: ${data.ok}`);
      } catch (e) {
        clearTimeout(timer);
        console.log(`   ${test.path}: ${e.name === 'AbortError' ? '⏱️ TIMEOUT' : '❌ ' + e.message}`);
      }
    }
  }
  
  console.log('\n✅ 진단 완료');
}

diagnosticTest();
