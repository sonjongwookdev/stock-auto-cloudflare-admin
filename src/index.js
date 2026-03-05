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
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
      background-size: 200% 200%;
      animation: gradientShift 15s ease infinite;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .login-page.active::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridMove 20s linear infinite;
    }
    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 50px); }
    }
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 24px;
      padding: 60px 50px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3), 
                  0 0 100px rgba(139, 92, 246, 0.2),
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
      box-shadow: 0 25px 70px rgba(0,0,0,0.35), 
                  0 0 120px rgba(139, 92, 246, 0.3);
    }
    .login-card h1 {
      font-size: 42px;
      font-weight: 900;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -2px;
      text-shadow: 0 2px 10px rgba(139, 92, 246, 0.1);
    }
    .login-card .subtitle {
      color: #6b7280;
      margin-bottom: 40px;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    /* Init Page */
    .page.init-page.active {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
      background-size: 200% 200%;
      animation: gradientShift 15s ease infinite;
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
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); 
      min-height: 100vh; 
      padding-top: 0; 
    }
    .top-header {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px) saturate(180%);
      border-bottom: 1px solid rgba(229, 231, 235, 0.8);
      padding: 18px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04),
                  0 2px 8px rgba(0, 0, 0, 0.02);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
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
      gap: 20px;
      align-items: center;
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
          <span class="status-dot online" id="headerDbStatus"></span>
          <span id="headerDbText">연결됨</span>
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
    <div class="wrap" style="max-width: 1200px; margin: 0 auto;">
      <div class="row">
        <!-- 자동매매 제어 -->
        <section class="card" style="grid-column: 1 / -1;">
          <h2 style="margin-bottom: 20px;">🤖 자동매매 제어</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <button id="startDomesticBtn" class="btn" onclick="startAutoTrading('domestic')" style="padding: 18px; font-size: 15px;">🇰🇷 국내 자동매매 시작</button>
            <button id="startOverseasBtn" class="btn" onclick="startAutoTrading('overseas')" style="padding: 18px; font-size: 15px;">🌎 해외 자동매매 시작</button>
          </div>
          <div id="quickControlMsg" style="margin-bottom: 12px;"></div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <h3 style="font-size: 15px; margin-bottom: 12px; color: #333;">📍 현재 포지션</h3>
            <div id="positionsList" style="display: grid; gap: 10px;">
              <div class="loading-spinner">⏳ 로딩 중...</div>
            </div>
          </div>
        </section>

        <!-- 시스템 현황 -->
        <section class="card" style="grid-column: 1 / -1;">
          <h2 style="margin-bottom: 15px;">⚙️ 시스템 현황</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <button class="btn" onclick="openStatusModal()" style="padding: 12px;">📊 현황보기</button>
            <button class="btn secondary" onclick="openErrorLogsModal()" style="padding: 12px;">📋 오류 로그 보기</button>
          </div>
        </section>

        <!-- 모든 거래 중단 -->
        <section class="card" style="grid-column: 1 / -1;">
          <button id="stopAllBtn" class="btn" onclick="openStopAllModal()" style="width: 100%; padding: 16px; font-size: 15px; background: #dc2626; font-weight: 600;">🛑 모든 거래 중단</button>
        </section>
      </div>
    </div>

    <!-- Stop All Trading Modal -->
    <div id="stopAllTradingModal" class="modal-overlay">
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
          <h2>🛑 모든 거래 중단</h2>
          <button class="modal-close" onclick="closeStopAllModal()">✕</button>
        </div>
        
        <div style="padding: 20px; color: #d32f2f;">
          <div style="background: #ffebee; border-left: 4px solid #d32f2f; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <strong style="color: #c62828;">⚠️ 경고</strong><br/>
            <span style="color: #d32f2f; font-size: 14px;">이 작업은 즉시 모든 보유 포지션을 매도하고 자동매매를 중단합니다.</span>
          </div>
          
          <p style="color: #666; margin-bottom: 15px; font-size: 14px;">중단하려면 아래 문구를 정확히 입력하세요:</p>
          <input 
            id="stopAllConfirmInput" 
            type="text" 
            placeholder="모든거래를중단합니다" 
            onkeyup="updateStopAllButtonState()"
            style="width: 100%; padding: 10px; border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 15px; font-size: 14px;"
          />
          
          <div id="stopAllStatus" style="background: #f5f5f5; padding: 10px; border-radius: 6px; margin-bottom: 15px; min-height: 20px; color: #666; font-size: 13px;"></div>
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
            <div class="stat-label">투자중 금액</div>
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
        <h2 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin-bottom: 20px;">📚 Stock Auto 관리자 가이드</h2>
        
        <div class="usage-guide" style="line-height: 1.8;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
            <h3 style="color: white; margin: 0 0 10px 0; font-size: 20px;">🚀 시작하기</h3>
            <p style="margin: 0; font-size: 14px; opacity: 0.95;">이 관리자 패널은 Stock Auto 자동매매 시스템을 제어하고 모니터링하는 웹 인터페이스입니다.</p>
          </div>

          <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">1️⃣ 로그인</h3>
            <p style="margin-bottom: 10px;">관리자 비밀번호를 입력하여 로그인합니다.</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>로그인 상태는 브라우저에 저장됩니다</li>
              <li>다음 방문 시 자동 로그인됩니다</li>
            </ul>
          </div>

          <div style="background: #f8f9fa; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #10b981; margin-top: 0;">2️⃣ 대시보드 (💼)</h3>
            <h4 style="color: #333; margin-top: 15px;">📊 상단 헤더 정보</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li><strong>🔑 키값:</strong> 설정된 KIS API 키 (앞뒤 3글자만 표시)</li>
              <li><strong>🖥️ 서버:</strong> 백엔드 서버 연결 상태 (🟢 정상 / 🔴 오류)</li>
              <li><strong>💰 잔고:</strong> 현재 계좌 잔고 (<strong>클릭하여 수동 새로고침</strong>)</li>
            </ul>
            <h4 style="color: #333; margin-top: 20px;">🤖 자동매매 제어</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li><strong>국내 자동매매:</strong> 한국 주식 시장 자동매매 시작</li>
              <li><strong>해외 자동매매:</strong> 해외 주식 시장 자동매매 시작</li>
              <li>실행 중인 매매는 버튼이 비활성화되며 사이클 횟수가 표시됩니다</li>
            </ul>
            <h4 style="color: #333; margin-top: 20px;">⚙️ 시스템 현황</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li><strong>📊 현황보기:</strong> 서버 상태, KIS 키 상태 확인</li>
              <li><strong>📋 오류 로그 보기:</strong> 발생한 오류 메시지 확인</li>
            </ul>
            <h4 style="color: #333; margin-top: 20px;">🛑 모든 거래 중단</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>"<strong>모든거래를중단합니다</strong>" 문구를 입력해야 실행됩니다</li>
              <li>즉시 모든 보유 포지션을 매도하고 자동매매를 중단합니다</li>
            </ul>
          </div>

          <div style="background: #f8f9fa; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #3b82f6; margin-top: 0;">3️⃣ 현황 페이지 (📊)</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li><strong>현황 보기:</strong> 서버 상태, 자동매매 상태 확인</li>
              <li><strong>오류 로그:</strong> 시스템 오류 및 경고 확인</li>
            </ul>
          </div>

          <div style="background: #f8f9fa; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #f59e0b; margin-top: 0;">4️⃣ 설정 (⚙️)</h3>
            <h4 style="color: #333; margin-top: 15px;">🔑 KIS API 키 교체</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>현재 설정된 API 키 확인</li>
              <li>키 교체 시 "<strong>키를교체하겠습니다</strong>" 문구 입력 필요</li>
              <li>⚠️ <strong>주의:</strong> 키 교체 시 자동매매가 중단됩니다</li>
            </ul>
          </div>

          <div style="background: #fff3cd; border-left: 4px solid #ff9800; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #ff9800; margin-top: 0;">💡 유용한 팁</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>잔고는 <strong>클릭하여 수동으로 새로고침</strong>할 수 있습니다</li>
              <li>중요한 작업은 확인 문구를 입력해야 실행됩니다</li>
              <li>모든 설정은 브라우저의 localStorage에 저장됩니다</li>
              <li>오류 발생 시 📋 오류 로그를 확인하세요</li>
            </ul>
          </div>

          <div style="background: #ffebee; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px;">
            <h3 style="color: #ef4444; margin-top: 0;">❓ 문제 해결</h3>
            <h4 style="color: #333; margin-top: 15px;">잔고가 표시되지 않아요</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>잔고를 클릭하여 수동 새로고침을 시도하세요</li>
              <li>KIS API 키가 제대로 설정되었는지 확인하세요</li>
              <li>백엔드 서버가 실행 중인지 확인하세요</li>
            </ul>
            <h4 style="color: #333; margin-top: 15px;">자동매매가 시작되지 않아요</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>시장 운영 시간인지 확인하세요</li>
              <li>KIS API 키가 유효한지 확인하세요</li>
              <li>📋 오류 로그에서 자세한 오류를 확인하세요</li>
            </ul>
          </div>
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
  const BACKEND_BASE = typeof globalThis !== 'undefined' && globalThis.BACKEND_BASE_URL 
    ? globalThis.BACKEND_BASE_URL 
    : 'http://localhost:4000'
  
  let currentMarket = 'domestic'
  let currentUser = { isLoggedIn: false }
  let balanceRefreshInterval = null  // 잔고 자동 갱신 타이머
  let balanceRefreshSeconds = 120  // 기본값 2분
  let statusRefreshInterval = null
  let statusRefreshSeconds = 120
  let statusPanelOpen = false
  let isServerOnline = true

  async function api(path, opts = {}) {
    const maxRetries = 5
    const initialDelay = 500
    const maxDelay = 10000

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        
        // /api로 시작하지 않으면 /api 추가
        const apiPath = path.startsWith('/api') ? path : ('/api' + path)
        
        // 로컬호스트 검사 - localhost에서는 localhost로 직접 호출
        let fullUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
          ? 'http://localhost:4000' + apiPath
          : BACKEND_BASE + apiPath
        
        const res = await fetch(fullUrl, {
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
      // 로컬호스트 검사
      const loginUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:4000/api/auth/login'
        : BACKEND_BASE + '/api/auth/login'
      
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
        throw new Error(errorData.error || ('HTTP ' + res.status))
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
      const category = e.category || classifyError(e)
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
    // 병렬 로딩으로 성능 개선
    await Promise.all([
      loadKisStatus(),
      loadStatus(),
      loadBalance(),
      loadAutoControlStatus(),
      loadTradingStatus()
    ]).catch(e => console.error('[Dashboard Load Error]', e))
    
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

      isServerOnline = dbOnline
      applyServerStateToTradingButtons()
      
      if (dbOnline) {
        dbDot.className = 'status-dot online'
        dbText.textContent = '연결됨'

        if (!previousServerOnline) {
          setQuickControlMessage('서버 연결이 복구되었습니다. 자동매매 시작 버튼을 다시 사용할 수 있습니다.', 'success')
          loadAutoControlStatus().catch(() => {})
        }
      } else {
        dbDot.className = 'status-dot offline'
        dbText.textContent = '오류'

        if (previousServerOnline) {
          setQuickControlMessage('서버 연결 오류 상태입니다. 자동매매 시작 버튼이 일시 비활성화됩니다.', 'error')
        }
      }
    } catch (e) {
      isServerOnline = false
      applyServerStateToTradingButtons()
      document.getElementById('headerDbStatus').className = 'status-dot offline'
      document.getElementById('headerDbText').textContent = '오류'
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
      const stopBtn = document.getElementById('stopAllBtn')
      
      if (domesticBtn && overseasBtn) {
        const domesticRunning = data.domestic?.running || false
        const overseasRunning = data.overseas?.running || false

        domesticBtn.dataset.running = domesticRunning ? '1' : '0'
        overseasBtn.dataset.running = overseasRunning ? '1' : '0'

        domesticBtn.textContent = domesticRunning ? '🇰🇷 국내 매매 중...' : '🇰🇷 국내 자동매매 시작'
        overseasBtn.textContent = overseasRunning ? '🌎 해외 매매 중...' : '🌎 해외 자동매매 시작'

        applyServerStateToTradingButtons()

        if (stopBtn) {
          stopBtn.disabled = !domesticRunning && !overseasRunning
        }
        
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
      const totalInvested = positions.reduce((sum, pos) => {
        const shares = Number(pos?.shares || 0)
        const entryPrice = Number(pos?.entryPrice || 0)
        return sum + (shares * entryPrice)
      }, 0)
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
      
      // /api/auth/logout 호출 (쿠키 포함)
      const logoutUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:4000/api/auth/logout'
        : BACKEND_BASE + '/api/auth/logout'
      
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

  async function startAutoTrading(market) {
    try {
      const btn = document.getElementById('start' + (market === 'domestic' ? 'Domestic' : 'Overseas') + 'Btn')
      if (!btn) {
        console.error('[AutoTrading] Button not found for market:', market)
        return
      }
      
      // 버튼 비활성화
      btn.disabled = true
      btn.classList.add('loading')
      const originalText = btn.innerHTML
      btn.innerHTML = '<span class="spinner"></span> 시작 중...'
      
      const response = await api('/trading/auto/start', {
        method: 'POST',
        body: { market }
      })
      
      // 성공
      btn.classList.remove('loading')
      btn.classList.add('success')
      btn.innerHTML = '✓ ' + (market === 'domestic' ? '국내' : '해외') + ' 실행 중'
      
      // 상태 갱신
      await Promise.all([
        loadAutoControlStatus(),
        loadStatus()
      ]).catch(e => console.warn('[Refresh after start]', e.message))
      
      // 3초 후 버튼 복구
      setTimeout(() => {
        btn.classList.remove('success')
        btn.disabled = true
        btn.innerHTML = '✓ ' + (market === 'domestic' ? '국내' : '해외') + ' 실행 중'
      }, 3000)
      
    } catch (err) {
      const category = err.category || classifyError(err)
      const btn = document.getElementById('start' + (market === 'domestic' ? 'Domestic' : 'Overseas') + 'Btn')
      
      if (!btn) return
      
      // 에러 처리
      btn.classList.remove('loading')
      btn.classList.add('failure')
      btn.innerHTML = '✕ 실패'
      
      // 에러 메시지 표시
      const msgDiv = document.getElementById('quickControlMsg')
      if (msgDiv) {
        msgDiv.innerHTML = formatErrorMessage(
          category.userMessage,
          category.suggestion
        )
      } else {
        alert(category.userMessage)
      }
      
      // 2초 후 버튼 복구
      setTimeout(() => {
        btn.classList.remove('failure')
        btn.disabled = false
        btn.innerHTML = '🤖 ' + (market === 'domestic' ? '🇰🇷 국내 자동매매 시작' : '🌎 해외 자동매매 시작')
      }, 2000)
    }
  }

  async function openStopAllModal() {
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
    
    const isCorrect = value === '모든거래를중단합니다'
    btn.disabled = !isCorrect
    btn.style.opacity = isCorrect ? '1' : '0.5'
    btn.style.cursor = isCorrect ? 'pointer' : 'not-allowed'
  }

  async function confirmStopAll() {
    try {
      const btn = document.getElementById('confirmStopAllBtn')
      if (!btn) return
      
      btn.disabled = true
      btn.innerHTML = '<span class="spinner"></span> 처리 중...'
      
      const response = await api('/trading/auto/stop-all', {
        method: 'POST',
        body: { confirmation: '모든거래를중단합니다' }
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
        btn.innerHTML = '⚠️ 중단합니다'
      }
    }
  }

  async function loadBalance() {
    try {
      const r = await api('/trading/balance')
      const balance = r.data || {}
      
      document.getElementById('headerBalance').textContent = 
        '₩' + (Number(balance.cashAvailable || 0)).toLocaleString('ko-KR')
      
      isServerOnline = true
    } catch (err) {
      document.getElementById('headerBalance').textContent = '오류'
      const category = err.category || classifyError(err)
      
      if (category.category === ErrorCategories.NETWORK) {
        isServerOnline = false
      }
    }
  }

  async function loadStatus() {
    try {
      const r = await api('/status')
      const dbStatus = r.dbStatus === 'healthy'
      
      const dot = document.getElementById('headerDbStatus')
      const text = document.getElementById('headerDbText')
      
      if (dot) {
        dot.className = 'status-dot ' + (dbStatus ? 'online' : 'offline')
      }
      if (text) {
        text.textContent = dbStatus ? '연결됨' : '오류'
      }
    } catch (err) {
      const dot = document.getElementById('headerDbStatus')
      const text = document.getElementById('headerDbText')
      
      if (dot) dot.className = 'status-dot offline'
      if (text) text.textContent = '오류'
    }
  }

  async function loadAutoControlStatus() {
    try {
      const r = await api('/trading/auto/status')
      const data = r.data || {}
      const domestic = data.domestic || {}
      const overseas = data.overseas || {}
      
      const domesticBtn = document.getElementById('startDomesticBtn')
      const overseasBtn = document.getElementById('startOverseasBtn')
      
      if (domesticBtn) {
        if (domestic.running) {
          domesticBtn.disabled = true
          domesticBtn.innerHTML = '✓ 🇰🇷 국내 실행 중'
          domesticBtn.style.background = '#10b981'
        } else {
          domesticBtn.disabled = false
          domesticBtn.innerHTML = '🤖 🇰🇷 국내 자동매매 시작'
          domesticBtn.style.background = ''
        }
      }
      
      if (overseasBtn) {
        if (overseas.running) {
          overseasBtn.disabled = true
          overseasBtn.innerHTML = '✓ 🌎 해외 실행 중'
          overseasBtn.style.background = '#10b981'
        } else {
          overseasBtn.disabled = false
          overseasBtn.innerHTML = '🤖 🌎 해외 자동매매 시작'
          overseasBtn.style.background = ''
        }
      }
    } catch (err) {
      console.warn('[LoadAutoStatus]', err.message)
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
    'Access-Control-Allow-Origin': origin,
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

  // Worker는 HTML만 제공, API는 프론트엔드에서 직접 백엔드 호출
  return new Response('Not Found', { status: 404, headers: corsHeaders })
}

export default {
  fetch(request, env) {
    return handleRequest(request, env)
  }
}