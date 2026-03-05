const BASE_URL = 'https://eight-poets-hug.loca.lt';
const ORIGIN = 'https://stock-auto-cloudflare-admin.sonjongwook123.workers.dev';

async function testEndpoints() {
  console.log('🚀 엔드포인트 검증\n');
  
  const results = {};
  let cookie = '';
  
  try {
    // 로그인
    console.log('1️⃣ 로그인 (POST /api/auth/login)');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': ORIGIN
      },
      body: JSON.stringify({ password: 'woaskshQ1@' })
    });
    const login = await loginRes.json();
    results.login = { status: loginRes.status, ok: login.ok };
    console.log(`   상태: ${loginRes.status}, ok: ${login.ok}`);
    
    const setCookie = loginRes.headers.get('set-cookie');
    cookie = setCookie ? setCookie.split(';')[0] : '';
    console.log(`   쿠키: ${cookie ? '✓ 있음' : '✗ 없음'}\n`);
    
    // GET 엔드포인트들
    const getEndpoints = [
      '/api/auth/init-check',
      '/api/trading/auto/status',
      '/api/trading/balance',
      '/api/trading/dashboard-overview',
      '/api/kis/status',
      '/api/errors',
      '/api/status'
    ];
    
    console.log('2️⃣ GET 엔드포인트 테스트');
    for (const endpoint of getEndpoints) {
      try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
          headers: {
            'Origin': ORIGIN,
            'Cookie': cookie
          }
        });
        const data = await res.json();
        const ok = typeof data === 'object' && data !== null;
        results[endpoint] = { status: res.status, ok };
        console.log(`   ${endpoint}: ${res.status} ${ok ? '✓' : '✗'}`);
      } catch (e) {
        results[endpoint] = { error: e.message };
        console.log(`   ${endpoint}: ❌ ${e.message}`);
      }
    }
    
    console.log('\n3️⃣ POST 엔드포인트 테스트 (빠른 체크용)');
    const postTests = [
      {
        endpoint: '/api/auth/logout',
        body: {}
      }
    ];
    
    for (const test of postTests) {
      try {
        const res = await fetch(`${BASE_URL}${test.endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Origin': ORIGIN,
            'Cookie': cookie
          },
          body: JSON.stringify(test.body)
        });
        const data = await res.json();
        const ok = typeof data === 'object' && data !== null;
        results[test.endpoint] = { status: res.status, ok };
        console.log(`   ${test.endpoint}: ${res.status} ${ok ? '✓' : '✗'}`);
      } catch (e) {
        results[test.endpoint] = { error: e.message };
        console.log(`   ${test.endpoint}: ❌ ${e.message}`);
      }
    }
    
    console.log('\n📊 결과 요약:');
    const passed = Object.values(results).filter(r => r.status && (r.status === 200 || r.status === 401)).length;
    const failed = Object.values(results).filter(r => !r.status || (r.status !== 200 && r.status !== 401)).length;
    console.log(`   ✓ 통과: ${passed}`);
    console.log(`   ✗ 실패: ${failed}`);
    console.log('\n✅ 기본 엔드포인트 검증 완료!');
    console.log('\n📝 상태 코드 설명:');
    console.log('   200: OK (성공)');
    console.log('   401: Unauthorized (인증 필요)');
    
  } catch (error) {
    console.error('\n❌ 오류:', error.message);
  }
}

testEndpoints();
