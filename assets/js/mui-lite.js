/* MUI v5 交互的轻量等价实现（DOM 结构与类名沿用线上渲染结果） */
(function () {
  'use strict';

  /* ---------- Ripple ---------- */
  document.addEventListener('mousedown', function (e) {
    var btn = e.target.closest('.MuiButtonBase-root');
    if (!btn || btn.classList.contains('Mui-disabled')) return;
    var root = btn.querySelector('.MuiTouchRipple-root');
    if (!root) return;
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 2;
    var span = document.createElement('span');
    span.className = 'MuiTouchRipple-ripple MuiTouchRipple-rippleVisible';
    span.style.width = size + 'px';
    span.style.height = size + 'px';
    span.style.top = (e.clientY - rect.top - size / 2) + 'px';
    span.style.left = (e.clientX - rect.left - size / 2) + 'px';
    span.innerHTML = '<span class="MuiTouchRipple-child"></span>';
    root.appendChild(span);
    setTimeout(function () {
      span.firstChild.classList.add('MuiTouchRipple-childLeaving');
      setTimeout(function () { span.remove(); }, 550);
    }, 550);
  });

  /* ---------- TextField（outlined：focus 态与 label shrink） ---------- */
  function syncField(el) {
    var rootBase = el.closest('.MuiInputBase-root');
    if (!rootBase) return;
    var form = el.closest('.MuiFormControl-root');
    var label = form && form.querySelector('label.MuiFormLabel-root');
    var legend = rootBase.querySelector('fieldset legend');
    var focused = document.activeElement === el;
    var filled = !!el.value;
    rootBase.classList.toggle('Mui-focused', focused);
    if (label) {
      label.classList.toggle('Mui-focused', focused);
      label.classList.toggle('MuiInputLabel-shrink', focused || filled);
      label.classList.toggle('MuiFormLabel-filled', filled);
    }
    if (legend) legend.style.maxWidth = (focused || filled || !label) ? '100%' : '0.01px';
  }
  ['focusin', 'focusout', 'input'].forEach(function (evt) {
    document.addEventListener(evt, function (e) {
      if (e.target.matches('.MuiInputBase-input')) syncField(e.target);
    });
  });

  /* ---------- Radio / Checkbox ---------- */
  document.addEventListener('change', function (e) {
    var inp = e.target;
    if (!inp.matches('.MuiRadio-root input, .MuiCheckbox-root input, .PrivateSwitchBase-input')) return;
    var holder = inp.closest('.MuiRadio-root, .MuiCheckbox-root');
    if (!holder) return;
    if (inp.type === 'radio' && inp.name) {
      document.querySelectorAll('input[type="radio"][name="' + inp.name + '"]').forEach(function (other) {
        var h = other.closest('.MuiRadio-root');
        if (h) h.classList.toggle('Mui-checked', other.checked);
      });
    } else {
      holder.classList.toggle('Mui-checked', inp.checked);
    }
  });

  /* ---------- Select（Menu 弹层，类名取自线上展开态 dump） ---------- */
  var openMenu = null;
  function closeMenu() {
    if (openMenu) { openMenu.remove(); openMenu = null; }
  }
  window.muiSelect = function (combo, options, onChange) {
    combo.style.cursor = 'pointer';
    combo.addEventListener('mousedown', function (e) {
      e.preventDefault();
      if (openMenu) { closeMenu(); return; }
      var rect = combo.getBoundingClientRect();
      var current = combo.textContent.replace(/​/g, '').trim();
      var wrap = document.createElement('div');
      wrap.className = 'MuiPopover-root MuiMenu-root MuiModal-root css-1sucic7';
      wrap.innerHTML =
        '<div aria-hidden="true" class="MuiBackdrop-root MuiBackdrop-invisible MuiModal-backdrop css-esi9ax" style="opacity:1;"></div>' +
        '<div class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation8 MuiPopover-paper MuiMenu-paper css-pwxzbm" style="opacity:1;min-width:' + Math.max(200, rect.width) + 'px;top:' + (rect.bottom + window.scrollY) + 'px;left:' + (rect.left + window.scrollX) + 'px;">' +
        '<ul class="MuiList-root MuiList-padding MuiMenu-list css-r8u8y9" role="listbox"></ul></div>';
      var ul = wrap.querySelector('ul');
      options.forEach(function (opt) {
        var li = document.createElement('li');
        li.className = 'MuiButtonBase-root MuiMenuItem-root MuiMenuItem-gutters css-1km1ehz' + (opt.label === current ? ' Mui-selected' : '');
        li.setAttribute('role', 'option');
        li.dataset.value = opt.value;
        li.innerHTML = opt.label + '<span class="MuiTouchRipple-root css-w0pj6f"></span>';
        li.addEventListener('click', function () {
          combo.childNodes[0].nodeValue = opt.label;
          closeMenu();
          onChange(opt.value, opt.label);
        });
        ul.appendChild(li);
      });
      wrap.querySelector('.MuiBackdrop-root').addEventListener('click', closeMenu);
      document.body.appendChild(wrap);
      openMenu = wrap;
    });
  };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
})();
