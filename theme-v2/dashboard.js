/**
 * FOCONET DASHBOARD CONTROLLER (Bootstrap 5)
 */
class FoconetDashboard {
  constructor() {
    this.sidebarDesktop = document.getElementById('sidebarDesktop');
    this.toggleBtn = document.getElementById('sidebarToggle');
    this.toggleIcon = this.toggleBtn?.querySelector('i');
    this.logoutLinkHeader = document.getElementById('logoutLinkHeader');
    
    this.init();
  }

  init() {
    this.loadSidebarState();
    this.setupEventListeners();
  }

  loadSidebarState() {
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const isDesktop = window.innerWidth >= 992;

    if (isCollapsed && isDesktop) {
      this.sidebarDesktop.classList.add('collapsed');
      this.updateToggleIcon(true);
    }
  }

  setupEventListeners() {
    // 1. Sidebar Toggle
    this.toggleBtn?.addEventListener('click', () => {
      this.sidebarDesktop.classList.toggle('collapsed');
      const isCollapsed = this.sidebarDesktop.classList.contains('collapsed');

      localStorage.setItem('sidebarCollapsed', isCollapsed);
      this.updateToggleIcon(isCollapsed);

      if (isCollapsed) this.closeAllSubmenus();
    });

    // 2. Submenu Auto-Expand Logic
    document.querySelectorAll('.sidebar-desktop .nav-link[data-bs-toggle="collapse"]').forEach(link => {
      const submenu = document.querySelector(link.getAttribute('href'));

      link.addEventListener('click', e => {
        if (this.sidebarDesktop.classList.contains('collapsed')) {
          e.preventDefault(); // Impede abertura imediata
          
          // Abre a sidebar primeiro
          this.sidebarDesktop.classList.remove('collapsed');
          localStorage.setItem('sidebarCollapsed', 'false');
          this.updateToggleIcon(false);

          // Abre o menu depois
          setTimeout(() => {
            const bsCollapse = bootstrap.Collapse.getInstance(submenu) || new bootstrap.Collapse(submenu, { toggle: false });
            bsCollapse.show();
          }, 300);
        }
      });

      // Accordion effect
      if (submenu) {
        submenu.addEventListener('show.bs.collapse', () => {
          this.closeAllOtherSubmenus(submenu);
        });
      }
    });

    // 3. Resize Handler
    window.addEventListener('resize', () => {
      const isDesktop = window.innerWidth >= 992;
      const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';

      if (isDesktop) {
        if (isCollapsed) {
          this.sidebarDesktop.classList.add('collapsed');
          this.closeAllSubmenus();
        } else {
          this.sidebarDesktop.classList.remove('collapsed');
        }
      } else {
        this.sidebarDesktop.classList.remove('collapsed');
      }
    });

    // 4. Logout
    this.logoutLinkHeader?.addEventListener('click', e => {
      e.preventDefault();
      alert('Logout realizado com sucesso!');
      // window.location.href = 'login.html';
    });
  }

  updateToggleIcon(isCollapsed) {
    if (this.toggleIcon) {
      this.toggleIcon.className = isCollapsed ? 'ri-menu-unfold-line fs-5' : 'ri-menu-fold-line fs-5';
    }
  }

  closeAllSubmenus() {
    document.querySelectorAll('.sidebar-desktop .submenu.show').forEach(submenu => {
      const bsCollapse = bootstrap.Collapse.getInstance(submenu);
      if (bsCollapse) bsCollapse.hide();
    });
  }

  closeAllOtherSubmenus(currentSubmenu) {
    document.querySelectorAll('.sidebar-desktop .submenu.collapse.show').forEach(otherSubmenu => {
      if (otherSubmenu !== currentSubmenu) {
        const collapseInstance = bootstrap.Collapse.getInstance(otherSubmenu) || new bootstrap.Collapse(otherSubmenu, { toggle: false });
        collapseInstance.hide();
      }
    });
  }
}

// Inicialização
// ... [Seu código FoconetDashboard Class e outras funções] ...

// =========================================================================
// NOVO: LÓGICA DE SELEÇÃO E PERSISTÊNCIA DE TEMA
// =========================================================================

const THEME_STORAGE_KEY = 'data-theme-colors';
const HTML_ELEMENT = document.documentElement;

function applyTheme(themeName) {
    HTML_ELEMENT.setAttribute(THEME_STORAGE_KEY, themeName);
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
    
    // Atualiza o radio button selecionado na interface
    document.querySelectorAll('.theme-radio').forEach(radio => {
        radio.checked = radio.value === themeName;
    });
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || 'default';
    applyTheme(savedTheme);
}

// -------------------------------------------------------------------------
// ADIÇÃO AO LISTENER PRINCIPAL DO DOM
// -------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Garante que o Bootstrap esteja carregado (Seu código existente)
    if (typeof bootstrap !== 'undefined') {
        new FoconetDashboard(); // Sua classe de inicialização
        
        // 1. Carrega o tema salvo
        loadSavedTheme();
        
        // 2. Adiciona listener aos botões de rádio para troca de tema
        document.querySelectorAll('.theme-radio').forEach(radio => {
            radio.addEventListener('change', (event) => {
                if (event.target.checked) {
                    applyTheme(event.target.value);
                }
            });
        });

        // ADICIONAR AQUI: Inicializa todos os tooltips (Seu código existente)
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }
});