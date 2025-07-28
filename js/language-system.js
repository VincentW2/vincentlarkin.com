// Global language system
let currentLang = localStorage.getItem('lang') || 'pt';
let translations = {};

// Load language and content
async function initLanguageSystem() {
  try {
    const response = await fetch('/js/translations.json');
    translations = await response.json();
    applyLanguage(currentLang);
  } catch (error) {
    console.error('Failed to load translations:', error);
  }
}

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  
  const currentPage = getCurrentPage();
  
  // Apply page translations
  const pageTranslations = translations[getCurrentPage()] || {};
  for (const [id, text] of Object.entries(pageTranslations)) {
    const element = document.getElementById(id);
    if (element) {
      let content = text[lang] || '';
      
      // Handle special placeholders for contact page
      if (id === 'contact-text') {
        const emailLink = '<a href="mailto:vincent@vincentwl.pt">vincent@vincentwl.pt</a>';
        const githubLink = '<a href="https://github.com/vincentw2">GitHub</a>';
        content = content.replace('{email}', emailLink).replace('{github}', githubLink);
        element.innerHTML = content;
      } else {
        element.textContent = content;
      }
    }
  }
  
  // Apply navigation translations
  const navTranslations = translations.nav || {};
  for (const [id, text] of Object.entries(navTranslations)) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = `> ${text[lang]}`;
    }
  }
  
  // Update language button
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    langBtn.textContent = lang.toUpperCase();
  }
}

// Language toggle function
function switchLanguage() {
  const newLang = currentLang === 'pt' ? 'en' : 'pt';
  applyLanguage(newLang);
}

// Helper function to get current page name
function getCurrentPage() {
  const path = window.location.pathname;
  if (path === '/' || path === '/index.html') return 'index';
  if (path.includes('/about.html')) return 'about';
  if (path.includes('/news.html')) return 'news';
  if (path.includes('/contact.html')) return 'contact';
  if (path.includes('/articles/')) return 'article';
  return 'index';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanguageSystem);
} else {
  initLanguageSystem();
} 