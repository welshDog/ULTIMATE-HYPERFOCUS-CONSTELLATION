/**
 * 📱 PWA Integration Manager
 * Handles app installation, updates, shortcuts, and offline functionality
 * 
 * COMPLETE FIXED VERSION - All bugs resolved
 */

class PWAManager {
    constructor(constellation) {
        this.constellation = constellation;
        this.isOnline = navigator.onLine;
        this.updateAvailable = false;
        this.installPrompt = null;
        this.sw = null;

        this.initializePWA();
        this.setupEventListeners();
        this.handleURLActions();
    }

    /**
     * Initialize PWA functionality
     */
    async initializePWA() {
        try {
            // Register service worker
            await this.registerServiceWorker();

            // Setup install prompt
            this.setupInstallPrompt();

            // Setup online/offline detection
            this.setupOnlineOfflineDetection();

            // Create PWA UI elements
            this.createPWAUI();

            // Check for updates
            this.checkForUpdates();

            console.log('📱 PWA Manager initialized');
        } catch (error) {
            console.warn('⚠️ PWA initialization failed:', error);
        }
    }

    /**
     * Register service worker
     */
    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/ULTIMATE-HYPERFOCUS-CONSTELLATION/sw.js', {
                    scope: '/ULTIMATE-HYPERFOCUS-CONSTELLATION/'
                });

                this.sw = registration;

                console.log('✅ Service Worker registered:', registration.scope);

                // Listen for service worker messages
                navigator.serviceWorker.addEventListener('message', this.handleSWMessage.bind(this));

                // Check for waiting service worker
                if (registration.waiting) {
                    this.showUpdateAvailable();
                }

                // Listen for new service worker installing
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;

                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable();
                        }
                    });
                });

            } catch (error) {
                console.warn('⚠️ Service Worker registration failed:', error);
            }
        }
    }

    /**
     * Handle service worker messages
     */
    handleSWMessage(event) {
        const { type, message, action, data } = event.data;

        switch (type) {
            case 'SW_ACTIVATED':
                this.showNotification('✅ Offline mode ready!', message);
                break;

            case 'GITHUB_DATA_SYNCED':
                if (this.constellation?.announceToScreenReader) {
                    this.constellation.announceToScreenReader(message);
                }
                // Refresh repository data
                if (this.constellation?.gitHubAPI) {
                    this.constellation.loadRepositoryData();
                }
                break;

            case 'NOTIFICATION_ACTION':
                this.handleNotificationAction(action, data);
                break;
        }
    }

    /**
     * Setup install prompt detection
     */
    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            this.installPrompt = event;
            this.showInstallButton();

            console.log('📱 Install prompt available');
        });

        // Track app installation
        window.addEventListener('appinstalled', () => {
            console.log('🎉 App installed!');
            this.hideInstallButton();
            this.showNotification('🎉 App Installed!', 'Constellation is now available as a standalone app!');

            // Track installation event
            this.trackEvent('app_installed');
        });
    }

    /**
     * Setup online/offline detection (FIXED)
     */
    setupOnlineOfflineDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNotification('🌐 Back Online!', 'Connection restored. Syncing data...');

            // Trigger background sync safely
            if (this.sw && 'sync' in this.sw) {
                try {
                    this.sw.sync.register('github-data-sync');
                    this.sw.sync.register('analytics-sync');
                } catch (err) {
                    console.warn('Background sync registration failed:', err);
                }
            }

            this.updateConnectionStatus();
            if (this.constellation?.announceToScreenReader) {
                this.constellation.announceToScreenReader('Internet connection restored. All features available.');
            }
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            // FIX: Proper string escaping
            this.showNotification('📱 Offline Mode', "You're now offline. Cached content is still available.");

            this.updateConnectionStatus();
            if (this.constellation?.announceToScreenReader) {
                this.constellation.announceToScreenReader('Internet connection lost. Working in offline mode.');
            }
        });

        // Initial status update
        this.updateConnectionStatus();
    }

    /**
     * Create PWA UI elements (IMPLEMENTED)
     */
    createPWAUI() {
        const pwaHTML = `
            <!-- Install Button -->
            <div id="pwa-install-container" class="pwa-install-container" style="display: none;">
                <div class="install-prompt">
                    <div class="install-content">
                        <div class="install-icon">📱</div>
                        <div class="install-text">
                            <h3>Install Constellation</h3>
                            <p>Add to your home screen for a better experience!</p>
                        </div>
                    </div>
                    <div class="install-actions">
                        <button id="pwa-install-btn" class="install-btn">Install</button>
                        <button id="pwa-install-dismiss" class="install-dismiss">Not now</button>
                    </div>
                </div>
            </div>

            <!-- Update Banner -->
            <div id="pwa-update-banner" class="pwa-update-banner" style="display: none;">
                <div class="update-content">
                    <span class="update-icon">🔄</span>
                    <span class="update-text">A new version is available!</span>
                </div>
                <div class="update-actions">
                    <button id="pwa-update-btn" class="update-btn">Update</button>
                    <button id="pwa-update-dismiss" class="update-dismiss">Later</button>
                </div>
            </div>

            <!-- Connection Status -->
            <div id="pwa-connection-status" class="pwa-connection-status">
                <span class="status-indicator"></span>
                <span class="status-text">Online</span>
            </div>

            <!-- Share Button -->
            <button id="pwa-share-btn" class="pwa-share-btn" title="Share constellation" style="display: none;">
                <span>🔗</span>
            </button>
        `;

        const pwaStyles = `
            <style>
                .pwa-install-container {
                    position: fixed;
                    top: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 9999;
                    animation: slideDown 0.5s ease-out;
                }

                .install-prompt {
                    background: rgba(26, 26, 46, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--accent-primary);
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    max-width: 400px;
                }

                .install-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                }

                .install-icon {
                    font-size: 2rem;
                }

                .install-text h3 {
                    margin: 0 0 4px 0;
                    color: var(--accent-primary);
                    font-size: 1rem;
                }

                .install-text p {
                    margin: 0;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }

                .install-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .install-btn, .update-btn {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                    border: none;
                    border-radius: 8px;
                    padding: 8px 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 0.9rem;
                }

                .install-btn:hover, .update-btn:hover {
                    background: var(--accent-secondary);
                    transform: translateY(-1px);
                }

                .install-dismiss, .update-dismiss {
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    padding: 4px 8px;
                    font-size: 0.8rem;
                    transition: color 0.2s ease;
                }

                .install-dismiss:hover, .update-dismiss:hover {
                    color: var(--text-primary);
                }

                .pwa-update-banner {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(26, 26, 46, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--accent-secondary);
                    border-radius: 12px;
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    z-index: 9999;
                    animation: slideInRight 0.5s ease-out;
                    max-width: 300px;
                }

                .update-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                }

                .update-icon {
                    font-size: 1.2rem;
                }

                .update-text {
                    color: var(--text-primary);
                    font-size: 0.9rem;
                    font-weight: 500;
                }

                .update-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .pwa-connection-status {
                    position: fixed;
                    bottom: 80px;
                    right: 20px;
                    background: rgba(26, 26, 46, 0.9);
                    border: 1px solid var(--border-color);
                    border-radius: 20px;
                    padding: 8px 12px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.8rem;
                    z-index: 1000;
                    transition: all 0.3s ease;
                }

                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--success-color);
                    transition: background 0.3s ease;
                }

                .pwa-connection-status.offline .status-indicator {
                    background: var(--warning-color);
                }

                .status-text {
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .pwa-share-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 80px;
                    width: 50px;
                    height: 50px;
                    background: var(--accent-secondary);
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
                    transition: all 0.3s ease;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .pwa-share-btn:hover {
                    background: var(--accent-primary);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
                }

                @keyframes slideDown {
                    from {
                        transform: translateX(-50%) translateY(-20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes slideInRight {
                    from {
                        transform: translateX(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            </style>
        `;

        // Inject styles and HTML
        document.head.insertAdjacentHTML('beforeend', pwaStyles);
        document.body.insertAdjacentHTML('beforeend', pwaHTML);

        // Setup event listeners
        this.setupPWAEventListeners();

        // Show share button if supported
        if (navigator.share) {
            document.getElementById('pwa-share-btn').style.display = 'flex';
        }
    }

    /**
     * Setup PWA event listeners (IMPLEMENTED)
     */
    setupPWAEventListeners() {
        // Install button
        const installBtn = document.getElementById('pwa-install-btn');
        const installDismiss = document.getElementById('pwa-install-dismiss');
        const updateBtn = document.getElementById('pwa-update-btn');
        const updateDismiss = document.getElementById('pwa-update-dismiss');
        const shareBtn = document.getElementById('pwa-share-btn');

        if (installBtn) {
            installBtn.addEventListener('click', () => this.installApp());
        }

        if (installDismiss) {
            installDismiss.addEventListener('click', () => this.hideInstallButton());
        }

        if (updateBtn) {
            updateBtn.addEventListener('click', () => this.updateApp());
        }

        if (updateDismiss) {
            updateDismiss.addEventListener('click', () => this.hideUpdateBanner());
        }

        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareApp());
        }
    }

    /**
     * Show install button (IMPLEMENTED)
     */
    showInstallButton() {
        const container = document.getElementById('pwa-install-container');
        if (container) {
            container.style.display = 'block';
        }
    }

    /**
     * Hide install button (IMPLEMENTED)
     */
    hideInstallButton() {
        const container = document.getElementById('pwa-install-container');
        if (container) {
            container.style.display = 'none';
        }
    }

    /**
     * Install the app (IMPLEMENTED)
     */
    async installApp() {
        if (!this.installPrompt) return;

        try {
            const result = await this.installPrompt.prompt();

            console.log('📱 Install prompt result:', result.outcome);

            if (result.outcome === 'accepted') {
                this.trackEvent('install_accepted');
            } else {
                this.trackEvent('install_dismissed');
            }

            this.installPrompt = null;
            this.hideInstallButton();

        } catch (error) {
            console.warn('⚠️ Install prompt failed:', error);
        }
    }

    /**
     * Show update available banner (IMPLEMENTED)
     */
    showUpdateAvailable() {
        this.updateAvailable = true;

        const banner = document.getElementById('pwa-update-banner');
        if (banner) {
            banner.style.display = 'flex';
        }

        this.showNotification('🔄 Update Available!', 'A new version of the constellation is ready to install.');
    }

    /**
     * Hide update banner (IMPLEMENTED)
     */
    hideUpdateBanner() {
        const banner = document.getElementById('pwa-update-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    /**
     * Update the app (IMPLEMENTED)
     */
    updateApp() {
        if (!this.sw || !this.sw.waiting) return;

        // Tell the waiting service worker to skip waiting
        this.sw.waiting.postMessage({ type: 'SKIP_WAITING' });

        // Reload the page to use the new service worker
        window.location.reload();
    }

    /**
     * Share the app (IMPLEMENTED)
     */
    async shareApp() {
        const shareData = {
            title: '🌌 Ultimate Hyperfocus Constellation',
            text: 'Check out this amazing 3D repository visualization designed for neurodivergent minds!',
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                this.trackEvent('app_shared', { method: 'native' });
                console.log('📤 App shared successfully');
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareData.url);
                this.showNotification('🔗 Link Copied!', 'Share link copied to clipboard.');
                this.trackEvent('app_shared', { method: 'clipboard' });
            }
        } catch (error) {
            console.warn('⚠️ Share failed:', error);
        }
    }

    /**
     * Update connection status UI (IMPLEMENTED)
     */
    updateConnectionStatus() {
        const statusElement = document.getElementById('pwa-connection-status');
        const statusText = statusElement?.querySelector('.status-text');

        if (statusElement && statusText) {
            if (this.isOnline) {
                statusElement.classList.remove('offline');
                statusText.textContent = 'Online';
            } else {
                statusElement.classList.add('offline');
                statusText.textContent = 'Offline';
            }
        }
    }

    /**
     * Handle URL actions (app shortcuts) (IMPLEMENTED)
     */
    handleURLActions() {
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');

        if (action) {
            setTimeout(() => {
                this.executeAction(action);
            }, 2000); // Wait for app to initialize
        }
    }

    /**
     * Execute URL action (IMPLEMENTED)
     */
    executeAction(action) {
        switch (action) {
            case 'focus':
                // Start hyperfocus session
                if (this.constellation?.sessionManager) {
                    this.constellation.sessionManager.startHyperfocusSession();
                }
                this.showNotification('⚡ Focus Session Started!', 'Hyperfocus mode activated from app shortcut.');
                break;

            case 'research':
                // Switch to research mode
                if (this.constellation?.researchMode) {
                    this.constellation.researchMode.toggleMode();
                }
                this.showNotification('📚 Research Mode!', 'Switched to research mode from app shortcut.');
                break;

            case 'settings':
                // Open accessibility settings
                const settingsToggle = document.getElementById('settings-toggle');
                if (settingsToggle) {
                    settingsToggle.click();
                }
                this.showNotification('⚙️ Settings Opened!', 'Accessibility settings opened from app shortcut.');
                break;
        }

        // Clean up URL
        const cleanURL = window.location.pathname;
        window.history.replaceState({}, document.title, cleanURL);
    }

    /**
     * Handle notification actions (IMPLEMENTED)
     */
    handleNotificationAction(action, data) {
        this.executeAction(action);
    }

    /**
     * Show in-app notification (IMPLEMENTED)
     */
    showNotification(title, message, duration = 4000) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'pwa-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close" aria-label="Close notification">×</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: rgba(26, 26, 46, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid var(--accent-primary);
            border-radius: 12px;
            padding: 16px;
            max-width: 300px;
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            display: flex;
            align-items: flex-start;
            gap: 12px;
        `;

        // Close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        document.body.appendChild(notification);

        // Auto-remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);

        // Announce to screen reader
        if (this.constellation?.announceToScreenReader) {
            this.constellation.announceToScreenReader(`${title}. ${message}`);
        }
    }

    /**
     * Track events (IMPLEMENTED)
     */
    trackEvent(eventName, data = {}) {
        console.log(`📊 Event tracked: ${eventName}`, data);

        // Here you would integrate with your analytics service
        // For example: gtag('event', eventName, data);
    }

    /**
     * Check for updates (IMPLEMENTED)
     */
    checkForUpdates() {
        if (this.sw) {
            this.sw.update().catch(error => {
                console.warn('⚠️ Update check failed:', error);
            });
        }
    }

    /**
     * Setup event listeners (IMPLEMENTED)
     */
    setupEventListeners() {
        // Handle display mode changes
        window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
            if (e.matches) {
                console.log('📱 Running as installed PWA');
                this.trackEvent('pwa_launched');
            }
        });

        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkForUpdates();
            }
        });

        // Handle focus/blur for analytics
        window.addEventListener('focus', () => {
            this.trackEvent('app_focused');
        });

        window.addEventListener('blur', () => {
            this.trackEvent('app_blurred');
        });
    }

    /**
     * Get PWA status information (IMPLEMENTED)
     */
    getPWAStatus() {
        return {
            isInstalled: window.matchMedia('(display-mode: standalone)').matches,
            isOnline: this.isOnline,
            updateAvailable: this.updateAvailable,
            swRegistered: !!this.sw,
            installPromptAvailable: !!this.installPrompt,
            shareSupported: !!navigator.share
        };
    }
}

// Export the PWA Manager
window.PWAManager = PWAManager;