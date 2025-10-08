// 🛠️ UI Interactions Script for Ultimate Hyperfocus Constellation
// This handles all the non-3D UI interactions and connects to your main engine

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 UI Interactions initialized');
    
    // Initialize UI after DOM is ready
    initializeUIInteractions();
});

function initializeUIInteractions() {
    // Settings panel toggle
    const settingsToggle = document.getElementById('settings-toggle');
    const accessibilityPanel = document.getElementById('accessibility-panel');
    
    if (settingsToggle && accessibilityPanel) {
        settingsToggle.addEventListener('click', function() {
            accessibilityPanel.classList.toggle('hidden');
        });
    }

    // Session timer functionality
    let sessionActive = false;
    let sessionStart = null;
    let sessionInterval = null;
    
    const sessionToggle = document.getElementById('session-toggle');
    const sessionTimer = document.getElementById('session-timer');
    const focusStatus = document.getElementById('focus-status');
    const focusProgress = document.getElementById('focus-progress');
    
    if (sessionToggle) {
        sessionToggle.addEventListener('click', function() {
            if (!sessionActive) {
                startHyperfocusSession();
            } else {
                stopHyperfocusSession();
            }
        });
    }

    function startHyperfocusSession() {
        if (sessionActive) return;
        
        sessionActive = true;
        sessionStart = Date.now();
        
        if (sessionToggle) {
            sessionToggle.textContent = '⏹️ End Session';
            sessionToggle.classList.add('stop');
        }
        
        if (focusStatus) {
            focusStatus.textContent = 'Hyperfocus session active - you\'re in the zone!';
        }
        
        sessionInterval = setInterval(updateSessionTimer, 1000);
        
        // Announce to screen reader
        announceToScreenReader('Hyperfocus session started');
    }

    function stopHyperfocusSession() {
        sessionActive = false;
        
        if (sessionToggle) {
            sessionToggle.textContent = '🚀 Start Session';
            sessionToggle.classList.remove('stop');
        }
        
        if (focusStatus) {
            focusStatus.textContent = 'Session complete! Great work focusing.';
        }
        
        if (sessionInterval) {
            clearInterval(sessionInterval);
        }
        
        // Announce to screen reader
        announceToScreenReader('Hyperfocus session ended');
    }

    function updateSessionTimer() {
        if (!sessionActive || !sessionStart || !sessionTimer) return;
        
        const elapsed = Date.now() - sessionStart;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const timeString = String(hours).padStart(2, '0') + ':' + 
                          String(minutes).padStart(2, '0') + ':' + 
                          String(seconds).padStart(2, '0');
        
        sessionTimer.textContent = timeString;
        
        // Update progress bar (30 min = 100%)
        if (focusProgress) {
            const progressPercent = Math.min((elapsed / (30 * 60 * 1000)) * 100, 100);
            focusProgress.style.width = progressPercent + '%';
        }
    }

    // Accessibility controls
    const highContrastToggle = document.getElementById('high-contrast');
    const reduceMotionToggle = document.getElementById('reduce-motion');
    
    if (highContrastToggle) {
        highContrastToggle.addEventListener('change', function() {
            document.body.classList.toggle('high-contrast', this.checked);
            announceToScreenReader(this.checked ? 'High contrast enabled' : 'High contrast disabled');
        });
    }
    
    if (reduceMotionToggle) {
        reduceMotionToggle.addEventListener('change', function() {
            if (this.checked) {
                document.documentElement.style.setProperty('--transition-fast', '0s');
                document.documentElement.style.setProperty('--transition-normal', '0s');
                document.documentElement.style.setProperty('--transition-slow', '0s');
                announceToScreenReader('Reduced motion enabled');
            } else {
                document.documentElement.style.setProperty('--transition-fast', '0.15s ease');
                document.documentElement.style.setProperty('--transition-normal', '0.3s ease');
                document.documentElement.style.setProperty('--transition-slow', '0.5s ease');
                announceToScreenReader('Reduced motion disabled');
            }
        });
    }

    // Volume controls
    const ambientVolume = document.getElementById('ambient-volume');
    const effectsVolume = document.getElementById('effects-volume');
    const ambientValue = document.getElementById('ambient-value');
    const effectsValue = document.getElementById('effects-value');
    
    if (ambientVolume && ambientValue) {
        ambientVolume.addEventListener('input', function() {
            ambientValue.textContent = this.value + '%';
        });
    }
    
    if (effectsVolume && effectsValue) {
        effectsVolume.addEventListener('input', function() {
            effectsValue.textContent = this.value + '%';
        });
    }

    // Panel close buttons
    document.querySelectorAll('.panel-close').forEach(button => {
        button.addEventListener('click', function() {
            const panel = this.closest('.side-panel, .repo-details');
            if (panel) {
                if (panel.classList.contains('repo-details')) {
                    panel.classList.remove('visible');
                } else {
                    panel.classList.add('hidden');
                }
            }
        });
    });

    // Category selection
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            const category = this.dataset.category;
            console.log('Selected category:', category);
            
            // Announce to screen reader
            const categoryName = this.querySelector('.category-name').textContent;
            announceToScreenReader(`Selected category: ${categoryName}`);
            
            // Trigger constellation filter if available
            if (window.constellation && window.constellation.filterByCategory) {
                window.constellation.filterByCategory(category);
            }
        });
    });

    // Mode toggle
    const modeToggle = document.getElementById('mode-toggle');
    if (modeToggle) {
        modeToggle.addEventListener('click', function() {
            const currentMode = this.textContent.includes('Research') ? 'repository' : 'research';
            
            if (currentMode === 'repository') {
                this.textContent = '🌟 Repository Mode';
                announceToScreenReader('Switched to research mode');
            } else {
                this.textContent = '📚 Research Mode';
                announceToScreenReader('Switched to repository mode');
            }
            
            // Trigger mode change in constellation if available
            if (window.constellation && window.constellation.changeMode) {
                window.constellation.changeMode(currentMode === 'repository' ? 'research' : 'repository');
            }
        });
    }

    // Focus toggle
    const focusToggle = document.getElementById('focus-toggle');
    const focusOverlay = document.getElementById('focus-overlay');
    
    if (focusToggle) {
        focusToggle.addEventListener('click', function() {
            const isActive = focusOverlay && focusOverlay.classList.contains('active');
            
            if (focusOverlay) {
                focusOverlay.classList.toggle('active', !isActive);
            }
            
            this.textContent = isActive ? '🎯 Focus' : '👁️ Normal';
            
            announceToScreenReader(isActive ? 'Focus mode disabled' : 'Focus mode enabled');
            
            // Trigger focus mode in constellation if available
            if (window.constellation && window.constellation.toggleFocusMode) {
                window.constellation.toggleFocusMode(!isActive);
            }
        });
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            // Debounce search
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                console.log('Searching for:', query);
                
                // Trigger search in constellation if available
                if (window.constellation && window.constellation.search) {
                    window.constellation.search(query);
                }
                
                if (query.length > 0) {
                    announceToScreenReader(`Searching for ${query}`);
                }
            }, 300);
        });
        
        // Focus search with / key
        document.addEventListener('keydown', function(e) {
            if (e.key === '/' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Skip if user is typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key.toLowerCase()) {
            case 't':
                if (modeToggle) modeToggle.click();
                break;
            case 'f':
                if (focusToggle) focusToggle.click();
                break;
            case 's':
                if (!e.ctrlKey && !e.metaKey && sessionToggle) {
                    sessionToggle.click();
                }
                break;
            case 'escape':
                // Close all panels
                document.querySelectorAll('.side-panel:not(.hidden)').forEach(panel => {
                    panel.classList.add('hidden');
                });
                document.querySelector('.repo-details.visible')?.classList.remove('visible');
                break;
        }
    });

    // Responsive mobile menu
    setupMobileMenu();
    
    console.log('✅ UI Interactions setup complete');
}

// Screen reader announcements
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('constellation-announcements');
    if (liveRegion) {
        // Clear previous content
        liveRegion.textContent = '';
        
        // Add new announcement
        setTimeout(() => {
            liveRegion.textContent = message;
        }, 100);
    }
}

// Mobile menu setup
function setupMobileMenu() {
    // Add mobile menu button if screen is small
    if (window.innerWidth <= 1024) {
        addMobileMenuButton();
    }
    
    // Handle resize
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 1024) {
            addMobileMenuButton();
        } else {
            removeMobileMenuButton();
        }
    });
}

function addMobileMenuButton() {
    const existingButton = document.getElementById('mobile-menu-toggle');
    if (existingButton) return;
    
    const navLeft = document.querySelector('.nav-left');
    if (!navLeft) return;
    
    const menuButton = document.createElement('button');
    menuButton.id = 'mobile-menu-toggle';
    menuButton.className = 'nav-button';
    menuButton.innerHTML = '☰';
    menuButton.setAttribute('aria-label', 'Toggle categories menu');
    
    menuButton.addEventListener('click', function() {
        const sidebar = document.querySelector('.categories-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    });
    
    navLeft.appendChild(menuButton);
}

function removeMobileMenuButton() {
    const button = document.getElementById('mobile-menu-toggle');
    if (button) {
        button.remove();
    }
    
    // Ensure sidebar is visible on desktop
    const sidebar = document.querySelector('.categories-sidebar');
    if (sidebar) {
        sidebar.classList.remove('open');
    }
}

// Export functions for use by constellation engine
window.UIInteractions = {
    announceToScreenReader,
    setupMobileMenu
};

console.log('🎯 UI Interactions module loaded');
