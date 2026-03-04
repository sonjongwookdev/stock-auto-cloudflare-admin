const BACKEND_BASE = (typeof BACKEND_BASE_URL !== 'undefined' && BACKEND_BASE_URL)
  ? BACKEND_BASE_URL
  : 'http://168.107.57.47.nip.io:4000'

const adminHtml = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Stock Auto Admin v2</title>
  <link rel="icon" href="data:," />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html {
      height: 100%;
      width: 100%;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      height: 100%;
      width: 100%;
      color: #1a1a1a;
    }
    
    /* ===== Pages ===== */
    .page { display: none; }
    .page.active { display: block; }
    
    /* Login Page */
    .login-page.active {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      width: 100%;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
    }
    .login-card {
      background: white;
      border-radius: 16px;
      padding: 60px 50px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1);
      width: 90%;
      max-width: 420px;
      text-align: center;
      backdrop-filter: blur(10px);
    }
    .login-card h1 {
      font-size: 36px;
      font-weight: 800;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -1px;
    }
    .login-card .subtitle {
      color: #666;
      margin-bottom: 40px;
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.5px;
    }
    
    /* Init Page */
    .page.init-page.active {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }
    .init-card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.1);
      width: 90%;
      max-width: 450px;
      text-align: center;
    }
    .init-card h2 { font-size: 20px; margin-bottom: 20px; }
    .status-item {
      display: flex;
      align-items: center;
      padding: 15px;
      margin: 10px 0;
      background: #f9f9f9;
      border-radius: 8px;
      border-left: 4px solid #ddd;
    }
    .status-item.success { border-left-color: #10b981; background: #ecfdf5; }
    .status-item.error { border-left-color: #ef4444; background: #fef2f2; }
    .status-item.pending { border-left-color: #f59e0b; background: #fffbeb; }
    .status-icon {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      font-weight: bold;
      color: white;
    }
    .status-item.success .status-icon { background: #10b981; }
    .status-item.error .status-icon { background: #ef4444; }
    .status-item.pending .status-icon { background: #f59e0b; }
    .status-text { text-align: left; flex: 1; }
    .status-text strong { display: block; margin-bottom: 4px; }
    .status-text small { color: #666; display: block; }
    
    /* KIS Setup Page */
    .page.kis-page.active {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      width: 100%;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
    }
    .kis-card {
      background: white;
      border-radius: 16px;
      padding: 50px 45px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1);
      width: 90%;
      max-width: 500px;
      text-align: center;
    }
    .kis-card h2 { 
      font-size: 28px; 
      font-weight: 700;
      margin-bottom: 8px; 
      color: #333;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .kis-card .subtitle { 
      color: #666; 
      margin-bottom: 30px; 
      font-size: 14px; 
    }
    .kis-card label,
    .kis-card input,
    .kis-card .warning {
      text-align: left;
    }
    .kis-card .warning {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 20px;
      font-size: 13px;
      color: #92400e;
    }
    
    /* Main Dashboard */
    .main-page.active { display: block; background: #f8f9fa; min-height: 100vh; padding-top: 0; }
    .top-header {
      background: white;
      border-bottom: 1px solid #e5e7eb;
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .header-title { font-size: 18px; font-weight: 600; color: #333; }
    .header-status {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      padding: 6px 12px;
      background: #f0f4f8;
      border-radius: 6px;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .status-dot.online { background: #10b981; }
    .status-dot.offline { background: #ef4444; }
    .header-buttons {
      display: flex;
      gap: 8px;
    }
    .header-btn {
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      font-size: 13px;
      cursor: pointer;
      transition: background 0.2s;
    }
    .header-btn:hover { background: #5568d3; }
    .header-btn.secondary { background: #e5e7eb; color: #333; }
    .header-btn.secondary:hover { background: #d1d5db; }
    
    /* Content Wrapper */
    .wrap {
      max-width: 1280px;
      margin: 20px auto;
      padding: 0 16px;
    }
    .row {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    }
    .card.full { grid-column: 1/-1; }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 10px;
      margin-top: 12px;
    }
    .quick-btn {
      border: none;
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      color: white;
      transition: opacity 0.2s ease;
    }
    .quick-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .quick-btn.domestic { background: #2563eb; }
    .quick-btn.overseas { background: #7c3aed; }
    .quick-btn.status { background: #0f766e; }
    .quick-btn.stop { background: #dc2626; }

    .status-panel {
      margin-top: 12px;
      border: 1px solid #dbe3ef;
      border-radius: 10px;
      padding: 14px;
      background: #f9fbff;
    }
    .status-panel.hidden { display: none; }
    .status-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      margin-top: 12px;
    }
    .status-box {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 10px;
    }
    .status-box h3 {
      font-size: 14px;
      margin: 0 0 8px;
      color: #111827;
    }
    .report-item {
      padding: 8px;
      border: 1px solid #eef2f7;
      border-radius: 8px;
      margin-bottom: 8px;
      background: #fff;
    }
    .report-item .meta {
      color: #6b7280;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .report-item .summary {
      color: #111827;
      font-size: 13px;
      line-height: 1.45;
    }
    
    h2 { font-size: 17px; margin: 0 0 8px; }
    label {
      display: block;
      font-size: 13px;
      margin: 18px 0 10px;
      color: #1a1a1a;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    input, textarea, select {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      box-sizing: border-box;
      font-family: inherit;
      font-size: 15px;
      transition: all 0.3s ease;
      background: #fafbfc;
    }
    input:focus, textarea:focus, select:focus { 
      outline: none; 
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
    }
    textarea { min-height: 90px; }
    
    button.btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 16px 24px;
      cursor: pointer;
      margin-right: 6px;
      margin-top: 28px;
      font-size: 16px;
      font-weight: 700;
      transition: all 0.3s ease;
      width: 100%;
      box-shadow: 0 8px 15px rgba(102, 126, 234, 0.3);
      letter-spacing: 0.5px;
    }
    button.btn:hover {
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      transform: translateY(-2px);
      box-shadow: 0 12px 20px rgba(102, 126, 234, 0.4);
    }
    button.btn:active {
      transform: translateY(0);
    }
    button.btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }
    /* Loading Spinner */
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-top: 3px solid white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-right: 8px;
      vertical-align: middle;
    }
    button.btn.loading {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      opacity: 0.9;
    }
    button.btn.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      box-shadow: 0 8px 15px rgba(16, 185, 129, 0.3);
    }
    button.btn.success:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: none;
    }
    button.btn.failure {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      box-shadow: 0 8px 15px rgba(239, 68, 68, 0.3);
    }
    button.btn.failure:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      transform: none;
    }
    button.btn.secondary {
      background: #f5f5f5;
      color: #333;
    }
    button.btn.secondary:hover { background: #e8e8e8; }
    button.btn.danger {
      background: #ef4444;
    }
    button.btn.danger:hover { background: #dc2626; }
    
    .tabs {
      display: flex;
      gap: 8px;
      margin: 10px 0;
    }
    .tabs button {
      background: #e5e7eb;
      color: #333;
    }
    .tabs button.active { background: #667eea; color: white; }
    
    .chip {
      display: inline-block;
      background: #dbeafe;
      color: #0c4a6e;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 11px;
      margin: 4px 4px 4px 0;
    }
    .list {
      max-height: 250px;
      overflow: auto;
      border: 1px solid #dbe3ef;
      border-radius: 8px;
      padding: 8px;
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    pre {
      background: #0b1020;
      color: #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      overflow: auto;
      max-height: 320px;
    }
    
    /* Modal */
    .modal-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
      align-items: center;
      justify-content: center;
    }
    .modal-overlay.active { display: flex; }
    .modal-content {
      background: white;
      border-radius: 16px;
      padding: 30px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow: auto;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 15px;
    }
    .modal-header h2 { font-size: 20px; margin: 0; }
    .modal-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #999;
    }
    .modal-close:hover { color: #333; }
    
    /* Error Messages */
    .alert {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 18px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 14px;
      line-height: 1.6;
      font-weight: 500;
      animation: slideDown 0.3s ease;
    }
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    /* Wrong Password - User Error */
    .alert.password-error {
      background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%);
      border-left: 4px solid #ff9500;
      color: #8b5a00;
    }
    /* Server Error - Connection Failed */
    .alert.server-error {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      border-left: 4px solid #dc2626;
      color: #7f1d1d;
    }
    /* Success */
    .alert.success {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      border-left: 4px solid #10b981;
      color: #065f46;
    }
    
    .error-msg {
      background: #fff5f5;
      border-left: 4px solid #ff9500;
      color: #b94717;
      padding: 12px 14px;
      border-radius: 6px;
      margin-bottom: 16px;
      font-size: 14px;
      line-height: 1.5;
    }
    .success-msg {
      background: #ecfdf5;
      border-left: 4px solid #10b981;
      color: #065f46;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 15px;
      font-size: 13px;
    }

    .kis-preview {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px;
      margin: 10px 0;
      font-family: monospace;
      font-size: 13px;
    }

    .usage-guide {
      line-height: 1.8;
    }
    .usage-guide h3 { margin: 20px 0 10px; color: #333; font-size: 16px; }
    .usage-guide p { color: #666; margin: 10px 0; }
    .usage-guide ol, .usage-guide ul { margin-left: 20px; color: #666; }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin: 20px;
    }
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
    }
    .stat-icon {
      font-size: 36px;
      line-height: 1;
    }
    .stat-content {
      flex: 1;
    }
    .stat-label {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 6px;
      font-weight: 500;
    }
    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #1f2937;
    }

    /* Position List */
    .position-list, .error-list {
      max-height: 400px;
      overflow-y: auto;
    }
    .position-item, .error-item {
      padding: 12px;
      margin: 8px 0;
      background: #f9fafb;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .position-item:hover, .error-item:hover {
      background: #f3f4f6;
    }
    .position-item strong, .error-item strong {
      display: block;
      margin-bottom: 4px;
      color: #1f2937;
    }
    .position-item small, .error-item small {
      color: #6b7280;
      font-size: 12px;
    }
    .error-item {
      border-left-color: #ef4444;
    }

    /* Trading Status */
    .trading-status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .trading-status-card {
      padding: 20px;
      background: #f9fafb;
      border-radius: 12px;
      border: 2px solid #e5e7eb;
    }
    .trading-status-card h3 {
      margin-bottom: 12px;
      font-size: 16px;
      color: #1f2937;
    }
    .trading-status-card.active {
      border-color: #10b981;
      background: #ecfdf5;
    }

    @media (max-width: 768px) {
      .row { grid-template-columns: 1fr; }
      .header-status { flex-direction: column; align-items: flex-start; gap: 10px; }
      .quick-actions { grid-template-columns: 1fr; }
      .status-grid { grid-template-columns: 1fr; }
      .stats-grid { grid-template-columns: 1fr; }
      .trading-status-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <!-- Login Page -->
  <div id="loginPage" class="page login-page active">
    <div class="login-card">
      <h1>Stock Auto</h1>
      <p class="subtitle">자동매매 시스템 관리</p>
      <form id="loginForm">
        <input type="text" autocomplete="username" style="display:none;" aria-hidden="true" tabindex="-1" />
        <label>비밀번호</label>
        <input id="loginPassword" type="password" autocomplete="current-password" placeholder="관리자 비밀번호를 입력하세요" />
        <button id="loginBtn" class="btn" type="button">로그인</button>
        <div id="loginError" style="margin-top:16px;"></div>
      </form>
    </div>
  </div>

  <!-- Init Check Page -->
  <div id="initPage" class="page init-page">
    <div class="init-card">
      <h2>초기화 중...</h2>
      <p style="color: #999; margin-top: 20px;">시스템 상태를 확인하는 중입니다</p>
    </div>
  </div>

  <!-- KIS Setup Page -->
  <div id="kisPage" class="page kis-page">
    <div class="kis-card">
      <h2>KIS API 키 설정</h2>
      <p class="subtitle">자동매매 API 키를 입력해주세요</p>
      <div class="warning">⚠️ 키는 안전하게 저장됩니다. 절대 공개하지 마세요.</div>

      <form id="kisForm" onsubmit="return false;">
        <label>KIS API Key</label>
        <input id="kisApiKey" type="password" autocomplete="new-password" placeholder="API Key" />

        <label>KIS API Secret (선택)</label>
        <input id="kisApiSecret" type="password" autocomplete="new-password" placeholder="API Secret" />

        <button class="btn" type="button" style="width:100%; margin-top:20px;" onclick="saveKisKeys()">키 저장 및 계속</button>
        <div id="kisError" style="margin-top:15px;"></div>
      </form>
    </div>
  </div>

  <!-- Main Dashboard -->
  <div id="mainPage" class="page main-page">
    <!-- Header -->
    <div class="top-header">
      <div class="header-left">
        <div class="header-title">📊 Stock Auto 관리자</div>
      </div>
      
      <div class="header-status">
        <div class="status-badge">
          <span>🔑 키값:</span>
          <code id="headerKeyPreview">***</code>
        </div>
        <div class="status-badge">
          <span>🖥️ 서버:</span>
          <span class="status-dot" id="headerDbStatus"></span>
          <span id="headerDbText">연결중</span>
        </div>
        <div class="status-badge">
          <span>💰 잔고:</span>
          <code id="headerBalance" style="cursor: pointer; color: #10b981; font-weight: 600;" title="클릭하여 새로고침">로딩중...</code>
        </div>
      </div>

      <div class="header-buttons">
        <button class="header-btn" onclick="showPage('mainPage')">💼 대시보드</button>
        <button class="header-btn" onclick="showPage('statusPage')">📊 현황</button>
        <button class="header-btn" onclick="showPage('usagePage')">📖 가이드</button>
        <button class="header-btn secondary" onclick="openSettingsModal()">⚙️ 설정</button>
        <button class="header-btn secondary" onclick="performLogout()">로그아웃</button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="wrap">
      <div class="row">
        <section class="card full">
          <h2>⚡ 원클릭 자동매매 제어</h2>
          <p style="color:#6b7280; font-size:13px; margin-top:4px;">로그인 후 바로 시장별 자동매매를 시작하고, 현황/리포트를 한 화면에서 확인합니다.</p>
          <div class="quick-actions">
            <button id="startDomesticBtn" class="quick-btn domestic" onclick="startAutoTrading('domestic')">국내 자동매매 시작</button>
            <button id="startOverseasBtn" class="quick-btn overseas" onclick="startAutoTrading('overseas')">해외 자동매매 시작</button>
            <button id="stopAllBtn" class="quick-btn stop" onclick="stopAllTrading()">모든거래중단</button>
          </div>
          <div id="quickControlMsg" style="margin-top: 12px;"></div>
        </section>

        <section class="card full">
          <h2>🤖 자동매매 제어</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
            <button id="startDomesticBtn" class="btn" onclick="startAutoTrading('domestic')" style="padding: 20px; font-size: 16px;">🇰🇷 국내 자동매매 시작</button>
            <button id="startOverseasBtn" class="btn" onclick="startAutoTrading('overseas')" style="padding: 20px; font-size: 16px;">🌎 해외 자동매매 시작</button>
            <button id="stopAllBtn" class="btn secondary" onclick="stopAllTrading()" style="padding: 20px; font-size: 16px;">🛑 모든 거래 중단</button>
          </div>
          <div id="autoTradingStatus" style="margin-bottom: 15px;"></div>
          <div style="margin-top: 15px;">
            <strong>현재 포지션:</strong>
            <div class="list" id="positionsList"></div>
            <pre id="tradingOut"></pre>
          </div>
        </section>

        <section class="card">
          <h2>시스템 현황</h2>
          <button class="btn" onclick="loadStatus()">새로고침</button>
          <button class="btn secondary" onclick="loadErrors()">오류 로그</button>
          <pre id="statusOut"></pre>
        </section>
      </div>
    </div>
  </div>

  <!-- Status Page -->
  <div id="statusPage" class="page main-page">
    <div class="top-header">
      <div class="header-left">
        <div class="header-title">📊 현황 대시보드</div>
      </div>
      <div class="header-buttons">
        <button class="header-btn" onclick="showPage('mainPage')">💼 대시보드</button>
        <button class="header-btn" onclick="showPage('statusPage')">📊 현황</button>
        <button class="header-btn" onclick="showPage('usagePage')">📖 가이드</button>
        <button class="header-btn secondary" onclick="openSettingsModal()">⚙️ 설정</button>
        <button class="header-btn secondary" onclick="performLogout()">로그아웃</button>
      </div>
    </div>

    <div class="wrap">
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <div class="stat-label">총 투자액</div>
            <div class="stat-value" id="statTotalInvested">로딩중...</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <div class="stat-label">수익률</div>
            <div class="stat-value" id="statROI">로딩중...</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <div class="stat-label">운영 시간</div>
            <div class="stat-value" id="statRuntime">로딩중...</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <div class="stat-label">활성 포지션</div>
            <div class="stat-value" id="statPositions">로딩중...</div>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="row">
        <section class="card full">
          <h2>📈 수익률 추이</h2>
          <canvas id="performanceChart" style="max-height: 300px;"></canvas>
        </section>
      </div>

      <!-- Positions & Logs -->
      <div class="row">
        <section class="card">
          <h2>📊 현재 포지션</h2>
          <div class="position-list" id="statusPositionList"></div>
        </section>
        <section class="card">
          <h2>⚠️ 오류 로그</h2>
          <div class="error-list" id="statusErrorList"></div>
        </section>
      </div>

      <!-- Trading Status -->
      <div class="row">
        <section class="card full">
          <h2>🤖 자동매매 상태</h2>
          <div class="trading-status-grid">
            <div class="trading-status-card">
              <h3>🇰🇷 국내 시장</h3>
              <div id="domesticStatus">확인 중...</div>
            </div>
            <div class="trading-status-card">
              <h3>🌎 해외 시장</h3>
              <div id="overseasStatus">확인 중...</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>

  <!-- Usage Page -->
  <div id="usagePage" class="page main-page">
    <div class="top-header">
      <div class="header-left">
        <div class="header-title">📖 사용 가이드</div>
      </div>
      <div class="header-buttons">
        <button class="header-btn" onclick="showPage('mainPage')">💼 대시보드</button>
        <button class="header-btn" onclick="showPage('statusPage')">📊 현황</button>
        <button class="header-btn" onclick="showPage('usagePage')">📖 가이드</button>
        <button class="header-btn secondary" onclick="openSettingsModal()">⚙️ 설정</button>
        <button class="header-btn secondary" onclick="performLogout()">로그아웃</button>
      </div>
    </div>

    <div class="wrap">
      <section class="card full">
        <h2>📚 Stock Auto 관리자 가이드</h2>
        <div class="usage-guide">
          <h3>1️⃣ 로그인</h3>
          <p>관리자 비밀번호를 입력하여 로그인합니다.</p>

          <h3>2️⃣ 초기화</h3>
          <p>로그인 후 다음 항목이 확인됩니다:</p>
          <ul>
            <li><strong>Oracle 서버:</strong> 자동매매 데이터베이스 연결 상태</li>
            <li><strong>KIS API 키:</strong> 자동매매에 필요한 API 키 설정 여부</li>
          </ul>

          <h3>3️⃣ KIS API 키 설정</h3>
          <p>키가 없는 경우 입력 페이지가 나타납니다:</p>
          <ul>
            <li>API Key 입력 (필수)</li>
            <li>API Secret 입력 (선택사항)</li>
          </ul>

          <h3>4️⃣ 메인 대시보드</h3>
          <p>헤더에서 다음 정보를 확인할 수 있습니다:</p>
          <ul>
            <li>🔑 키값: 현재 설정된 API 키 (앞뒤 3글자만 표시)</li>
            <li>🖥️ 서버: Oracle 서버 연결 상태 (🟢=정상, 🔴=오류)</li>
            <li>💰 잔고: 현재 계좌 잔고 (클릭하여 새로고침)</li>
          </ul>

          <h3>5️⃣ 자동매매 시작</h3>
          <p>시장별로 자동매매를 시작할 수 있습니다:</p>
          <ul>
            <li><strong>국내 자동매매:</strong> 한국 주식 시장</li>
            <li><strong>해외 자동매매:</strong> 해외 주식 시장</li>
          </ul>

          <h3>6️⃣ 현황 확인</h3>
          <p>📊 현황 메뉴에서 다음을 확인할 수 있습니다:</p>
          <ul>
            <li>총 투자액 및 수익률</li>
            <li>수익률 추이 그래프</li>
            <li>현재 보유 포지션</li>
            <li>오류 로그</li>
          </ul>

          <h3>7️⃣ 설정 및 키 변경</h3>
          <p>⚙️ 설정 버튼으로:</p>
          <ul>
            <li>현재 API 키 확인</li>
            <li>잔고 갱신 주기 설정</li>
          </ul>

          <h3>💡 참고사항</h3>
          <ul>
            <li>모든 설정은 즉시 저장됩니다</li>
            <li>키 변경 시 서버가 자동으로 재시작됩니다</li>
            <li>오류가 발생하면 "현황" 페이지에서 확인할 수 있습니다</li>
          </ul>
        </div>
      </section>
    </div>
  </div>

  <!-- Settings Modal -->
  <div id="settingsModal" class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>설정</h2>
        <button class="modal-close" onclick="closeSettingsModal()">✕</button>
      </div>
      
      <div id="settingsContent">
        <h3>💰 잔고 갱신 설정</h3>
        <p style="color: #666; margin-bottom: 15px; font-size: 13px;">상단바에 표시되는 잔고 정보의 자동 갱신 주기를 설정합니다.</p>
        
        <label>갱신 주기 선택</label>
        <select id="settingsBalanceRefreshInterval" onchange="updateBalanceRefreshInterval()">
          <option value="30">30초 (매우 빠름)</option>
          <option value="60">1분</option>
          <option value="120" selected>2분 (기본값)</option>
          <option value="180">3분</option>
          <option value="300">5분</option>
          <option value="600">10분</option>
        </select>
        <div class="kis-preview" id="balanceRefreshPreview" style="margin-top: 10px; padding: 10px; background: #ecfdf5; border-left: 4px solid #10b981; color: #065f46;">✓ 현재 설정: 2분(120초)마다 자동 갱신</div>
        
        <hr style="margin: 25px 0; border: none; border-top: 1px solid #e5e7eb;" />
        
        <h3>🔑 KIS API 키 교체</h3>
        <p style="color: #666; margin-bottom: 15px; font-size: 13px;">현재 설정된 KIS API 키를 확인하고 교체할 수 있습니다.</p>
        
        <div class="kis-preview" id="settingsKeyInfo" style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-left: 4px solid #667eea; color: #333;">
          <div style="margin-bottom: 8px;"><strong>Base URL:</strong> <span id="settingsBaseUrlDisplay">로딩 중...</span></div>
          <div><strong>API Key:</strong> <span id="settingsKeyDisplay">로딩 중...</span></div>
        </div>
        
        <div style="background: #fff3cd; border-left: 4px solid #ff9800; padding: 12px; border-radius: 6px; margin: 15px 0; font-size: 13px; color: #856404;">
          <strong>⚠️ 주의:</strong> 키 교체 시 자동매매가 중단되고 서버가 재시작됩니다.
        </div>
        
        <button class="btn" type="button" style="width:100%; margin-top:15px; padding: 15px; font-size: 15px;" onclick="goToKisSetup()">🔑 KIS API 키 교체하기</button>
        <button class="btn secondary" type="button" style="width:100%; margin-top:10px;" onclick="closeSettingsModal()">닫기</button>
      </div>
    </div>
  </div>

<script>
  // Backend URL 설정
  const BACKEND_BASE = '${BACKEND_BASE}'
  
  let currentMarket = 'domestic'
  let currentUser = { isLoggedIn: false }
  let balanceRefreshInterval = null  // 잔고 자동 갱신 타이머
  let balanceRefreshSeconds = 120  // 기본값 2분
  let statusRefreshInterval = null
  let statusRefreshSeconds = 120
  let statusPanelOpen = false

  async function api(path, opts = {}) {
    const maxRetries = 5
    const initialDelay = 500
    const maxDelay = 10000

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        const res = await fetch('/api' + path, {
          method: opts.method || 'GET',
          headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
          body: opts.body ? JSON.stringify(opts.body) : undefined,
          credentials: 'include',
          signal: controller.signal
        });
        clearTimeout(timeout);
        
        const text = await res.text()
        let json = {}
        try { json = text ? JSON.parse(text) : {} } catch (err) { json = { raw: text } }
        
        if (!res.ok) {
          // 4xx 에러는 재시도하지 않음
          if (res.status >= 400 && res.status < 500) {
            const msg = json.message || '알 수 없음'
            throw new Error(json.error || ('HTTP ' + res.status + ': ' + msg))
          }
          
          // 5xx 또는 네트워크 에러는 재시도
          if (attempt < maxRetries) {
            const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay)
            console.warn('[API] ' + path + ' 실패 (' + attempt + '/' + maxRetries + ', ' + res.status + '), ' + delay + 'ms 후 재시도...')
            await new Promise(r => setTimeout(r, delay))
            continue
          }
          throw new Error(json.error || ('HTTP ' + res.status))
        }
        
        return json
      } catch (e) {
        // 마지막 시도면 에러 던짐
        if (attempt === maxRetries) {
          throw new Error(path + ' 호출 실패 (' + maxRetries + '번 시도): ' + e.message)
        }
        
        // 네트워크 에러면 재시도
        const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay)
        console.warn('[API] ' + path + ' 연결 실패 (' + attempt + '/' + maxRetries + '), ' + delay + 'ms 후 재시도...')
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }

  function setOut(id, data) {
    document.getElementById(id).textContent = JSON.stringify(data, null, 2)
  }

  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
    document.getElementById(pageId).classList.add('active')
    
    // 현황 페이지로 이동 시 데이터 로드
    if (pageId === 'statusPage') {
      loadStatusPage()
    }
  }

  async function performLogin() {
    try {
      console.log('[로그인] 시작')
      const password = document.getElementById('loginPassword').value
      if (!password) {
        displayAlert('loginError', '비밀번호를 입력해주세요', 'password-error')
        return
      }
      
      // 로딩 상태 시작 (클릭 방지)
      console.log('[로그인] 로딩 상태 표시')
      setLoginLoading(true)
      document.getElementById('loginError').innerHTML = ''
      
      // UI 업데이트를 위한 짧은 딜레이
      await new Promise(resolve => setTimeout(resolve, 50))
      
      console.log('[로그인] API 호출 중...')
      await api('/login', { method: 'POST', body: { password } })
      console.log('[로그인] 성공')
      currentUser.isLoggedIn = true
      
      // 로그인 상태를 localStorage에 저장
      localStorage.setItem('isLoggedIn', 'true')
      
      // 성공 표시
      showLoginSuccess()
      
      // 2초 후 다음 페이지로 이동
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      showPage('initPage')
      await checkInitStatus()
    } catch (e) {
      console.error('[로그인] 실패:', e)
      
      const errorMsg = e.message || '로그인 실패'
      const statusMatch = errorMsg.match(/HTTP (\\d+)/)
      const status = statusMatch ? parseInt(statusMatch[1]) : null
      
      let alertType = 'password-error'
      let displayMsg = ''
      
      if (status === 401 || errorMsg.includes('비밀번호')) {
        alertType = 'password-error'
        displayMsg = '비밀번호가 올바르지 않습니다'
      } else if (status >= 500 || errorMsg.includes('Failed to fetch') || errorMsg.includes('connect')) {
        alertType = 'server-error'
        displayMsg = '서버에 연결할 수 없습니다. 나중에 다시 시도해주세요'
      } else if (status === 403) {
        alertType = 'server-error'
        displayMsg = '접근이 거부되었습니다. 관리자에게 문의하세요'
      } else {
        alertType = 'server-error'
        displayMsg = errorMsg
      }
      
      // 실패 표시 후 버튼 복구
      showLoginFailure(displayMsg, alertType)
    }
  }
  
  function showLoginSuccess() {
    const btn = document.getElementById('loginBtn')
    const passwordInput = document.getElementById('loginPassword')
    
    if (!btn || !passwordInput) {
      console.error('[로그인] 버튼 또는 입력 필드를 찾을 수 없습니다')
      return
    }
    
    btn.disabled = true
    btn.classList.remove('loading')
    btn.classList.add('success')
    btn.innerHTML = '<span style="font-size: 18px;">✓</span> 로그인 성공'
    passwordInput.disabled = true
    
    console.log('[로그인] 성공 표시')
  }
  
  function showLoginFailure(message, alertType) {
    const btn = document.getElementById('loginBtn')
    const passwordInput = document.getElementById('loginPassword')
    
    if (!btn || !passwordInput) {
      console.error('[로그인] 버튼 또는 입력 필드를 찾을 수 없습니다')
      displayAlert('loginError', message, alertType)
      return
    }
    
    btn.disabled = true
    btn.classList.remove('loading')
    btn.classList.add('failure')
    btn.innerHTML = '<span style="font-size: 18px;">✕</span> 로그인 실패'
    passwordInput.disabled = false
    
    // 에러 메시지 표시
    displayAlert('loginError', message, alertType)
    
    // 3초 후 버튼 복구
    setTimeout(() => {
      btn.disabled = false
      btn.classList.remove('failure')
      btn.innerHTML = '로그인'
      console.log('[로그인] 버튼 복구')
    }, 3000)
    
    console.log('[로그인] 실패 표시')
  }
  
  function setLoginLoading(isLoading) {
    const btn = document.getElementById('loginBtn')
    const passwordInput = document.getElementById('loginPassword')
    
    if (!btn || !passwordInput) {
      console.error('[로딩] 버튼 또는 입력 필드를 찾을 수 없습니다')
      return
    }
    
    console.log('[로딩] 상태 변경:', isLoading ? '시작' : '종료')
    
    if (isLoading) {
      btn.disabled = true
      btn.classList.add('loading')
      btn.innerHTML = '<span class="spinner"></span>로그인 중...'
      passwordInput.disabled = true
      console.log('[로딩] 버튼 비활성화 및 스피너 표시')
    } else {
      btn.disabled = false
      btn.classList.remove('loading')
      btn.innerHTML = '로그인'
      passwordInput.disabled = false
      console.log('[로딩] 버튼 활성화')
    }
  }
  
  function displayAlert(elementId, message, type) {
    const alertHtml = '<div class="alert ' + type + '">' + message + '</div>'
    document.getElementById(elementId).innerHTML = alertHtml
  }

  // 페이지 로드 시 서버 연결 상태 확인
  async function checkServerConnection() {
    try {
      console.log('[서버 연결] 확인 시작: ' + BACKEND_BASE)
      const response = await fetch(BACKEND_BASE + '/health', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      })
      
      if (response.ok) {
        console.log('[서버 연결] ✓ 정상')
        return true
      } else {
        console.warn('[서버 연결] 응답 상태: ' + response.status)
        return false
      }
    } catch (e) {
      console.error('[서버 연결] ✕ 실패: ' + e.message)
      console.error('[서버 주소] ' + BACKEND_BASE)
      return false
    }
  }

  async function checkInitStatus() {
    try {
      const r = await api('/auth/init-check')
      const card = document.getElementById('initPage')
      
      let html = '<div class="init-card"><h2>초기화 상태</h2>'
      
      // DB Status
      const dbStatusClass = r.dbStatus === 'healthy' ? 'success' : (r.dbStatus === 'unhealthy' ? 'error' : 'pending')
      const dbStatusIcon = r.dbStatus === 'healthy' ? '✓' : (r.dbStatus === 'unhealthy' ? '✕' : '⟳')
      html += '<div class="status-item ' + dbStatusClass + '">' +
        '<div class="status-icon">' + dbStatusIcon + '</div>' +
        '<div class="status-text">' +
        '<strong>Oracle 서버</strong>' +
        '<small>' + (r.dbStatus === 'healthy' ? '정상 연결됨' : (r.dbStatus === 'unhealthy' ? '연결 오류' : '확인 중')) + '</small>' +
        '</div></div>'

      // KIS Keys Status
      const kisStatusClass = r.hasKisKeys ? 'success' : 'error'
      const kisStatusIcon = r.hasKisKeys ? '✓' : '✕'
      html += '<div class="status-item ' + kisStatusClass + '">' +
        '<div class="status-icon">' + kisStatusIcon + '</div>' +
        '<div class="status-text">' +
        '<strong>KIS API 키</strong>' +
        '<small>' + (r.hasKisKeys ? '설정됨' : '설정 필요') + '</small>' +
        '</div></div>'
      
      html += '</div>'
      card.innerHTML = html

      // Auto-navigate after 2 seconds
      setTimeout(() => {
        if (r.hasKisKeys) {
          goToMainDashboard()
        } else {
          showPage('kisPage')
        }
      }, 2000)
    } catch (e) {
      document.getElementById('initPage').innerHTML = 
        '<div class="init-card"><div class="error-msg">오류: ' + e.message + '</div></div>'
      setTimeout(() => showPage('loginPage'), 3000)
    }
  }

  async function saveKisKeys() {
    try {
      const baseUrl = BACKEND_BASE  // 백엔드 URL 자동 사용
      const apiKey = document.getElementById('kisApiKey').value
      const apiSecret = document.getElementById('kisApiSecret').value
      
      if (!apiKey) {
        document.getElementById('kisError').innerHTML = '<div class="error-msg">API Key를 입력하세요</div>'
        return
      }

      await api('/kis/update', {
        method: 'POST',
        body: {
          kis_base_url: baseUrl,
          kis_api_key: apiKey,
          kis_api_secret: apiSecret,
          confirmation: '변경합니다'
        }
      })

      goToMainDashboard()
    } catch (e) {
      document.getElementById('kisError').innerHTML = '<div class="error-msg">오류: ' + e.message + '</div>'
    }
  }

  async function goToMainDashboard() {
    showPage('mainPage')
    await loadKisStatus()
    await loadStatus()
    await loadBalance()  // 초기 잔고 로드
    await loadAutoControlStatus()
    await loadTradingStatus()
    
    // 저장된 갱신 시간 불러오기
    loadBalanceRefreshPreference()
    loadStatusRefreshPreference()
    updateStatusRefreshPreview()
    
    // 잔고 자동 갱신 설정
    startBalanceAutoRefresh()
  }

  async function loadKisStatus() {
    try {
      const r = await api('/kis/status')
      const preview = r.kisKeyPreview || '미설정'
      const baseUrl = r.kisBaseUrl ? '(' + r.kisBaseUrl.substring(0, 30) + '...)' : ''
      
      document.getElementById('headerKeyPreview').textContent = preview
      document.getElementById('headerKeyPreview').title = baseUrl
    } catch (e) {
      document.getElementById('headerKeyPreview').textContent = '오류'
    }
  }

  async function loadStatus() {
    try {
      const r = await api('/status')
      const dbOnline = r.dbStatus === 'healthy'
      const dbDot = document.getElementById('headerDbStatus')
      const dbText = document.getElementById('headerDbText')
      
      if (dbOnline) {
        dbDot.className = 'status-dot online'
        dbText.textContent = '정상'
      } else {
        dbDot.className = 'status-dot offline'
        dbText.textContent = '오류'
      }

      setOut('statusOut', r)
    } catch (e) {
      setOut('statusOut', { error: e.message })
      document.getElementById('headerDbStatus').className = 'status-dot offline'
      document.getElementById('headerDbText').textContent = '오류'
    }
  }

  /**
   * 잔고 조회 함수
   */
  async function loadBalance() {
    try {
      const r = await api('/api/trading/balance')
      const balanceEl = document.getElementById('headerBalance')
      
      if (r.ok && r.data) {
        const data = r.data
        // 총 자산을 표시 (원화)
        const totalAssets = parseInt(data.totalAssets) || 0
        const formatted = totalAssets.toLocaleString('ko-KR')
        balanceEl.textContent = '₩' + formatted
        balanceEl.title = '총 자산: ₩' + formatted + ' | 보유 현금: ₩' + (parseInt(data.cashBalance) || 0).toLocaleString('ko-KR') + ' | 클릭하여 새로고침'
        balanceEl.style.color = '#10b981'
      } else {
        balanceEl.textContent = '조회 실패'
        balanceEl.style.color = '#ef4444'
      }
    } catch (e) {
      const balanceEl = document.getElementById('headerBalance')
      balanceEl.textContent = '오류'
      balanceEl.style.color = '#ef4444'
      balanceEl.title = '클릭하여 재시도'
      console.warn('[Balance Load]', e.message)
    }
  }

  function setQuickControlMessage(message, type = 'success') {
    const box = document.getElementById('quickControlMsg')
    if (!box) return
    const className = type === 'error' ? 'error-msg' : 'success-msg'
    box.innerHTML = '<div class="' + className + '">' + message + '</div>'
  }

  async function loadAutoControlStatus() {
    try {
      const r = await api('/api/trading/auto/status')
      const data = r.data || {}
      
      // 버튼 상태 업데이트
      const domesticBtn = document.getElementById('startDomesticBtn')
      const overseasBtn = document.getElementById('startOverseasBtn')
      const stopBtn = document.getElementById('stopAllBtn')
      
      if (domesticBtn && overseasBtn && stopBtn) {
        const domesticRunning = data.domestic?.running || false
        const overseasRunning = data.overseas?.running || false
        
        domesticBtn.disabled = domesticRunning
        domesticBtn.textContent = domesticRunning ? '🇰🇷 국내 매매 중...' : '🇰🇷 국내 자동매매 시작'
        
        overseasBtn.disabled = overseasRunning
        overseasBtn.textContent = overseasRunning ? '🌎 해외 매매 중...' : '🌎 해외 자동매매 시작'
        
        stopBtn.disabled = !domesticRunning && !overseasRunning
        
        // 상태 표시
        const statusEl = document.getElementById('autoTradingStatus')
        if (statusEl) {
          let statusHtml = '<div style=\"padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 14px;\">'
          statusHtml += '<div><strong>국내:</strong> ' + (domesticRunning ? '<span style=\"color: #10b981;\">✓ 실행 중 (사이클: ' + (data.domestic.cycleCount || 0) + '회)</span>' : '<span style=\"color: #999;\">중단됨</span>') + '</div>'
          statusHtml += '<div style=\"margin-top: 8px;\"><strong>해외:</strong> ' + (overseasRunning ? '<span style=\"color: #10b981;\">✓ 실행 중 (사이클: ' + (data.overseas.cycleCount || 0) + '회)</span>' : '<span style=\"color: #999;\">중단됨</span>') + '</div>'
          if (data.intervalSeconds) {
            statusHtml += '<div style=\"margin-top: 8px; color: #666;\"><small>갱신 주기: ' + data.intervalSeconds + '초</small></div>'
          }
          statusHtml += '</div>'
          statusEl.innerHTML = statusHtml
        }
      }
    } catch (e) {
      console.error('[자동매매] 상태 로드 실패:', e)
    }
  }

  async function startAutoTrading(market) {
    try {
      const targetMarket = market === 'overseas' ? 'overseas' : 'domestic'
      setQuickControlMessage((targetMarket === 'overseas' ? '해외' : '국내') + ' 자동매매 시작 중...')

      const r = await api('/api/trading/auto/start', {
        method: 'POST',
        body: { market: targetMarket },
      })

      await loadAutoControlStatus()
      setQuickControlMessage(
        (targetMarket === 'overseas' ? '해외' : '국내') + ' 자동매매 시작 완료' + (r.firstResult?.ok ? '' : ' (첫 사이클 일부 실패 가능)')
      )

      if (statusPanelOpen) {
        await refreshStatusView()
      }
    } catch (e) {
      setQuickControlMessage('자동매매 시작 실패: ' + e.message, 'error')
    }
  }

  function openStatusView() {
    const panel = document.getElementById('statusViewPanel')
    if (!panel) return
    panel.classList.remove('hidden')
    statusPanelOpen = true
    refreshStatusView()
    startStatusAutoRefresh()
  }

  function closeStatusView() {
    const panel = document.getElementById('statusViewPanel')
    if (!panel) return
    panel.classList.add('hidden')
    statusPanelOpen = false
    stopStatusAutoRefresh()
  }

  function renderStatusPositions(positions) {
    const list = document.getElementById('statusPositionsList')
    if (!list) return

    if (!positions || !positions.length) {
      list.innerHTML = '<div style="padding:10px; color:#6b7280; text-align:center;">현재 보유 포지션이 없습니다</div>'
      return
    }

    list.innerHTML = positions
      .map((item) => {
        const shares = Number(item.shares || 0).toLocaleString('ko-KR')
        const entryPrice = Number(item.entryPrice || 0).toLocaleString('ko-KR')
        const entryDate = item.entryDate ? String(item.entryDate).substring(0, 19).replace('T', ' ') : '-'
        return (
          '<div class="item">' +
          '<div><strong>' + item.symbol + '</strong><br/><small>' + shares + '주 @ ₩' + entryPrice + '</small></div>' +
          '<div style="text-align:right; font-size:11px; color:#6b7280;">' + entryDate + '</div>' +
          '</div>'
        )
      })
      .join('')
  }

  function renderStatusReports(reports) {
    const box = document.getElementById('statusReportsList')
    if (!box) return

    if (!reports || !reports.length) {
      box.innerHTML = '<div style="padding:10px; color:#6b7280; text-align:center;">표시할 보고서가 없습니다</div>'
      return
    }

    box.innerHTML = reports
      .map((item) => {
        const date = item.analysis_date ? String(item.analysis_date).replace('T', ' ').substring(0, 19) : '-'
        const provider = item.provider || 'N/A'
        const summary = String(item.summary || '').slice(0, 200)
        return (
          '<div class="report-item">' +
          '<div class="meta">' + date + ' · ' + provider + '</div>' +
          '<div class="summary">' + summary + '</div>' +
          '</div>'
        )
      })
      .join('')
  }

  async function refreshStatusView() {
    try {
      const r = await api('/api/trading/dashboard-overview')
      const data = r.data || {}
      const trading = data.trading || {}
      const auto = data.auto || {}
      const strategy = data.strategy || {}
      const reports = data.reports || {}

      setOut('statusSummaryOut', {
        systemStatus: trading.systemStatus,
        lastRunTime: trading.lastRunTime,
        totalCapital: trading.totalCapital,
        cashAvailable: trading.cashAvailable,
        unrealizedPnl: trading.unrealizedPnl,
        realizedPnl: trading.realizedPnl,
        totalPositions: trading.totalPositions,
        runningMarkets: {
          domestic: !!auto.domestic?.running,
          overseas: !!auto.overseas?.running,
        },
      })

      setOut('statusWinrateOut', {
        avgWinRate: strategy.avgWinRate,
        totalStrategies: strategy.totalStrategies,
        rankingTop5: (strategy.ranking || []).slice(0, 5),
      })

      renderStatusPositions(trading.positions || [])
      renderStatusReports(reports.aiReports || [])
      await loadAutoControlStatus()
    } catch (e) {
      setOut('statusSummaryOut', { error: e.message })
      setOut('statusWinrateOut', { error: e.message })
    }
  }

  async function generateLiveReport() {
    try {
      const r = await api('/api/trading/report/live')
      const data = r.data || {}
      setOut('statusLiveReportOut', {
        generatedAt: data.generatedAt,
        marketHint: data.marketHint,
        totalCapital: data.totalCapital,
        cashAvailable: data.cashAvailable,
        totalPositions: data.totalPositions,
        performanceReport: data.performanceReport,
        reportMetadata: data.reportMetadata,
        liveReportPreview: data.liveReportPreview,
      })
    } catch (e) {
      setOut('statusLiveReportOut', { error: e.message })
    }
  }

  async function stopAllTrading() {
    const warningText =
      '⚠️ 경고\\n\\n이 작업은 즉시 모든 보유 포지션을 매도하고 자동매매를 중단합니다.\\n정말 계속하시겠습니까?'
    if (!confirm(warningText)) return

    const input = prompt('중단하려면 정확히 다음 문구를 입력하세요:\\n모든거래를중단합니다')
    if (input !== '모든거래를중단합니다') {
      alert('확인 문구가 일치하지 않아 취소되었습니다.')
      return
    }

    try {
      setQuickControlMessage('모든 거래 중단 처리 중...')
      const r = await api('/api/trading/auto/stop-all', {
        method: 'POST',
        body: { confirmation: input },
      })

      const sold = Number(r.liquidation?.sold?.length || 0)
      const failed = Number(r.liquidation?.failed?.length || 0)
      setQuickControlMessage('모든 거래 중단 완료 (청산 성공: ' + sold + '건, 실패: ' + failed + '건)')
      await loadAutoControlStatus()

      if (statusPanelOpen) {
        await refreshStatusView()
      }
    } catch (e) {
      setQuickControlMessage('모든 거래 중단 실패: ' + e.message, 'error')
    }
  }

  function updateStatusRefreshInterval() {
    const seconds = parseInt(document.getElementById('statusRefreshInterval').value || '120')
    statusRefreshSeconds = seconds
    localStorage.setItem('statusRefreshSeconds', String(seconds))
    updateStatusRefreshPreview()
    if (statusPanelOpen) startStatusAutoRefresh()
  }

  function loadStatusRefreshPreference() {
    const saved = localStorage.getItem('statusRefreshSeconds')
    if (!saved) return
    statusRefreshSeconds = parseInt(saved)
    const select = document.getElementById('statusRefreshInterval')
    if (select) select.value = String(statusRefreshSeconds)
  }

  function updateStatusRefreshPreview() {
    const preview = document.getElementById('statusRefreshPreview')
    if (!preview) return

    let text = '2분마다'
    if (statusRefreshSeconds === 30) text = '30초마다'
    else if (statusRefreshSeconds === 60) text = '1분마다'
    else if (statusRefreshSeconds === 120) text = '2분마다'
    else if (statusRefreshSeconds === 180) text = '3분마다'
    else if (statusRefreshSeconds === 300) text = '5분마다'
    else if (statusRefreshSeconds === 600) text = '10분마다'

    preview.textContent = '✓ 현재 설정: ' + text + ' 자동 갱신'
  }

  function startStatusAutoRefresh() {
    stopStatusAutoRefresh()
    statusRefreshInterval = setInterval(() => {
      refreshStatusView().catch((e) => console.warn('[Status Refresh]', e.message))
    }, statusRefreshSeconds * 1000)
  }

  function stopStatusAutoRefresh() {
    if (statusRefreshInterval) {
      clearInterval(statusRefreshInterval)
      statusRefreshInterval = null
    }
  }

  async function loadErrors() {
    try {
      setOut('statusOut', await api('/errors'))
    } catch (e) {
      setOut('statusOut', { error: e.message })
    }
  }

  async function loadTradingStatus() {
    try {
      const r = await api('/trading/status')
      const positions = r.positions || {}
      
      // 포지션 목록 표시
      const posList = document.getElementById('positionsList')
      posList.innerHTML = ''
      
      Object.entries(positions).forEach(([symbol, pos]) => {
        const item = document.createElement('div')
        item.className = 'item'
        item.innerHTML = '<div>' +
          '<strong>' + symbol + '</strong><br/>' +
          '<small>' + pos.shares + '주 @ ' + pos.entry_price.toFixed(2) + '</small>' +
          '</div><div style="text-align:right;font-size:11px;">' +
          pos.entry_date.substring(0, 10) +
          '</div>'
        posList.appendChild(item)
      })
      
      if (Object.keys(positions).length === 0) {
        posList.innerHTML = '<div style="padding: 15px; color: #999; text-align: center;">현재 포지션 없음</div>'
      }
      
      setOut('tradingOut', r)
    } catch (e) {
      setOut('tradingOut', { error: e.message })
    }
  }

  function openSettingsModal() {
    document.getElementById('settingsModal').classList.add('active')
    loadSettingsForm()
  }

  function closeSettingsModal() {
    document.getElementById('settingsModal').classList.remove('active')
  }

  async function loadSettingsForm() {
    try {
      // 잔고 갱신 설정 로드
      loadBalanceRefreshPreference()
      updateBalanceRefreshPreview()
      
      // KIS 키 정보 표시
      const r = await api('/kis/status')
      const baseUrlDisplay = document.getElementById('settingsBaseUrlDisplay')
      const keyDisplay = document.getElementById('settingsKeyDisplay')
      
      if (baseUrlDisplay) {
        baseUrlDisplay.textContent = r.kisBaseUrl || '미설정'
      }
      if (keyDisplay) {
        keyDisplay.textContent = r.kisKeyPreview || '미설정'
      }
    } catch (e) {
      console.error('Failed to load settings:', e)
      const baseUrlDisplay = document.getElementById('settingsBaseUrlDisplay')
      const keyDisplay = document.getElementById('settingsKeyDisplay')
      if (baseUrlDisplay) baseUrlDisplay.textContent = '오류'
      if (keyDisplay) keyDisplay.textContent = '오류'
    }
  }

  function goToKisSetup() {
    closeSettingsModal()
    showPage('kisPage')
  }

  /**
   * 잔고 갱신 주기 설정 저장
   */
  function updateBalanceRefreshInterval() {
    const seconds = parseInt(document.getElementById('settingsBalanceRefreshInterval').value)
    balanceRefreshSeconds = seconds
    localStorage.setItem('balanceRefreshSeconds', seconds.toString())
    updateBalanceRefreshPreview()
    
    // 즉시 갱신 주기 변경
    if (balanceRefreshInterval) clearInterval(balanceRefreshInterval)
    startBalanceAutoRefresh()
  }
  
  /**
   * 저장된 갱신 시간 불러오기
   */
  function loadBalanceRefreshPreference() {
    const saved = localStorage.getItem('balanceRefreshSeconds')
    if (saved) {
      balanceRefreshSeconds = parseInt(saved)
      const select = document.getElementById('settingsBalanceRefreshInterval')
      if (select) {
        select.value = balanceRefreshSeconds.toString()
      }
    }
  }
  
  /**
   * 갱신 시간 미리보기 업데이트
   */
  function updateBalanceRefreshPreview() {
    const previewEl = document.getElementById('balanceRefreshPreview')
    let displayText = ''
    if (balanceRefreshSeconds === 30) displayText = '30초마다 (매우 빠름)'
    else if (balanceRefreshSeconds === 60) displayText = '1분마다'
    else if (balanceRefreshSeconds === 120) displayText = '2분마다 (기본값)'
    else if (balanceRefreshSeconds === 180) displayText = '3분마다'
    else if (balanceRefreshSeconds === 300) displayText = '5분마다'
    else if (balanceRefreshSeconds === 600) displayText = '10분마다'
    
    previewEl.textContent = '✓ 현재 설정: ' + displayText + ' 자동 갱신'
  }
  
  /**
   * 잔고 자동 갱신 시작
   */
  function startBalanceAutoRefresh() {
    if (balanceRefreshInterval) clearInterval(balanceRefreshInterval)
    balanceRefreshInterval = setInterval(() => {
      loadBalance().catch(e => console.warn('[Balance Refresh]', e.message))
    }, balanceRefreshSeconds * 1000)
  }
  
  /**
   * 헤더의 잔고 클릭하여 새로고침
   */
  document.addEventListener('DOMContentLoaded', () => {
    const balanceEl = document.getElementById('headerBalance')
    if (balanceEl) {
      balanceEl.addEventListener('click', () => {
        balanceEl.style.opacity = '0.6'
        loadBalance().finally(() => {
          balanceEl.style.opacity = '1'
        })
      })
    }
  })

  let performanceChart = null

  async function loadStatusPage() {
    try {
      // API 호출
      const r = await api('/api/trading/dashboard-overview')
      const data = r.data || {}
      const trading = data.trading || {}
      const auto = data.auto || {}

      // 통계 카드 업데이트
      const totalInvested = Number(trading.totalCapital || 0)
      const realizedPnl = Number(trading.realizedPnl || 0)
      const unrealizedPnl = Number(trading.unrealizedPnl || 0)
      const roi = totalInvested > 0 ? ((realizedPnl + unrealizedPnl) / totalInvested * 100) : 0

      document.getElementById('statTotalInvested').textContent = '₩' + totalInvested.toLocaleString('ko-KR')
      document.getElementById('statROI').textContent = roi.toFixed(2) + '%'
      document.getElementById('statROI').style.color = roi >= 0 ? '#10b981' : '#ef4444'
      
      // 운영 시간 계산 (lastRunTime 기준)
      const runtime = trading.lastRunTime || '시작 전'
      document.getElementById('statRuntime').textContent = runtime
      
      // 포지션 수
      const positions = trading.positions || []
      document.getElementById('statPositions').textContent = positions.length + '개'

      // 포지션 리스트
      renderPositionList(positions)

      // 자동매매 상태
      updateTradingStatus(auto)

      // 차트 그리기
      drawPerformanceChart(data)

      // 오류 로그 로드
      loadErrorLogs()
    } catch (e) {
      console.error('현황 페이지 로드 실패:', e)
    }
  }

  function renderPositionList(positions) {
    const list = document.getElementById('statusPositionList')
    if (!list) return

    if (!positions || !positions.length) {
      list.innerHTML = '<div style="padding:20px; color:#6b7280; text-align:center;">현재 보유 포지션이 없습니다</div>'
      return
    }

    list.innerHTML = positions.map(p => {
      const shares = Number(p.shares || 0).toLocaleString('ko-KR')
      const entryPrice = Number(p.entryPrice || 0).toLocaleString('ko-KR')
      const entryDate = p.entryDate ? String(p.entryDate).substring(0, 16).replace('T', ' ') : '-'
      return '<div class="position-item">' +
        '<strong>' + p.symbol + '</strong>' +
        '<small>' + shares + '주 @ ₩' + entryPrice + ' | ' + entryDate + '</small>' +
        '</div>'
    }).join('')
  }

  function updateTradingStatus(auto) {
    const domesticDiv = document.getElementById('domesticStatus')
    const overseasDiv = document.getElementById('overseasStatus')
    
    if (domesticDiv) {
      const isRunning = auto.domestic?.running
      domesticDiv.innerHTML = isRunning 
        ? '<div style="color:#10b981;">✓ 실행 중</div>' 
        : '<div style="color:#6b7280;">⏸️ 중지됨</div>'
    }
    
    if (overseasDiv) {
      const isRunning = auto.overseas?.running
      overseasDiv.innerHTML = isRunning 
        ? '<div style="color:#10b981;">✓ 실행 중</div>' 
        : '<div style="color:#6b7280;">⏸️ 중지됨</div>'
    }
  }

  function drawPerformanceChart(data) {
    const canvas = document.getElementById('performanceChart')
    if (!canvas) return

    // 기존 차트가 있으면 제거
    if (performanceChart) {
      performanceChart.destroy()
    }

    // 샘플 데이터 (실제로는 백엔드에서 시계열 데이터를 받아와야 함)
    const trading = data.trading || {}
    const realizedPnl = Number(trading.realizedPnl || 0)
    const unrealizedPnl = Number(trading.unrealizedPnl || 0)
    
    // 간단한 막대 차트로 수익 표시
    const ctx = canvas.getContext('2d')
    performanceChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['실현 수익', '미실현 수익', '총 수익'],
        datasets: [{
          label: '수익 (₩)',
          data: [realizedPnl, unrealizedPnl, realizedPnl + unrealizedPnl],
          backgroundColor: [
            realizedPnl >= 0 ? '#10b981' : '#ef4444',
            unrealizedPnl >= 0 ? '#3b82f6' : '#f59e0b',
            (realizedPnl + unrealizedPnl) >= 0 ? '#8b5cf6' : '#ef4444'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    })
  }

  async function loadErrorLogs() {
    try {
      const r = await api('/errors')
      const errors = r.errors || []
      const list = document.getElementById('statusErrorList')
      if (!list) return

      if (!errors || !errors.length) {
        list.innerHTML = '<div style="padding:20px; color:#6b7280; text-align:center;">오류가 없습니다</div>'
        return
      }

      list.innerHTML = errors.slice(0, 10).map(e => 
        '<div class="error-item">' +
        '<strong>' + (e.type || '오류') + '</strong>' +
        '<small>' + (e.message || '') + ' | ' + (e.timestamp || '') + '</small>' +
        '</div>'
      ).join('')
    } catch (e) {
      console.error('오류 로그 로드 실패:', e)
    }
  }

  async function performLogout() {
    try {
      stopStatusAutoRefresh()
      await api('/logout', { method: 'POST' })
      currentUser.isLoggedIn = false
      
      // localStorage에서 로그인 상태 제거
      localStorage.removeItem('isLoggedIn')
      
      document.getElementById('loginPassword').value = ''
      document.getElementById('loginError').innerHTML = ''
      showPage('loginPage')
    } catch (e) {
      alert('로그아웃 오류: ' + e.message)
    }
  }

  // DOM이 로드된 후 이벤트 리스너 등록
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventListeners)
  } else {
    initEventListeners()
  }

  function initEventListeners() {
    const loginInput = document.getElementById('loginPassword')
    const loginBtn = document.getElementById('loginBtn')
    
    // 저장된 로그인 상태 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (isLoggedIn) {
      console.log('[초기화] 저장된 로그인 상태 감지')
      currentUser.isLoggedIn = true
      
      // 비동기로 초기화 체크 실행
      setTimeout(() => {
        showPage('initPage')
        checkInitStatus().catch(e => {
          console.error('[초기화 체크] 실패:', e)
          // 오류 시 로그인 페이지로 돌아가기
          localStorage.removeItem('isLoggedIn')
          showPage('loginPage')
        })
      }, 100)
    }
    
    // 서버 연결 상태 확인 (비동기, 백그라운드에서 실행)
    checkServerConnection().catch(e => {
      console.error('[초기화] 서버 연결 확인 중 에러:', e)
    })
    
    if (loginBtn) {
      loginBtn.addEventListener('click', performLogin)
    }
    
    if (loginInput) {
      loginInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performLogin()
      })
    }
  }
</script>
</body>
</html>`

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname === '/' || url.pathname === '/admin') {
    // 템플릿 변수 치환
    const html = adminHtml.replace('${BACKEND_BASE}', BACKEND_BASE)
    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=UTF-8' },
    })
  }

  if (url.pathname.startsWith('/api/')) {
    return proxyToBackend(request, url)
  }

  return new Response('Not Found', { status: 404 })
}

async function proxyToBackend(request, url) {
  const targetPath = url.pathname.replace('/api', '') || '/'
  const targetUrl = new URL(targetPath + url.search, BACKEND_BASE)
  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.set('x-forwarded-host', url.host)
  headers.set('x-forwarded-proto', 'https')

  const init = {
    method: request.method,
    headers,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    redirect: 'follow',
  }

  const response = await fetch(targetUrl.toString(), init)
  return response
}
