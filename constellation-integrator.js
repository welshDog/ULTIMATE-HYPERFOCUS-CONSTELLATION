/**
 * 🚀 Ultimate Hyperfocus Constellation - Production Integration
 * Connects all enhancement modules for production-grade experience
 */

class ConstellationIntegrator {
    constructor() {
        this.modules = {};
        this.isInitialized = false;
        this.loadingProgress = 0;

        this.initialize();
    }

    /**
     * Initialize all production modules
     */
    async initialize() {
        try {
            console.log('🚀 Starting production constellation initialization...');
            this.updateLoadingProgress('Initializing core systems...', 10);

            // Initialize core constellation
            await this.initializeCore();
            this.updateLoadingProgress('Core systems ready', 20);

            // Initialize GitHub API manager
            await this.initializeGitHubAPI();
            this.updateLoadingProgress('GitHub integration ready', 30);

            // Initialize research mode
            await this.initializeResearchMode();
            this.updateLoadingProgress('Research mode ready', 40);

            // Initialize onboarding
            await this.initializeOnboarding();
            this.updateLoadingProgress('Onboarding system ready', 50);

            // Initialize PWA features
            await this.initializePWA();
            this.updateLoadingProgress('PWA features ready', 70);

            // Initialize SEO
            await this.initializeSEO();
            this.updateLoadingProgress('SEO optimization ready', 80);

            // Final setup
            await this.finalizeSetup();
            this.updateLoadingProgress('All systems operational', 100);

            this.isInitialized = true;
            console.log('🌟 Production constellation fully initialized!');

        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.showError('Failed to initialize constellation. Please refresh the page.');
        }
    }

    /**
     * Initialize core constellation
     */
    async initializeCore() {
        if (window.UltimateHyperfocusConstellation) {
            this.modules.constellation = new window.UltimateHyperfocusConstellation();

            // Enhanced event system
            this.modules.constellation.addEventListener = (event, callback) => {
                document.addEventListener(`constellation:${event}`, callback);
            };

            this.modules.constellation.dispatchEvent = (event, data) => {
                document.dispatchEvent(new CustomEvent(`constellation:${event}`, { detail: data }));
            };

            return this.modules.constellation;
        } else {
            throw new Error('Core constellation not available');
        }
    }

    /**
     * Initialize GitHub API manager
     */
    async initializeGitHubAPI() {
        if (window.GitHubAPIManager) {
            this.modules.githubAPI = new window.GitHubAPIManager();

            // Connect to constellation
            if (this.modules.constellation) {
                this.modules.constellation.gitHubAPI = this.modules.githubAPI;

                // Override loadRepositoryData to use real API
                const originalLoad = this.modules.constellation.loadRepositoryData;
                this.modules.constellation.loadRepositoryData = async () => {
                    try {
                        const repos = await this.modules.githubAPI.fetchUserRepositories();
                        this.modules.constellation.repositories = repos;
                        this.modules.constellation.totalStars = repos.reduce((sum, repo) => sum + repo.stars, 0);

                        // Update UI
                        const totalStarsElement = document.getElementById('total-stars');
                        if (totalStarsElement) {
                            totalStarsElement.textContent = this.modules.constellation.totalStars;
                        }

                        console.log(`📊 Loaded ${repos.length} repositories from GitHub API`);
                    } catch (error) {
                        console.warn('⚠️ GitHub API failed, using fallback');
                        await originalLoad.call(this.modules.constellation);
                    }
                };
            }

            return this.modules.githubAPI;
        }
    }

    /**
     * Initialize research mode
     */
    async initializeResearchMode() {
        if (window.ResearchModeManager && this.modules.constellation) {
            this.modules.researchMode = new window.ResearchModeManager(this.modules.constellation);
            this.modules.constellation.researchMode = this.modules.researchMode;

            // Connect mode toggle
            const modeToggle = document.getElementById('mode-toggle');
            if (modeToggle) {
                modeToggle.addEventListener('click', () => {
                    this.modules.researchMode.toggleMode();

                    // Dispatch event for SEO updates
                    this.modules.constellation.dispatchEvent('modeChanged', {
                        mode: this.modules.researchMode.currentMode
                    });
                });
            }

            return this.modules.researchMode;
        }
    }

    /**
     * Initialize onboarding system
     */
    async initializeOnboarding() {
        if (window.OnboardingManager && this.modules.constellation) {
            this.modules.onboarding = new window.OnboardingManager(this.modules.constellation);
            this.modules.constellation.onboarding = this.modules.onboarding;

            return this.modules.onboarding;
        }
    }

    /**
     * Initialize PWA features
     */
    async initializePWA() {
        if (window.PWAManager && this.modules.constellation) {
            this.modules.pwa = new window.PWAManager(this.modules.constellation);
            this.modules.constellation.pwa = this.modules.pwa;

            return this.modules.pwa;
        }
    }

    /**
     * Initialize SEO
     */
    async initializeSEO() {
        if (window.SEOManager) {
            this.modules.seo = new window.SEOManager();

            // Connect to constellation events
            if (this.modules.constellation) {
                this.modules.constellation.addEventListener('repositorySelected', (event) => {
                    this.modules.seo.updateMetaForRepository(event.detail.repository);
                });
            }

            return this.modules.seo;
        }
    }

    /**
     * Finalize setup and connect all systems
     */
    async finalizeSetup() {
        // Cross-module connections
        this.setupCrossModuleIntegration();

        // Analytics integration
        this.setupAnalytics();

        // Performance monitoring
        this.setupPerformanceMonitoring();

        // Error handling
        this.setupErrorHandling();

        // Accessibility announcements
        this.setupAccessibilityFeatures();

        // Hide loading screen
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
        }, 1000);
    }

    /**
     * Setup cross-module integration
     */
    setupCrossModuleIntegration() {
        // Repository selection integration
        if (this.modules.constellation && this.modules.githubAPI) {
            const originalSelectRepository = this.modules.constellation.selectRepository;
            this.modules.constellation.selectRepository = async (repository) => {
                // Call original selection
                originalSelectRepository.call(this.modules.constellation, repository);

                // Fetch enhanced details
                try {
                    const details = await this.modules.githubAPI.getRepositoryDetails(repository.name);
                    if (details) {
                        this.updateRepositoryModal(repository, details);
                    }
                } catch (error) {
                    console.warn('Could not fetch repository details:', error);
                }

                // Dispatch event for other modules
                this.modules.constellation.dispatchEvent('repositorySelected', { repository });
            };
        }

        // Focus mode integration
        if (this.modules.constellation && this.modules.pwa) {
            const originalStartHyperfocus = this.modules.constellation.startHyperfocusSession;
            this.modules.constellation.startHyperfocusSession = () => {
                originalStartHyperfocus.call(this.modules.constellation);

                // Track in PWA
                if (this.modules.pwa) {
                    this.modules.pwa.trackEvent('hyperfocus_session_started');
                }
            };
        }
    }

    /**
     * Update repository modal with enhanced details
     */
    updateRepositoryModal(repository, details) {
        // Add language breakdown
        if (details.languages) {
            const languagesHTML = Object.entries(details.languages)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([lang, bytes]) => `<span class="language-tag">${lang}</span>`)
                .join('');

            const languageContainer = document.querySelector('.repo-languages');
            if (languageContainer) {
                languageContainer.innerHTML = languagesHTML;
            }
        }

        // Add activity score
        if (details.activity !== undefined) {
            const activityElement = document.querySelector('.repo-activity');
            if (activityElement) {
                activityElement.innerHTML = `
                    <div class="activity-score">
                        <span class="activity-label">Activity Score:</span>
                        <span class="activity-value">${details.activity}/100</span>
                        <div class="activity-bar">
                            <div class="activity-fill" style="width: ${details.activity}%"></div>
                        </div>
                    </div>
                `;
            }
        }

        // Add last commit info
        if (details.lastCommit) {
            const commitElement = document.querySelector('.repo-last-commit');
            if (commitElement) {
                const commitDate = new Date(details.lastCommit.commit.author.date);
                commitElement.innerHTML = `
                    <div class="last-commit">
                        <span class="commit-label">Last commit:</span>
                        <span class="commit-message">${details.lastCommit.commit.message.slice(0, 60)}...</span>
                        <span class="commit-date">${commitDate.toLocaleDateString()}</span>
                    </div>
                `;
            }
        }
    }

    /**
     * Setup analytics integration
     */
    setupAnalytics() {
        // Privacy-respecting analytics setup
        if (window.gtag) {
            // Track constellation usage
            this.modules.constellation?.addEventListener('repositorySelected', (event) => {
                gtag('event', 'repository_selected', {
                    event_category: 'engagement',
                    event_label: event.detail.repository.name
                });
            });

            this.modules.constellation?.addEventListener('modeChanged', (event) => {
                gtag('event', 'mode_changed', {
                    event_category: 'navigation',
                    event_label: event.detail.mode
                });
            });
        }

        console.log('📊 Analytics integration ready');
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor frame rate
        let frameCount = 0;
        let lastTime = performance.now();

        const monitorFrameRate = () => {
            frameCount++;
            const currentTime = performance.now();

            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                console.log(`🎮 FPS: ${fps}`);

                // Track performance
                if (this.modules.pwa) {
                    this.modules.pwa.trackEvent('performance_fps', { fps });
                }

                frameCount = 0;
                lastTime = currentTime;
            }

            requestAnimationFrame(monitorFrameRate);
        };

        requestAnimationFrame(monitorFrameRate);

        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                console.log(`💾 Memory: ${memoryMB}MB`);

                if (memoryMB > 50) {
                    console.warn('⚠️ High memory usage detected');
                }
            }, 30000);
        }
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('❌ Global error:', event.error);

            if (this.modules.pwa) {
                this.modules.pwa.trackEvent('error_occurred', {
                    message: event.error?.message,
                    filename: event.filename,
                    lineno: event.lineno
                });
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('❌ Unhandled promise rejection:', event.reason);

            if (this.modules.pwa) {
                this.modules.pwa.trackEvent('promise_rejection', {
                    reason: event.reason?.toString()
                });
            }
        });
    }

    /**
     * Setup accessibility features
     */
    setupAccessibilityFeatures() {
        // Enhanced keyboard navigation
        document.addEventListener('keydown', (event) => {
            // Global shortcuts
            if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
                switch (event.key.toLowerCase()) {
                    case '?':
                        event.preventDefault();
                        if (this.modules.onboarding) {
                            this.modules.onboarding.showHelp();
                        }
                        break;

                    case 'i':
                        event.preventDefault();
                        if (this.modules.pwa && this.modules.pwa.installPrompt) {
                            this.modules.pwa.installApp();
                        }
                        break;
                }
            }
        });

        // Accessibility announcements for module interactions
        if (this.modules.constellation) {
            this.modules.constellation.addEventListener('achievementUnlocked', (event) => {
                this.modules.constellation.announceToScreenReader(
                    `Achievement unlocked: ${event.detail.achievement.name}!`
                );
            });
        }
    }

    /**
     * Update loading progress
     */
    updateLoadingProgress(message, percent) {
        const loadingText = document.querySelector('.loading-text');
        const loadingSubtext = document.querySelector('.loading-subtext');

        if (loadingText) {
            loadingText.textContent = message;
        }

        if (loadingSubtext) {
            loadingSubtext.textContent = `${percent}% complete`;
        }

        this.loadingProgress = percent;
    }

    /**
     * Show error message
     */
    showError(message) {
        const errorHTML = `
            <div class="error-container">
                <div class="error-icon">❌</div>
                <h2>Initialization Error</h2>
                <p>${message}</p>
                <button onclick="window.location.reload()" class="retry-button">
                    🔄 Retry
                </button>
            </div>
        `;

        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = errorHTML;
        }
    }

    /**
     * Get system status
     */
    getSystemStatus() {
        return {
            initialized: this.isInitialized,
            loadingProgress: this.loadingProgress,
            modules: Object.keys(this.modules),
            performance: {
                memory: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB' : 'Unknown',
                timing: performance.timing ? {
                    domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
                    loadComplete: performance.timing.loadEventEnd - performance.timing.navigationStart
                } : null
            },
            features: {
                webgl: !!window.WebGLRenderingContext,
                serviceWorker: 'serviceWorker' in navigator,
                pwa: this.modules.pwa?.getPWAStatus(),
                github: !!this.modules.githubAPI,
                research: !!this.modules.researchMode,
                onboarding: !!this.modules.onboarding,
                seo: !!this.modules.seo
            }
        };
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.constellationIntegrator = new ConstellationIntegrator();
});

// Export for debugging
window.ConstellationIntegrator = ConstellationIntegrator;

console.log('🚀 Production integrator loaded - ready for hyperfocus constellation!');
