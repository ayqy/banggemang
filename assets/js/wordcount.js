/* 字数计算：中文逐字 + 连续字母/数字串按 1 计；空格换行标点不计 */
(function () {
  var tas = document.querySelectorAll('.pc-content textarea:not([aria-hidden])');
  var input = tas[0], output = tas[1];
  var btns = document.querySelectorAll('.pc-content button');
  var confirmBtn = null, clearBtn = null;
  btns.forEach(function (b) {
    if (b.textContent.indexOf('确认') >= 0) confirmBtn = b;
    if (b.textContent.indexOf('清空') >= 0) clearBtn = b;
  });
  function count(text) {
    var n = (text.match(/[一-龥]/g) || []).length;
    n += (text.match(/[A-Za-z0-9]+/g) || []).length;
    return n;
  }
  if (confirmBtn) confirmBtn.addEventListener('click', function () {
    if (output) output.value = '总字数：' + count(input.value);
  });
  if (clearBtn) clearBtn.addEventListener('click', function () {
    if (input) { input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); }
    if (output) output.value = '';
  });
})();
