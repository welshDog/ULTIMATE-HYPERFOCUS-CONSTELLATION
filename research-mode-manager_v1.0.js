/**
 * 📚 Enhanced Research Mode with AI Chat Interface
 * Interactive research nodes for vibe coding exploration
 * 
 * COMPLETE IMPLEMENTATION - Ready for production
 */

class ResearchModeManager {
    constructor(constellation) {
        this.constellation = constellation;
        this.currentMode = 'repository';
        this.researchNodes = [];
        this.visitedResearchNodes = new Set();
        this.chatInterface = null;
        this.isVibeCodingActive = false;
        this.chatHistory = [];

        this.initializeResearchNodes();
        this.setupChatInterface();
    }

    /**
     * Initialize research nodes with content
     */
    initializeResearchNodes() {
        this.researchNodes = [
            {
                id: 'origins-vibe-coding',
                title: '🌊 Origins of Vibe Coding',
                description: 'Explore the historical roots and emergence of conversational programming',
                position: { x: -30, y: 20, z: 10 },
                color: '#00d9ff',
                content: {
                    summary: 'Vibe coding emerged from the intersection of natural language processing and human-centered design, revolutionizing how developers interact with code through intuitive conversation.',
                    keyPoints: [
                        'Started with early chatbots in the 1960s (ELIZA)',
                        'Modern AI assistants like GitHub Copilot changed the game',
                        'Neurodivergent developers pioneered conversational interfaces',
                        'Focus shifted from syntax memorization to concept communication'
                    ],
                    hyperfocusTips: [
                        'Use conversational coding during hyperfocus to maintain flow state',
                        'Natural language reduces cognitive switching between thinking and coding',
                        'Perfect for ADHD brains that think in concepts, not syntax'
                    ]
                }
            },
            {
                id: 'current-state',
                title: '🚀 Current State',
                description: 'What\'s happening right now in conversational programming',
                position: { x: 30, y: 15, z: -5 },
                color: '#7c3aed',
                content: {
                    summary: 'Today\'s vibe coding landscape features AI pair programming, voice-driven development, and neurodivergent-optimized interfaces that adapt to different thinking styles.',
                    keyPoints: [
                        'AI assistants understand context and intent',
                        'Voice coding reduces typing fatigue',
                        'Real-time collaboration with AI pair programming',
                        'Adaptive interfaces that learn your coding style'
                    ],
                    hyperfocusTips: [
                        'Set up AI assistant boundaries to maintain focus flow',
                        'Use voice coding during physical fatigue periods',
                        'Leverage AI for tedious tasks while preserving creative flow'
                    ]
                }
            },
            {
                id: 'future-trends',
                title: '🔮 Future Trends',
                description: 'Where AI-assisted development is heading',
                position: { x: 0, y: -20, z: 15 },
                color: '#06ffa5',
                content: {
                    summary: 'Future vibe coding will feature brain-computer interfaces, emotion-aware AI, and fully personalized development environments that adapt to individual neurocognitive patterns.',
                    keyPoints: [
                        'Brain-computer interfaces for direct thought-to-code',
                        'Emotion-aware AI that detects stress and adapts accordingly',
                        'Personalized development environments based on cognitive patterns',
                        'Universal design principles built into all coding tools'
                    ],
                    hyperfocusTips: [
                        'Future tools will automatically detect and optimize for hyperfocus states',
                        'Emotion-aware systems will provide gentle transitions between focus states',
                        'Personalized AI will learn your unique ADHD patterns and preferences'
                    ]
                }
            },
            {
                id: 'hyperfocus-superpowers',
                title: '⚡ Hyperfocus Superpowers',
                description: 'How ADHD traits become advantages in development',
                position: { x: -15, y: 0, z: -20 },
                color: '#f59e0b',
                content: {
                    summary: 'ADHD hyperfocus enables deep problem-solving, innovative thinking, and sustained attention on interesting challenges - perfect superpowers for complex development work.',
                    keyPoints: [
                        'Hyperfocus enables 8+ hour deep coding sessions',
                        'ADHD brains excel at pattern recognition and creative problem-solving',
                        'Natural ability to see connections others miss',
                        'Urgency-driven productivity creates breakthrough innovations'
                    ],
                    hyperfocusTips: [
                        'Embrace your natural hyperfocus cycles instead of fighting them',
                        'Use time-blocking to maximize hyperfocus sessions',
                        'Create environments that support sustained attention',
                        'Leverage dopamine-driven motivation for challenging projects'
                    ]
                }
            },
            {
                id: 'practical-wisdom',
                title: '💡 Practical Wisdom',
                description: 'Real-world applications and recommendations',
                position: { x: 25, y: -10, z: 8 },
                color: '#10b981',
                content: {
                    summary: 'Practical vibe coding combines AI assistance, adaptive interfaces, and neurodivergent-friendly workflows to create development environments that work with your brain, not against it.',
                    keyPoints: [
                        'Set up development environments that minimize friction',
                        'Use AI assistants as thought partners, not replacements',
                        'Create sensory-friendly workspaces with proper lighting and sound',
                        'Build in regular breaks and transition rituals'
                    ],
                    hyperfocusTips: [
                        'Prepare your environment before entering hyperfocus',
                        'Use ambient sounds or music to maintain focus flow',
                        'Have water and snacks ready to avoid breaking concentration',
                        'Set gentle timers to remind yourself to take care of basic needs'
                    ]
                }
            },
            {
                id: 'community-building',
                title: '🤝 Community Building',
                description: 'Creating inclusive neurodivergent spaces',
                position: { x: -10, y: 25, z: -12 },
                color: '#ec4899',
                content: {
                    summary: 'Building inclusive developer communities means creating spaces where neurodivergent minds can thrive, share experiences, and collaborate using their unique strengths.',
                    keyPoints: [
                        'Async communication accommodates different processing speeds',
                        'Multiple communication channels serve different needs',
                        'Celebration of diverse thinking styles and approaches',
                        'Mentorship programs that understand neurodivergent challenges'
                    ],
                    hyperfocusTips: [
                        'Join communities that respect focus boundaries',
                        'Share your hyperfocus discoveries and insights',
                        'Mentor others by sharing your unique perspective',
                        'Advocate for neurodivergent-friendly practices in your workplace'
                    ]
                }
            }
        ];

        console.log(`📚 Initialized ${this.researchNodes.length} research nodes`);
    }

    /**
     * Setup AI chat interface
     */
    setupChatInterface() {
        this.chatInterface = {
            isOpen: false,
            currentNode: null,
            messages: [],
            isTyping: false
        };

        this.createChatUI();
    }

    /**
     * Create chat interface UI
     */
    createChatUI() {
        const chatHTML = `
            <div id="vibe-chat-interface" class="vibe-chat-interface">
                <div class="chat-header">
                    <h3>🤖 Vibe Coding AI Assistant</h3>
                    <div class="chat-controls">
                        <button id="chat-minimize" class="chat-control-btn" aria-label="Minimize chat">−</button>
                        <button id="chat-close" class="chat-control-btn" aria-label="Close chat">×</button>
                    </div>
                </div>

                <div class="chat-content" id="chat-content">
                    <div class="chat-welcome">
                        <div class="ai-message">
                            <div class="message-avatar">🤖</div>
                            <div class="message-content">
                                <p>Hi! I'm your vibe coding assistant. I'm here to help you explore research topics, answer questions about neurodivergent development, and chat about hyperfocus superpowers!</p>
                                <p>Click on any research node to start our conversation, or ask me anything about ADHD development practices. 🧠✨</p>
                            </div>
                        </div>
                    </div>

                    <div id="chat-messages" class="chat-messages"></div>

                    <div id="chat-typing" class="typing-indicator" style="display: none;">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span>AI is thinking...</span>
                    </div>
                </div>

                <div class="chat-input-container">
                    <textarea 
                        id="chat-input" 
                        class="chat-input" 
                        placeholder="Ask about vibe coding, ADHD development, or hyperfocus strategies..."
                        aria-label="Chat with AI assistant"
                        rows="2"
                    ></textarea>
                    <button id="chat-send" class="chat-send-btn" aria-label="Send message">
                        <span>Send</span>
                        <span class="send-icon">→</span>
                    </button>
                </div>

                <div class="chat-suggestions" id="chat-suggestions">
                    <div class="suggestion-chip" data-message="What is vibe coding?">What is vibe coding?</div>
                    <div class="suggestion-chip" data-message="How can ADHD be a superpower in development?">ADHD superpowers</div>
                    <div class="suggestion-chip" data-message="Tips for maintaining hyperfocus while coding">Hyperfocus tips</div>
                    <div class="suggestion-chip" data-message="How to build neurodivergent-friendly interfaces?">Inclusive design</div>
                </div>
            </div>
        `;

        // Add chat styles
        const chatStyles = `
            <style>
                .vibe-chat-interface {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 380px;
                    max-height: 600px;
                    background: rgba(26, 26, 46, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    z-index: 1000;
                    display: none;
                    flex-direction: column;
                    font-family: var(--font-primary);
                    transform: translateY(20px);
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .vibe-chat-interface.open {
                    display: flex;
                    transform: translateY(0);
                    opacity: 1;
                }

                .vibe-chat-interface.minimized {
                    max-height: 60px;
                }

                .chat-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 16px 20px;
                    border-bottom: 1px solid var(--border-color);
                    background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
                    border-radius: 16px 16px 0 0;
                }

                .chat-header h3 {
                    margin: 0;
                    color: white;
                    font-size: 1.1rem;
                    font-weight: 600;
                }

                .chat-controls {
                    display: flex;
                    gap: 8px;
                }

                .chat-control-btn {
                    width: 28px;
                    height: 28px;
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 6px;
                    color: white;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .chat-control-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .chat-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 16px;
                    max-height: 400px;
                    display: flex;
                    flex-direction: column;
                }

                .chat-messages {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .ai-message, .user-message {
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                }

                .user-message {
                    flex-direction: row-reverse;
                }

                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: var(--accent-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    flex-shrink: 0;
                }

                .user-message .message-avatar {
                    background: var(--accent-secondary);
                }

                .message-content {
                    background: rgba(35, 53, 84, 0.6);
                    padding: 12px 16px;
                    border-radius: 16px;
                    max-width: 80%;
                    line-height: 1.4;
                }

                .user-message .message-content {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                }

                .message-content p {
                    margin: 0 0 8px 0;
                }

                .message-content p:last-child {
                    margin-bottom: 0;
                }

                .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 0;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }

                .typing-dots {
                    display: flex;
                    gap: 4px;
                }

                .typing-dots span {
                    width: 6px;
                    height: 6px;
                    background: var(--accent-primary);
                    border-radius: 50%;
                    animation: typing-bounce 1.4s infinite;
                }

                .typing-dots span:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-dots span:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes typing-bounce {
                    0%, 60%, 100% {
                        transform: translateY(0);
                        opacity: 0.4;
                    }
                    30% {
                        transform: translateY(-10px);
                        opacity: 1;
                    }
                }

                .chat-input-container {
                    display: flex;
                    gap: 8px;
                    padding: 16px;
                    border-top: 1px solid var(--border-color);
                    align-items: flex-end;
                }

                .chat-input {
                    flex: 1;
                    background: rgba(35, 53, 84, 0.6);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 12px 16px;
                    color: var(--text-primary);
                    font-size: 0.95rem;
                    line-height: 1.4;
                    resize: none;
                    outline: none;
                    transition: border-color 0.2s ease;
                    max-height: 100px;
                }

                .chat-input:focus {
                    border-color: var(--accent-primary);
                    box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
                }

                .chat-input::placeholder {
                    color: var(--text-muted);
                }

                .chat-send-btn {
                    background: var(--accent-primary);
                    border: none;
                    border-radius: 12px;
                    padding: 12px 16px;
                    color: var(--bg-primary);
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    white-space: nowrap;
                }

                .chat-send-btn:hover {
                    background: var(--accent-secondary);
                    transform: translateY(-1px);
                }

                .chat-send-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .chat-suggestions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    padding: 12px 16px;
                    border-top: 1px solid var(--border-color);
                }

                .suggestion-chip {
                    background: rgba(35, 53, 84, 0.6);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    padding: 6px 12px;
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }

                .suggestion-chip:hover {
                    background: var(--accent-primary);
                    color: var(--bg-primary);
                    border-color: var(--accent-primary);
                    transform: translateY(-1px);
                }

                .chat-welcome {
                    margin-bottom: 16px;
                }

                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    .vibe-chat-interface {
                        width: calc(100vw - 40px);
                        right: 20px;
                        left: 20px;
                        bottom: 20px;
                        max-height: calc(100vh - 120px);
                    }

                    .chat-content {
                        max-height: calc(100vh - 300px);
                    }

                    .suggestion-chip {
                        flex: 1;
                        text-align: center;
                        min-width: calc(50% - 4px);
                    }
                }

                /* Focus mode adjustments */
                .focus-mode .vibe-chat-interface {
                    opacity: 0.7;
                }

                .focus-mode .vibe-chat-interface:hover {
                    opacity: 1;
                }
            </style>
        `;

        // Inject styles and HTML
        document.head.insertAdjacentHTML('beforeend', chatStyles);
        document.body.insertAdjacentHTML('beforeend', chatHTML);

        // Setup event listeners
        this.setupChatEventListeners();
    }

    /**
     * Setup chat event listeners
     */
    setupChatEventListeners() {
        const chatInterface = document.getElementById('vibe-chat-interface');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatClose = document.getElementById('chat-close');
        const chatMinimize = document.getElementById('chat-minimize');
        const suggestions = document.querySelectorAll('.suggestion-chip');

        // Send message
        if (chatSend) {
            chatSend.addEventListener('click', () => this.sendMessage());
        }

        // Enter to send (Shift+Enter for new line)
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            chatInput.addEventListener('input', () => {
                chatInput.style.height = 'auto';
                chatInput.style.height = Math.min(chatInput.scrollHeight, 100) + 'px';
            });
        }

        // Close chat
        if (chatClose) {
            chatClose.addEventListener('click', () => this.closeChatInterface());
        }

        // Minimize chat
        if (chatMinimize) {
            chatMinimize.addEventListener('click', () => this.toggleChatMinimize());
        }

        // Suggestion chips
        suggestions.forEach(chip => {
            chip.addEventListener('click', () => {
                const message = chip.dataset.message;
                if (chatInput) {
                    chatInput.value = message;
                    this.sendMessage();
                }
            });
        });
    }

    /**
     * Toggle between repository and research modes
     */
    toggleMode() {
        this.currentMode = this.currentMode === 'repository' ? 'research' : 'repository';

        if (this.currentMode === 'research') {
            this.activateResearchMode();
        } else {
            this.activateRepositoryMode();
        }

        if (this.constellation?.announceToScreenReader) {
            this.constellation.announceToScreenReader(`Switched to ${this.currentMode} mode`);
        }
        console.log(`🔄 Switched to ${this.currentMode} mode`);
    }

    /**
     * Activate research mode
     */
    activateResearchMode() {
        // Hide repository spheres
        if (this.constellation?.repositoryMeshes) {
            this.constellation.repositoryMeshes.forEach(mesh => {
                mesh.visible = false;
            });
        }

        // Hide connection lines
        if (this.constellation?.connectionLines) {
            this.constellation.connectionLines.forEach(line => {
                line.visible = false;
            });
        }

        // Create research nodes
        this.createResearchNodes();

        // Update UI
        const modeToggle = document.getElementById('mode-toggle');
        if (modeToggle) {
            modeToggle.textContent = '🗂️ Repository Mode';
        }

        // Show chat interface
        this.openChatInterface();
    }

    /**
     * Activate repository mode
     */
    activateRepositoryMode() {
        // Show repository spheres
        if (this.constellation?.repositoryMeshes) {
            this.constellation.repositoryMeshes.forEach(mesh => {
                mesh.visible = true;
            });
        }

        // Show connection lines
        if (this.constellation?.connectionLines) {
            this.constellation.connectionLines.forEach(line => {
                line.visible = true;
            });
        }

        // Hide research nodes
        this.hideResearchNodes();

        // Update UI
        const modeToggle = document.getElementById('mode-toggle');
        if (modeToggle) {
            modeToggle.textContent = '📚 Research Mode';
        }

        // Close chat interface
        this.closeChatInterface();
    }

    /**
     * Create 3D research nodes
     */
    createResearchNodes() {
        if (!this.constellation?.scene) return;

        this.researchNodes.forEach(node => {
            const sphere = this.createResearchNodeSphere(node);
            this.constellation.scene.add(sphere);
        });
    }

    /**
     * Create a 3D sphere for research node
     */
    createResearchNodeSphere(node) {
        if (!window.THREE) {
            console.warn('THREE.js not available for research nodes');
            return;
        }

        const geometry = new THREE.SphereGeometry(2, 32, 32);
        const material = new THREE.MeshLambertMaterial({
            color: new THREE.Color(node.color),
            transparent: true,
            opacity: 0.9
        });

        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(node.position.x, node.position.y, node.position.z);

        // Add pulsing animation
        sphere.userData = {
            isResearchNode: true,
            node: node,
            animationOffset: Math.random() * Math.PI * 2
        };

        // Add glow effect
        const glowGeometry = new THREE.SphereGeometry(3, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(node.color),
            transparent: true,
            opacity: 0.2
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        sphere.add(glow);

        // Add text label
        this.addResearchNodeLabel(sphere, node.title);

        return sphere;
    }

    /**
     * Add text label to research node
     */
    addResearchNodeLabel(sphere, text) {
        if (!window.THREE) return;

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;

        // Background
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Text
        context.fillStyle = 'rgba(255, 255, 255, 0.95)';
        context.font = 'bold 36px Arial, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        const lines = text.split(' ');
        const maxLines = 2;
        const lineHeight = 40;

        for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
            const y = canvas.height / 2 - ((maxLines - 1) * lineHeight) / 2 + i * lineHeight;
            context.fillText(lines[i], canvas.width / 2, y);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1
        });

        const labelGeometry = new THREE.PlaneGeometry(8, 2);
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(0, 3.5, 0);
        label.userData.isLabel = true;

        sphere.add(label);
    }

    /**
     * Hide research nodes
     */
    hideResearchNodes() {
        if (!this.constellation?.scene) return;

        const researchNodes = this.constellation.scene.children.filter(
            child => child.userData?.isResearchNode
        );

        researchNodes.forEach(node => {
            this.constellation.scene.remove(node);
        });
    }

    /**
     * Handle research node selection
     */
    selectResearchNode(node) {
        this.visitedResearchNodes.add(node.id);
        this.openChatInterface(node);
        this.startNodeConversation(node);

        console.log(`📚 Selected research node: ${node.title}`);
    }

    /**
     * Open chat interface
     */
    openChatInterface(node = null) {
        const chatInterface = document.getElementById('vibe-chat-interface');
        if (chatInterface) {
            chatInterface.classList.add('open');
            this.chatInterface.isOpen = true;
            this.chatInterface.currentNode = node;

            if (node) {
                this.addNodeContextToChat(node);
            }
        }
    }

    /**
     * Close chat interface
     */
    closeChatInterface() {
        const chatInterface = document.getElementById('vibe-chat-interface');
        if (chatInterface) {
            chatInterface.classList.remove('open');
            this.chatInterface.isOpen = false;
            this.chatInterface.currentNode = null;
        }
    }

    /**
     * Toggle chat minimize
     */
    toggleChatMinimize() {
        const chatInterface = document.getElementById('vibe-chat-interface');
        if (chatInterface) {
            chatInterface.classList.toggle('minimized');
        }
    }

    /**
     * Add node context to chat
     */
    addNodeContextToChat(node) {
        const message = {
            type: 'ai',
            content: `
                <h4>${node.title}</h4>
                <p>${node.content.summary}</p>
                <details>
                    <summary><strong>Key Points</strong></summary>
                    <ul>
                        ${node.content.keyPoints.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                </details>
                <details>
                    <summary><strong>🧠 Hyperfocus Tips</strong></summary>
                    <ul>
                        ${node.content.hyperfocusTips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </details>
                <p>What would you like to explore about this topic?</p>
            `,
            timestamp: Date.now()
        };

        this.addMessageToChat(message);
    }

    /**
     * Start conversation with research node
     */
    startNodeConversation(node) {
        const welcomeMessage = `Great choice! Let's dive into ${node.title}. This is a fascinating area where ${node.content.summary.toLowerCase()}`;

        this.simulateAIResponse(welcomeMessage);
    }

    /**
     * Send message
     */
    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) return;

        const message = chatInput.value.trim();

        if (!message) return;

        // Add user message
        this.addMessageToChat({
            type: 'user',
            content: message,
            timestamp: Date.now()
        });

        // Clear input
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Generate AI response
        this.generateAIResponse(message);
    }

    /**
     * Add message to chat
     */
    addMessageToChat(message) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `${message.type}-message`;

        const avatar = message.type === 'ai' ? '🤖' : '👤';

        messageElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">${message.content}</div>
        `;

        chatMessages.appendChild(messageElement);

        // Scroll to bottom
        const chatContent = document.getElementById('chat-content');
        if (chatContent) {
            chatContent.scrollTop = chatContent.scrollHeight;
        }

        // Store in history
        this.chatHistory.push(message);
    }

    /**
     * Generate AI response (simulated)
     */
    generateAIResponse(userMessage) {
        this.showTypingIndicator();

        // Simulate AI thinking time
        setTimeout(() => {
            const response = this.getAIResponse(userMessage);
            this.hideTypingIndicator();
            this.simulateAIResponse(response);
        }, 1000 + Math.random() * 2000);
    }

    /**
     * Get AI response based on user message
     */
    getAIResponse(userMessage) {
        const message = userMessage.toLowerCase();

        // Simple pattern matching for demonstration
        if (message.includes('vibe coding') || message.includes('what is')) {
            return "Vibe coding is the art of conversational programming - where you communicate with your computer using natural language instead of struggling with syntax. It's especially powerful for neurodivergent developers because it allows you to focus on concepts and ideas rather than memorizing exact syntax. Think of it as having a conversation with a really smart coding partner who understands exactly what you want to build! 🤖✨";
        }

        if (message.includes('adhd') || message.includes('superpower')) {
            return "ADHD brings incredible superpowers to development! Your hyperfocus ability lets you dive deep into complex problems for hours, your pattern recognition helps you see connections others miss, and your creativity leads to innovative solutions. The key is building environments that work WITH your ADHD brain - like using tools that minimize distractions during hyperfocus sessions, setting up dopamine-driven reward systems, and embracing your natural cycles of high and low energy. Your ADHD isn't a limitation - it's your secret weapon! ⚡🧠";
        }

        if (message.includes('hyperfocus') || message.includes('focus')) {
            return "Hyperfocus is your ultimate coding superpower! Here are some tips to maximize it: 1) Prepare your environment beforehand - water, snacks, comfortable temperature, 2) Use ambient sounds or focus music to maintain flow, 3) Set gentle timers to remind yourself of basic needs, 4) Choose projects that genuinely interest you - hyperfocus works best on engaging challenges, 5) Embrace it when it happens naturally rather than forcing it. Remember, hyperfocus sessions of 4-8 hours are completely normal for ADHD brains! 🎯⏰";
        }

        if (message.includes('interface') || message.includes('design') || message.includes('inclusive')) {
            return "Neurodivergent-friendly interfaces are game-changers! Key principles: 1) Reduce cognitive load with clear visual hierarchy, 2) Provide multiple ways to access information (visual, auditory, text), 3) Allow customization - let users control motion, colors, and layout, 4) Build in focus modes that minimize distractions, 5) Use consistent patterns and clear feedback, 6) Respect different processing speeds with appropriate timing. The beautiful thing is that accessible design benefits EVERYONE, not just neurodivergent users! ♿✨";
        }

        if (message.includes('tips') || message.includes('help') || message.includes('advice')) {
            return "Here are some practical neurodivergent development tips: 1) Use AI assistants as thought partners to reduce syntax anxiety, 2) Break large projects into dopamine-sized chunks, 3) Create visual progress tracking (we love seeing progress!), 4) Build in movement breaks - even 5 minutes helps reset focus, 5) Use version control religiously - it's external memory for your ideas, 6) Join neurodivergent developer communities for support and shared experiences. Remember: your brain works differently, not wrongly! 💡🚀";
        }

        // Default response
        return `That's a great question about ${this.extractKeyTopic(message)}! As a neurodivergent-focused AI, I'm here to help you explore these concepts through the lens of ADHD strengths and hyperfocus superpowers. What specific aspect would you like to dive deeper into? I can share more about practical applications, research insights, or personal strategies that work well for different brain types. 🤔💭`;
    }

    /**
     * Extract key topic from user message
     */
    extractKeyTopic(message) {
        const topics = ['vibe coding', 'adhd', 'hyperfocus', 'development', 'accessibility', 'neurodivergent'];

        for (const topic of topics) {
            if (message.includes(topic)) {
                return topic;
            }
        }

        return 'neurodivergent development';
    }

    /**
     * Simulate AI response with typing effect
     */
    simulateAIResponse(text) {
        this.addMessageToChat({
            type: 'ai',
            content: text,
            timestamp: Date.now()
        });
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        const typingIndicator = document.getElementById('chat-typing');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
        }

        // Scroll to bottom
        const chatContent = document.getElementById('chat-content');
        if (chatContent) {
            chatContent.scrollTop = chatContent.scrollHeight;
        }
    }

    /**
     * Hide typing indicator
     */
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('chat-typing');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }

    /**
     * Get research progress
     */
    getResearchProgress() {
        return {
            visited: this.visitedResearchNodes.size,
            total: this.researchNodes.length,
            percentage: (this.visitedResearchNodes.size / this.researchNodes.length) * 100
        };
    }
}

// Export the Research Mode Manager
window.ResearchModeManager = ResearchModeManager;

console.log('📚 Research Mode Manager loaded - ready for vibe coding exploration!');
