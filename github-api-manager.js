/**
 * 🔗 GitHub API Integration with Smart Caching
 * Real-time repository data with rate limit respect
 */

class GitHubAPIManager {
    constructor() {
        this.baseURL = 'https://api.github.com';
        this.username = 'welshDog';
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        this.rateLimitRemaining = 60;
        this.rateLimitReset = Date.now();
        this.requestQueue = [];
        this.isProcessingQueue = false;

        // Initialize IndexedDB for persistent caching
        this.initializeCache();
    }

    /**
     * Initialize IndexedDB for persistent caching
     */
    async initializeCache() {
        try {
            this.db = await this.openIndexedDB();
            console.log('✅ IndexedDB cache initialized');
        } catch (error) {
            console.warn('⚠️ IndexedDB not available, using memory cache only');
            this.db = null;
        }
    }

    openIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('ConstellationCache', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('repositories')) {
                    const store = db.createObjectStore('repositories', { keyPath: 'name' });
                    store.createIndex('lastUpdated', 'lastUpdated', { unique: false });
                }
            };
        });
    }

    /**
     * Get cached data from IndexedDB
     */
    async getCachedData(key) {
        if (!this.db) return null;

        try {
            const transaction = this.db.transaction(['repositories'], 'readonly');
            const store = transaction.objectStore('repositories');
            const request = store.get(key);

            return new Promise((resolve) => {
                request.onsuccess = () => {
                    const result = request.result;
                    if (result && Date.now() - result.timestamp < this.cacheExpiry) {
                        resolve(result.data);
                    } else {
                        resolve(null);
                    }
                };
                request.onerror = () => resolve(null);
            });
        } catch (error) {
            console.warn('Cache read error:', error);
            return null;
        }
    }

    /**
     * Store data in IndexedDB cache
     */
    async setCachedData(key, data) {
        if (!this.db) return;

        try {
            const transaction = this.db.transaction(['repositories'], 'readwrite');
            const store = transaction.objectStore('repositories');

            await store.put({
                name: key,
                data: data,
                timestamp: Date.now()
            });
        } catch (error) {
            console.warn('Cache write error:', error);
        }
    }

    /**
     * Fetch user repositories with smart caching
     */
    async fetchUserRepositories() {
        const cacheKey = `user_repos_${this.username}`;

        // Try cache first
        let cachedData = this.cache.get(cacheKey);
        if (cachedData && Date.now() - cachedData.timestamp < this.cacheExpiry) {
            console.log('📦 Using cached repository data');
            return cachedData.data;
        }

        // Try IndexedDB cache
        cachedData = await this.getCachedData(cacheKey);
        if (cachedData) {
            console.log('💾 Using IndexedDB cached repository data');
            this.cache.set(cacheKey, { data: cachedData, timestamp: Date.now() });
            return cachedData;
        }

        // Fetch fresh data
        try {
            const repos = await this.makeAPIRequest(`/users/${this.username}/repos?per_page=100&sort=updated`);

            // Transform API data to our format
            const transformedRepos = this.transformRepositoryData(repos);

            // Cache the results
            const cacheData = { data: transformedRepos, timestamp: Date.now() };
            this.cache.set(cacheKey, cacheData);
            await this.setCachedData(cacheKey, transformedRepos);

            console.log(`🔄 Fetched ${transformedRepos.length} repositories from GitHub API`);
            return transformedRepos;

        } catch (error) {
            console.error('❌ Failed to fetch repositories:', error);

            // Return fallback mock data if API fails
            return this.getFallbackRepositories();
        }
    }

    /**
     * Transform GitHub API data to constellation format
     */
    transformRepositoryData(repos) {
        const categories = {
            'hyperfocus': { key: 'core', color: '#00d9ff' },
            'constellation': { key: 'visual', color: '#7c3aed' },
            'adhd': { key: 'brain', color: '#06ffa5' },
            'social': { key: 'social', color: '#f59e0b' },
            'accessibility': { key: 'accessibility', color: '#10b981' },
            'creative': { key: 'creative', color: '#ef4444' },
            'tool': { key: 'dev-tools', color: '#8b5cf6' },
            'portal': { key: 'portal', color: '#ec4899' },
            'raspberry': { key: 'hardware', color: '#6366f1' },
            'research': { key: 'research', color: '#14b8a6' }
        };

        return repos.map((repo, index) => {
            // Determine category based on name, description, and topics
            let category = 'dev-tools'; // default
            const searchText = `${repo.name} ${repo.description || ''} ${(repo.topics || []).join(' ')}`.toLowerCase();

            for (const [keyword, categoryInfo] of Object.entries(categories)) {
                if (searchText.includes(keyword)) {
                    category = categoryInfo.key;
                    break;
                }
            }

            const categoryInfo = Object.values(categories).find(c => c.key === category) || categories.tool;

            return {
                id: repo.id,
                name: repo.name,
                description: repo.description || `Advanced ${category} project with neurodivergent-friendly design.`,
                category: category,
                stars: repo.stargazers_count || 0,
                forks: repo.forks_count || 0,
                language: repo.language || 'Multiple',
                updated: new Date(repo.updated_at),
                url: repo.html_url,
                demo_url: repo.homepage || null,
                color: categoryInfo.color,
                topics: repo.topics || [],
                position: {
                    x: (Math.random() - 0.5) * 80,
                    y: (Math.random() - 0.5) * 60,
                    z: (Math.random() - 0.5) * 40
                }
            };
        }).filter(repo => !repo.name.startsWith('.') && repo.name !== this.username);
    }

    /**
     * Make API request with rate limiting
     */
    async makeAPIRequest(endpoint) {
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ endpoint, resolve, reject });
            this.processQueue();
        });
    }

    /**
     * Process API request queue with rate limiting
     */
    async processQueue() {
        if (this.isProcessingQueue || this.requestQueue.length === 0) return;

        this.isProcessingQueue = true;

        while (this.requestQueue.length > 0) {
            // Check rate limit
            if (this.rateLimitRemaining <= 1 && Date.now() < this.rateLimitReset) {
                const waitTime = this.rateLimitReset - Date.now();
                console.log(`⏳ Rate limit reached, waiting ${waitTime}ms`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }

            const { endpoint, resolve, reject } = this.requestQueue.shift();

            try {
                const response = await fetch(this.baseURL + endpoint, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'User-Agent': 'Ultimate-Hyperfocus-Constellation/1.0'
                    }
                });

                // Update rate limit info
                this.rateLimitRemaining = parseInt(response.headers.get('X-RateLimit-Remaining')) || 0;
                this.rateLimitReset = parseInt(response.headers.get('X-RateLimit-Reset')) * 1000 || Date.now();

                if (!response.ok) {
                    const errorBody = await response.json().catch(() => ({ message: 'No error body.' }));
                    const errorMessage = `GitHub API error: ${response.status} ${response.statusText}. Message: ${errorBody.message}`;
                    console.error(errorMessage);
                    reject(new Error(errorMessage));
                    return; // Important to exit after rejecting
                }

                const data = await response.json();
                resolve(data);

                // Small delay to be respectful
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                reject(error);
            }
        }

        this.isProcessingQueue = false;
    }

    /**
     * Get repository details with enhanced data
     */
    async getRepositoryDetails(repoName) {
        const cacheKey = `repo_details_${repoName}`;

        // Check cache
        let cachedData = this.cache.get(cacheKey);
        if (cachedData && Date.now() - cachedData.timestamp < this.cacheExpiry) {
            return cachedData.data;
        }

        try {
            const [repo, languages, commits] = await Promise.all([
                this.makeAPIRequest(`/repos/${this.username}/${repoName}`),
                this.makeAPIRequest(`/repos/${this.username}/${repoName}/languages`),
                this.makeAPIRequest(`/repos/${this.username}/${repoName}/commits?per_page=1`)
            ]);

            const details = {
                ...repo,
                languages: languages,
                lastCommit: commits[0] || null,
                activity: this.calculateActivityScore(repo, commits[0])
            };

            // Cache the results
            const cacheData = { data: details, timestamp: Date.now() };
            this.cache.set(cacheKey, cacheData);

            return details;

        } catch (error) {
            console.warn(`⚠️ Could not fetch details for ${repoName}:`, error);
            return null;
        }
    }

    /**
     * Calculate repository activity score
     */
    calculateActivityScore(repo, lastCommit) {
        const now = Date.now();
        const updated = new Date(repo.updated_at).getTime();
        const daysSinceUpdate = (now - updated) / (1000 * 60 * 60 * 24);

        let score = 0;

        // Recent activity bonus
        if (daysSinceUpdate < 7) score += 50;
        else if (daysSinceUpdate < 30) score += 30;
        else if (daysSinceUpdate < 90) score += 10;

        // Stars and forks contribution
        score += Math.min(repo.stargazers_count * 2, 30);
        score += Math.min(repo.forks_count * 3, 20);

        // Language diversity (if we have topics)
        if (repo.topics && repo.topics.length > 0) {
            score += Math.min(repo.topics.length * 5, 25);
        }

        return Math.min(score, 100);
    }

    /**
     * Fallback repository data if API is unavailable
     */
 getFallbackRepositories() {
    return [
        {
            id: 1,
            name: 'ULTIMATE-HYPERFOCUS-CONSTELLATION',
            description: 'The world\'s most advanced 3D repository visualization designed for neurodivergent minds',
            category: 'core',
            stars: 0,
            forks: 0,
            language: 'JavaScript',
            updated: new Date(),
            url: 'https://github.com/welshDog/ULTIMATE-HYPERFOCUS-CONSTELLATION',
            color: '#00d9ff',
            position: { x: 0, y: 0, z: 0 }
        },
        // Add more fallback repos as needed
    ];
    }

    /**
     * Get rate limit status
     */
    getRateLimitStatus() {
        return {
            remaining: this.rateLimitRemaining,
            reset: new Date(this.rateLimitReset),
            waitTime: Math.max(0, this.rateLimitReset - Date.now())
        };
    }
}

// Export the GitHub API manager
window.GitHubAPIManager = GitHubAPIManager;
