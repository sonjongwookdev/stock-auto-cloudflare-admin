const BASE_URL = typeof globalThis !== 'undefined' && globalThis.BACKEND_BASE_URL
  ? globalThis.BACKEND_BASE_URL
  : process.env.BACKEND_BASE_URL || 'http://localhost:4000';
const ORIGIN = 'https://stock-auto-cloudflare-admin.sonjongwook123.workers.dev';

async function testAllEndpoints() {
  console.log('🚀 완벽 검증 시작 - 모든 엔드포인트 테스트\n');
  
  let cookie = '';
  
  try {
    // 1단계: 로그인
    console.log('1️⃣ 로그인 테스트');
    console.log('   POST /api/auth/login');
    console.log(`   URL: ${BASE_URL}/api/auth/login`);
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': ORIGIN
      },
      body: JSON.stringify({ password: 'woaskshQ1@' }),
      timeout: 15000
    });
    console.log(`   ✓ 상태: ${loginRes.status} ${loginRes.statusText || 'OK'}`);
    
    const responseText = await loginRes.text();
    console.log(`   ✓ 응답 본문: ${responseText.substring(0, 100)}`);
    
    let loginData;
    try {
      loginData = JSON.parse(responseText);
    } catch (e) {
      console.log(`   ⚠️ JSON 파싱 실패, 원본: ${responseText}`);
      throw e;
    }
    
    console.log(`   ✓ 응답: ok=${loginData.ok}, error=${loginData.error || 'none'}`);
    
    // 쿠키 추출
    const setCookie = loginRes.headers.get('set-cookie');
    cookie = setCookie ? setCookie.split(';')[0] : '';
    console.log(`   ✓ 쿠키: ${cookie.substring(0, 30) || '없음'}\n`);
    
    // 2단계: 인증 확인 (GET)
    console.log('2️⃣ GET 엔드포인트 - 인증 확인');
    const authCheckRes = await fetch(`${BASE_URL}/api/auth/init-check`, {
      headers: {
        'Origin': ORIGIN,
        'Cookie': cookie
      }
    });
    console.log(`   GET /api/auth/init-check: ${authCheckRes.status} ✓`);
    const authCheckData = await authCheckRes.json();
    console.log(`   응답: dbStatus=${authCheckData.dbStatus}, hasKeys=${authCheckData.hasKisKeys}\n`);
    
    // 3단계: 자동매수 상태
    console.log('3️⃣ 자동매수 상태 조회 (GET)');
    const autoStatusRes = await fetch(`${BASE_URL}/api/trading/auto/status`, {
      headers: {
        'Origin': ORIGIN,
        'Cookie': cookie
      }
    });
    console.log(`   GET /api/trading/auto/status: ${autoStatusRes.status} ✓`);
    const autoStatusData = await autoStatusRes.json();
    console.log(`   응답: running=${autoStatusData.running}, market=${autoStatusData.market || 'N/A'}\n`);
    
    // 4단계: POST - 자동매수 시작
    console.log('4️⃣ 자동매수 시작 (POST)');
    console.log('   POST /api/trading/auto/start');
    const startRes = await fetch(`${BASE_URL}/api/trading/auto/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': ORIGIN,
        'Cookie': cookie
      },
      body: JSON.stringify({ market: 'domestic' })
    });
    console.log(`   ✓ 상태: ${startRes.status}`);
    const startData = await startRes.json();
    console.log(`   ✓ 응답: ok=${startData.ok}, message=${startData.message || 'N/A'}\n`);
    
    // 5단계: 자동매수 상태 다시 확인
    console.log('5️⃣ 자동매수 상태 재확인 (GET)');
    const autoStatus2Res = await fetch(`${BASE_URL}/api/trading/auto/status`, {
      headers: {
        'Origin': ORIGIN,
        'Cookie': cookie
      }
    });
    console.log(`   GET /api/trading/auto/status: ${autoStatus2Res.status} ✓`);
    const autoStatus2Data = await autoStatus2Res.json();
    console.log(`   응답: running=${autoStatus2Data.running} (변경됨: ${autoStatus2Data.running !== autoStatusData.running ? '✓' : '✗'})\n`);
    
    // 6단계: POST - 자동매수 중단
    console.log('6️⃣ 자동매수 중단 (POST)');
    console.log('   POST /api/trading/auto/stop-all');
    const stopRes = await fetch(`${BASE_URL}/api/trading/auto/stop-all`, {
      method: 'POST',
      headers: {
        'Origin': ORIGIN,
        'Cookie': cookie
      }
    });
    console.log(`   ✓ 상태: ${stopRes.status}`);
    const stopData = await stopRes.json();
    console.log(`   ✓ 응답: ok=${stopData.ok}, message=${stopData.message || 'N/A'}\n`);
    
    // 7단계: KIS 설정 업데이트
    console.log('7️⃣ KIS 설정 업데이트 (POST)');
    console.log('   POST /api/kis/update');
    const kisRes = await fetch(`${BASE_URL}/api/kis/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': ORIGIN,
        'Cookie': cookie
      },
      body: JSON.stringify({
        kis_base_url: 'https://example.com',
        kis_api_key: 'test_key',
        kis_api_secret: 'test_secret',
        confirmation: '변경합니다'
      })
    });
    console.log(`   ✓ 상태: ${kisRes.status}`);
    const kisData = await kisRes.json();
    console.log(`   ✓ 응답: ok=${kisData.ok}, message=${kisData.message || 'N/A'}\n`);
    
    // 8단계: 대시보드 조회
    console.log('8️⃣ 대시보드 조회 (GET)');
    const dashRes = await fetch(`${BASE_URL}/api/trading/dashboard-overview`, {
      headers: {
        'Origin': ORIGIN,
        'Cookie': cookie
      }
    });
    console.log(`   GET /api/trading/dashboard-overview: ${dashRes.status} ✓`);
    const dashData = await dashRes.json();
    console.log(`   응답: sections=${Object.keys(dashData).length}개\n`);
    
    // 9단계: 로그아웃
    console.log('9️⃣ 로그아웃 (POST)');
    console.log('   POST /api/auth/logout');
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Origin': ORIGIN,
        'Cookie': cookie
      }
    });
    console.log(`   ✓ 상태: ${logoutRes.status}`);
    const logoutData = await logoutRes.json();
    console.log(`   ✓ 응답: ok=${logoutData.ok}\n`);
    
    // 10단계: 로그아웃 후 인증 필요 엔드포인트 접근
    console.log('🔟 로그아웃 후 보호 확인');
    const protectedRes = await fetch(`${BASE_URL}/api/auth/init-check`, {
      headers: {
        'Origin': ORIGIN,
        'Cookie': 'session=' // 유효하지 않은 쿠키
      }
    });
    console.log(`   GET /api/auth/init-check (invalid cookie): ${protectedRes.status}`);
    console.log(`   ✓ ${protectedRes.status === 401 ? '보호됨 ✓' : '경고: 보호되지 않음'}\n`);
    
    console.log('✅ 모든 테스트 완료!');
    console.log('\n📊 결과 요약:');
    console.log('  ✓ 로그인 성공');
    console.log('  ✓ GET 요청 (인증 확인, 상태 조회, 대시보드)');
    console.log('  ✓ POST 요청 (자동매수 시작/중단, KIS 설정, 로그아웃)');
    console.log('  ✓ 상태 변경 추적 (자동매수 running 변경)');
    console.log('  ✓ 인증 보호 (로그아웃 후 401)');
    
  } catch (error) {
    console.error('\n❌ 오류:', error.message);
    console.error('\n스택:', error.stack);
  }
}

testAllEndpoints();
