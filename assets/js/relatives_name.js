/* 亲戚关系计算：relationship.js，实时计算 */
(function () {
  var MAP = { '父': '爸爸', '母': '妈妈', '夫': '老公', '妻': '老婆', '子': '儿子', '女': '女儿', '兄': '哥哥', '弟': '弟弟', '姐': '姐姐', '妹': '妹妹' };
  var chain = [];
  var pc = document.querySelector('.pc-content');
  var textInput = pc.querySelector('input[type="text"]');
  var checkbox = pc.querySelector('input[type="checkbox"]');
  var radios = pc.querySelectorAll('input[type="radio"]');
  var resultEl = (function () {
    // 结果显示元素：按键区之后的最后一个块
    var el = document.createElement('div');
    el.className = 'bxm-rel-result';
    var host = pc.querySelector('.pc-content > div') || pc;
    pc.appendChild(el);
    return el;
  })();
  // 找到已有的结果容器（线上初始为空 div），优先复用
  (function () {
    var divs = pc.querySelectorAll('div');
    for (var i = divs.length - 1; i >= 0; i--) {
      var d = divs[i];
      if (!d.children.length && !d.textContent.trim() && d.className.indexOf('Ripple') < 0 && d !== resultEl) {
        resultEl.remove();
        resultEl = d;
        break;
      }
    }
  })();

  function sexVal() {
    // 页面结构无 label 包裹：radio value="0"=我是女的（默认选中），"1"=我是男的
    var sex = 0;
    radios.forEach(function (r) { if (r.checked) sex = r.value === '1' ? 1 : 0; });
    return sex;
  }
  function update() {
    var text = chain.map(function (k, i) { return i === 0 ? MAP[k] : '的' + MAP[k]; }).join('');
    if (textInput) {
      textInput.value = text;
      textInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (!chain.length) { resultEl.textContent = ''; return; }
    var res = [];
    try {
      res = window.relationship({ text: text, sex: sexVal(), reverse: !!(checkbox && checkbox.checked) });
    } catch (e) {}
    resultEl.textContent = (res && res.length) ? res.join('、') : '';
  }
  pc.querySelectorAll('button').forEach(function (b) {
    var t = b.textContent.replace(/\s/g, '').replace(/<.*$/, '');
    var key = t[0];
    if (MAP[key]) {
      b.addEventListener('click', function () { chain.push(key); update(); });
    } else if (t.indexOf('<') === 0 || b.textContent.indexOf('<') >= 0) {
      b.addEventListener('click', function () { chain.pop(); update(); });
    }
  });
  if (checkbox) checkbox.addEventListener('change', update);
  radios.forEach(function (r) { r.addEventListener('change', update); });
})();
