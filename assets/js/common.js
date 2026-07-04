/* 公共骨架逻辑：统计数字 / 站内搜索 / 分享面板 / 回顶 */
(function () {
  'use strict';
  var META = window.TOOLS_META || { eduTools: [], allTools: [] };
  var LOCAL_PATHS = {};
  META.eduTools.forEach(function (t) { LOCAL_PATHS[t.path] = true; });

  function toolHref(t) {
    if (LOCAL_PATHS[t.path]) return './' + t.path + '.html';
    if (t.url) return t.url;
    return 'https://tool.browser.qq.com/' + t.path + '.html';
  }

  /* ---------- 统计数字（本地模拟，展示形式与线上一致） ---------- */
  var countEl = document.querySelector('.count-up-container');
  if (countEl) {
    var base = parseInt(countEl.textContent.replace(/\D/g, ''), 10);
    if (!base || isNaN(base)) base = 374158740;
    // 以采集基线按时间推进，重现“累计使用人次”缓慢增长的效果
    var COLLECT_TS = 1751611200000; // 2026-07-04 采集时刻
    base += Math.floor((Date.now() - COLLECT_TS) / 1000 * 0.12);
    var render = function () { countEl.textContent = String(base); };
    render();
    setInterval(function () { base += 1 + Math.floor(Math.random() * 3); render(); }, 2500);
  }

  /* ---------- 站内搜索 ---------- */
  var input = document.querySelector('.search-input');
  var panel = document.querySelector('.search-panel');
  if (input && panel) {
    var renderPanel = function (q) {
      if (!q) { panel.innerHTML = ''; return; }
      var hits = META.allTools.filter(function (t) {
        return (t.name && t.name.indexOf(q) >= 0) || (t.keyword && t.keyword.indexOf(q) >= 0);
      });
      if (hits.length) {
        panel.innerHTML = hits.map(function (t) {
          return '<a class="search-panel-item" href="' + toolHref(t) + '" target="_blank">' +
                 ' <img src="' + t.icon + '"> <span>' + t.name + '</span> </a>';
        }).join('');
      } else {
        panel.innerHTML = '<a class="search-panel-empty" target="_blank" href="https://sogou.com/web?query=' +
          encodeURIComponent(q) + '">没有找到相关工具，试试搜全网\n<span class="search-panel-ermpty-go">全网搜索</span></a>';
      }
    };
    input.addEventListener('input', function () { renderPanel(input.value.trim()); });
    input.addEventListener('focus', function () { renderPanel(input.value.trim()); });
  }

  /* ---------- 分享面板 ---------- */
  var shareBtn = document.querySelector('.share-btn');
  if (shareBtn) {
    var linkItem = shareBtn.querySelector('.channel-item[data-type="link"]');
    var qrItem = shareBtn.querySelector('.channel-item[data-type="qrcode"] img');
    if (qrItem && window.qrcode) {
      try {
        var qr = window.qrcode(0, 'M');
        qr.addData(location.href);
        qr.make();
        qrItem.src = qr.createDataURL(4, 8);
      } catch (e) { /* 超长 file:// 路径等异常时保留原图 */ }
    }
    if (linkItem) linkItem.addEventListener('click', function () {
      var url = location.href;
      var done = function () { toast('复制成功'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { fallbackCopy(url); done(); });
      } else { fallbackCopy(url); done(); }
    });
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------- toast ---------- */
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'bxm-toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1800);
  }
  window.bxmToast = toast;

  /* ---------- 回顶（接管 javascript: href，file:// 下行为一致） ---------- */
  var back = document.querySelector('.nav-backtop');
  if (back) back.addEventListener('click', function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); });
})();
