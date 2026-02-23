/**
 * 帮小忙 - 通用 JavaScript
 * 腾讯 QQ 浏览器在线工具箱平台
 */

// ==================== 工具函数 ====================

/**
 * 渲染左侧导航栏
 */
function renderLeftNav(activeCategory = '') {
  const container = document.querySelector('.category-container');
  if (!container) return;
  
  container.innerHTML = categories.map(cat => `
    <li class="category-entry-wrapper" data-category="${cat.id}">
      <a class="category-entry-item ${activeCategory === cat.id ? 'active' : ''}" href="${cat.path}">
        <img src="/assets/images/nav/${cat.icon}" alt="${cat.name}">
        <span>${cat.name}</span>
      </a>
    </li>
  `).join('');
}

/**
 * 渲染工具卡片
 */
function renderToolCards(tools, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  container.innerHTML = tools.map(tool => `
    <a class="tool-card" href="${tool.path}">
      <img class="tool-icon" src="/assets/images/tools/${tool.icon}" alt="${tool.name}">
      <div class="tool-info">
        <h3 class="tool-name">${tool.name}</h3>
        <p class="tool-desc">${tool.description}</p>
      </div>
      ${tool.tag ? `<span class="tool-tag ${tool.tag}">${tool.tag}</span>` : ''}
    </a>
  `).join('');
}

/**
 * 渲染推荐工具
 */
function renderRecommendTools(tools, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  
  // 只显示前 2-4 个推荐
  const recommendTools = tools.slice(0, 4);
  
  container.innerHTML = recommendTools.map(tool => `
    <a class="recommend-card" href="${tool.path}">
      <img class="tool-icon" src="/assets/images/tools/${tool.icon}" alt="${tool.name}">
      <div class="tool-info">
        <h3 class="tool-name">${tool.name}</h3>
        <p class="tool-desc">${tool.description}</p>
      </div>
    </a>
  `).join('');
}

/**
 * 搜索工具
 */
function searchTools(keyword) {
  if (!keyword) return [];
  
  const allTools = [
    ...educationTools
    // 后续可以添加其他分类的工具
  ];
  
  return allTools.filter(tool => 
    tool.name.toLowerCase().includes(keyword.toLowerCase()) ||
    tool.description.toLowerCase().includes(keyword.toLowerCase())
  );
}

/**
 * 初始化搜索功能
 */
function initSearch() {
  const searchInput = document.querySelector('.search-input');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.trim();
    if (keyword.length >= 2) {
      const results = searchTools(keyword);
      showSearchResults(results);
    } else {
      hideSearchResults();
    }
  });
  
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const keyword = searchInput.value.trim();
      if (keyword) {
        const results = searchTools(keyword);
        if (results.length === 1) {
          window.location.href = results[0].path;
        }
      }
    }
  });
}

/**
 * 显示搜索结果
 */
function showSearchResults(results) {
  let panel = document.querySelector('.search-panel');
  if (!panel) {
    panel = document.createElement('div');
    panel.className = 'search-panel';
    const searchContainer = document.querySelector('.search-container');
    searchContainer.appendChild(panel);
  }
  
  if (results.length === 0) {
    panel.innerHTML = '<div class="no-results">未找到相关工具</div>';
  } else {
    panel.innerHTML = results.slice(0, 5).map(tool => `
      <a class="search-result-item" href="${tool.path}">
        <img src="/assets/images/tools/${tool.icon}" alt="${tool.name}">
        <span>${tool.name}</span>
      </a>
    `).join('');
  }
  
  panel.style.display = 'block';
}

/**
 * 隐藏搜索结果
 */
function hideSearchResults() {
  const panel = document.querySelector('.search-panel');
  if (panel) {
    panel.style.display = 'none';
  }
}

/**
 * 初始化回顶部按钮
 */
function initBackToTop() {
  const backTopBtn = document.querySelector('.back-top');
  if (!backTopBtn) return;
  
  backTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 初始化分享按钮
 */
function initShare() {
  const shareBtn = document.querySelector('.share-btn');
  if (!shareBtn) return;
  
  shareBtn.addEventListener('click', () => {
    const url = window.location.href;
    const title = document.title;
    
    if (navigator.share) {
      navigator.share({ title, url });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(url).then(() => {
        alert('链接已复制到剪贴板');
      });
    }
  });
}

/**
 * 获取当前分类 ID
 */
function getCurrentCategoryId() {
  const path = window.location.pathname;
  const match = path.match(/\/category\/([^.]+)\.html/);
  if (match) {
    return match[1];
  }
  return 'all';
}

/**
 * 初始化页脚
 */
function initFooter() {
  const footerPlaceholder = document.querySelector('.footer-placeholder-pc');
  if (footerPlaceholder && !footerPlaceholder.innerHTML) {
    footerPlaceholder.innerHTML = `
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-left">
            <img class="footer-logo" src="/assets/icons/footer-logo.png" alt="帮小忙">
            <div>
              <div class="footer-introduce">轻松办公，工具助你一臂之力</div>
              <div class="license-pc">
                <a href="https://rule.tencent.com/rule/preview/10c4538f-a3b6-4292-803d-5c8498657b75" target="_blank">隐私政策</a>
                <a href="https://static.res.qq.com/nav/qbtool/qbtool-license.html" target="_blank">数据处理规则及免责声明</a>
              </div>
              <div class="copyright-pc">
                Copyright © 1998 - ${new Date().getFullYear()} Tencent. All Rights Reserved.
              </div>
            </div>
          </div>
          <img class="footer-qrcode" src="/assets/icons/footer-qrcode.png" alt="二维码">
        </div>
      </footer>
    `;
  }
}

/**
 * 初始化右侧快捷导航
 */
function initQuickNav() {
  const quickNav = document.querySelector('.quick-nav');
  if (!quickNav) {
    // 创建右侧快捷导航
    const navHTML = `
      <aside class="quick-nav">
        <div class="nav-button-item back-top" title="回顶部">
          <img src="/assets/icons/nav-top.png" alt="回顶部">
        </div>
        <div class="nav-button-item" title="QQ 群">
          <a href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=G8GZ1XGfQoypNSFz79BNmF06xOkhKt5h&authKey=6wQcUEbSlL9sHcNv4gtr7jS9Mmz03wjxUAEsLTh4KhOSECC4EpBaMe2nEW%2BZJoas&noverify=0&group_code=459317399" target="_blank">
            <img src="/assets/icons/nav-qqgroup.png" alt="QQ 群">
          </a>
          <span class="qqgroup-tip">QQ 群：459317399</span>
        </div>
        <div class="nav-button-item" title="共建">
          <a href="https://feedback.browser.qq.com/qbtool?dev=1&url=tool.browser.qq.com/" target="_blank">
            <span class="nav-button-text">共建</span>
          </a>
        </div>
        <div class="nav-button-item" title="反馈">
          <a href="https://feedback.browser.qq.com/qbtool?url=tool.browser.qq.com/" target="_blank">
            <span class="nav-button-text">反馈</span>
          </a>
        </div>
      </aside>
    `;
    document.body.insertAdjacentHTML('beforeend', navHTML);
  }
}

// ==================== 页面初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
  // 初始化通用功能
  initBackToTop();
  initShare();
  initSearch();
  initFooter();
  initQuickNav();
});
