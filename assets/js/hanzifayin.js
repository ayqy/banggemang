/* 汉字标准发音：speechSynthesis 中文朗读（与线上一致，无网络请求） */
(function () {
  var ta = document.querySelector('.pc-content textarea:not([aria-hidden])');
  var btn = null;
  document.querySelectorAll('.pc-content button').forEach(function (b) {
    if (b.textContent.indexOf('标准发音') >= 0) btn = b;
  });
  if (!btn) return;
  btn.addEventListener('click', function () {
    var text = (ta.value || '').trim();
    if (!text || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.7;
    window.speechSynthesis.speak(u);
  });
})();
