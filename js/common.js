/**
 * 帮小忙 - 公共JS函数库
 */

// ==================== 全局配置 ====================
const CONFIG = {
  siteName: '帮小忙',
  siteSubtitle: '腾讯QQ浏览器在线工具箱',
  copyright: 'Copyright © 1998 - 2026 Tencent. All Rights Reserved.'
};

// ==================== 分类数据 ====================
const CATEGORIES = [
  { id: 'all', name: '全部', icon: '🏠', url: 'index.html' },
  { id: 'img', name: '图片工具', icon: '🖼️', url: '#' },
  { id: 'pdf', name: 'PDF转换工具', icon: '📄', url: '#' },
  { id: 'data', name: '数据换算工具', icon: '📊', url: '#' },
  { id: 'life', name: '生活娱乐工具', icon: '🎮', url: '#' },
  { id: 'education', name: '教育工具', icon: '📚', url: 'index.html' },
  { id: 'text', name: '文本工具', icon: '📝', url: '#' },
  { id: 'doc', name: '文档转换工具', icon: '📑', url: '#' },
  { id: 'develop', name: '开发工具', icon: '💻', url: '#' },
  { id: 'video', name: '视频工具', icon: '🎬', url: '#' },
  { id: 'pc_plugin', name: '浏览器插件', icon: '🔌', url: '#' }
];

// ==================== 教育工具数据 ====================
const EDUCATION_TOOLS = [
  { id: 'handwriting_erasure', name: '去手写', icon: '✍️', iconBg: '#4ECDC4', desc: '去手写是一款专为处理文件中的手写笔迹而设计的在线工具。它能够智能识别并抹除文件中的手写内容，如笔记、标注和答案，从而还原干净的试卷或文档，方便用户重新练习或使用。', tag: 'new', url: 'handwriting_erasure.html' },
  { id: 'zitie_new', name: '字帖生成', icon: '📜', iconBg: '#FF6B6B', desc: '字帖生成是一款在线工具，专为生成个性化字帖而设计。通过这款工具，您可以选择不同的模板、年级，快速生成适合练习书写的字帖。', tag: 'recommend', url: 'zitie_new.html' },
  { id: 'relatives_name', name: '亲戚关系计算', icon: '👨‍👩‍👧‍👦', iconBg: '#45B7D1', desc: '亲戚关系计算可以帮助用户快速计算两个或多个对象之间复杂的亲戚关系。亲戚关系计算操作简单易用，只需要打开工具，选择需要计算的亲戚关系，点击"计算"按钮即可得到准确的计算结果。', tag: 'hot', url: 'relatives_name.html' },
  { id: 'school', name: '高校查询', icon: '🏫', iconBg: '#6C5CE7', desc: '高校查询可以快速找到中国境内知名大学的相关信息，应用汇聚了全国各地的知名大学，包括清华大学、北京大学、南京大学、浙江大学、复旦大学、上海交通大学等等。', tag: null, url: 'school.html' },
  { id: 'wordcount', name: '字数计算', icon: '📝', iconBg: '#F39C12', desc: '字数计算专为快速计算文本中的字数、字符数、单词数和句子数而设计。无论您是需要统计文章的字数、检查字符限制，还是进行文本分析，这款工具都能帮助您高效完成任务。', tag: null, url: 'wordcount.html' },
  { id: 'dynasties', name: '历史朝代查询', icon: '🏛️', iconBg: '#9B59B6', desc: '历史朝代查询是一款教育性和实用性兼备的在线工具，专为帮助用户快速查询和了解各个历史朝代的相关信息而设计。', tag: null, url: 'dynasties.html' },
  { id: 'capital', name: '各国首都', icon: '🌍', iconBg: '#E74C3C', desc: '各国首都查询是一款实用的在线工具，专为帮助用户快速查询世界各国首都而设计。', tag: null, url: 'capital.html' },
  { id: 'jielong', name: '成语接龙', icon: '🐉', iconBg: '#E67E22', desc: '成语接龙工具可以帮助您进行成语接龙游戏，提升您的汉语词汇量和语言表达能力。', tag: null, url: 'jielong.html' },
  { id: 'markmap', name: '便捷思维导图', icon: '🧠', iconBg: '#1ABC9C', desc: '便捷思维导图工具可以帮助您快速创建、编辑和分享思维导图，提升您的思维整理和信息管理能力。', tag: null, url: 'markmap.html' },
  { id: 'hanzifayin', name: '汉字标准发音', icon: '🔊', iconBg: '#3498DB', desc: '汉字标准发音工具可以帮助您学习和掌握汉字的标准发音。', tag: null, url: 'hanzifayin.html' },
  { id: 'periodic', name: '元素周期表', icon: '⚗️', iconBg: '#27AE60', desc: '元素周期表工具可以帮助您快速查阅和了解化学元素的详细信息。', tag: null, url: 'periodic.html' },
  { id: 'translate', name: '翻译', icon: '🌐', iconBg: '#8E44AD', desc: '翻译工具可以帮助您将文本从一种语言翻译成另一种语言。', tag: null, url: 'translate.html' },
  { id: 'radical', name: '汉字偏旁', icon: '📖', iconBg: '#F1C40F', desc: '汉字偏旁工具可以帮助您查找和学习汉字的偏旁部首。', tag: null, url: 'radical.html' },
  { id: 'allegory', name: '歇后语', icon: '💬', iconBg: '#95A5A6', desc: '歇后语工具可以帮助您查找和学习各种歇后语。', tag: null, url: 'allegory.html' },
  { id: 'explain', name: '词语注解', icon: '📚', iconBg: '#16A085', desc: '词语注解工具可以帮助您查找和学习词语的详细解释和用法。', tag: null, url: 'explain.html' },
  { id: 'chengyujielong', name: '成语大全', icon: '📖', iconBg: '#D35400', desc: '成语大全查询是一款免费的中国传统文化知识工具，它收录了大量成语。', tag: null, url: 'chengyujielong.html' }
];

// ==================== 成语数据 ====================
const IDIOMS = [
  '开天辟地', '地大物博', '博学多才', '才高八斗', '斗转星移', '移花接木', '木已成舟',
  '舟车劳顿', '顿开茅塞', '塞翁失马', '马到成功', '功成名就', '就事论事', '事半功倍',
  '倍道而行', '行云流水', '水滴石穿', '穿针引线', '争分夺秒', '妙不可言', '言简意赅',
  '墨守成规', '规行矩步', '步步为营', '营私舞弊', '弊绝风清', '清正廉洁', '洁身自好',
  '好高骛远', '远见卓识', '识文断字', '字里行间', '间不容发', '发扬光大', '大公无私',
  '念念不忘', '忘恩负义', '义无反顾', '顾全大局', '局促不安', '安居乐业', '业精于勤',
  '勤能补拙', '手到擒来', '来日方长', '长驱直入', '入木三分', '争先恐后', '后来居上',
  '手舞足蹈', '出类拔萃', '堂堂正正', '正大光明', '明察秋毫', '毫发不爽', '爽心悦目'
];

// ==================== 亲戚关系计算 ====================
function calculateRelation(relations, isFemale, reverseCall) {
  // 简化的亲戚关系计算
  const relationMap = {
    '父': { self: '父亲', reverse: '儿子/女儿' },
    '母': { self: '母亲', reverse: '儿子/女儿' },
    '子': { self: '儿子', reverse: '父亲/母亲' },
    '女': { self: '女儿', reverse: '父亲/母亲' },
    '兄': { self: '哥哥', reverse: '弟弟/妹妹' },
    '弟': { self: '弟弟', reverse: '哥哥/姐姐' },
    '姐': { self: '姐姐', reverse: '弟弟/妹妹' },
    '妹': { self: '妹妹', reverse: '哥哥/姐姐' },
    '夫': { self: '丈夫', reverse: '妻子' },
    '妻': { self: '妻子', reverse: '丈夫' },
    '父的父': { self: '爷爷', reverse: '孙子/孙女' },
    '父的母': { self: '奶奶', reverse: '孙子/孙女' },
    '母的父': { self: '外公', reverse: '外孙/外孙女' },
    '母的母': { self: '外婆', reverse: '外孙/外孙女' },
    '父的兄': { self: '伯父', reverse: '侄子/侄女' },
    '父的弟': { self: '叔叔', reverse: '侄子/侄女' },
    '父的姐': { self: '姑姑', reverse: '侄子/侄女' },
    '父的妹': { self: '姑姑', reverse: '侄子/侄女' },
    '母的兄': { self: '舅舅', reverse: '外甥/外甥女' },
    '母的弟': { self: '舅舅', reverse: '外甥/外甥女' },
    '母的姐': { self: '姨妈', reverse: '外甥/外甥女' },
    '母的妹': { self: '姨妈', reverse: '外甥/外甥女' },
    '兄的妻': { self: '嫂子', reverse: '小叔子/小姑子' },
    '弟的妻': { self: '弟媳', reverse: '大伯子/大姑子' },
    '姐的夫': { self: '姐夫', reverse: '小舅子/小姨子' },
    '妹的夫': { self: '妹夫', reverse: '大舅子/大姨子' },
    '子的子': { self: '孙子', reverse: '爷爷/奶奶' },
    '子的女': { self: '孙女', reverse: '爷爷/奶奶' },
    '女的子': { self: '外孙', reverse: '外公/外婆' },
    '女的女': { self: '外孙女', reverse: '外公/外婆' }
  };

  const key = relations.join('的');
  const result = relationMap[key];
  if (result) {
    return reverseCall ? result.reverse : result.self;
  }

  // 默认返回关系链
  return relations.map(r => {
    const single = relationMap[r];
    return single ? single.self : r;
  }).join('的');
}

// ==================== 拼音转换（简化版） ====================
const PINYIN_MAP = {
  '一': 'yī', '二': 'èr', '三': 'sān', '四': 'sì', '五': 'wǔ',
  '六': 'liù', '七': 'qī', '八': 'bā', '九': 'jiǔ', '十': 'shí',
  '天': 'tiān', '地': 'dì', '人': 'rén', '山': 'shān', '水': 'shuǐ',
  '火': 'huǒ', '木': 'mù', '土': 'tǔ', '金': 'jīn', '风': 'fēng',
  '云': 'yún', '雨': 'yǔ', '日': 'rì', '月': 'yuè', '星': 'xīng',
  '春': 'chūn', '夏': 'xià', '秋': 'qiū', '冬': 'dōng', '花': 'huā',
  '草': 'cǎo', '树': 'shù', '叶': 'yè', '根': 'gēn', '果': 'guǒ',
  '鸟': 'niǎo', '鱼': 'yú', '虫': 'chóng', '兽': 'shòu', '马': 'mǎ',
  '牛': 'niú', '羊': 'yáng', '猪': 'zhū', '狗': 'gǒu', '猫': 'māo',
  '大': 'dà', '小': 'xiǎo', '高': 'gāo', '低': 'dī', '长': 'cháng',
  '短': 'duǎn', '宽': 'kuān', '窄': 'zhǎi', '厚': 'hòu', '薄': 'báo',
  '上': 'shàng', '下': 'xià', '左': 'zuǒ', '右': 'yòu', '前': 'qián',
  '后': 'hòu', '里': 'lǐ', '外': 'wài', '中': 'zhōng', '内': 'nèi'
};

function getPinyin(char) {
  return PINYIN_MAP[char] || '';
}

function getTextPinyin(text) {
  return text.split('').map(char => PINYIN_MAP[char] || char).join(' ');
}

// ==================== 字数统计 ====================
function countWords(text) {
  const result = {
    chars: 0,      // 字符数（不含空格）
    charsAll: 0,   // 总字符数
    chinese: 0,    // 中文字数
    words: 0,      // 英文单词数
    sentences: 0,  // 句子数
    paragraphs: 0  // 段落数
  };

  if (!text) return result;

  result.charsAll = text.length;
  result.chars = text.replace(/\s/g, '').length;
  result.chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  result.words = (text.match(/[a-zA-Z]+/g) || []).length;
  result.sentences = (text.match(/[。！？.!?]/g) || []).length;
  result.paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || 1;

  return result;
}

// ==================== 成语接龙 ====================
function findNextIdiom(lastChar) {
  const matches = IDIOMS.filter(idiom => idiom.charAt(0) === lastChar);
  if (matches.length > 0) {
    return matches[Math.floor(Math.random() * matches.length)];
  }
  return null;
}

function getRandomIdiom() {
  return IDIOMS[Math.floor(Math.random() * IDIOMS.length)];
}

// ==================== 工具函数 ====================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  return true;
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ==================== 页面初始化 ====================
function initPage() {
  // 渲染侧边栏
  renderSidebar();

  // 初始化搜索功能
  initSearch();

  // 初始化回到顶部按钮
  initBackToTop();
}

function renderSidebar() {
  const sidebar = document.querySelector('.sidebar-nav');
  if (!sidebar) return;

  const currentCategory = document.body.dataset.category || 'education';

  sidebar.innerHTML = CATEGORIES.map(cat => `
        <a href="${cat.url}" class="sidebar-item ${cat.id === currentCategory ? 'active' : ''}">
            <span class="sidebar-item-icon">${cat.icon}</span>
            <span class="sidebar-item-text">${cat.name}</span>
        </a>
    `).join('');
}

function initSearch() {
  const searchInput = document.querySelector('.search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', debounce((e) => {
    const keyword = e.target.value.toLowerCase().trim();
    filterTools(keyword);
  }, 300));
}

function filterTools(keyword) {
  const cards = document.querySelectorAll('.tool-card');
  cards.forEach(card => {
    const title = card.querySelector('.tool-card-title').textContent.toLowerCase();
    const desc = card.querySelector('.tool-card-desc').textContent.toLowerCase();
    const visible = title.includes(keyword) || desc.includes(keyword);
    card.style.display = visible ? '' : 'none';
  });
}

function initBackToTop() {
  const backToTop = document.querySelector('.floating-btn.back-to-top');
  if (!backToTop) return;

  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 300) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  }, 100));

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ==================== 页面加载完成后初始化 ====================
document.addEventListener('DOMContentLoaded', initPage);
