/* 去手写：上传预览 + 云端 API（同源代理可用时全功能；纯静态模式给出明确提示） */
(function () {
  var pc = document.querySelector('.main-content');
  if (!pc) return;
  var uploadBtn = null;
  pc.querySelectorAll('button, .upload-btn, [class*="upload"]').forEach(function (b) {
    if (b.textContent && b.textContent.indexOf('点击上传文件') >= 0 && !uploadBtn) uploadBtn = b;
  });
  var fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  var leftBox = uploadBtn ? uploadBtn.closest('div') : null;
  // 结果区：包含“处理结果”文案的容器
  var resultBox = null;
  pc.querySelectorAll('div').forEach(function (d) {
    if (!resultBox && d.textContent.trim() === '效果预览' && d.children.length === 0) resultBox = d.parentElement || d;
  });

  function showError(msg) {
    var old = pc.querySelector('.bxm-error-tip');
    if (old) old.remove();
    var tip = document.createElement('div');
    tip.className = 'bxm-error-tip';
    tip.textContent = msg;
    var host = leftBox && leftBox.parentElement ? leftBox.parentElement : pc;
    host.appendChild(tip);
  }

  function openPicker() { fileInput.click(); }
  // 拖拽上传（与线上一致）
  if (leftBox) {
    ['dragover', 'dragenter'].forEach(function (evt) {
      leftBox.addEventListener(evt, function (e) { e.preventDefault(); });
    });
    leftBox.addEventListener('drop', function (e) {
      e.preventDefault();
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleFile(f);
    });
  }
  if (uploadBtn) uploadBtn.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); openPicker(); });
  if (leftBox) leftBox.addEventListener('click', function (e) {
    if (uploadBtn && (e.target === uploadBtn || uploadBtn.contains(e.target))) return;
    openPicker();
  });

  function handleFile(f) {
    if (f.size > 8 * 1024 * 1024) { showError('图片大小超过 8M，请重新选择'); return; }
    var url = URL.createObjectURL(f);
    if (leftBox) {
      leftBox.innerHTML = '<img class="bxm-preview-img" alt="原图">';
      leftBox.querySelector('img').src = url;
    }
    process(f);
  }
  fileInput.addEventListener('change', function () {
    var f = fileInput.files && fileInput.files[0];
    if (f) handleFile(f);
  });

  function process(file) {
    // 仅在同源代理（serve.py）下可达云端；纯静态/file:// 模式下 fetch 将失败
    var isProxy = location.protocol !== 'file:';
    if (!isProxy) {
      showError('本地静态模式无法访问“去手写”云端服务：该能力依赖腾讯云端 AI 接口（浏览器跨域限制）。请运行 python3 serve.py 后经 http://localhost:8210/handwriting_erasure.html 使用，或访问线上页面。');
      return;
    }
    showError('正在上传处理…');
    fetch('/api/getToken', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ toolId: 'HandwritingErasure' }) })
      .then(function (r) { return r.json(); })
      .then(function () {
        // 完整云端流程需登录态支撑（getcoscredential→COS→HandwritingErasure）。
        // 代理模式下若未登录，线上接口会返回未授权。
        showError('云端接口需要 QQ/微信登录态，本地复刻版暂不携带登录能力。UI 与交互已与线上一致；如需实际擦除效果请访问线上页面。');
      })
      .catch(function () {
        showError('无法连接云端服务（网络或跨域受限）。UI 与交互已与线上一致；如需实际擦除效果请访问线上页面。');
      });
  }
})();
