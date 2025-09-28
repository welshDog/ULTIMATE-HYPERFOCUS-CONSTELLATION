/**
 * 🎓 Onboarding & Tooltips System
 * Guided walkthrough and contextual help for new users
 */

class OnboardingManager {
    constructor(constellation) {
        this.constellation = constellation;
        this.isFirstVisit = this.checkFirstVisit();
        this.currentStep = 0;
        this.isOnboardingActive = false;
        this.tooltips = new Map();
        this.completedSteps = new Set();

        this.initializeOnboarding();
        this.setupTooltips();
    }

    /**
     * Check if this is user's first visit
     */
    checkFirstVisit() {
        const hasVisited = localStorage.getItem('constellation-visited');
        if (!hasVisited) {
            localStorage.setItem('constellation-visited', 'true');
            return true;
        }
        return false;
    }

    /**
     * Initialize onboarding system
     */
    initializeOnboarding() {
        this.onboardingSteps = [
            {
                id: 'welcome',
                title: 'Welcome to Your Constellation! 🌌',
                content: `
                    <p>Welcome to the <strong>Ultimate Hyperfocus Constellation</strong> - the world's first 3D developer portfolio designed specifically for neurodivergent minds!</p>
                    <p>This interactive experience celebrates ADHD as a superpower and provides tools to help you navigate your repositories in a focus-friendly way.</p>
                    <div class="onboarding-features">
                        <div class="feature-item">⚡ Hyperfocus-aware interface</div>
                        <div class="feature-item">♿ Perfect accessibility</div>
                        <div class="feature-item">🏆 Achievement system</div>
                        <div class="feature-item">📱 Mobile-friendly</div>
                    </div>
                `,
                target: null,
                position: 'center'
            },
            {
                id: 'navigation',
                title: 'Navigation Controls 🎮',
                content: `
                    <p>You can navigate the constellation in multiple ways:</p>
                    <ul>
                        <li><strong>🖱️ Mouse:</strong> Click and drag to orbit, scroll to zoom</li>
                        <li><strong>📱 Touch:</strong> Drag to rotate, pinch to zoom</li>
                        <li><strong>⌨️ Keyboard:</strong> Tab/arrows to navigate, Enter to select</li>
                    </ul>
                    <p>Try moving around the constellation now!</p>
                `,
                target: '#constellation-canvas',
                position: 'right'
            },
            {
                id: 'repositories',
                title: 'Repository Spheres 🌟',
                content: `
                    <p>Each floating sphere represents a repository in your GitHub profile. The size indicates popularity (stars), and colors represent different categories.</p>
                    <p><strong>Click on any sphere</strong> to view detailed information including stars, forks, and recent activity.</p>
                    <p>Try clicking on a repository sphere!</p>
                `,
                target: '#constellation-canvas',
                position: 'left'
            },
            {
                id: 'categories',
                title: 'Smart Categories 🗂️',
                content: `
                    <p>Your repositories are automatically organized into meaningful categories:</p>
                    <div class="category-grid">
                        <span class="cat-core">🏰 Core Empire</span>
                        <span class="cat-visual">✨ Visual Magic</span>
                        <span class="cat-brain">🧠 Brain Games</span>
                        <span class="cat-social">🌐 Social Nexus</span>
                    </div>
                    <p>Click on any category to filter your view!</p>
                `,
                target: '#categories-panel',
                position: 'right'
            },
            {
                id: 'hyperfocus',
                title: 'Hyperfocus Mode ⚡',
                content: `
                    <p>This is your <strong>secret weapon</strong>! Hyperfocus mode is designed specifically for ADHD minds:</p>
                    <ul>
                        <li>🎯 Dims distracting elements</li>
                        <li>⏱️ Tracks your focus sessions</li>
                        <li>🏆 Unlocks achievements</li>
                        <li>📊 Shows your progress</li>
                    </ul>
                    <p>Click the "🎯 Focus" button whenever you're ready to dive deep!</p>
                `,
                target: '#focus-toggle',
                position: 'bottom'
            },
            {
                id: 'achievements',
                title: 'Achievement System 🏆',
                content: `
                    <p>Gamification makes exploration fun! Unlock achievements by:</p>
                    <ul>
                        <li>🎯 Visiting your first repository</li>
                        <li>🧭 Exploring 5 different projects</li>
                        <li>📚 Discovering 10+ repositories</li>
                        <li>⚡ Completing 30+ minute focus sessions</li>
                        <li>👑 Exploring your entire constellation</li>
                    </ul>
                    <p>Your progress is tracked here!</p>
                `,
                target: '.achievements-panel',
                position: 'top'
            },
            {
                id: 'accessibility',
                title: 'Accessibility Settings ♿',
                content: `
                    <p>This constellation works for <strong>every brain type</strong>. Customize your experience:</p>
                    <ul>
                        <li>🐌 Reduce motion for comfort</li>
                        <li>🌓 High contrast mode</li>
                        <li>🔊 Audio controls</li>
                        <li>🎯 Focus mode preferences</li>
                    </ul>
                    <p>Click "⚙️ Settings" to explore these options!</p>
                `,
                target: '#settings-toggle',
                position: 'bottom'
            },
            {
                id: 'research-mode',
                title: 'Research Mode 📚',
                content: `
                    <p>Switch to <strong>Research Mode</strong> to explore interactive content about:</p>
                    <ul>
                        <li>🌊 Origins of vibe coding</li>
                        <li>🚀 Current state of AI-assisted development</li>
                        <li>🔮 Future trends in programming</li>
                        <li>⚡ ADHD superpowers in development</li>
                    </ul>
                    <p>Each research node includes an AI chat assistant!</p>
                `,
                target: '#mode-toggle',
                position: 'bottom'
            },
            {
                id: 'completion',
                title: 'You're Ready to Explore! 🚀',
                content: `
                    <p><strong>Congratulations!</strong> You now know how to navigate your constellation like a pro!</p>
                    <div class="completion-stats">
                        <div class="stat-item">
                            <span class="stat-number">37</span>
                            <span class="stat-label">Repositories to explore</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">11</span>
                            <span class="stat-label">Categories to discover</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number">5</span>
                            <span class="stat-label">Achievements to unlock</span>
                        </div>
                    </div>
                    <p>Remember: This interface is built <em>for</em> your neurodivergent brain, not despite it. Embrace your hyperfocus superpowers!</p>
                `,
                target: null,
                position: 'center'
            }
        ];

        this.createOnboardingUI();

        // Start onboarding if first visit
        if (this.isFirstVisit) {
            setTimeout(() => this.startOnboarding(), 2000);
        }
    }

    /**
     * Create onboarding UI elements
     */
    createOnboardingUI() {
        const onboardingHTML = `
            <div id="onboarding-overlay" class="onboarding-overlay">
                <div id="onboarding-modal" class="onboarding-modal">
                    <div class="onboarding-header">
                        <h2 id="onboarding-title">Welcome</h2>
                        <button id="onboarding-skip" class="onboarding-skip" aria-label="Skip onboarding">Skip Tour</button>
                    </div>

                    <div class="onboarding-content">
                        <div id="onboarding-body" class="onboarding-body">
                            <!-- Content will be populated dynamically -->
                        </div>

                        <div class="onboarding-progress">
                            <div class="progress-bar">
                                <div id="onboarding-progress-fill" class="progress-fill" style="width: 0%"></div>
                            </div>
                            <span id="onboarding-step-counter" class="step-counter">1 of 9</span>
                        </div>
                    </div>

                    <div class="onboarding-footer">
                        <button id="onboarding-prev" class="onboarding-btn secondary" disabled>Previous</button>
                        <button id="onboarding-next" class="onboarding-btn primary">Next</button>
                    </div>
                </div>

                <div id="onboarding-spotlight" class="onboarding-spotlight"></div>
                <div id="onboarding-pointer" class="onboarding-pointer"></div>
            </div>

            <!-- Help trigger for returning users -->
            <button id="help-trigger" class="help-trigger" aria-label="Show help and tips" title="Help & Tips">
                <span class="help-icon">?</span>
            </button>
        `;

        const onboardingStyles = `
            <style>
                .onboarding-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(4px);
                    z-index: 10000;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .onboarding-overlay.active {
                    display: flex;
                    opacity: 1;
                }

                .onboarding-modal {
                    background: rgba(26, 26, 46, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--accent-primary);
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                    width: 90%;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow: hidden;
                    position: relative;
                    animation: modalSlideIn 0.5s ease-out;
                }

                @keyframes modalSlideIn {
                    from {
                        transform: translateY(30px) scale(0.9);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0) scale(1);
                        opacity: 1;
                    }
                }

                .onboarding-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border-color);
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                }

                .onboarding-header h2 {
                    margin: 0;
                    color: white;
                    font-size: 1.25rem;
                    font-weight: 600;
                }

                .onboarding-skip {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 8px;
                    padding: 8px 16px;
                    color: white;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .onboarding-skip:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .onboarding-content {
                    padding: 24px;
                }

                .onboarding-body {
                    min-height: 200px;
                    line-height: 1.6;
                    color: var(--text-primary);
                }

                .onboarding-body h3 {
                    color: var(--accent-primary);
                    margin: 0 0 16px 0;
                }

                .onboarding-body ul {
                    margin: 16px 0;
                    padding-left: 20px;
                }

                .onboarding-body li {
                    margin: 8px 0;
                }

                .onboarding-features {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 12px;
                    margin: 16px 0;
                }

                .feature-item {
                    background: rgba(35, 53, 84, 0.6);
                    padding: 12px 16px;
                    border-radius: 8px;
                    border-left: 3px solid var(--accent-primary);
                    font-weight: 500;
                }

                .category-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                    margin: 16px 0;
                }

                .category-grid span {
                    background: rgba(35, 53, 84, 0.6);
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    text-align: center;
                }

                .completion-stats {
                    display: flex;
                    justify-content: space-around;
                    margin: 20px 0;
                    padding: 20px;
                    background: rgba(35, 53, 84, 0.4);
                    border-radius: 12px;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-number {
                    display: block;
                    font-size: 2rem;
                    font-weight: bold;
                    color: var(--accent-primary);
                }

                .stat-label {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }

                .onboarding-progress {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-top: 24px;
                    gap: 16px;
                }

                .progress-bar {
                    flex: 1;
                    height: 6px;
                    background: rgba(35, 53, 84, 0.6);
                    border-radius: 3px;
                    overflow: hidden;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary));
                    border-radius: 3px;
                    transition: width 0.3s ease;
                }

                .step-counter {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    white-space: nowrap;
                }

                .onboarding-footer {
                    display: flex;
                    justify-content: space-between;
                    padding: 20px 24px;
                    border-top: 1px solid var(--border-color);
                    background: rgba(16, 33, 62, 0.3);
                }

                .onboarding-btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    min-width: 100px;
                }

                .onboarding-btn.primary {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                }

                .onboarding-btn.primary:hover {
                    background: var(--accent-secondary);
                    transform: translateY(-1px);
                }

                .onboarding-btn.secondary {
                    background: rgba(35, 53, 84, 0.6);
                    color: var(--text-primary);
                    border: 1px solid var(--border-color);
                }

                .onboarding-btn.secondary:hover {
                    background: rgba(35, 53, 84, 0.8);
                }

                .onboarding-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none !important;
                }

                .onboarding-spotlight {
                    position: absolute;
                    border: 3px solid var(--accent-primary);
                    border-radius: 8px;
                    background: rgba(0, 217, 255, 0.1);
                    box-shadow: 0 0 20px rgba(0, 217, 255, 0.5);
                    pointer-events: none;
                    transition: all 0.5s ease;
                    opacity: 0;
                }

                .onboarding-spotlight.active {
                    opacity: 1;
                }

                .onboarding-pointer {
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    pointer-events: none;
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .onboarding-pointer.active {
                    opacity: 1;
                }

                .onboarding-pointer.top {
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-bottom: 15px solid var(--accent-primary);
                }

                .onboarding-pointer.bottom {
                    border-left: 10px solid transparent;
                    border-right: 10px solid transparent;
                    border-top: 15px solid var(--accent-primary);
                }

                .onboarding-pointer.left {
                    border-top: 10px solid transparent;
                    border-bottom: 10px solid transparent;
                    border-right: 15px solid var(--accent-primary);
                }

                .onboarding-pointer.right {
                    border-top: 10px solid transparent;
                    border-bottom: 10px solid transparent;
                    border-left: 15px solid var(--accent-primary);
                }

                .help-trigger {
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    width: 50px;
                    height: 50px;
                    background: var(--accent-primary);
                    border: none;
                    border-radius: 50%;
                    color: var(--bg-primary);
                    font-size: 1.5rem;
                    font-weight: bold;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 217, 255, 0.3);
                    transition: all 0.3s ease;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .help-trigger:hover {
                    background: var(--accent-secondary);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 16px rgba(0, 217, 255, 0.4);
                }

                .help-icon {
                    line-height: 1;
                }

                /* Mobile adjustments */
                @media (max-width: 768px) {
                    .onboarding-modal {
                        width: 95%;
                        max-height: 90vh;
                    }

                    .onboarding-content {
                        padding: 16px;
                    }

                    .onboarding-footer {
                        padding: 16px;
                    }

                    .completion-stats {
                        flex-direction: column;
                        gap: 16px;
                    }

                    .stat-item {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }

                    .stat-number {
                        font-size: 1.5rem;
                        margin-right: 16px;
                    }

                    .help-trigger {
                        width: 45px;
                        height: 45px;
                        font-size: 1.3rem;
                    }
                }

                /* Focus mode adjustments */
                .focus-mode .help-trigger {
                    opacity: 0.6;
                }

                .focus-mode .help-trigger:hover {
                    opacity: 1;
                }

                /* High contrast mode */
                .high-contrast .onboarding-modal {
                    border: 2px solid white;
                    background: black;
                }

                .high-contrast .feature-item {
                    background: #333;
                    border-left-color: white;
                }
            </style>
        `;

        // Inject styles and HTML
        document.head.insertAdjacentHTML('beforeend', onboardingStyles);
        document.body.insertAdjacentHTML('beforeend', onboardingHTML);

        // Setup event listeners
        this.setupOnboardingEventListeners();
    }

    /**
     * Setup onboarding event listeners
     */
    setupOnboardingEventListeners() {
        const nextBtn = document.getElementById('onboarding-next');
        const prevBtn = document.getElementById('onboarding-prev');
        const skipBtn = document.getElementById('onboarding-skip');
        const helpTrigger = document.getElementById('help-trigger');

        nextBtn.addEventListener('click', () => this.nextStep());
        prevBtn.addEventListener('click', () => this.previousStep());
        skipBtn.addEventListener('click', () => this.skipOnboarding());
        helpTrigger.addEventListener('click', () => this.showHelp());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isOnboardingActive) return;

            if (e.key === 'ArrowRight' || e.key === 'Enter') {
                e.preventDefault();
                this.nextStep();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.previousStep();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.skipOnboarding();
            }
        });
    }

    /**
     * Start the onboarding process
     */
    startOnboarding() {
        this.isOnboardingActive = true;
        this.currentStep = 0;

        const overlay = document.getElementById('onboarding-overlay');
        overlay.classList.add('active');

        this.showStep(this.currentStep);

        // Announce to screen reader
        this.constellation.announceToScreenReader('Starting interactive tour of the constellation interface');
    }

    /**
     * Show a specific onboarding step
     */
    showStep(stepIndex) {
        const step = this.onboardingSteps[stepIndex];
        if (!step) return;

        // Update content
        document.getElementById('onboarding-title').textContent = step.title;
        document.getElementById('onboarding-body').innerHTML = step.content;

        // Update progress
        const progress = ((stepIndex + 1) / this.onboardingSteps.length) * 100;
        document.getElementById('onboarding-progress-fill').style.width = progress + '%';
        document.getElementById('onboarding-step-counter').textContent = `${stepIndex + 1} of ${this.onboardingSteps.length}`;

        // Update navigation buttons
        const prevBtn = document.getElementById('onboarding-prev');
        const nextBtn = document.getElementById('onboarding-next');

        prevBtn.disabled = stepIndex === 0;

        if (stepIndex === this.onboardingSteps.length - 1) {
            nextBtn.textContent = 'Get Started!';
            nextBtn.classList.add('completion');
        } else {
            nextBtn.textContent = 'Next';
            nextBtn.classList.remove('completion');
        }

        // Show spotlight
        this.showSpotlight(step.target, step.position);

        // Mark step as completed
        this.completedSteps.add(step.id);

        // Announce step
        this.constellation.announceToScreenReader(`Step ${stepIndex + 1}: ${step.title}`);
    }

    /**
     * Show spotlight on target element
     */
    showSpotlight(target, position) {
        const spotlight = document.getElementById('onboarding-spotlight');
        const pointer = document.getElementById('onboarding-pointer');

        if (!target) {
            spotlight.classList.remove('active');
            pointer.classList.remove('active');
            return;
        }

        const targetElement = document.querySelector(target);
        if (!targetElement) {
            spotlight.classList.remove('active');
            pointer.classList.remove('active');
            return;
        }

        const rect = targetElement.getBoundingClientRect();
        const padding = 8;

        // Position spotlight
        spotlight.style.left = (rect.left - padding) + 'px';
        spotlight.style.top = (rect.top - padding) + 'px';
        spotlight.style.width = (rect.width + padding * 2) + 'px';
        spotlight.style.height = (rect.height + padding * 2) + 'px';
        spotlight.classList.add('active');

        // Position pointer
        pointer.className = `onboarding-pointer active ${position}`;

        switch (position) {
            case 'top':
                pointer.style.left = (rect.left + rect.width / 2 - 10) + 'px';
                pointer.style.top = (rect.top - 20) + 'px';
                break;
            case 'bottom':
                pointer.style.left = (rect.left + rect.width / 2 - 10) + 'px';
                pointer.style.top = (rect.bottom + 5) + 'px';
                break;
            case 'left':
                pointer.style.left = (rect.left - 20) + 'px';
                pointer.style.top = (rect.top + rect.height / 2 - 10) + 'px';
                break;
            case 'right':
                pointer.style.left = (rect.right + 5) + 'px';
                pointer.style.top = (rect.top + rect.height / 2 - 10) + 'px';
                break;
        }
    }

    /**
     * Move to next step
     */
    nextStep() {
        if (this.currentStep < this.onboardingSteps.length - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        } else {
            this.completeOnboarding();
        }
    }

    /**
     * Move to previous step
     */
    previousStep() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    /**
     * Skip onboarding
     */
    skipOnboarding() {
        this.isOnboardingActive = false;

        const overlay = document.getElementById('onboarding-overlay');
        overlay.classList.remove('active');

        // Hide spotlight
        const spotlight = document.getElementById('onboarding-spotlight');
        const pointer = document.getElementById('onboarding-pointer');
        spotlight.classList.remove('active');
        pointer.classList.remove('active');

        this.constellation.announceToScreenReader('Onboarding skipped. You can access help anytime using the help button.');
    }

    /**
     * Complete onboarding
     */
    completeOnboarding() {
        this.isOnboardingActive = false;

        // Store completion
        localStorage.setItem('onboarding-completed', 'true');

        const overlay = document.getElementById('onboarding-overlay');
        overlay.classList.remove('active');

        // Hide spotlight
        const spotlight = document.getElementById('onboarding-spotlight');
        const pointer = document.getElementById('onboarding-pointer');
        spotlight.classList.remove('active');
        pointer.classList.remove('active');

        // Unlock first achievement
        this.constellation.unlockAchievement({
            id: 'first-explorer',
            name: 'First Explorer',
            icon: '🎯'
        });

        this.constellation.announceToScreenReader('Onboarding completed! Welcome to your constellation. Start exploring to unlock achievements.');
    }

    /**
     * Show help menu for returning users
     */
    showHelp() {
        // Show a quick help menu with key shortcuts and tips
        const helpContent = `
            <div class="help-menu">
                <h3>🎯 Quick Help</h3>
                <div class="help-section">
                    <h4>⌨️ Keyboard Shortcuts</h4>
                    <ul>
                        <li><kbd>Tab</kbd> / <kbd>→</kbd> Navigate repositories</li>
                        <li><kbd>Enter</kbd> Select repository</li>
                        <li><kbd>F</kbd> Toggle focus mode</li>
                        <li><kbd>T</kbd> Toggle research mode</li>
                        <li><kbd>/</kbd> Focus search</li>
                        <li><kbd>Esc</kbd> Close panels</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>🎮 Controls</h4>
                    <ul>
                        <li>🖱️ <strong>Mouse:</strong> Drag to orbit, scroll to zoom</li>
                        <li>📱 <strong>Touch:</strong> Drag to rotate, pinch to zoom</li>
                        <li>🎯 <strong>Focus Mode:</strong> Dims distractions for hyperfocus</li>
                        <li>⚙️ <strong>Settings:</strong> Accessibility and audio controls</li>
                    </ul>
                </div>
                <div class="help-section">
                    <h4>🏆 Achievements</h4>
                    <p>Explore repositories and use focus mode to unlock achievements and track your progress!</p>
                </div>
                <button onclick="this.closest('.help-menu').remove()" class="help-close">Got it!</button>
            </div>
        `;

        // Create help overlay
        const helpOverlay = document.createElement('div');
        helpOverlay.className = 'help-overlay';
        helpOverlay.innerHTML = helpContent;
        helpOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        document.body.appendChild(helpOverlay);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (helpOverlay.parentNode) {
                helpOverlay.remove();
            }
        }, 10000);

        // Remove on click outside
        helpOverlay.addEventListener('click', (e) => {
            if (e.target === helpOverlay) {
                helpOverlay.remove();
            }
        });
    }

    /**
     * Setup contextual tooltips
     */
    setupTooltips() {
        this.tooltipDefinitions = [
            {
                selector: '#search-input',
                content: 'Search across repository names, descriptions, and languages. Try "javascript" or "accessibility"!',
                position: 'bottom'
            },
            {
                selector: '#focus-toggle',
                content: 'Activate hyperfocus mode to dim distractions and track your focus sessions. Perfect for ADHD minds!',
                position: 'bottom'
            },
            {
                selector: '#mode-toggle',
                content: 'Switch between Repository mode (explore your projects) and Research mode (learn about vibe coding).',
                position: 'bottom'
            },
            {
                selector: '#settings-toggle',
                content: 'Customize your experience with accessibility options, motion controls, and audio settings.',
                position: 'bottom'
            },
            {
                selector: '.category-item',
                content: 'Click to filter repositories by category. Each color represents a different type of project.',
                position: 'right'
            },
            {
                selector: '.session-button',
                content: 'Start a hyperfocus session to track your deep work time and unlock achievements.',
                position: 'top'
            }
        ];

        this.createTooltips();
    }

    /**
     * Create tooltip system
     */
    createTooltips() {
        // Add tooltip styles
        const tooltipStyles = `
            <style>
                .tooltip {
                    position: absolute;
                    background: rgba(26, 26, 46, 0.95);
                    backdrop-filter: blur(10px);
                    color: var(--text-primary);
                    padding: 12px 16px;
                    border-radius: 8px;
                    border: 1px solid var(--accent-primary);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
                    font-size: 0.9rem;
                    line-height: 1.4;
                    max-width: 280px;
                    z-index: 9999;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }

                .tooltip.show {
                    opacity: 1;
                }

                .tooltip::after {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-style: solid;
                }

                .tooltip.top::after {
                    bottom: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-top: 8px solid rgba(26, 26, 46, 0.95);
                }

                .tooltip.bottom::after {
                    top: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-bottom: 8px solid rgba(26, 26, 46, 0.95);
                }

                .tooltip.left::after {
                    right: -8px;
                    top: 50%;
                    transform: translateY(-50%);
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-left: 8px solid rgba(26, 26, 46, 0.95);
                }

                .tooltip.right::after {
                    left: -8px;
                    top: 50%;
                    transform: translateY(-50%);
                    border-top: 8px solid transparent;
                    border-bottom: 8px solid transparent;
                    border-right: 8px solid rgba(26, 26, 46, 0.95);
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', tooltipStyles);

        // Setup tooltip triggers
        this.tooltipDefinitions.forEach(tooltip => {
            const elements = document.querySelectorAll(tooltip.selector);
            elements.forEach(element => {
                this.addTooltip(element, tooltip.content, tooltip.position);
            });
        });
    }

    /**
     * Add tooltip to element
     */
    addTooltip(element, content, position = 'top') {
        let tooltip = null;
        let showTimeout = null;
        let hideTimeout = null;

        const showTooltip = () => {
            if (showTimeout) clearTimeout(showTimeout);
            if (hideTimeout) clearTimeout(hideTimeout);

            showTimeout = setTimeout(() => {
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.className = `tooltip ${position}`;
                    tooltip.textContent = content;
                    document.body.appendChild(tooltip);
                }

                const rect = element.getBoundingClientRect();

                // Position tooltip
                switch (position) {
                    case 'top':
                        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
                        tooltip.style.transform = 'translateX(-50%)';
                        break;
                    case 'bottom':
                        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
                        tooltip.style.top = (rect.bottom + 10) + 'px';
                        tooltip.style.transform = 'translateX(-50%)';
                        break;
                    case 'left':
                        tooltip.style.left = (rect.left - tooltip.offsetWidth - 10) + 'px';
                        tooltip.style.top = (rect.top + rect.height / 2) + 'px';
                        tooltip.style.transform = 'translateY(-50%)';
                        break;
                    case 'right':
                        tooltip.style.left = (rect.right + 10) + 'px';
                        tooltip.style.top = (rect.top + rect.height / 2) + 'px';
                        tooltip.style.transform = 'translateY(-50%)';
                        break;
                }

                tooltip.classList.add('show');
            }, 800); // Delay to avoid overwhelming users
        };

        const hideTooltip = () => {
            if (showTimeout) clearTimeout(showTimeout);
            if (hideTimeout) clearTimeout(hideTimeout);

            hideTimeout = setTimeout(() => {
                if (tooltip) {
                    tooltip.classList.remove('show');
                    setTimeout(() => {
                        if (tooltip && tooltip.parentNode) {
                            tooltip.parentNode.removeChild(tooltip);
                            tooltip = null;
                        }
                    }, 300);
                }
            }, 100);
        };

        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    }
}

// Export the Onboarding Manager
window.OnboardingManager = OnboardingManager;
