const BASE_URL = typeof globalThis !== 'undefined' && globalThis.BACKEND_BASE_URL
  ? globalThis.BACKEND_BASE_URL
  : process.env.BACKEND_BASE_URL || 'http://localhost:4000';
const ORIGIN = 'https://stock-auto-cloudflare-admin.sonjongwook123.workers.dev';

async function finalValidation() {
  console.log('✅ 최종 검증 - 타임아웃 10초 적용\n');
  
  let cookie = '';
  const results = {
    fast: [],
    slow: [],
    failed: []
  };
  
  try {
    // 로그인
    console.log('🔑 로그인...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': ORIGIN
      },
      body: JSON.stringify({ password: 'woaskshQ1@' })
    });
    
    const login = await loginRes.json();
    const setCookie = loginRes.headers.get('set-cookie');
    cookie = setCookie ? setCookie.split(';')[0] : '';
    console.log(`✓ 로그인 성공 (${loginRes.status})\n`);
    
    // 모든 엔드포인트 테스트
    const endpointTests = [
      { path: '/api/auth/init-check', method: 'GET', category: 'auth' },
      { path: '/api/trading/auto/status', method: 'GET', category: 'trading' },
      { path: '/api/trading/balance', method: 'GET', category: 'trading', slow: true },
      { path: '/api/trading/dashboard-overview', method: 'GET', category: 'trading', slow: true },
      { path: '/api/kis/status', method: 'GET', category: 'kis', slow: true },
      { path: '/api/errors', method: 'GET', category: 'system' },
      { path: '/api/status', method: 'GET', category: 'system' },
      { path: '/api/trading/auto/start', method: 'POST', body: { market: 'domestic' }, category: 'trading', slow: true },
      { path: '/api/trading/auto/stop-all', method: 'POST', body: {}, category: 'trading', slow: true },
    ];
    
    console.log('🧪 엔드포인트 테스트 (timeout: 10초)\n');
    
    for (const test of endpointTests) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 10000);
        
        const start = Date.now();
        const res = await fetch(`${BASE_URL}${test.path}`, {
          method: test.method || 'GET',
          headers: {
            'Origin': ORIGIN,
            'Cookie': cookie,
            'Content-Type': 'application/json'
          },
          body: test.body ? JSON.stringify(test.body) : undefined,
          signal: controller.signal
        });
        
        const elapsed = Date.now() - start;
        clearTimeout(timer);
        
        if (res.ok) {
          const data = await res.json();
          const timeStr = elapsed > 3000 ? `🐢 ${elapsed}ms` : `⚡ ${elapsed}ms`;
          console.log(`✓ ${test.path}`);
          console.log(`  │ ${test.method} ${res.status} ${timeStr}`);
          console.log(`  └─ ${JSON.stringify(data).substring(0, 70)}\n`);
          
          if (elapsed > 3000) {
            results.slow.push(test.path);
          } else {
            results.fast.push(test.path);
          }
        } else {
          console.log(`✗ ${test.path} - ${res.status} ${res.statusText}\n`);
          results.failed.push(test.path);
        }
      } catch (e) {
        if (e.name === 'AbortError') {
          console.log(`⏱️ ${test.path} - TIMEOUT (10초 초과)\n`);
          results.failed.push(test.path);
        } else {
          console.log(`❌ ${test.path} - ${e.message}\n`);
          results.failed.push(test.path);
        }
      }
    }
    
    // 로그아웃
    console.log('🔓 로그아웃...');
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Origin': ORIGIN,
        'Cookie': cookie
      }
    });
    console.log(`✓ 로그아웃 (${logoutRes.status})\n`);
    
    // 요약
    console.log('='  .repeat(50));
    console.log('📊 검증 결과:');
    console.log('='  .repeat(50));
    const total = results.fast.length + results.slow.length + results.failed.length;
    const passRate = ((results.fast.length + results.slow.length) / total * 100).toFixed(1);
    
    console.log(`\n✓ 정상: ${results.fast.length + results.slow.length}/${total} (${passRate}%)`);
    console.log(`  ⚡ 빠른 응답 (< 3초):  ${results.fast.length}개`);
    if (results.fast.length > 0) {
      results.fast.forEach(p => console.log(`     • ${p}`));
    }
    
    if (results.slow.length > 0) {
      console.log(`  🐢 느린 응답 (> 3초):  ${results.slow.length}개`);
      results.slow.forEach(p => console.log(`     • ${p}`));
    }
    
    if (results.failed.length > 0) {
      console.log(`✗ 실패/타임아웃:  ${results.failed.length}개`);
      results.failed.forEach(p => console.log(`     • ${p}`));
    }
    
    console.log('\n' + '='  .repeat(50));
    if (passRate >= 80) {
      console.log('✅ 시스템 정상 작동!');
      console.log('   로그인, 로그아웃, 대부분의 조회 기능 정상');
      if (results.slow.length > 0) {
        console.log(`   ${results.slow.length}개 엔드포인트는 KIS API 호출로 인해 느림`);
      }
    } else if (passRate >= 50) {
      console.log('⚠️  부분적 작동');
    } else {
      console.log('❌ 심각한 오류');
    }
    console.log('='  .repeat(50));
    
  } catch (error) {
    console.error('\n❌ 오류:', error.message);
  }
}

finalValidation();
