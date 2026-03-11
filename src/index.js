const DEFAULT_BACKEND_BASE = 'http://localhost:4000'  // 로컬 개발 시 기본값

function getBackendBase(env) {
  const fromEnv = env && typeof env.BACKEND_BASE_URL === 'string'
    ? env.BACKEND_BASE_URL.trim()
    : ''
  return fromEnv || DEFAULT_BACKEND_BASE
}

const adminHtml = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Stock Auto Admin v2</title>
  <link rel="icon" href="data:," />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html {
      height: 100%;
      width: 100%;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background:
        radial-gradient(circle at 8% 20%, rgba(104, 170, 255, 0.35) 0%, rgba(104, 170, 255, 0) 45%),
        radial-gradient(circle at 88% 18%, rgba(255, 190, 120, 0.28) 0%, rgba(255, 190, 120, 0) 42%),
        radial-gradient(circle at 50% 86%, rgba(140, 220, 200, 0.25) 0%, rgba(140, 220, 200, 0) 44%),
        linear-gradient(140deg, #eef4ff 0%, #f4f8ff 42%, #f6f6f2 100%);
      height: 100%;
      width: 100%;
      color: #1a1a1a;
      background-size: 140% 140%, 150% 150%, 160% 160%, 100% 100%;
      animation: pageGradientDrift 20s ease-in-out infinite alternate;
    }
    @keyframes pageGradientDrift {
      0% {
        background-position: 0% 0%, 100% 0%, 50% 100%, 0% 0%;
      }
      100% {
        background-position: 12% 8%, 86% 12%, 42% 90%, 0% 0%;
      }
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
      background:
        radial-gradient(circle at 20% 24%, rgba(127, 182, 255, 0.42) 0%, rgba(127, 182, 255, 0) 48%),
        radial-gradient(circle at 82% 14%, rgba(255, 201, 140, 0.34) 0%, rgba(255, 201, 140, 0) 44%),
        radial-gradient(circle at 72% 78%, rgba(150, 232, 208, 0.32) 0%, rgba(150, 232, 208, 0) 46%),
        linear-gradient(132deg, #f3f8ff 0%, #f8fbff 48%, #fcfbf7 100%);
      background-size: 170% 170%, 180% 180%, 170% 170%, 100% 100%;
      animation: loginGradientShift 18s ease-in-out infinite alternate;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    @keyframes loginGradientShift {
      0% {
        background-position: 0% 0%, 100% 0%, 80% 100%, 0% 0%;
      }
      100% {
        background-position: 14% 10%, 88% 18%, 60% 84%, 0% 0%;
      }
    }
    .login-page.active::before {
      content: '';
      position: absolute;
      inset: -30%;
      background:
        radial-gradient(circle at 18% 26%, rgba(80, 144, 255, 0.28) 0%, rgba(80, 144, 255, 0) 36%),
        radial-gradient(circle at 78% 22%, rgba(255, 171, 93, 0.22) 0%, rgba(255, 171, 93, 0) 32%),
        radial-gradient(circle at 52% 78%, rgba(111, 209, 190, 0.18) 0%, rgba(111, 209, 190, 0) 34%);
      filter: blur(6px);
      animation: auraFloat 24s ease-in-out infinite alternate;
      pointer-events: none;
    }
    .login-page.active::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(26, 60, 120, 0.10) 0.8px, transparent 0.9px);
      background-size: 26px 26px;
      opacity: 0.22;
      mix-blend-mode: soft-light;
      animation: textureDrift 32s linear infinite;
      pointer-events: none;
    }
    @keyframes auraFloat {
      0% {
        transform: translate(-2%, -1%) scale(1);
      }
      100% {
        transform: translate(3%, 2%) scale(1.06);
      }
    }
    @keyframes textureDrift {
      0% {
        transform: translate3d(0, 0, 0);
      }
      100% {
        transform: translate3d(18px, 18px, 0);
      }
    }
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 24px;
      padding: 60px 50px;
      box-shadow: 0 22px 70px rgba(20, 43, 76, 0.22),
                  0 0 120px rgba(110, 175, 245, 0.22),
                  inset 0 1px 0 rgba(255,255,255,0.6);
      width: 90%;
      max-width: 440px;
      text-align: center;
      position: relative;
      z-index: 1;
      transform: translateY(0);
      transition: transform 0.3s ease;
    }
    .login-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 30px 84px rgba(16, 37, 66, 0.28),
                  0 0 140px rgba(110, 175, 245, 0.3);
    }
    .login-card h1 {
      font-size: 42px;
      font-weight: 900;
      margin-bottom: 12px;
      background: linear-gradient(130deg, #0c65b3 0%, #2563eb 46%, #14b8a6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -2px;
      text-shadow: 0 3px 16px rgba(39, 97, 168, 0.16);
    }
    .login-card .subtitle {
      color: #4f5f76;
      margin-bottom: 40px;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    #loginBtn {
      background: linear-gradient(120deg, #1767b2 0%, #2f7de8 38%, #38bdb2 74%, #f2ad69 100%);
      background-size: 230% 230%;
      box-shadow: 0 12px 28px rgba(39, 102, 178, 0.35),
                  0 6px 18px rgba(56, 189, 178, 0.2);
      animation: loginBtnFlow 7s ease-in-out infinite;
    }
    #loginBtn:hover {
      background-position: 100% 45%;
      box-shadow: 0 16px 34px rgba(39, 102, 178, 0.45),
                  0 10px 22px rgba(56, 189, 178, 0.26);
    }
    #loginBtn:active {
      box-shadow: 0 8px 18px rgba(39, 102, 178, 0.38);
    }
    @keyframes loginBtnFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    /* Init Page */
    .page.init-page.active {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: #fff;
      background-size: 100% 100%;
      /* animation: gradientShift 15s ease infinite; */
    }
    .init-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 24px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 100px rgba(139, 92, 246, 0.2);
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
    .main-page.active { 
      display: block; 
      background:
        radial-gradient(circle at 0% 0%, rgba(21, 94, 239, 0.08), transparent 24%),
        radial-gradient(circle at 100% 12%, rgba(15, 118, 110, 0.08), transparent 22%),
        linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); 
      min-height: 100vh; 
      padding-top: 0; 
    }
    .top-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid rgba(229, 231, 235, 0.8);
      padding: 18px 24px;
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 1.35fr) auto;
      gap: 16px;
      align-items: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04),
                  0 2px 8px rgba(0, 0, 0, 0.02);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      grid-column: 1;
    }
    .header-title { 
      font-size: 20px; 
      font-weight: 800; 
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
    .header-status {
      display: flex;
      gap: 12px;
      align-items: center;
      min-width: 0;
      flex-wrap: wrap;
      justify-content: center;
      grid-column: 2;
    }
    .status-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      padding: 8px 14px;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      font-weight: 600;
      color: #475569;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      min-width: 0;
    }
    .status-badge code,
    .status-badge span:last-child {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .status-badge:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      box-shadow: 0 0 8px currentColor;
    }
    .status-dot.online { background: #10b981; }
    .status-dot.offline { background: #ef4444; }
    .header-buttons {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      flex-wrap: wrap;
      grid-column: 3;
      justify-self: end;
    }
    .header-btn {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      color: white;
      border: none;
      border-radius: 10px;
      padding: 10px 18px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
      white-space: nowrap;
    }
    .header-btn:hover { 
      background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(99, 102, 241, 0.35);
    }
    .header-btn.secondary { 
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); 
      color: #374151;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
    .header-btn.secondary:hover { 
      background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    /* Content Wrapper */
    .wrap {
      max-width: 1320px;
      margin: 24px auto;
      padding: 0 20px;
    }
    .row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(229, 231, 235, 0.8);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06),
                  0 2px 12px rgba(0, 0, 0, 0.04);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1),
                  0 4px 16px rgba(0, 0, 0, 0.06);
      border-color: rgba(139, 92, 246, 0.3);
    }
    .card:hover::before {
      opacity: 1;
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
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      color: white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    .quick-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
    }
    .quick-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    .quick-btn.domestic { 
      background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
    }
    .quick-btn.overseas { 
      background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); 
    }
    .quick-btn.status { 
      background: linear-gradient(135deg, #0f766e 0%, #047857 100%); 
    }
    .quick-btn.stop { 
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); 
    }

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
    
    h2 { 
      font-size: 18px; 
      font-weight: 800; 
      margin: 0 0 20px;
      color: #1e293b;
      letter-spacing: -0.5px;
    }
    label {
      display: block;
      font-size: 14px;
      margin: 18px 0 10px;
      color: #374151;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    input, textarea, select {
      width: 100%;
      padding: 16px 18px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      box-sizing: border-box;
      font-family: inherit;
      font-size: 15px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: #f9fafb;
      font-weight: 500;
    }
    input:focus, textarea:focus, select:focus { 
      outline: none; 
      border-color: #8b5cf6;
      background: white;
      box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1),
                  0 4px 12px rgba(139, 92, 246, 0.15);
      transform: translateY(-1px);
    }
    input:hover, textarea:hover, select:hover {
      border-color: #c7d2fe;
      background: white;
    }
    textarea { min-height: 90px; }
    
    button.btn {
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
      background-size: 200% 200%;
      color: white;
      border: none;
      border-radius: 12px;
      padding: 16px 24px;
      cursor: pointer;
      margin-right: 6px;
      margin-top: 28px;
      font-size: 16px;
      font-weight: 700;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      width: 100%;
      box-shadow: 0 8px 24px rgba(139, 92, 246, 0.35),
                  0 4px 12px rgba(139, 92, 246, 0.25);
      letter-spacing: 0.5px;
      position: relative;
      overflow: hidden;
    }
    button.btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.5s;
    }
    button.btn:hover::before {
      left: 100%;
    }
    button.btn:hover {
      background-position: 100% 50%;
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(139, 92, 246, 0.45),
                  0 8px 16px rgba(139, 92, 246, 0.3);
    }
    button.btn:active {
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(139, 92, 246, 0.4);
    }
    button.btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
    }
    button.btn:disabled:hover {
      transform: none;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
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
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
      opacity: 0.9;
      pointer-events: none;
    }
    button.btn.success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
    }
    button.btn.success:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
      transform: none;
    }
    button.btn.failure {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.35);
    }
    button.btn.failure:hover {
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      transform: none;
    }
    button.btn.secondary {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      color: #374151;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    button.btn.secondary:hover { 
      background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
    }
    button.btn.danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.35);
    }
    button.btn.danger:hover { 
      background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
      box-shadow: 0 12px 32px rgba(239, 68, 68, 0.45);
    }
    
    .tabs {
      display: flex;
      gap: 8px;
      margin: 10px 0;
    }
    .tabs button {
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      color: #374151;
      border: none;
      border-radius: 10px;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
    .tabs button.active { 
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
      color: white;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
      transform: translateY(-2px);
    }
    .tabs button:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
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
      display: grid;
      gap: 22px;
    }
    .usage-hero {
      position: relative;
      overflow: hidden;
      padding: 30px;
      border-radius: 28px;
      background:
        radial-gradient(circle at 18% 24%, rgba(90, 157, 255, 0.26) 0%, rgba(90, 157, 255, 0) 34%),
        radial-gradient(circle at 85% 18%, rgba(255, 186, 102, 0.24) 0%, rgba(255, 186, 102, 0) 30%),
        linear-gradient(135deg, #0f172a 0%, #154a7a 48%, #0f766e 100%);
      color: white;
      box-shadow: 0 24px 70px rgba(15, 23, 42, 0.24);
    }
    .usage-hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, rgba(255,255,255,0.14), rgba(255,255,255,0));
      pointer-events: none;
    }
    .usage-eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.18);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 18px;
    }
    .usage-hero h2 {
      margin: 0 0 14px;
      font-size: clamp(28px, 4vw, 44px);
      line-height: 1.08;
      letter-spacing: -0.04em;
      color: white;
    }
    .usage-hero p {
      margin: 0;
      max-width: 760px;
      color: rgba(255,255,255,0.84);
      font-size: 16px;
      line-height: 1.7;
    }
    .guide-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 18px;
    }
    .guide-card {
      position: relative;
      overflow: hidden;
      padding: 24px;
      border-radius: 24px;
      background: rgba(255,255,255,0.92);
      border: 1px solid rgba(148, 163, 184, 0.16);
      box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
    }
    .guide-card::before {
      content: '';
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 4px;
      background: var(--guide-accent, linear-gradient(90deg, #2563eb, #14b8a6));
    }
    .guide-card h3 {
      margin: 0 0 10px;
      color: #14233c;
      font-size: 20px;
      letter-spacing: -0.02em;
    }
    .guide-card p,
    .guide-card li {
      color: #58677d;
      font-size: 14px;
      line-height: 1.75;
    }
    .guide-card ul {
      margin: 14px 0 0 18px;
      padding: 0;
    }
    .guide-card strong {
      color: #16243b;
    }
    .guide-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }
    .guide-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 9px 14px;
      border-radius: 999px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #334155;
      font-size: 12px;
      font-weight: 700;
    }
    .guide-section-title {
      margin: 8px 0 -2px;
      color: #17324f;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .guide-stack {
      display: grid;
      gap: 16px;
    }
    .guide-callout {
      padding: 18px 20px;
      border-radius: 20px;
      background: linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%);
      border: 1px solid #fed7aa;
      color: #9a3412;
      font-size: 14px;
      line-height: 1.7;
    }
    .guide-callout strong {
      color: #7c2d12;
    }
    .guide-troubleshoot {
      display: grid;
      gap: 14px;
    }
    .guide-troubleshoot-item {
      padding: 18px 20px;
      border-radius: 18px;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      border: 1px solid #e2e8f0;
    }
    .guide-troubleshoot-item h4 {
      margin: 0 0 8px;
      color: #1e293b;
      font-size: 16px;
    }
    .ai-ops-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    .ai-ops-card {
      padding: 22px;
      border-radius: 22px;
      background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(240,247,255,0.9) 100%);
      border: 1px solid rgba(148, 163, 184, 0.16);
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);
    }
    .ai-ops-card span {
      display: block;
      color: #5b6b80;
      font-size: 13px;
      margin-bottom: 10px;
    }
    .ai-ops-card strong {
      display: block;
      color: #12233c;
      font-size: 24px;
      line-height: 1.25;
      margin-bottom: 8px;
    }
    .ai-ops-card small {
      color: #6b7280;
      line-height: 1.65;
    }
    .market-failure-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-top: 18px;
    }
    .market-failure-card {
      padding: 18px 20px;
      border-radius: 20px;
      border: 1px solid rgba(148, 163, 184, 0.16);
      background: linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.92) 100%);
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.05);
    }
    .market-failure-card strong,
    .market-failure-card small,
    .market-failure-card span {
      display: block;
    }
    .market-failure-card span {
      color: #64748b;
      font-size: 12px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 800;
    }
    .market-failure-card strong {
      color: #0f172a;
      font-size: 18px;
      margin-bottom: 8px;
    }
    .market-failure-card small {
      color: #6b7280;
      line-height: 1.7;
    }
    .market-failure-card.good {
      border-color: rgba(16, 185, 129, 0.2);
      background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
    }
    .market-failure-card.bad {
      border-color: rgba(239, 68, 68, 0.22);
      background: linear-gradient(180deg, #ffffff 0%, #fff7f7 100%);
    }
    .logs-toolbar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      margin-top: 18px;
    }
    .input.soft {
      width: 100%;
      min-height: 46px;
      border-radius: 16px;
      border: 1px solid #dbe3ef;
      background: rgba(255,255,255,0.9);
      padding: 0 14px;
      color: #1f2937;
      box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.04);
    }
    .download-status {
      margin-top: 14px;
      padding: 14px 16px;
      border-radius: 16px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      color: #475569;
      font-size: 14px;
    }
    .log-file-item {
      padding: 16px 18px;
      border-radius: 18px;
      background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
      border: 1px solid #e2e8f0;
    }
    .log-file-item strong,
    .log-file-item small {
      display: block;
    }
    .log-file-item strong {
      color: #1e293b;
      margin-bottom: 6px;
    }
    .log-file-item small {
      color: #64748b;
      line-height: 1.6;
    }

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

    :root {
      --bg: #f4f6f3;
      --surface: rgba(255, 255, 255, 0.82);
      --surface-strong: #ffffff;
      --surface-soft: #eef2ec;
      --line: rgba(25, 34, 28, 0.08);
      --text: #142018;
      --muted: #66756c;
      --brand: #0f766e;
      --brand-2: #155eef;
      --accent: #d97706;
      --good: #15803d;
      --bad: #dc2626;
      --shadow: 0 20px 50px rgba(19, 33, 24, 0.08);
      --radius-xl: 28px;
      --radius-lg: 20px;
      --radius-md: 14px;
    }

    body {
      font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif;
      background:
        radial-gradient(circle at top left, rgba(21, 94, 239, 0.12), transparent 28%),
        radial-gradient(circle at top right, rgba(15, 118, 110, 0.12), transparent 34%),
        linear-gradient(180deg, #f8faf8 0%, #eef2ee 100%);
      color: var(--text);
    }

    .login-page.active,
    .page.kis-page.active,
    .page.init-page.active {
      background:
        radial-gradient(circle at 15% 20%, rgba(21, 94, 239, 0.16), transparent 30%),
        radial-gradient(circle at 85% 15%, rgba(217, 119, 6, 0.12), transparent 22%),
        linear-gradient(160deg, #f6fbf9 0%, #edf2f0 55%, #f8faf7 100%);
    }

    .login-card,
    .init-card,
    .kis-card,
    .card,
    .modal-content,
    .stat-card,
    .trading-status-card {
      background: var(--surface);
      backdrop-filter: blur(22px) saturate(140%);
      border: 1px solid var(--line);
      box-shadow: var(--shadow);
    }

    .login-card h1,
    .header-title {
      font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
      letter-spacing: -0.04em;
    }

    .login-card {
      box-shadow: 0 32px 80px rgba(20, 32, 24, 0.12);
    }

    .login-card h1 {
      background: linear-gradient(135deg, #0f766e 0%, #155eef 65%, #d97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-shadow: none;
    }

    .top-header {
      background: rgba(255, 255, 255, 0.72);
      border-bottom: 1px solid rgba(20, 32, 24, 0.08);
      box-shadow: 0 12px 30px rgba(20, 32, 24, 0.06);
      border-radius: 0 0 24px 24px;
    }

    .header-title {
      font-size: 22px;
      background: linear-gradient(135deg, #12261c 0%, #0f766e 52%, #155eef 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      min-width: 0;
    }

    .status-badge {
      background: rgba(255, 255, 255, 0.7);
      border: 1px solid rgba(20, 32, 24, 0.08);
      color: var(--muted);
      border-radius: 999px;
      box-shadow: none;
      min-height: 44px;
    }

    .header-btn,
    .quick-btn,
    button.btn {
      border-radius: 16px;
    }

    .header-btn {
      background: linear-gradient(135deg, #12261c 0%, #0f766e 100%);
      box-shadow: 0 10px 24px rgba(15, 118, 110, 0.2);
      min-height: 46px;
    }

    .header-btn:hover,
    button.btn:hover {
      transform: translateY(-2px) scale(1.01);
    }

    .header-btn.secondary,
    button.btn.secondary,
    .tabs button {
      background: rgba(255, 255, 255, 0.75);
      color: var(--text);
      border: 1px solid rgba(20, 32, 24, 0.08);
    }

    .card {
      border-radius: var(--radius-xl);
      padding: 26px;
    }

    .main-page .card {
      background:
        linear-gradient(180deg, rgba(255,255,255,0.94) 0%, rgba(250,252,255,0.9) 100%);
    }

    .card::before {
      background: linear-gradient(90deg, #0f766e 0%, #155eef 58%, #d97706 100%);
    }

    .wrap {
      max-width: 1280px;
      margin: 28px auto 48px;
      padding: 0 20px 36px;
    }

    .dashboard-hero {
      display: grid;
      grid-template-columns: 1.35fr 1fr;
      gap: 20px;
      margin-bottom: 22px;
    }

    .hero-panel {
      position: relative;
      overflow: hidden;
      padding: 28px;
      border-radius: 30px;
      border: 1px solid rgba(20, 32, 24, 0.08);
      background: rgba(255, 255, 255, 0.72);
      backdrop-filter: blur(24px);
      box-shadow: var(--shadow);
    }

    .hero-panel.primary {
      background:
        radial-gradient(circle at top right, rgba(21, 94, 239, 0.18), transparent 28%),
        linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(241,248,245,0.86) 100%);
    }

    .eyebrow {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 12px;
      border-radius: 999px;
      background: rgba(15, 118, 110, 0.1);
      color: #0f766e;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }

    .hero-title {
      font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
      font-size: 38px;
      line-height: 1.03;
      letter-spacing: -0.05em;
      margin-bottom: 12px;
      max-width: 11ch;
    }

    .hero-copy {
      color: var(--muted);
      font-size: 15px;
      line-height: 1.7;
      max-width: 56ch;
    }

    .hero-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 18px;
    }

    .market-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 999px;
      padding: 10px 14px;
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(20, 32, 24, 0.08);
      color: var(--text);
      font-size: 13px;
      font-weight: 700;
    }

    .hero-mini-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-top: 6px;
    }

    .hero-kpi {
      padding: 18px;
      border-radius: 22px;
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(20, 32, 24, 0.08);
    }

    .hero-kpi span {
      display: block;
      color: var(--muted);
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .hero-kpi strong {
      display: block;
      font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
      font-size: 28px;
      letter-spacing: -0.04em;
    }

    .hero-kpi small {
      display: block;
      margin-top: 8px;
      color: var(--muted);
      line-height: 1.5;
    }

    .section-subtitle {
      margin-top: -6px;
      margin-bottom: 18px;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.6;
    }

    .control-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 12px;
    }

    .quick-control-note {
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid rgba(20, 32, 24, 0.08);
    }
    .market-open-notice {
      margin: 14px 0 18px;
      padding: 14px 16px;
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(21, 94, 239, 0.08) 0%, rgba(20, 184, 166, 0.08) 100%);
      border: 1px solid rgba(59, 130, 246, 0.16);
      color: #1d4ed8;
      font-size: 13px;
      line-height: 1.7;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
    }
    .market-open-notice strong {
      color: #0f172a;
    }
    .stop-confirm-shell {
      padding: 22px;
      color: #b91c1c;
      display: grid;
      gap: 16px;
    }
    .stop-confirm-warning {
      padding: 18px 18px 18px 20px;
      border-radius: 18px;
      background: linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%);
      border: 1px solid rgba(239, 68, 68, 0.16);
      box-shadow: 0 12px 24px rgba(185, 28, 28, 0.08);
    }
    .stop-confirm-warning strong {
      display: block;
      color: #991b1b;
      margin-bottom: 8px;
      font-size: 15px;
    }
    .stop-confirm-warning span {
      color: #b45309;
      font-size: 14px;
      line-height: 1.7;
    }
    .stop-confirm-copy {
      color: #5b6475;
      font-size: 14px;
      line-height: 1.7;
      margin: 0;
    }
    .stop-confirm-field {
      display: grid;
      gap: 10px;
    }
    .stop-confirm-label {
      color: #1f2937;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .stop-confirm-input {
      width: 100%;
      min-height: 54px;
      padding: 0 18px;
      border-radius: 18px;
      border: 1px solid #fecaca;
      background: linear-gradient(180deg, #ffffff 0%, #fff7f7 100%);
      color: #111827;
      font-size: 15px;
      font-weight: 600;
      box-shadow: inset 0 1px 2px rgba(127, 29, 29, 0.05);
      transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    }
    .stop-confirm-input:focus {
      outline: none;
      border-color: #ef4444;
      box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
      transform: translateY(-1px);
    }
    .stop-confirm-input.valid {
      border-color: #10b981;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.12);
      background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%);
    }
    .stop-confirm-code {
      display: inline-flex;
      align-items: center;
      padding: 10px 14px;
      border-radius: 14px;
      background: #fff7ed;
      border: 1px dashed #fdba74;
      color: #9a3412;
      font-size: 13px;
      font-weight: 700;
    }
    .stop-confirm-status {
      background: #f8fafc;
      padding: 12px 14px;
      border-radius: 14px;
      min-height: 24px;
      color: #64748b;
      font-size: 13px;
      border: 1px solid #e2e8f0;
    }

    .header-balance-code {
      cursor: pointer;
      color: #10b981;
      font-weight: 700;
      letter-spacing: -0.02em;
    }

    .stats-grid {
      margin: 0 0 22px;
    }

    .stat-card {
      border-radius: 24px;
      padding: 22px;
      gap: 14px;
      box-shadow: var(--shadow);
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      display: grid;
      place-items: center;
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(15, 118, 110, 0.12), rgba(21, 94, 239, 0.1));
      font-size: 24px;
    }

    .stat-label {
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-size: 11px;
      font-weight: 800;
    }

    .stat-value {
      font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
      letter-spacing: -0.04em;
      font-size: 26px;
    }

    .position-item,
    .error-item,
    .report-item,
    .status-box,
    .status-panel,
    .trading-status-card {
      border-radius: 20px;
    }

    .position-item,
    .error-item,
    .report-item,
    .status-box,
    .status-panel {
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(20, 32, 24, 0.08);
    }

    .trading-status-card {
      border: 1px solid rgba(20, 32, 24, 0.08);
      background: rgba(255,255,255,0.78);
    }

    .trading-status-card.active {
      border-color: rgba(21, 128, 61, 0.28);
      background: linear-gradient(180deg, rgba(220,252,231,0.9), rgba(255,255,255,0.84));
    }

    .market-state {
      display: grid;
      gap: 10px;
    }

    .market-state strong {
      font-size: 18px;
      letter-spacing: -0.03em;
    }

    .market-state.running strong { color: var(--good); }
    .market-state.stopped strong { color: #64748b; }
    .market-state.warning strong { color: var(--accent); }

    .market-state small {
      color: var(--muted);
      line-height: 1.6;
      display: block;
    }

    .status-chip {
      display: inline-flex;
      width: fit-content;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 800;
      background: rgba(255,255,255,0.8);
      border: 1px solid rgba(20, 32, 24, 0.08);
    }

    .status-chip.good { color: var(--good); }
    .status-chip.bad { color: var(--bad); }
    .status-chip.neutral { color: #475569; }

    pre {
      background: linear-gradient(180deg, #0f172a 0%, #111827 100%);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 18px;
      padding: 16px;
    }

    .modal-overlay {
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(12px);
    }

    .modal-content {
      border-radius: 28px;
    }

    .usage-guide > div,
    .usage-hero,
    .guide-card,
    .guide-callout,
    .guide-troubleshoot-item {
      border-radius: 22px !important;
    }

    @media (max-width: 1024px) {
      .dashboard-hero {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .row { grid-template-columns: 1fr; }
      .quick-actions { grid-template-columns: 1fr; }
      .status-grid { grid-template-columns: 1fr; }
      .stats-grid { grid-template-columns: 1fr; }
      .trading-status-grid { grid-template-columns: 1fr; }
      .hero-title { font-size: 30px; max-width: none; }
      .hero-mini-grid, .control-grid { grid-template-columns: 1fr; }
      .top-header {
        grid-template-columns: 1fr;
        padding: 14px;
        margin: 10px 10px 0;
        border: 1px solid rgba(20, 32, 24, 0.08);
        border-radius: 24px;
        top: 10px;
      }
      .header-left {
        align-items: flex-start;
        grid-column: auto;
      }
      .header-title {
        font-size: 20px;
        line-height: 1.05;
      }
      .header-status {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: minmax(150px, 1fr);
        overflow-x: auto;
        gap: 10px;
        justify-content: flex-start;
        padding-bottom: 2px;
        scrollbar-width: none;
        grid-column: auto;
      }
      .header-status::-webkit-scrollbar {
        display: none;
      }
      .status-badge {
        padding: 10px 12px;
      }
      .header-buttons {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 10px;
        grid-column: auto;
        justify-self: stretch;
      }
      .header-btn {
        width: 100%;
        min-width: 0;
        padding: 11px 12px;
        font-size: 13px;
      }
      .wrap {
        margin: 18px auto 34px;
        padding: 0 12px 24px;
      }
      .card {
        padding: 20px;
      }
      .hero-panel {
        padding: 22px;
      }
      .hero-kpi {
        padding: 16px;
      }
      .action-duo-grid,
      .stop-grid {
        grid-template-columns: 1fr !important;
      }
      .modal-content {
        width: min(100% - 20px, 720px);
      }
    }

    @media (max-width: 520px) {
      .top-header {
        margin: 8px 8px 0;
        padding: 12px;
        top: 8px;
      }
      .header-title {
        font-size: 18px;
      }
      .header-status {
        grid-auto-columns: minmax(138px, 1fr);
      }
      .header-buttons {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .guide-hero,
      .usage-hero,
      .hero-panel,
      .card,
      .guide-card,
      .guide-troubleshoot-item,
      .guide-callout,
      .stat-card,
      .trading-status-card {
        border-radius: 20px !important;
      }
      .hero-title {
        font-size: 26px;
      }
      .hero-copy,
      .guide-card p,
      .guide-card li,
      .guide-callout,
      .guide-troubleshoot-item {
        font-size: 13px;
      }
      .wrap {
        padding: 0 10px 24px;
      }
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
        <div class="header-title">Stock Auto Control Room</div>
      </div>
      
      <div class="header-status">
        <div class="status-badge">
          <span>🔑 키값:</span>
          <code id="headerKeyPreview">***</code>
        </div>
        <div class="status-badge">
          <span>🖥️ 서버:</span>
          <span class="status-dot online" id="headerDbStatus"></span>
          <span id="headerDbText">연결됨</span>
        </div>
        <div class="status-badge">
          <span>💰 잔고:</span>
          <code id="headerBalance" class="header-balance-code" title="클릭하여 새로고침">로딩중...</code>
        </div>
      </div>

      <div class="header-buttons">
        <button class="header-btn" onclick="showPage('mainPage')">💼 대시보드</button>
        <button class="header-btn" onclick="showPage('statusPage')">📊 현황</button>
        <button class="header-btn" onclick="showPage('logsPage')">🧾 로그</button>
        <button class="header-btn" onclick="showPage('usagePage')">📖 가이드</button>
        <button class="header-btn secondary" onclick="openSettingsModal()">⚙️ 설정</button>
        <button class="header-btn secondary" onclick="performLogout()">로그아웃</button>
      </div>
    </div>

    <!-- Main Content -->
      <div class="wrap">
        <section class="dashboard-hero">
          <div class="hero-panel primary">
            <div class="eyebrow">2026 Live Ops</div>
            <div class="hero-title">실시간 자동매매 운영을 한 화면에서.</div>
            <div class="hero-copy">실서버, DB, KIS, 계좌잔고, 자동매매 상태를 같은 흐름으로 보고 바로 제어할 수 있는 운영 패널입니다.</div>
            <div class="hero-pills">
              <div id="heroSystemBadge" class="market-pill">시스템 상태 확인 중</div>
              <div id="heroDbBadge" class="market-pill">DB 확인 중</div>
              <div id="heroTradeBadge" class="market-pill">자동매매 상태 확인 중</div>
            </div>
          </div>
          <div class="hero-panel">
            <div class="hero-mini-grid">
              <div class="hero-kpi">
                <span>총 자산</span>
                <strong id="heroBalanceValue">로딩 중...</strong>
                <small>실시간 KIS 계좌 평가 금액</small>
              </div>
              <div class="hero-kpi">
                <span>가용 현금</span>
                <strong id="heroCashValue">로딩 중...</strong>
                <small>즉시 사용할 수 있는 현금</small>
              </div>
              <div class="hero-kpi">
                <span>국내 자동매매</span>
                <strong id="heroDomesticValue">확인 중...</strong>
                <small id="heroDomesticMeta">첫 상태 조회 전</small>
              </div>
              <div class="hero-kpi">
                <span>해외 자동매매</span>
                <strong id="heroOverseasValue">확인 중...</strong>
                <small id="heroOverseasMeta">첫 상태 조회 전</small>
              </div>
            </div>
          </div>
        </section>
        <div class="row">
          <!-- 자동매매 제어 -->
        <section class="card" style="grid-column: 1 / -1;">
          <h2 style="margin-bottom: 20px;">🧠 AI 자동개선 상태</h2>
          <p class="section-subtitle">매일 누적 성과를 기반으로 어떤 규칙이 현재 반영 중인지 바로 확인합니다.</p>
          <div class="ai-ops-grid">
            <div class="ai-ops-card">
              <span>현재 익절 규칙</span>
              <strong id="aiRuleSummary">로딩 중...</strong>
              <small id="aiRuleDetail">AI 규칙 요약을 불러오는 중입니다.</small>
            </div>
            <div class="ai-ops-card">
              <span>자동개선 상태</span>
              <strong id="aiOptimizationStatus">로딩 중...</strong>
              <small id="aiOptimizationDetail">최근 최적화 보고서 확인 중</small>
            </div>
            <div class="ai-ops-card">
              <span>Oracle AI 기록</span>
              <strong id="aiOracleCount">로딩 중...</strong>
              <small id="aiOracleDetail">DB 저장 상태 확인 중</small>
            </div>
            <div class="ai-ops-card">
              <span>보조 매수 정책</span>
              <strong id="aiFallbackPolicy">로딩 중...</strong>
              <small id="aiFallbackDetail">fallback 매수 규칙 확인 중</small>
            </div>
          </div>
        </section>

        <section class="card" style="grid-column: 1 / -1;">
          <h2 style="margin-bottom: 20px;">🤖 자동매매 제어</h2>
          <p class="section-subtitle">국내/해외 자동매매를 즉시 시작하거나 중단하고, 최근 상태를 빠르게 확인합니다.</p>
            <div class="control-grid">
              <button id="startDomesticBtn" class="btn" onclick="startAutoTrading('domestic')" style="padding: 18px; font-size: 15px;">🇰🇷 국내 자동매매 시작</button>
              <button id="startOverseasBtn" class="btn" onclick="startAutoTrading('overseas')" style="padding: 18px; font-size: 15px;">🌎 해외 자동매매 시작</button>
            </div>
            <div class="market-open-notice" id="marketOpenNoticeDomestic">
              <strong>국내 안내</strong> 장 상태를 확인하는 중입니다.
            </div>
            <div class="market-open-notice" id="marketOpenNoticeOverseas">
              <strong>해외 안내</strong> 장 상태를 확인하는 중입니다.
            </div>
            <div id="quickControlMsg" style="margin-bottom: 12px;"></div>
            
            <div class="quick-control-note">
              <h3 style="font-size: 15px; margin-bottom: 12px; color: #333;">📍 현재 포지션</h3>
              <div id="positionsList" style="display: grid; gap: 10px;">
                <div class="loading-spinner">⏳ 로딩 중...</div>
            </div>
          </div>
        </section>

        <!-- 시스템 현황 -->
        <section class="card" style="grid-column: 1 / -1;">
          <h2 style="margin-bottom: 15px;">⚙️ 시스템 현황</h2>
          <div class="action-duo-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <button class="btn" onclick="openStatusModal()" style="padding: 12px;">📊 현황보기</button>
            <button class="btn secondary" onclick="openErrorLogsModal()" style="padding: 12px;">📋 오류 로그 보기</button>
          </div>
        </section>

        <!-- 시장별 거래 중단 -->
        <section class="card" style="grid-column: 1 / -1;">
          <div class="stop-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <button id="stopDomesticBtn" class="btn" onclick="openStopTradingModal('domestic')" style="padding: 16px; font-size: 15px; background: #dc2626; font-weight: 600;">🛑 국내 거래 중단</button>
            <button id="stopOverseasBtn" class="btn" onclick="openStopTradingModal('overseas')" style="padding: 16px; font-size: 15px; background: #b91c1c; font-weight: 600;">🛑 해외 거래 중단</button>
          </div>
        </section>
      </div>
    </div>

    <!-- Stop All Trading Modal -->
    <div id="stopAllTradingModal" class="modal-overlay">
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
          <h2 id="stopTradingTitle">🛑 거래 중단</h2>
          <button class="modal-close" onclick="closeStopAllModal()">✕</button>
        </div>
        
        <div class="stop-confirm-shell">
          <div class="stop-confirm-warning">
            <strong>⚠️ 경고</strong>
            <span id="stopTradingWarning">이 작업은 해당 시장의 보유 포지션을 모두 매도하고 자동매매를 중단합니다.</span>
          </div>
          
          <p class="stop-confirm-copy">중단하려면 아래 확인 문구를 정확히 입력해야 합니다. 실거래 포지션 청산과 자동매매 중지가 함께 실행됩니다.</p>
          <div class="stop-confirm-field">
            <div class="stop-confirm-label">확인 문구 입력</div>
            <input 
              id="stopAllConfirmInput" 
              class="stop-confirm-input"
              type="text" 
              placeholder="거래를중단합니다" 
              onkeyup="updateStopAllButtonState()"
            />
            <div id="stopTradingExpectedText" class="stop-confirm-code">확인 문구: 거래를중단합니다</div>
          </div>
          
          <div id="stopAllStatus" class="stop-confirm-status"></div>
        </div>
        
        <div style="display: flex; gap: 10px; padding: 15px 20px; background: #fafafa; border-top: 1px solid #e0e0e0;">
          <button class="btn secondary" type="button" style="flex: 1;" onclick="closeStopAllModal()">취소</button>
          <button id="confirmStopAllBtn" class="btn" type="button" style="flex: 1; background: #d32f2f;" onclick="confirmStopAll()" disabled>중단 실행</button>
        </div>
      </div>
    </div>

    <!-- Status Modal -->
    <div id="statusModal" class="modal-overlay">
      <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto;">
        <div class="modal-header">
          <h2>📊 시스템 현황</h2>
          <button class="modal-close" onclick="closeStatusModal()">✕</button>
        </div>
        
        <div id="statusContent" style="padding: 20px; max-height: 60vh; overflow-y: auto;">
          <div style="text-align: center; color: #999;">로딩 중...</div>
        </div>
        
        <div style="padding: 15px 20px; background: #fafafa; border-top: 1px solid #e0e0e0;">
          <button class="btn secondary" type="button" style="width: 100%;" onclick="closeStatusModal()">닫기</button>
        </div>
      </div>
    </div>

    <!-- Error Logs Modal -->
    <div id="errorLogsModal" class="modal-overlay">
      <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto;">
        <div class="modal-header">
          <h2>📋 오류 로그</h2>
          <button class="modal-close" onclick="closeErrorLogsModal()">✕</button>
        </div>
        
        <div id="errorLogsContent" style="padding: 20px; max-height: 60vh; overflow-y: auto;">
          <div style="text-align: center; color: #999;">로딩 중...</div>
        </div>
        
        <div style="padding: 15px 20px; background: #fafafa; border-top: 1px solid #e0e0e0;">
          <button class="btn secondary" type="button" style="width: 100%;" onclick="closeErrorLogsModal()">닫기</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Status Page -->
  <div id="statusPage" class="page main-page">
    <div class="top-header">
      <div class="header-left">
        <div class="header-title">Status Observatory</div>
      </div>
      <div class="header-buttons">
        <button class="header-btn" onclick="showPage('mainPage')">💼 대시보드</button>
        <button class="header-btn" onclick="showPage('statusPage')">📊 현황</button>
        <button class="header-btn" onclick="showPage('logsPage')">🧾 로그</button>
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
            <div class="stat-label">총 자산</div>
            <div class="stat-value" id="statTotalInvested">로딩중...</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <div class="stat-label">가용 현금</div>
            <div class="stat-value" id="statROI">로딩중...</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⏱️</div>
          <div class="stat-content">
            <div class="stat-label">시스템 상태</div>
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
          <h2>🚀 국내 즉시 매수 후보</h2>
          <div class="position-list" id="statusDomesticBuyCandidates"></div>
        </section>
        <section class="card">
          <h2>🌎 해외 즉시 매수 후보</h2>
          <div class="position-list" id="statusOverseasBuyCandidates"></div>
        </section>
        <section class="card">
          <h2>⚠️ 오류 로그</h2>
          <div class="error-list" id="statusErrorList"></div>
        </section>
        <section class="card full">
          <h2>🧾 최근 주문 실패</h2>
          <div class="market-failure-grid">
            <div id="domesticOrderFailureCard" class="market-failure-card">
              <span>국내 주문 상태</span>
              <strong>확인 중...</strong>
              <small>최근 국내 주문 실패 이력을 확인하는 중입니다.</small>
            </div>
            <div id="overseasOrderFailureCard" class="market-failure-card">
              <span>해외 주문 상태</span>
              <strong>확인 중...</strong>
              <small>최근 해외 주문 실패 이력을 확인하는 중입니다.</small>
            </div>
          </div>
          <div class="error-list" id="statusOrderFailureList"></div>
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
        <button class="header-btn" onclick="showPage('logsPage')">🧾 로그</button>
        <button class="header-btn" onclick="showPage('usagePage')">📖 가이드</button>
        <button class="header-btn secondary" onclick="openSettingsModal()">⚙️ 설정</button>
        <button class="header-btn secondary" onclick="performLogout()">로그아웃</button>
      </div>
    </div>

    <div class="wrap">
      <section class="card full">
        <div class="usage-guide">
          <section class="usage-hero">
            <div class="usage-eyebrow">Operator Playbook</div>
            <h2>한 화면에서 보고, 바로 판단하고, 필요한 시장만 안전하게 제어합니다.</h2>
            <p>이 가이드는 현재 운영 중인 Stock Auto 관리자 패널 기준입니다. 로그인, 대시보드 해석, 국내/해외 자동매매 제어, 중단 절차, 설정 변경, 장애 대응 순서까지 실제 운용 흐름에 맞춰 정리했습니다.</p>
            <div class="guide-meta">
              <div class="guide-pill">실시간 KIS 잔고 반영</div>
              <div class="guide-pill">시장별 자동매매 제어</div>
              <div class="guide-pill">확인 문구 기반 안전 중단</div>
              <div class="guide-pill">Cloudflare 프록시 운영</div>
            </div>
          </section>

          <div class="guide-grid">
            <article class="guide-card" style="--guide-accent: linear-gradient(90deg, #2563eb, #0ea5e9);">
              <div class="guide-section-title">Step 01</div>
              <h3>로그인과 초기 진입</h3>
              <p>관리자 비밀번호로 로그인하면 Worker 프록시 경유 세션 쿠키가 발급됩니다. 로그인 상태는 브라우저에 저장되어 다음 방문 시 빠르게 복구됩니다.</p>
              <ul>
                <li><strong>로그인 성공 후</strong> 대시보드가 먼저 뜨고, 핵심 카드부터 빠르게 채워집니다.</li>
                <li><strong>초기 점검</strong>에서는 DB 연결 여부와 KIS 키 설정 여부를 확인합니다.</li>
                <li><strong>접속 이상 시</strong> 강력 새로고침 후 다시 로그인하면 최신 Worker 버전으로 갱신됩니다.</li>
              </ul>
            </article>

            <article class="guide-card" style="--guide-accent: linear-gradient(90deg, #0f766e, #14b8a6);">
              <div class="guide-section-title">Step 02</div>
              <h3>대시보드 읽는 법</h3>
              <p>상단 헤더와 히어로 카드만 봐도 운영 핵심 상태를 바로 파악할 수 있게 구성되어 있습니다.</p>
              <ul>
                <li><strong>키값</strong>: 현재 설정된 KIS 키 프리뷰를 표시합니다.</li>
                <li><strong>서버</strong>: 백엔드 + DB 상태를 간단하게 보여줍니다.</li>
                <li><strong>잔고</strong>: 총 자산 기준으로 표시되고, 현금은 히어로 카드에서 별도로 확인합니다.</li>
                <li><strong>국내/해외 자동매매</strong>: 각 시장별로 실행 중인지 대기 중인지 즉시 확인합니다.</li>
              </ul>
            </article>

            <article class="guide-card" style="--guide-accent: linear-gradient(90deg, #7c3aed, #8b5cf6);">
              <div class="guide-section-title">Step 03</div>
              <h3>자동매매 시작</h3>
              <p>국내와 해외 자동매매는 독립적으로 제어됩니다. 필요한 시장만 시작하면 해당 시장의 주기와 상태가 바로 반영됩니다.</p>
              <ul>
                <li><strong>국내 자동매매 시작</strong>: 한국 시장 대상 자동매매 사이클을 시작합니다.</li>
                <li><strong>해외 자동매매 시작</strong>: 해외 시장 대상 자동매매 사이클을 시작합니다.</li>
                <li><strong>실행 중 상태</strong>: 버튼이 실행 중으로 바뀌고 최근 사이클 시각이 표시됩니다.</li>
              </ul>
            </article>

            <article class="guide-card" style="--guide-accent: linear-gradient(90deg, #ea580c, #f59e0b);">
              <div class="guide-section-title">Step 04</div>
              <h3>안전 중단 절차</h3>
              <p>중단은 시장별로 분리되어 있으며, 확인 문구를 정확히 입력해야 실행됩니다. 잘못된 클릭으로 멈추지 않도록 안전장치를 두었습니다.</p>
              <ul>
                <li><strong>국내 거래 중단</strong>: 국내 포지션 전량 정리 후 국내 자동매매만 중단합니다.</li>
                <li><strong>해외 거래 중단</strong>: 해외 포지션 전량 정리 후 해외 자동매매만 중단합니다.</li>
                <li><strong>전체 거래 중단</strong>: 모든 포지션 청산 후 전체 자동매매를 중단합니다.</li>
              </ul>
            </article>
          </div>

          <div class="guide-grid">
            <article class="guide-card" style="--guide-accent: linear-gradient(90deg, #0891b2, #06b6d4);">
              <div class="guide-section-title">Monitoring</div>
              <h3>현황 페이지 활용</h3>
              <p>현황 페이지는 요약 통계, 포지션 목록, 시장별 자동매매 상태, 오류 로그를 한 번에 점검하는 운영용 화면입니다.</p>
              <ul>
                <li><strong>포지션 목록</strong>: 현재 보유 종목과 진입 정보를 확인합니다.</li>
                <li><strong>수익 차트</strong>: 실현/미실현 수익 흐름을 간단히 봅니다.</li>
                <li><strong>오류 로그</strong>: 최근 장애나 경고가 쌓였는지 빠르게 판단합니다.</li>
              </ul>
            </article>

            <article class="guide-card" style="--guide-accent: linear-gradient(90deg, #1d4ed8, #2563eb);">
              <div class="guide-section-title">Settings</div>
              <h3>설정과 키 교체</h3>
              <p>설정 모달에서는 잔고 갱신 주기와 KIS 키 상태를 확인할 수 있고, 필요하면 키를 교체할 수 있습니다.</p>
              <ul>
                <li><strong>잔고 갱신 주기</strong>: 운영 상황에 맞춰 30초~10분으로 조정합니다.</li>
                <li><strong>KIS 키 교체</strong>: 현재 키 프리뷰를 확인한 뒤 교체를 진행합니다.</li>
                <li><strong>주의</strong>: 키 교체는 자동매매에 직접 영향을 주므로 안내 문구를 꼭 확인하세요.</li>
              </ul>
            </article>

            <article class="guide-card" style="--guide-accent: linear-gradient(90deg, #059669, #10b981);">
              <div class="guide-section-title">Best Practice</div>
              <h3>운영 팁</h3>
              <ul>
                <li><strong>대시보드 잔고</strong>와 <strong>가용 현금</strong>을 먼저 확인하고 자동매매를 시작하세요.</li>
                <li><strong>오류 로그 보기</strong>에서 최근 오류가 없는지 먼저 확인하면 불필요한 실패를 줄일 수 있습니다.</li>
                <li><strong>시장 중단 버튼</strong>은 실제 청산 동작이 포함되므로 꼭 대상 시장을 다시 확인하세요.</li>
                <li><strong>브라우저가 느릴 때</strong>는 새로고침 후 다시 로그인하면 최신 리소스가 반영됩니다.</li>
              </ul>
            </article>
          </div>

          <div class="guide-callout">
            <strong>운영 주의:</strong> 중단/키 교체 같은 민감 작업은 확인 문구를 요구합니다. 이 동작은 실주문, 포지션 청산, 자동매매 정지와 연결될 수 있으므로 버튼을 누르기 전에 대상 시장과 현재 포지션을 반드시 확인하세요.
          </div>

          <section class="guide-stack">
            <div class="guide-section-title">Troubleshooting</div>
            <div class="guide-troubleshoot">
              <article class="guide-troubleshoot-item">
                <h4>잔고나 카드 값이 계속 로딩 중일 때</h4>
                <ul>
                  <li>먼저 <strong>Ctrl+F5</strong>로 새로고침해서 최신 Worker 자산을 받습니다.</li>
                  <li>그래도 안 뜨면 <strong>서버 상태</strong>와 <strong>오류 로그</strong>를 확인합니다.</li>
                  <li>KIS 계정 상태가 불안정하면 잔고 조회가 지연될 수 있습니다.</li>
                </ul>
              </article>
              <article class="guide-troubleshoot-item">
                <h4>자동매매 시작이 실패할 때</h4>
                <ul>
                  <li>KIS 키가 유효한지, 해당 시장이 현재 운영 시간인지 확인합니다.</li>
                  <li>서버/DB가 정상이어도 시장 휴장 시간에는 주문이 제한될 수 있습니다.</li>
                  <li>실패 메시지와 오류 로그를 같이 보면 원인을 더 빨리 찾을 수 있습니다.</li>
                </ul>
              </article>
              <article class="guide-troubleshoot-item">
                <h4>로그인은 되는데 데이터가 안 뜰 때</h4>
                <ul>
                  <li>브라우저 콘솔에 mixed content 또는 fetch 오류가 있는지 확인합니다.</li>
                  <li>현재 운영 버전은 Worker 프록시 기반이라, 직접 http:// 호출이 보이면 프론트 캐시를 비우는 게 좋습니다.</li>
                  <li>반복되면 운영 화면에서 어떤 카드가 비는지 알려주면 바로 추적 가능합니다.</li>
                </ul>
              </article>
            </div>
          </section>
        </div>
      </section>
    </div>
  </div>

  <div id="logsPage" class="page main-page">
    <div class="top-header">
      <div class="header-left">
        <div class="header-title">🧾 Log Vault</div>
      </div>
      <div class="header-buttons">
        <button class="header-btn" onclick="showPage('mainPage')">💼 대시보드</button>
        <button class="header-btn" onclick="showPage('statusPage')">📊 현황</button>
        <button class="header-btn" onclick="showPage('logsPage')">🧾 로그</button>
        <button class="header-btn" onclick="showPage('usagePage')">📖 가이드</button>
        <button class="header-btn secondary" onclick="openSettingsModal()">⚙️ 설정</button>
        <button class="header-btn secondary" onclick="performLogout()">로그아웃</button>
      </div>
    </div>

    <div class="wrap">
      <section class="card full">
        <div class="usage-hero">
          <div class="usage-eyebrow">Logs & Exports</div>
          <h2>운영 로그 저장 위치를 확인하고, 전체/구간 로그를 바로 다운로드합니다.</h2>
          <p>AI 분석 결과는 Oracle DB에, 거래 로그는 JSONL 파일에, 앱 로그는 서버의 logs/*.log 파일에 저장됩니다. 최근 오류는 메모리 버퍼에도 유지됩니다.</p>
        </div>
      </section>

      <div class="stats-grid" id="logSummaryGrid">
        <div class="stat-card"><div class="stat-icon">🗄️</div><div class="stat-content"><div class="stat-label">Oracle AI 결과</div><div class="stat-value" id="logOracleStatus">로딩중...</div></div></div>
        <div class="stat-card"><div class="stat-icon">📒</div><div class="stat-content"><div class="stat-label">거래 로그</div><div class="stat-value" id="logTradeCount">로딩중...</div></div></div>
        <div class="stat-card"><div class="stat-icon">🚨</div><div class="stat-content"><div class="stat-label">메모리 오류</div><div class="stat-value" id="logRuntimeCount">로딩중...</div></div></div>
        <div class="stat-card"><div class="stat-icon">📁</div><div class="stat-content"><div class="stat-label">서버 로그 파일</div><div class="stat-value" id="logFileCount">로딩중...</div></div></div>
      </div>

      <div class="row">
        <section class="card full">
          <h2>⬇️ 로그 다운로드</h2>
          <p class="section-subtitle">전체 로그 또는 날짜 구간 로그를 타입별로 저장할 수 있습니다.</p>
          <div class="logs-toolbar">
            <select id="logTypeSelect" class="input soft">
              <option value="oracle-ops">Oracle 운영 로그</option>
              <option value="trade-jsonl">거래 로그 JSON</option>
              <option value="runtime-errors">오류 버퍼 JSON</option>
              <option value="all-log">전체 앱 로그</option>
              <option value="error-log">에러 로그</option>
              <option value="api-log">API 로그</option>
              <option value="ai-results">Oracle AI 결과 JSON</option>
            </select>
            <select id="logFormatSelect" class="input soft">
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
            <input id="logFromDate" class="input soft" type="datetime-local" />
            <input id="logToDate" class="input soft" type="datetime-local" />
            <button class="btn" onclick="downloadLogs(false)">전체 다운로드</button>
            <button class="btn secondary" onclick="downloadLogs(true)">구간 다운로드</button>
          </div>
          <div id="logDownloadStatus" class="download-status">다운로드할 로그 타입과 구간을 선택하세요.</div>
        </section>
      </div>

      <div class="row">
        <section class="card">
          <h2>🧠 저장 구조</h2>
          <div id="logStorageNote" class="guide-callout">로딩 중...</div>
        </section>
        <section class="card">
          <h2>📋 서버 로그 파일</h2>
          <div id="logFileList" class="guide-troubleshoot"></div>
        </section>
      </div>
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
        
        <button class="btn" type="button" style="width:100%; margin-top:15px; padding: 15px; font-size: 15px;" onclick="openKeyChangeModal()">🔑 KIS API 키 교체하기</button>
        <button class="btn secondary" type="button" style="width:100%; margin-top:10px;" onclick="closeSettingsModal()">닫기</button>
      </div>
    </div>
  </div>

  <!-- Key Change Confirmation Modal -->
  <div id="keyChangeModal" class="modal-overlay">
    <div class="modal-content" style="max-width: 500px;">
      <div class="modal-header">
        <h2>🔑 API 키 교체 확인</h2>
        <button class="modal-close" onclick="closeKeyChangeModal()">✕</button>
      </div>
      
      <div style="padding: 20px; color: #d32f2f;">
        <div style="background: #ffebee; border-left: 4px solid #d32f2f; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <strong style="color: #c62828;">⚠️ 경고</strong><br/>
          <span style="color: #d32f2f; font-size: 14px;">이 작업은 자동매매를 중단하고 서버를 재시작합니다.</span>
        </div>
        
        <p style="color: #666; margin-bottom: 15px; font-size: 14px;">진행하려면 아래 문구를 정확히 입력하세요:</p>
        <input 
          id="keyChangeConfirmInput" 
          type="text" 
          placeholder="키를교체하겠습니다" 
          onkeyup="updateKeyChangeButtonState()"
          style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 15px; font-size: 14px;"
        />
        
        <div id="keyChangeStatus" style="background: #f5f5f5; padding: 10px; border-radius: 6px; margin-bottom: 15px; min-height: 20px; color: #666; font-size: 13px;"></div>
      </div>
      
      <div style="display: flex; gap: 10px; padding: 15px 20px; background: #fafafa; border-top: 1px solid #e0e0e0;">
        <button class="btn secondary" type="button" style="flex: 1;" onclick="closeKeyChangeModal()">취소</button>
        <button id="confirmKeyChangeBtn" class="btn" type="button" style="flex: 1; background: #d32f2f;" onclick="confirmKeyChange()" disabled>교체 실행</button>
      </div>
    </div>
  </div>

<script>
  // ============================================
  // 에러 분류 및 처리 시스템
  // ============================================
  
  const ErrorCategories = {
    NETWORK: 'network',        // 네트워크 오류
    AUTH: 'auth',              // 인증 오류
    CONFIG: 'config',          // 설정 오류 (KIS 키 미설정 등)
    DATABASE: 'database',      // 데이터베이스 오류
    TIMEOUT: 'timeout',        // 타임아웃
    VALIDATION: 'validation',  // 입력값 검증 오류
    NOT_FOUND: 'not_found',    // 리소스 미발견
    CONFLICT: 'conflict',      // 충돌 (이미 실행 중 등)
    SERVER: 'server',          // 서버 오류
    EXTERNAL_API: 'external',  // 외부 API 오류
    UNKNOWN: 'unknown'         // 기타 오류
  }

  // 에러 코드별 사용자 친화적 메시지
  const ErrorMessageMap = {
    'INVALID_INPUT': '입력값이 올바르지 않습니다. 다시 확인해주세요.',
    'AUTH_FAILED': '인증에 실패했습니다. 비밀번호를 확인해주세요.',
    'KIS_NOT_CONFIGURED': 'KIS API 키가 설정되지 않았습니다. 설정하기를 클릭해주세요.',
    'DB_CONNECTION_ERROR': '데이터베이스 연결에 실패했습니다.',
    'OPERATION_TIMEOUT': '작업이 시간 초과되었습니다. 다시 시도해주세요.',
    'OPERATION_IN_PROGRESS': '해당 작업은 이미 진행 중입니다.',
    'OPERATION_NOT_ALLOWED': '현재 이 작업은 수행할 수 없습니다.',
  }

  // 에러 분류 및 사용자 메시지 생성
  function classifyError(error, statusCode = null) {
    const message = error.message || String(error)
    
    // 타임아웃 감지
    if (message.includes('timeout') || message.includes('Timeout') || message.includes('시간 초과')) {
      return {
        category: ErrorCategories.TIMEOUT,
        userMessage: '요청이 시간 초과되었습니다. 네트워크 상태를 확인하고 다시 시도해주세요.',
        suggestion: '네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.'
      }
    }

    // HTTP 상태 코드 기반 분류
    if (statusCode) {
      if (statusCode === 401 || statusCode === 403) {
        return {
          category: ErrorCategories.AUTH,
          userMessage: '인증에 실패했습니다.',
          suggestion: '로그인을 다시 시도해주세요.'
        }
      }
      if (statusCode === 400) {
        return {
          category: ErrorCategories.VALIDATION,
          userMessage: '요청 데이터가 올바르지 않습니다.',
          suggestion: '입력값을 확인해주세요.'
        }
      }
      if (statusCode === 404) {
        return {
          category: ErrorCategories.NOT_FOUND,
          userMessage: '요청한 리소스를 찾을 수 없습니다.',
          suggestion: '서버 상태를 확인해주세요.'
        }
      }
      if (statusCode === 409) {
        return {
          category: ErrorCategories.CONFLICT,
          userMessage: '현재 상태에서 이 작업을 수행할 수 없습니다.',
          suggestion: '시스템 상태를 확인 후 다시 시도해주세요.'
        }
      }
      if (statusCode === 503) {
        return {
          category: ErrorCategories.SERVER,
          userMessage: '백엔드 서버가 응답하지 않습니다.',
          suggestion: '잠시 후 다시 시도해주세요.'
        }
      }
      if (statusCode >= 500) {
        return {
          category: ErrorCategories.SERVER,
          userMessage: '서버 오류가 발생했습니다.',
          suggestion: '오류 로그를 확인하고 관리자에게 연락해주세요.'
        }
      }
    }

    // 에러 메시지 키워드 기반 분류
    if (message.includes('KIS') || message.includes('API 키')) {
      return {
        category: ErrorCategories.CONFIG,
        userMessage: 'KIS API 설정에 문제가 있습니다.',
        suggestion: '설정 페이지에서 KIS API 키를 확인해주세요.'
      }
    }
    
    if (message.includes('Database') || message.includes('database')) {
      return {
        category: ErrorCategories.DATABASE,
        userMessage: '데이터베이스 연결에 실패했습니다.',
        suggestion: '서버 상태를 확인해주세요.'
      }
    }
    
    if (message.includes('offline') || message.includes('Failed to fetch') || message.includes('Network')) {
      return {
        category: ErrorCategories.NETWORK,
        userMessage: '네트워크 연결을 확인할 수 없습니다.',
        suggestion: '인터넷 연결을 확인하거나 백엔드 서버가 실행 중인지 확인해주세요.'
      }
    }

    // 기본값
    return {
      category: ErrorCategories.UNKNOWN,
      userMessage: '오류가 발생했습니다: ' + message,
      suggestion: '오류 로그를 확인하거나 관리자에게 연락해주세요.'
    }
  }

  // 건의사항 포함된 에러 메시지 표시
  function formatErrorMessage(userMessage, suggestion = null) {
    let html = '<div style="color: #d32f2f; font-size: 14px; line-height: 1.5;">' +
      '<strong>오류:</strong> ' + userMessage
    
    if (suggestion) {
      html += '<br/><span style="color: #666; font-size: 12px; margin-top: 8px; display: block;">' +
        '→ ' + suggestion + '</span>'
    }
    
    html += '</div>'
    return html
  }

  // Backend URL 설정
  // Cloudflare Workers 배포 시 환경 변수로 주입됨
  // 개발 환경: localhost:4000, 프로덕션: env.BACKEND_BASE_URL
  const BACKEND_BASE = '__BACKEND_BASE__'

  function isLocalDevHost() {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  }

  function buildBrowserApiUrl(path) {
    const normalizedPath = path.startsWith('/api') ? path : ('/api' + path)
    return isLocalDevHost() ? ('http://localhost:4000' + normalizedPath) : normalizedPath
  }
  
  let currentMarket = 'domestic'
  let currentUser = { isLoggedIn: false }
  let balanceRefreshInterval = null  // 잔고 자동 갱신 타이머
  let balanceRefreshSeconds = 120  // 기본값 2분
  let statusRefreshInterval = null
  let statusRefreshSeconds = 120
  let statusPanelOpen = false
  let isServerOnline = true

  async function api(path, opts = {}) {
    const method = opts.method || 'GET'
    const maxRetries = Number.isFinite(opts.retries) ? opts.retries : (method === 'GET' ? 2 : 1)
    const initialDelay = 300
    const maxDelay = 2500
    const timeoutMs = Number.isFinite(opts.timeoutMs) ? opts.timeoutMs : (method === 'GET' ? 8000 : 12000)

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);
        
        // /api로 시작하지 않으면 /api 추가
        const apiPath = path.startsWith('/api') ? path : ('/api' + path)
        
        // 로컬호스트 검사 - localhost에서는 localhost로 직접 호출
        const fullUrl = buildBrowserApiUrl(apiPath)
        
        const res = await fetch(fullUrl, {
          method,
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
            const err = new Error(json.error || json.message || ('HTTP ' + res.status))
            err.statusCode = res.status
            err.errorType = json.code
            err.category = classifyError(err, res.status)
            throw err
          }
          
          // 5xx 또는 네트워크 에러는 재시도
          if (attempt < maxRetries) {
            const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay)
            console.warn('[API] ' + path + ' 실패 (' + attempt + '/' + maxRetries + ', ' + res.status + '), ' + delay + 'ms 후 재시도...')
            await new Promise(r => setTimeout(r, delay))
            continue
          }
          
          const err = new Error(json.error || ('HTTP ' + res.status))
          err.statusCode = res.status
          err.category = classifyError(err, res.status)
          throw err
        }
        
        return json
      } catch (e) {
        // 분류 정보 추가
        if (!e.category) {
          e.category = classifyError(e, e.statusCode)
        }
        
        // 마지막 시도면 에러 던짐
        if (attempt === maxRetries) {
          const finalErr = new Error(e.message)
          finalErr.category = e.category
          finalErr.statusCode = e.statusCode
          finalErr.errorType = e.errorType
          throw finalErr
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

  function formatKrw(value) {
    return '₩' + Number(value || 0).toLocaleString('ko-KR')
  }

  function formatDateTime(value) {
    if (!value) return '기록 없음'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return String(value)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  }

  function getSystemStatusMeta(status) {
    if (status === 'running') {
      return { label: '실행 중', tone: 'good' }
    }
    if (status === 'stopped') {
      return { label: '중단됨', tone: 'neutral' }
    }
    if (status === 'suspended') {
      return { label: '보호 중지', tone: 'bad' }
    }
    return { label: status || '확인 중', tone: 'neutral' }
  }

  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))
    document.getElementById(pageId).classList.add('active')
    
    // 현황 페이지로 이동 시 데이터 로드
    if (pageId === 'statusPage') {
      loadStatusPage()
    } else if (pageId === 'logsPage') {
      loadLogsPage()
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
      // 로컬호스트 검사
      const loginUrl = buildBrowserApiUrl('/auth/login')
      
      const res = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        credentials: 'include'
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        let errorData = {}
        try { errorData = JSON.parse(errorText) } catch (e) {}
        // Throw a richer error object so downstream can provide better hints
        const err = errorData.error || ('HTTP ' + res.status)
        throw { message: err, statusCode: res.status, category: errorData.category }
      }
      
      console.log('[로그인] 성공')
      currentUser.isLoggedIn = true
      
      // 로그인 상태를 storage에 저장
      storage.setItem('isLoggedIn', 'true')
      
      // 성공 표시
      showLoginSuccess()
      
      // 2초 후 다음 페이지로 이동
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      showPage('initPage')
      await checkInitStatus()
    } catch (e) {
      console.error('[로그인] 실패:', e)
      
      // 에러 분류
      const category = e.category || classifyError(e, e.statusCode)
      const errorMsg = e.message || '로그인 실패'
      
      let displayMsg = category.userMessage
      let alertType = 'server-error'
      
      // 카테고리별 커스터마이징
      if (category.category === ErrorCategories.AUTH) {
        alertType = 'password-error'
        displayMsg = '비밀번호가 올바르지 않습니다'
      } else if (category.category === ErrorCategories.NETWORK) {
        alertType = 'server-error'
        displayMsg = '서버에 연결할 수 없습니다. 네트워크와 백엔드 서버 상태를 확인해주세요'
      } else if (category.category === ErrorCategories.TIMEOUT) {
        alertType = 'server-error'
        displayMsg = '로그인 요청이 시간 초과되었습니다. 다시 시도해주세요'
      }
      
      // 실패 표시 후 버튼 복구
      showLoginFailure(formatErrorMessage(displayMsg, category.suggestion), alertType)
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

  // 페이지 로드 시 서버 연결 상태 확인 (비활성화 - 불필요)
  async function checkServerConnection() {
    // 로그인 시 자동으로 서버 상태가 확인되므로 별도 체크 불필요
    return true
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

      // Auto-navigate quickly after initial health snapshot
      setTimeout(() => {
        if (r.hasKisKeys) {
          goToMainDashboard()
        } else {
          showPage('kisPage')
        }
      }, 350)
    } catch (e) {
      document.getElementById('initPage').innerHTML = 
        '<div class="init-card"><div class="error-msg">오류: ' + e.message + '</div></div>'
      setTimeout(() => showPage('loginPage'), 3000)
    }
  }

  async function saveKisKeys() {
    try {
      const apiKey = document.getElementById('kisApiKey').value
      const apiSecret = document.getElementById('kisApiSecret').value
      
      if (!apiKey) {
        document.getElementById('kisError').innerHTML = '<div class="error-msg">API Key를 입력하세요</div>'
        return
      }

      await api('/kis/update', {
        method: 'POST',
        body: {
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
    // 첫 화면은 가능한 한 빨리 채우고, 나머지는 백그라운드에서 보강
    await Promise.allSettled([
      loadKisStatus(),
      loadBalance(),
      loadStatus(),
      loadAutoControlStatus(),
      loadAiImprovementSummary(),
      loadMarketOpenNotices(),
    ])

    Promise.allSettled([
      loadTradingStatus(),
      loadStatusPage(),
    ]).catch(e => console.error('[Dashboard Background Load Error]', e))
    
    // 저장된 갱신 시간 불러오기
    loadBalanceRefreshPreference()
    loadStatusRefreshPreference()
    updateStatusRefreshPreview()
    
    // 자동 갱신 제거: 사용자가 직접 새로고침 버튼 누름
    // startBalanceAutoRefresh()
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
    const previousServerOnline = isServerOnline

    try {
      const r = await api('/api/status')
      const dbOnline = r.dbStatus === 'healthy'
      const dbDot = document.getElementById('headerDbStatus')
      const dbText = document.getElementById('headerDbText')
      const heroDbBadge = document.getElementById('heroDbBadge')
      const heroSystemBadge = document.getElementById('heroSystemBadge')
      const systemMeta = getSystemStatusMeta(r.systemStatus)

      isServerOnline = dbOnline
      applyServerStateToTradingButtons()
      
      if (dbOnline) {
        dbDot.className = 'status-dot online'
        dbText.textContent = '실시간 정상'
        if (heroDbBadge) heroDbBadge.textContent = 'DB 정상 연결'

        if (!previousServerOnline) {
          setQuickControlMessage('서버 연결이 복구되었습니다. 자동매매 시작 버튼을 다시 사용할 수 있습니다.', 'success')
          loadAutoControlStatus().catch(() => {})
        }
      } else {
        dbDot.className = 'status-dot offline'
        dbText.textContent = '오류'
        if (heroDbBadge) heroDbBadge.textContent = 'DB 연결 오류'

        if (previousServerOnline) {
          setQuickControlMessage('서버 연결 오류 상태입니다. 자동매매 시작 버튼이 일시 비활성화됩니다.', 'error')
        }
      }

      if (heroSystemBadge) {
        heroSystemBadge.textContent = '시스템 ' + systemMeta.label
      }
    } catch (e) {
      isServerOnline = false
      applyServerStateToTradingButtons()
      document.getElementById('headerDbStatus').className = 'status-dot offline'
      document.getElementById('headerDbText').textContent = '오류'
      const heroDbBadge = document.getElementById('heroDbBadge')
      if (heroDbBadge) heroDbBadge.textContent = 'DB 상태 확인 실패'
      if (previousServerOnline) {
        setQuickControlMessage('서버 상태 확인 실패로 자동매매 시작 버튼이 일시 비활성화됩니다.', 'error')
      }
      console.error('[Status Check]', e.message)
    }
  }

  function renderStatusOut(data) {
    // statusOut 엘리먼트가 없으므로 렌더링하지 않음
    // (모달에서 renderStatusInModal()을 사용)
  }

  // Status Modal Functions
  async function openStatusModal() {
    const modal = document.getElementById('statusModal')
    const contentEl = document.getElementById('statusContent')
    
    modal.classList.add('active')
    contentEl.innerHTML = '<div style="text-align: center; color: #999;">로딩 중...</div>'
    
    try {
      const status = await api('/status')
      const dbOnline = status.dbStatus === 'healthy'
      const dbDot = document.getElementById('headerDbStatus')
      const dbText = document.getElementById('headerDbText')
      
      if (dbOnline) {
        dbDot.className = 'status-dot online'
        dbText.textContent = '연결됨'
      } else {
        dbDot.className = 'status-dot offline'
        dbText.textContent = '오류'
      }
      
      renderStatusInModal(status)
    } catch (e) {
      contentEl.innerHTML = '<div style="padding: 20px; color: #ef4444; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">오류: ' + e.message + '</div>'
    }
  }

  function closeStatusModal() {
    document.getElementById('statusModal').classList.remove('active')
  }

  function renderStatusInModal(data) {
    const contentEl = document.getElementById('statusContent')
    let html = ''
    
    Object.entries(data).forEach(([k, v]) => {
      const valueStr = typeof v === 'object' ? JSON.stringify(v) : String(v)
      const icon = k.includes('status') || k.includes('Status') ? '⚙️' :
                   k.includes('health') || k.includes('healthy') ? '💚' :
                   k.includes('time') ? '⏰' : '📌'
      
      html += '<div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 10px; display: grid; grid-template-columns: 150px 1fr; gap: 15px;">' +
              '<div style="font-weight: bold; color: #667eea;">' + icon + ' ' + k + '</div>' +
              '<div style="word-break: break-all; color: #333; font-family: monospace; font-size: 13px;">' + valueStr + '</div>' +
              '</div>'
    })
    
    if (html === '') {
      html = '<div style="padding: 30px; text-align: center; color: #999;">데이터 없음</div>'
    }
    
    contentEl.innerHTML = html
  }

  /**
   * 잔고 조회 함수
   */
  async function loadBalance() {
    const balanceEl = document.getElementById('headerBalance')
    try {
      balanceEl.textContent = '⏳'
      balanceEl.style.color = '#6b7280'
      
      const r = await api('/api/trading/balance')
      
      if (r.ok && r.data) {
        const data = r.data
        // 총 자산을 표시 (원화)
        const totalAssets = parseInt(data.totalAssets) || 0
        const formatted = totalAssets.toLocaleString('ko-KR')
        balanceEl.textContent = '₩' + formatted
        balanceEl.title = '총 자산: ₩' + formatted + ' | 보유 현금: ₩' + (parseInt(data.cashBalance) || 0).toLocaleString('ko-KR') + ' | 클릭하여 새로고침'
        balanceEl.style.color = '#10b981'
        const heroBalanceValue = document.getElementById('heroBalanceValue')
        const heroCashValue = document.getElementById('heroCashValue')
        if (heroBalanceValue) heroBalanceValue.textContent = formatKrw(data.totalAssets)
        if (heroCashValue) heroCashValue.textContent = formatKrw(data.availableCash || data.cashBalance)
      } else {
        balanceEl.textContent = '조회 실패'
        balanceEl.style.color = '#ef4444'
      }
    } catch (e) {
      const balanceEl = document.getElementById('headerBalance')
      balanceEl.textContent = '오류'
      balanceEl.style.color = '#ef4444'
      balanceEl.title = '클릭하여 재시도'
      const heroBalanceValue = document.getElementById('heroBalanceValue')
      const heroCashValue = document.getElementById('heroCashValue')
      if (heroBalanceValue) heroBalanceValue.textContent = '조회 실패'
      if (heroCashValue) heroCashValue.textContent = '조회 실패'
      console.warn('[Balance Load]', e.message)
    }
  }

  function setQuickControlMessage(message, type = 'success') {
    const box = document.getElementById('quickControlMsg')
    if (!box) return
    const className = type === 'error' ? 'error-msg' : 'success-msg'
    box.innerHTML = '<div class="' + className + '">' + message + '</div>'
  }

  function applyServerStateToTradingButtons() {
    const domesticBtn = document.getElementById('startDomesticBtn')
    const overseasBtn = document.getElementById('startOverseasBtn')
    if (!domesticBtn || !overseasBtn) return

    if (!isServerOnline) {
      domesticBtn.disabled = true
      overseasBtn.disabled = true
      domesticBtn.title = '서버 연결 오류로 비활성화됨'
      overseasBtn.title = '서버 연결 오류로 비활성화됨'
      return
    }

    domesticBtn.title = ''
    overseasBtn.title = ''

    if (domesticBtn.dataset.running !== '1') {
      domesticBtn.disabled = false
    }
    if (overseasBtn.dataset.running !== '1') {
      overseasBtn.disabled = false
    }
  }

  async function loadAutoControlStatus() {
    const statusEl = document.getElementById('autoTradingStatus')
    if (statusEl) {
      statusEl.innerHTML = '<div class="loading-spinner">⏳ 로딩 중...</div>'
    }
    
    try {
      const r = await api('/api/trading/auto/status')
      const data = r.data || {}
      
      // 버튼 상태 업데이트
      const domesticBtn = document.getElementById('startDomesticBtn')
      const overseasBtn = document.getElementById('startOverseasBtn')
      const stopDomesticBtn = document.getElementById('stopDomesticBtn')
      const stopOverseasBtn = document.getElementById('stopOverseasBtn')
      const stopBtn = document.getElementById('stopAllBtn')
      
      if (domesticBtn && overseasBtn) {
        const domesticRunning = data.domestic?.running || false
        const overseasRunning = data.overseas?.running || false
        const heroTradeBadge = document.getElementById('heroTradeBadge')
        const heroDomesticValue = document.getElementById('heroDomesticValue')
        const heroDomesticMeta = document.getElementById('heroDomesticMeta')
        const heroOverseasValue = document.getElementById('heroOverseasValue')
        const heroOverseasMeta = document.getElementById('heroOverseasMeta')

        domesticBtn.dataset.running = domesticRunning ? '1' : '0'
        overseasBtn.dataset.running = overseasRunning ? '1' : '0'

        domesticBtn.textContent = domesticRunning ? '🇰🇷 국내 매매 중...' : '🇰🇷 국내 자동매매 시작'
        overseasBtn.textContent = overseasRunning ? '🌎 해외 매매 중...' : '🌎 해외 자동매매 시작'

        applyServerStateToTradingButtons()

        if (stopBtn) {
          stopBtn.disabled = !domesticRunning && !overseasRunning
        }

        if (heroTradeBadge) {
          heroTradeBadge.textContent = domesticRunning || overseasRunning ? '자동매매 실행 중' : '자동매매 대기 중'
        }
        if (heroDomesticValue) heroDomesticValue.textContent = domesticRunning ? '실행 중' : '대기 중'
        if (heroOverseasValue) heroOverseasValue.textContent = overseasRunning ? '실행 중' : '대기 중'
        if (heroDomesticMeta) heroDomesticMeta.textContent = data.domestic?.lastCycleAt ? '최근 사이클 ' + formatDateTime(data.domestic.lastCycleAt) : '아직 실행 기록 없음'
        if (heroOverseasMeta) heroOverseasMeta.textContent = data.overseas?.lastCycleAt ? '최근 사이클 ' + formatDateTime(data.overseas.lastCycleAt) : '아직 실행 기록 없음'
        
        // 상태 표시
        const statusEl = document.getElementById('autoTradingStatus')
        if (statusEl) {
          let statusHtml = '<div style=\"padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 14px;\">'
          statusHtml += '<div><strong>국내:</strong> ' + (domesticRunning ? '<span style=\"color: #10b981;\">✓ 실행 중 (사이클: ' + (data.domestic.cycleCount || 0) + '회)</span>' : '<span style=\"color: #64748b;\">대기 중</span>') + '</div>'
          statusHtml += '<div style=\"margin-top: 8px;\"><strong>해외:</strong> ' + (overseasRunning ? '<span style=\"color: #10b981;\">✓ 실행 중 (사이클: ' + (data.overseas.cycleCount || 0) + '회)</span>' : '<span style=\"color: #64748b;\">대기 중</span>') + '</div>'
          if (data.intervalSeconds) {
            statusHtml += '<div style=\"margin-top: 8px; color: #666;\"><small>갱신 주기: ' + data.intervalSeconds + '초</small></div>'
          }
          statusHtml += '</div>'
          statusEl.innerHTML = statusHtml
        }
      }
    } catch (e) {
      console.error('[자동매매] 상태 로드 실패:', e)
      setQuickControlMessage('자동매매 상태 조회 실패: ' + e.message, 'error')
    }
  }

  async function startAutoTrading(market) {
    try {
      const targetMarket = market === 'overseas' ? 'overseas' : 'domestic'

      await loadStatus()
      if (!isServerOnline) {
        setQuickControlMessage('서버 연결 오류 상태입니다. 연결 복구 후 다시 시도하세요.', 'error')
        return
      }

      setQuickControlMessage((targetMarket === 'overseas' ? '해외' : '국내') + ' 자동매매 시작 요청 중...')

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
      await loadAutoControlStatus().catch(() => {})
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
      const positions = Array.isArray(trading.positions) ? trading.positions : []
      const investedAmount = positions.reduce((sum, pos) => {
        const shares = Number(pos?.shares || 0)
        const entryPrice = Number(pos?.entryPrice || 0)
        return sum + (shares * entryPrice)
      }, 0)

      setOut('statusSummaryOut', {
        systemStatus: trading.systemStatus,
        lastRunTime: trading.lastRunTime,
        totalCapital: trading.totalCapital,
        investedAmount,
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

  // Stop All Trading Modal Functions
  function openStopAllModal() {
    document.getElementById('stopAllTradingModal').classList.add('active')
    document.getElementById('stopAllConfirmInput').value = ''
    document.getElementById('stopAllStatus').innerHTML = ''
    updateStopAllButtonState()
  }

  function closeStopAllModal() {
    document.getElementById('stopAllTradingModal').classList.remove('active')
  }

  function updateStopAllButtonState() {
    const input = document.getElementById('stopAllConfirmInput').value
    const btn = document.getElementById('confirmStopAllBtn')
    btn.disabled = input !== '모든거래를중단합니다'
  }

  async function confirmStopAllTrading() {
    const statusEl = document.getElementById('stopAllStatus')
    
    try {
      statusEl.innerHTML = '⏳ 모든 거래 중단 처리 중...'
      
      const r = await api('/api/trading/auto/stop-all', {
        method: 'POST',
        body: { confirmation: '모든거래를중단합니다' },
      })

      const sold = Number(r.liquidation?.sold?.length || 0)
      const failed = Number(r.liquidation?.failed?.length || 0)
      
      statusEl.innerHTML = '✓ 모든 거래 중단 완료<br/>청산 성공: ' + sold + '건, 실패: ' + failed + '건'
      
      setTimeout(() => {
        closeStopAllModal()
      }, 1500)
      
      await loadAutoControlStatus()
      await loadTradingStatus()

      if (statusPanelOpen) {
        await refreshStatusView()
      }
    } catch (e) {
      statusEl.innerHTML = '✗ 오류: ' + e.message
    }
  }

  async function stopAllTrading() {
    openStopAllModal()
  }

  function updateStatusRefreshInterval() {
    const seconds = parseInt(document.getElementById('statusRefreshInterval').value || '120')
    statusRefreshSeconds = seconds
    storage.setItem('statusRefreshSeconds', String(seconds))
    updateStatusRefreshPreview()
    if (statusPanelOpen) startStatusAutoRefresh()
  }

  function loadStatusRefreshPreference() {
    const saved = storage.getItem('statusRefreshSeconds')
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

  async function openErrorLogsModal() {
    const modal = document.getElementById('errorLogsModal')
    const contentEl = document.getElementById('errorLogsContent')
    
    modal.classList.add('active')
    contentEl.innerHTML = '<div style="text-align: center; color: #999;">로딩 중...</div>'
    
    try {
      const errors = await api('/api/errors')
      renderErrorLogs(errors)
    } catch (e) {
      contentEl.innerHTML = '<div style="padding: 20px; color: #ef4444; background: #fef2f2; border-radius: 8px; border-left: 4px solid #ef4444;">오류: ' + e.message + '</div>'
    }
  }

  function closeErrorLogsModal() {
    document.getElementById('errorLogsModal').classList.remove('active')
  }

  function renderErrorLogs(data) {
    const contentEl = document.getElementById('errorLogsContent')
    
    if (!data || (Array.isArray(data) && data.length === 0)) {
      contentEl.innerHTML = '<div style="padding: 30px; text-align: center; color: #999;">오류가 없습니다.</div>'
      return
    }

    let html = ''
    
    if (Array.isArray(data.errors)) {
      data.errors.forEach((err, idx) => {
        const timestamp = err.timestamp || err.time || '시간 정보 없음'
        const message = err.message || err.msg || ''
        const code = err.code || ''
        
        html += '<div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #ef4444;">' +
                '<div style="display: grid; grid-template-columns: 1fr auto; gap: 15px; margin-bottom: 8px;">' +
                '<div>' +
                '<strong style="color: #d32f2f;">오류 #' + (idx + 1) + '</strong>' +
                '</div>' +
                '<div style="font-size: 12px; color: #666;">' + timestamp + '</div>' +
                '</div>' +
                '<div style="color: #333; font-size: 13px; line-height: 1.6; word-break: break-all;">' +
                (message || '메시지 없음') +
                (code ? '<br/><span style="color: #666;">코드: ' + code + '</span>' : '') +
                '</div>' +
                '</div>'
      })
    } else if (Array.isArray(data)) {
      data.forEach((err, idx) => {
        const timestamp = err.timestamp || err.time || '시간 정보 없음'
        const message = typeof err === 'string' ? err : err.message || JSON.stringify(err)
        
        html += '<div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #ef4444;">' +
                '<div style="display: grid; grid-template-columns: 1fr auto; gap: 15px; margin-bottom: 8px;">' +
                '<div><strong style="color: #d32f2f;">오류 #' + (idx + 1) + '</strong></div>' +
                '<div style="font-size: 12px; color: #666;">' + timestamp + '</div>' +
                '</div>' +
                '<div style="color: #333; font-size: 13px; line-height: 1.6; word-break: break-all;">' + message + '</div>' +
                '</div>'
      })
    } else {
      html = '<div style="padding: 20px; color: #333; background: #f9f9f9; border-radius: 8px; font-family: monospace; font-size: 12px; word-break: break-all;">' +
             JSON.stringify(data, null, 2) +
             '</div>'
    }
    
    if (!html) {
      html = '<div style="padding: 30px; text-align: center; color: #999;">오류 정보가 없습니다.</div>'
    }
    
    contentEl.innerHTML = html
  }

  async function loadErrors() {
    // loadErrors는 더 이상 사용되지 않음
    // openErrorLogsModal()을 사용하세요
    try {
      await api('/errors')
    } catch (e) {
      console.error('[Load Errors]', e.message)
    }
  }

  async function loadTradingStatus() {
    const posList = document.getElementById('positionsList')
    try {
      posList.innerHTML = '<div class="loading-spinner">⏳ 로딩 중...</div>'
      
      const r = await api('/trading/status')
      const positions = r.positions || {}
      posList.innerHTML = ''
      
      if (Object.keys(positions).length === 0) {
        posList.innerHTML = '<div style="padding: 20px; color: #999; text-align: center; background: #f9f9f9; border-radius: 8px; border: 1px solid #e0e0e0;">현재 포지션 없음</div>'
      } else {
        Object.entries(positions).forEach(([symbol, pos]) => {
          const item = document.createElement('div')
          item.style.cssText = 'background: #f9f9f9; padding: 12px; border-radius: 8px; border-left: 4px solid #2563eb; display: grid; grid-template-columns: 1fr auto; gap: 15px; align-items: center;'
          
          const gainLoss = pos.current_price ? ((pos.current_price - pos.entry_price) * pos.shares).toFixed(0) : 'N/A'
          const gainPct = pos.current_price ? (((pos.current_price - pos.entry_price) / pos.entry_price) * 100).toFixed(1) : 'N/A'
          
          item.innerHTML = '<div>' +
            '<div style="font-weight: bold; font-size: 15px; margin-bottom: 4px;">' + symbol + '</div>' +
            '<div style="font-size: 12px; color: #666; line-height: 1.6;">' +
            '보유수량: ' + pos.shares + '주 | 매입가: ' + pos.entry_price.toFixed(2) + ' | 매입일: ' + pos.entry_date.substring(0, 10) +
            '</div>' +
            '</div>' +
            '<div style="text-align: right;">' +
            '<div style="font-weight: bold; font-size: 14px; color: ' + (gainLoss >= 0 ? '#10b981' : '#ef4444') + ';">' + (gainLoss >= 0 ? '+' : '') + gainLoss + '원</div>' +
            '<div style="font-size: 12px; color: ' + (gainPct >= 0 ? '#10b981' : '#ef4444') + ';">' + (gainPct >= 0 ? '+' : '') + gainPct + '%</div>' +
            '</div>'
          
          posList.appendChild(item)
        })
      }
    } catch (e) {
      const posList = document.getElementById('positionsList')
      posList.innerHTML = '<div style="padding: 20px; color: #ef4444; text-align: center;">오류: ' + e.message + '</div>'
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

  // Key Change Modal Functions
  function openKeyChangeModal() {
    document.getElementById('keyChangeModal').classList.add('active')
    document.getElementById('keyChangeConfirmInput').value = ''
    document.getElementById('keyChangeStatus').innerHTML = ''
    updateKeyChangeButtonState()
  }

  function closeKeyChangeModal() {
    document.getElementById('keyChangeModal').classList.remove('active')
  }

  function updateKeyChangeButtonState() {
    const input = document.getElementById('keyChangeConfirmInput').value
    const btn = document.getElementById('confirmKeyChangeBtn')
    const isCorrect = input === '키를교체하겠습니다'
    
    if (isCorrect) {
      btn.disabled = false
      btn.style.opacity = '1'
      btn.style.cursor = 'pointer'
    } else {
      btn.disabled = true
      btn.style.opacity = '0.5'
      btn.style.cursor = 'not-allowed'
    }
  }

  async function confirmKeyChange() {
    const statusEl = document.getElementById('keyChangeStatus')
    
    try {
      statusEl.innerHTML = '⏳ 키 교체 처리 중...'
      
      const r = await api('/kis/update', {
        method: 'POST',
        body: { action: 'update' }
      })
      
      statusEl.innerHTML = '✓ API 키가 업데이트 되었습니다.<br/>키 입력 페이지로 이동합니다.'
      
      setTimeout(() => {
        closeKeyChangeModal()
        closeSettingsModal()
        showPage('kisPage')
      }, 1500)
      
    } catch (e) {
      statusEl.innerHTML = '✗ 오류: ' + e.message
    }
  }

  /**
   * 잔고 갱신 주기 설정 저장
   */
  function updateBalanceRefreshInterval() {
    const seconds = parseInt(document.getElementById('settingsBalanceRefreshInterval').value)
    balanceRefreshSeconds = seconds
    storage.setItem('balanceRefreshSeconds', seconds.toString())
    updateBalanceRefreshPreview()
    
    // 즉시 갱신 주기 변경
    if (balanceRefreshInterval) clearInterval(balanceRefreshInterval)
    startBalanceAutoRefresh()
  }
  
  /**
   * 저장된 갱신 시간 불러오기
   */
  function loadBalanceRefreshPreference() {
    const saved = storage.getItem('balanceRefreshSeconds')
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
      Promise.all([
        loadStatus(),
        loadBalance()
      ]).catch(e => console.warn('[Header Refresh]', e.message))
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
        Promise.all([
          loadStatus(),
          loadBalance()
        ]).finally(() => {
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
      const positions = Array.isArray(trading.positions) ? trading.positions : []

      // 통계 카드 업데이트
      const systemMeta = getSystemStatusMeta(trading.systemStatus)

      document.getElementById('statTotalInvested').textContent = formatKrw(trading.totalCapital)
      document.getElementById('statROI').textContent = formatKrw(trading.cashAvailable)
      document.getElementById('statROI').style.color = '#0f766e'
      document.getElementById('statRuntime').textContent = systemMeta.label
      document.getElementById('statRuntime').style.color = systemMeta.tone === 'good' ? '#15803d' : systemMeta.tone === 'bad' ? '#dc2626' : '#475569'
      
      // 포지션 수
      document.getElementById('statPositions').textContent = positions.length + '개'

      // 포지션 리스트
      renderPositionList(positions)
      renderBuyCandidates('statusDomesticBuyCandidates', data.symbolSelection?.responsiveBuyCandidates?.domestic || [], '국내')
      renderBuyCandidates('statusOverseasBuyCandidates', data.symbolSelection?.responsiveBuyCandidates?.overseas || [], '해외')
      renderOrderFailures(data.reports?.recentTradeLogs || [])
      renderMarketFailureCards(data.reports?.recentTradeFailures || {})

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
        ? '<div class="market-state running"><div class="status-chip good">LIVE</div><strong>실행 중</strong><small>사이클 ' + (auto.domestic?.cycleCount || 0) + '회 · 최근 실행 ' + formatDateTime(auto.domestic?.lastCycleAt) + '</small></div>'
        : '<div class="market-state stopped"><div class="status-chip neutral">IDLE</div><strong>대기 중</strong><small>최근 실행 ' + formatDateTime(auto.domestic?.lastCycleAt) + '</small></div>'
    }
    
    if (overseasDiv) {
      const isRunning = auto.overseas?.running
      overseasDiv.innerHTML = isRunning
        ? '<div class="market-state running"><div class="status-chip good">LIVE</div><strong>실행 중</strong><small>사이클 ' + (auto.overseas?.cycleCount || 0) + '회 · 최근 실행 ' + formatDateTime(auto.overseas?.lastCycleAt) + '</small></div>'
        : '<div class="market-state stopped"><div class="status-chip neutral">IDLE</div><strong>대기 중</strong><small>최근 실행 ' + formatDateTime(auto.overseas?.lastCycleAt) + '</small></div>'
    }
  }

  function renderBuyCandidates(elementId, candidates, marketLabel) {
    const list = document.getElementById(elementId)
    if (!list) return

    if (!candidates || !candidates.length) {
      list.innerHTML = '<div style="padding:20px; color:#6b7280; text-align:center;">지금 바로 진입할 ' + marketLabel + ' 후보가 없습니다</div>'
      return
    }

    list.innerHTML = candidates.map((item) => {
      const price = Number(item.lastPrice || 0).toLocaleString('ko-KR')
      const mode = item.mode === 'responsive_momentum'
        ? '빠른모멘텀'
        : item.mode === 'ranking_fallback'
          ? '보조진입'
          : item.mode === 'ranking_watchlist'
            ? '관찰후보'
            : 'MA추세'
      return '<div class="position-item">' +
        '<strong>' + item.symbol + ' · ' + mode + '</strong>' +
        '<small>현재가 ₩' + price + ' | 강도 ' + Number(item.strength || 0).toFixed(4) + '</small>' +
        '<small>' + (item.reason || '현재 전략 기준 즉시 진입 후보') + '</small>' +
        '</div>'
    }).join('')
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

  function renderOrderFailures(logs) {
    const list = document.getElementById('statusOrderFailureList')
    if (!list) return

    const failures = (logs || []).filter((item) => item.action === 'ORDER_FAILED' || item.action === 'RETRY_EXHAUSTED').slice(0, 12)
    if (!failures.length) {
      list.innerHTML = '<div style="padding:20px; color:#6b7280; text-align:center;">최근 주문 실패가 없습니다</div>'
      return
    }

    list.innerHTML = failures.map((item) => {
      const title = item.symbol ? (item.symbol + ' · ' + (item.action || '실패')) : (item.operation || item.action || '실패')
      const detail = item.errorMessage || item.error || item.failureSummary || item.errors || '상세 사유 없음'
      const actionGuide = item.requiredAction ? ' | 조치: ' + item.requiredAction : ''
      const retryable = item.retryable ? ' | 재시도 가능' : ''
      const time = item.timestamp ? formatDateTime(item.timestamp) : '-'
      return '<div class="error-item">' +
        '<strong>' + title + '</strong>' +
        '<small>' + detail + actionGuide + retryable + ' | ' + time + '</small>' +
        '</div>'
    }).join('')
  }

  function renderMarketFailureCards(summary) {
    const domesticCard = document.getElementById('domesticOrderFailureCard')
    const overseasCard = document.getElementById('overseasOrderFailureCard')

    const render = (card, label, data) => {
      if (!card) return
      if (!data) {
        card.className = 'market-failure-card good'
        card.innerHTML = '<span>' + label + ' 주문 상태</span><strong>정상</strong><small>최근 실패 기록이 없거나, 최근 주문 흐름이 안정적입니다.</small>'
        return
      }

      card.className = 'market-failure-card bad'
      card.innerHTML = '<span>' + label + ' 주문 상태</span>' +
        '<strong>' + (data.symbol || label) + ' 실패</strong>' +
        '<small>' + (data.errorMessage || '실패 사유 없음') + '</small>' +
        '<small>' + (data.requiredAction || '추가 조치 정보 없음') + (data.retryable ? ' | 재시도 가능' : '') + '</small>'
    }

    render(domesticCard, '국내', summary.domestic)
    render(overseasCard, '해외', summary.overseas)
  }

  async function loadAiImprovementSummary() {
    try {
      const r = await api('/api/ai/improvements')
      const data = r.data || {}
      const rules = data.activeExitRules || {}
      const optimizationReport = data.optimizationReport || {}
      const recentAiResults = Array.isArray(data.recentAiResults) ? data.recentAiResults : []

      const ruleSummary = document.getElementById('aiRuleSummary')
      const ruleDetail = document.getElementById('aiRuleDetail')
      const optimizationStatus = document.getElementById('aiOptimizationStatus')
      const optimizationDetail = document.getElementById('aiOptimizationDetail')
      const oracleCount = document.getElementById('aiOracleCount')
      const oracleDetail = document.getElementById('aiOracleDetail')
      const fallbackPolicy = document.getElementById('aiFallbackPolicy')
      const fallbackDetail = document.getElementById('aiFallbackDetail')

      if (ruleSummary) ruleSummary.textContent = '+3% 시작 / 고점 -3% 익절'
      if (ruleDetail) ruleDetail.textContent = rules.summary || '현재 자동 익절/손절 규칙이 적용 중입니다.'
      if (optimizationStatus) optimizationStatus.textContent = optimizationReport.summary ? '자동 최적화 활성' : '성과 학습 대기'
      if (optimizationDetail) optimizationDetail.textContent = optimizationReport.summary || '최근 거래 데이터가 쌓이면 더 정교하게 보정됩니다.'
      if (oracleCount) oracleCount.textContent = recentAiResults.length + '건 최근 표시'
      if (oracleDetail) oracleDetail.textContent = data.storage?.aiResultsInOracle ? 'AI 분석 결과는 Oracle DB에 저장됩니다.' : 'Oracle DB 연결을 확인하세요.'
      if (fallbackPolicy) fallbackPolicy.textContent = '최대 ' + (data.auto?.buyPolicy?.fallbackFillTarget || 1) + '슬롯 보조 채움'
      if (fallbackDetail) fallbackDetail.textContent = data.auto?.buyPolicy?.summary || '기본 매수 실패 시 보조 매수 규칙을 사용합니다.'
    } catch (e) {
      const ruleSummary = document.getElementById('aiRuleSummary')
      const ruleDetail = document.getElementById('aiRuleDetail')
      const optimizationStatus = document.getElementById('aiOptimizationStatus')
      const fallbackPolicy = document.getElementById('aiFallbackPolicy')
      if (ruleSummary) ruleSummary.textContent = '확인 실패'
      if (ruleDetail) ruleDetail.textContent = 'AI 개선 정보 조회에 실패했습니다.'
      if (optimizationStatus) optimizationStatus.textContent = '불러오기 실패'
      if (fallbackPolicy) fallbackPolicy.textContent = '확인 실패'
    }
  }

  function renderMarketOpenNotice(elementId, label, status, openTimeLabel) {
    const el = document.getElementById(elementId)
    if (!el) return

    if (!status) {
      el.innerHTML = '<strong>' + label + ' 안내</strong> 시장 상태를 불러오지 못했습니다.'
      return
    }

    if (status.isOpen) {
      el.innerHTML = '<strong>' + label + ' 안내</strong> 현재 ' + label + ' 시장이 열려 있어, 자동매매를 시작하면 바로 조건 검토와 매매가 진행됩니다.'
      return
    }

    el.innerHTML = '<strong>' + label + ' 안내</strong> 장이 열리기 전 자동매매를 시작하면, ' + openTimeLabel + ' 이후 해당 시장이 열리는 시점부터 자동으로 매매가 시작됩니다.'
  }

  async function loadMarketOpenNotices() {
    try {
      const r = await api('/trading/market-status')
      const data = r.data || {}
      renderMarketOpenNotice('marketOpenNoticeDomestic', '국내', data.korean, data.korean?.nextOpen?.timeString || '다음 개장 시간')
      renderMarketOpenNotice('marketOpenNoticeOverseas', '해외', data.us, data.us?.nextOpen?.timeString || '다음 개장 시간')
    } catch (e) {
      renderMarketOpenNotice('marketOpenNoticeDomestic', '국내', null)
      renderMarketOpenNotice('marketOpenNoticeOverseas', '해외', null)
    }
  }

  async function loadLogsPage() {
    try {
      const r = await api('/api/logs/summary')
      const data = r.data || {}
      const loggerFiles = Array.isArray(data.files?.loggerFiles) ? data.files.loggerFiles : []

      document.getElementById('logOracleStatus').textContent = data.oracle?.aiResultsStored ? ('AI ' + (data.oracle?.aiResultsCount || 0) + ' / 운영 ' + (data.oracle?.operationalLogsCount || 0)) : '미연결'
      document.getElementById('logTradeCount').textContent = (data.files?.tradeJsonlEntries || 0) + '건'
      document.getElementById('logRuntimeCount').textContent = (data.runtime?.inMemoryErrors || 0) + '건'
      document.getElementById('logFileCount').textContent = loggerFiles.length + '개'
      document.getElementById('logStorageNote').textContent = data.note || '저장 구조를 불러오지 못했습니다.'

      const list = document.getElementById('logFileList')
      if (list) {
        list.innerHTML = loggerFiles.length
          ? loggerFiles.map((file) => '<div class="log-file-item"><strong>' + file.name + '</strong><small>크기: ' + Number(file.sizeBytes || 0).toLocaleString('ko-KR') + ' bytes</small><small>수정: ' + formatDateTime(file.updatedAt) + '</small></div>').join('')
          : '<div class="log-file-item"><strong>로그 파일 없음</strong><small>서버 로그 파일이 아직 생성되지 않았습니다.</small></div>'
      }
    } catch (e) {
      const status = document.getElementById('logDownloadStatus')
      if (status) status.textContent = '로그 요약을 불러오지 못했습니다: ' + e.message
    }
  }

  async function downloadLogs(useRange) {
    const type = document.getElementById('logTypeSelect')?.value || 'trade-jsonl'
    const format = document.getElementById('logFormatSelect')?.value || 'json'
    const from = document.getElementById('logFromDate')?.value || ''
    const to = document.getElementById('logToDate')?.value || ''
    const status = document.getElementById('logDownloadStatus')

    try {
      if (useRange && (!from || !to)) {
        throw new Error('구간 다운로드는 시작/종료 시간을 모두 선택해야 합니다.')
      }

      const params = new URLSearchParams({ type, format })
      if (useRange) {
        params.set('from', from)
        params.set('to', to)
      }

      const url = buildBrowserApiUrl('/logs/download') + '?' + params.toString()
      if (status) status.textContent = '로그를 준비하는 중입니다...'

      const res = await fetch(url, { credentials: 'include' })
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || '로그 다운로드 실패')
      }

      const blob = await res.blob()
      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const disposition = res.headers.get('Content-Disposition') || ''
      const fileNameMatch = disposition.match(/filename="([^"]+)"/)
      link.href = downloadUrl
      link.download = fileNameMatch ? fileNameMatch[1] : (type + '.txt')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(downloadUrl)

      if (status) status.textContent = '다운로드를 시작했습니다: ' + (link.download || type)
    } catch (e) {
      if (status) status.textContent = '다운로드 실패: ' + e.message
    }
  }

  async function performLogout() {
    try {
      stopStatusAutoRefresh()
      
      // /api/auth/logout 호출 (쿠키 포함)
      const logoutUrl = buildBrowserApiUrl('/auth/logout')
      
      const res = await fetch(logoutUrl, {
        method: 'POST',
        credentials: 'include'
      })
      
      currentUser.isLoggedIn = false
      
      // localStorage에서 로그인 상태 제거
      storage.removeItem('isLoggedIn')
      
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

  // localStorage 안전하게 사용하는 헬퍼 함수
  function safeLocalStorage() {
    try {
      const test = '__test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return localStorage
    } catch (e) {
      // localStorage 사용 불가 시 메모리 스토리지 사용
      console.warn('[Storage] localStorage 사용 불가, 메모리 저장소 사용 중')
      return {
        data: {},
        getItem(key) { return this.data[key] || null },
        setItem(key, value) { this.data[key] = value },
        removeItem(key) { delete this.data[key] },
        clear() { this.data = {} }
      }
    }
  }

  const storage = safeLocalStorage()

  // ============================================
  // 핵심 자동매매 제어 함수들
  // ============================================

  let stopTradingMarket = 'all'

  function getStopTradingConfig() {
    if (stopTradingMarket === 'domestic') {
      return {
        title: '🛑 국내 거래 중단',
        warning: '이 작업은 국내 보유 포지션을 즉시 모두 매도하고 국내 자동매매를 중단합니다.',
        confirmation: '거래를중단합니다',
        endpoint: '/trading/auto/stop-market',
        body: { market: 'domestic', confirmation: '거래를중단합니다' },
      }
    }
    if (stopTradingMarket === 'overseas') {
      return {
        title: '🛑 해외 거래 중단',
        warning: '이 작업은 해외 보유 포지션을 즉시 모두 매도하고 해외 자동매매를 중단합니다.',
        confirmation: '거래를중단합니다',
        endpoint: '/trading/auto/stop-market',
        body: { market: 'overseas', confirmation: '거래를중단합니다' },
      }
    }
    return {
      title: '🛑 모든 거래 중단',
      warning: '이 작업은 즉시 모든 보유 포지션을 매도하고 국내/해외 자동매매를 모두 중단합니다.',
      confirmation: '모든거래를중단합니다',
      endpoint: '/trading/auto/stop-all',
      body: { confirmation: '모든거래를중단합니다' },
    }
  }

  async function openStopTradingModal(market = 'all') {
    stopTradingMarket = market
    const config = getStopTradingConfig()
    const title = document.getElementById('stopTradingTitle')
    const warning = document.getElementById('stopTradingWarning')
    const expectedText = document.getElementById('stopTradingExpectedText')
    const input = document.getElementById('stopAllConfirmInput')

    if (title) title.textContent = config.title
    if (warning) warning.textContent = config.warning
    if (expectedText) expectedText.textContent = '확인 문구: ' + config.confirmation
    if (input) input.placeholder = config.confirmation

    document.getElementById('stopAllTradingModal').classList.add('active')
  }

  function closeStopAllModal() {
    document.getElementById('stopAllTradingModal').classList.remove('active')
    document.getElementById('stopAllConfirmInput').value = ''
    document.getElementById('stopAllStatus').innerHTML = ''
    updateStopAllButtonState()
  }

  function updateStopAllButtonState() {
    const input = document.getElementById('stopAllConfirmInput')
    if (!input) return
    
    const value = input.value
    const btn = document.getElementById('confirmStopAllBtn')
    if (!btn) return
    const config = getStopTradingConfig()
    
    const isCorrect = value === config.confirmation
    input.classList.toggle('valid', isCorrect)
    btn.disabled = !isCorrect
    btn.style.opacity = isCorrect ? '1' : '0.5'
    btn.style.cursor = isCorrect ? 'pointer' : 'not-allowed'
  }

  async function confirmStopAll() {
    try {
      const btn = document.getElementById('confirmStopAllBtn')
      if (!btn) return
      const config = getStopTradingConfig()
      
      btn.disabled = true
      btn.innerHTML = '<span class="spinner"></span> 처리 중...'
      
      await api(config.endpoint, {
        method: 'POST',
        body: config.body
      })
      
      // 성공
      btn.innerHTML = '✓ 처리 완료'
      btn.style.background = '#10b981'
      
      // 상태 갱신
      await Promise.all([
        loadAutoControlStatus(),
        loadStatus(),
        loadBalance()
      ]).catch(e => console.warn('[Refresh after stop]', e.message))
      
      // 2초 후 모달 닫기
      setTimeout(() => {
        closeStopAllModal()
      }, 2000)
      
    } catch (err) {
      const category = err.category || classifyError(err)
      const statusDiv = document.getElementById('stopAllStatus')
      
      if (statusDiv) {
        statusDiv.innerHTML = formatErrorMessage(
          category.userMessage,
          category.suggestion
        )
      }
      
      const btn = document.getElementById('confirmStopAllBtn')
      if (btn) {
        btn.disabled = false
        btn.innerHTML = '⚠️ 중단 실행'
      }
    }
  }

  function initEventListeners() {
    const loginInput = document.getElementById('loginPassword')
    const loginBtn = document.getElementById('loginBtn')
    
    // 저장된 로그인 상태 확인
    const isLoggedIn = storage.getItem('isLoggedIn') === 'true'
    if (isLoggedIn) {
      console.log('[초기화] 저장된 로그인 상태 감지')
      currentUser.isLoggedIn = true
      
      // 비동기로 초기화 체크 실행
      setTimeout(() => {
        showPage('initPage')
        checkInitStatus().catch(e => {
          console.error('[초기화 체크] 실패:', e)
          // 오류 시 로그인 페이지로 돌아가기
          storage.removeItem('isLoggedIn')
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

async function handleRequest(request, env) {
  const url = new URL(request.url)
  const backendBase = getBackendBase(env)
  const origin = request.headers.get('Origin') || '*'
  
  // CORS 헤더 설정
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Cookie, X-Requested-With',
    'Access-Control-Expose-Headers': 'Set-Cookie, Content-Type'
  }

  // OPTIONS 프리플라이트 요청 처리
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (url.pathname === '/' || url.pathname === '/admin') {
    // 템플릿 변수 치환
    const html = adminHtml.replace('__BACKEND_BASE__', backendBase)
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8',
        ...corsHeaders
      },
    })
  }

  // /api로 시작하는 요청은 백엔드로 프록시
  if (url.pathname.startsWith('/api')) {
    const normalizedBackendBase = backendBase.replace(/\/$/, '')
    const backendUrl = normalizedBackendBase + url.pathname + (url.search || '')

    // body 복사
    let body = null;
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      body = await request.clone().arrayBuffer();
    }

    // 헤더 복사 및 정리
    const headers = new Headers(request.headers);
    headers.delete('host');
    headers.delete('content-length');
    // Origin 헤더 강제 설정
    headers.set('Origin', 'http://localhost:4000');

    const backendReq = new Request(backendUrl, {
      method: request.method,
      headers,
      body,
      redirect: 'follow',
    });
    const backendRes = await fetch(backendReq);
    // 응답 헤더 복사
    const resHeaders = new Headers(backendRes.headers);
    corsHeaders && Object.entries(corsHeaders).forEach(([k, v]) => resHeaders.set(k, v));
    return new Response(await backendRes.body, {
      status: backendRes.status,
      headers: resHeaders
    });
  }

  // 그 외 경로는 404
  return new Response('Not Found', { status: 404, headers: corsHeaders })
}

export default {
  fetch(request, env) {
    return handleRequest(request, env)
  }
}
