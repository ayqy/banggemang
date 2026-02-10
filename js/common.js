// Common JS - 帮小忙 工具箱

// ===== Label text mapping =====
var LABEL_TEXT = {
  1: 'hot',
  3: '推荐',
  4: 'new',
  5: '精品',
  6: 'AI',
  7: '安全',
  9: '签约',
  10: '搜狗'
};

// ===== Counter animation for statistics =====
function animateCounter(element, target, duration) {
  if (!element) return;
  var start = 0;
  var startTime = performance.now();

  function update(currentTime) {
    var elapsed = currentTime - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var easeOut = 1 - Math.pow(1 - progress, 3);
    var current = Math.floor(start + (target - start) * easeOut);
    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ===== Render a single tool card =====
function renderToolCard(tool) {
  var styleAttr = (tool.style !== undefined && tool.style !== null) ? tool.style : -1;
  var labelText = LABEL_TEXT[styleAttr] || '';
  var html = '<a class="tool-item" href="' + tool.href + '" target="_blank">';
  html += '<img src="' + tool.icon + '" alt="' + tool.name + '">';
  html += '<div class="tool-content">';
  html += '<div class="tool-name">' + tool.name + '</div>';
  html += '<div class="tool-desc">' + tool.desc + '</div>';
  html += '</div>';
  html += '<div class="label" data-style="' + styleAttr + '"><div class="label_font">' + labelText + '</div></div>';
  html += '</a>';
  return html;
}

// ===== Render a single plugin card =====
function renderPluginCard(plugin) {
  var html = '<div class="plugin-item">';
  html += '<img src="' + plugin.icon + '" alt="' + plugin.name + '">';
  html += '<div class="plugin-content">';
  html += '<div class="plugin-name">' + plugin.name + '</div>';
  html += '<div class="plugin-desc">' + plugin.desc + '</div>';
  html += '</div>';
  html += '</div>';
  return html;
}

// ===== Highlight active nav item =====
function highlightNav(cat) {
  var catMap = {
    'img': '图片工具',
    'pdf': 'PDF转换工具',
    'data': '数据换算工具',
    'life': '生活娱乐工具',
    'education': '教育工具',
    'text': '文本工具',
    'doc': '文档转换工具',
    'develop': '开发工具',
    'video': '视频工具',
    'pc_plugin': '浏览器插件'
  };

  var navItems = document.querySelectorAll('.category-entry-item');
  var activeName = cat ? catMap[cat] : '全部';

  for (var i = 0; i < navItems.length; i++) {
    var span = navItems[i].querySelector('span');
    if (span && span.textContent === activeName) {
      navItems[i].setAttribute('data-actived', 'true');
    }
  }
}

// ===== Initialize tool list rendering =====
function initToolList() {
  var params = new URLSearchParams(window.location.search);
  var cat = params.get('cat');

  // Highlight nav
  highlightNav(cat);

  var toolListEl = document.getElementById('toolList');
  var pluginListEl = document.getElementById('pluginList');

  if (!toolListEl) return;

  // Plugin view
  if (cat === 'pc_plugin') {
    toolListEl.style.display = 'none';
    pluginListEl.style.display = '';
    var pluginHtml = '<div class="plugin-list-container">';
    for (var p = 0; p < PLUGINS_DATA.length; p++) {
      pluginHtml += renderPluginCard(PLUGINS_DATA[p]);
    }
    pluginHtml += '</div>';
    pluginListEl.innerHTML = pluginHtml;
    return;
  }

  // Hide plugin list
  pluginListEl.style.display = 'none';
  toolListEl.style.display = '';

  if (cat) {
    // Single category view
    var tools = [];
    for (var i = 0; i < TOOLS_DATA.length; i++) {
      if (TOOLS_DATA[i].cat === cat) {
        tools.push(TOOLS_DATA[i]);
      }
    }
    var html = '<div class="tool-list-container">';
    for (var j = 0; j < tools.length; j++) {
      html += renderToolCard(tools[j]);
    }
    html += '</div>';
    toolListEl.innerHTML = html;
  } else {
    // "全部" grouped view — show all categories with section headers
    var catOrder = [];
    var catKey;
    for (catKey in CATEGORY_META) {
      if (CATEGORY_META.hasOwnProperty(catKey)) {
        catOrder.push({ key: catKey, name: CATEGORY_META[catKey].name, order: CATEGORY_META[catKey].order });
      }
    }
    catOrder.sort(function(a, b) { return a.order - b.order; });

    var allHtml = '';
    for (var c = 0; c < catOrder.length; c++) {
      var catInfo = catOrder[c];
      var catTools = [];
      for (var t = 0; t < TOOLS_DATA.length; t++) {
        if (TOOLS_DATA[t].cat === catInfo.key) {
          catTools.push(TOOLS_DATA[t]);
        }
      }
      if (catTools.length === 0) continue;

      allHtml += '<div class="tool-section">';
      allHtml += '<div class="tool-section-header">';
      allHtml += '<h3>' + catInfo.name + '</h3>';
      allHtml += '<a class="section-link" href="index.html?cat=' + catInfo.key + '">查看全部 ' + catTools.length + ' 个 &rarr;</a>';
      allHtml += '</div>';
      allHtml += '<div class="tool-section-grid">';
      for (var k = 0; k < catTools.length; k++) {
        allHtml += renderToolCard(catTools[k]);
      }
      allHtml += '</div>';
      allHtml += '</div>';
    }
    toolListEl.innerHTML = allHtml;
  }
}

// ===== Search functionality =====
function initSearch() {
  var searchInput = document.querySelector('.search-input');
  var searchPanel = document.querySelector('.search-panel');

  if (!searchInput || !searchPanel) return;

  // Combine tools + plugins for search
  var allItems = [];
  var i;
  for (i = 0; i < TOOLS_DATA.length; i++) {
    var tool = TOOLS_DATA[i];
    allItems.push({
      name: tool.name,
      desc: tool.desc,
      icon: tool.icon,
      href: tool.href,
      cat: (CATEGORY_META[tool.cat] ? CATEGORY_META[tool.cat].name : '')
    });
  }
  for (i = 0; i < PLUGINS_DATA.length; i++) {
    var plugin = PLUGINS_DATA[i];
    allItems.push({
      name: plugin.name,
      desc: plugin.desc,
      icon: plugin.icon,
      href: '',
      cat: '浏览器插件'
    });
  }

  function doSearch(query) {
    query = query.trim().toLowerCase();
    if (!query) {
      searchPanel.style.display = 'none';
      return;
    }

    var results = [];
    for (var s = 0; s < allItems.length; s++) {
      var item = allItems[s];
      if (item.name.toLowerCase().indexOf(query) !== -1 || item.desc.toLowerCase().indexOf(query) !== -1) {
        results.push(item);
      }
      if (results.length >= 20) break;
    }

    if (results.length === 0) {
      searchPanel.innerHTML = '<div class="search-empty">没有找到相关工具</div>';
      searchPanel.style.display = 'block';
      return;
    }

    var html = '';
    for (var r = 0; r < results.length; r++) {
      var res = results[r];
      var nameHighlighted = highlightText(res.name, query);
      if (res.href) {
        html += '<a class="search-result-item" href="' + res.href + '" target="_blank">';
      } else {
        html += '<div class="search-result-item">';
      }
      html += '<img src="' + res.icon + '" alt="' + res.name + '">';
      html += '<div style="flex:1;overflow:hidden;">';
      html += '<div class="search-result-name">' + nameHighlighted + '</div>';
      html += '<div class="search-result-desc">' + res.desc + '</div>';
      html += '</div>';
      html += '<span class="search-result-cat">' + res.cat + '</span>';
      if (res.href) {
        html += '</a>';
      } else {
        html += '</div>';
      }
    }
    searchPanel.innerHTML = html;
    searchPanel.style.display = 'block';
  }

  function highlightText(text, query) {
    var idx = text.toLowerCase().indexOf(query);
    if (idx === -1) return text;
    return text.substring(0, idx) +
      '<span class="search-result-highlight">' + text.substring(idx, idx + query.length) + '</span>' +
      text.substring(idx + query.length);
  }

  searchInput.addEventListener('input', function() {
    doSearch(this.value);
  });

  searchInput.addEventListener('focus', function() {
    if (this.value.trim()) {
      doSearch(this.value);
    }
  });

  searchInput.addEventListener('blur', function() {
    setTimeout(function() {
      searchPanel.style.display = 'none';
    }, 200);
  });
}

// ===== Back to top =====
function initBackToTop() {
  var backTopBtn = document.querySelector('.nav-backtop');
  if (backTopBtn) {
    backTopBtn.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ===== Initialize everything on DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', function() {
  // Counter animation
  var counter = document.querySelector('.count-up-container');
  if (counter) {
    var target = parseInt(counter.textContent.replace(/,/g, '')) || 365853165;
    animateCounter(counter, target, 2000);
  }

  // Tool list rendering (only on index page)
  if (document.getElementById('toolList')) {
    initToolList();
  }

  // Search
  initSearch();

  // Back to top
  initBackToTop();
});
