// ====================================
// STORY ENGINE - CYOA System
// ====================================

class StoryEngine {
    constructor() {
        this.storyData = null;
        this.currentChapter = null;
        this.gameState = {
            variables: {},
            currentChapterId: null,
            history: [],
            playCount: 0
        };
        this.autoSave = true;
        this.init();
    }

    async init() {
        try {
            await this.loadStoryData();
            this.loadGameState();
            this.setupEventListeners();
            this.startStory();
        } catch (error) {
            console.error('Failed to initialize story:', error);
            this.showError('Failed to load story data. Please refresh the page.');
        }
    }

    async loadStoryData() {
        const response = await fetch('story-data.json');
        if (!response.ok) {
            throw new Error('Failed to load story data');
        }
        this.storyData = await response.json();
        
        // Set story title and description
        document.getElementById('storyTitle').textContent = this.storyData.title;
        document.getElementById('storyDescription').textContent = this.storyData.description;
    }

    loadGameState() {
        const savedState = localStorage.getItem('raven-crow-save');
        if (savedState) {
            const parsed = JSON.parse(savedState);
            // Ask user if they want to continue
            if (confirm('Continue from where you left off?')) {
                this.gameState = parsed;
                return;
            }
        }
        // Initialize new game
        this.gameState = {
            variables: { ...this.storyData.variables },
            currentChapterId: this.storyData.startChapter,
            history: [],
            playCount: 0
        };
    }

    saveGameState() {
        if (this.autoSave) {
            localStorage.setItem('raven-crow-save', JSON.stringify(this.gameState));
            this.showSaveIndicator();
        }
    }

    startStory() {
        const startChapterId = this.gameState.currentChapterId || this.storyData.startChapter;
        this.loadChapter(startChapterId);
    }

    loadChapter(chapterId) {
        const chapter = this.storyData.chapters[chapterId];
        if (!chapter) {
            console.error('Chapter not found:', chapterId);
            this.showError('Chapter not found. This might be under development.');
            return;
        }

        this.currentChapter = chapter;
        this.gameState.currentChapterId = chapterId;
        
        // Add to history
        this.gameState.history.push(chapterId);
        
        // Render chapter
        this.renderChapter();
        
        // Update UI
        this.updateUI();
        
        // Auto-save
        this.saveGameState();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    renderChapter() {
        const chapter = this.currentChapter;
        
        // Render title
        document.getElementById('chapterTitle').textContent = chapter.title;
        
        // Render content
        const contentDiv = document.getElementById('chapterContent');
        contentDiv.innerHTML = '';
        
        chapter.content.forEach(paragraph => {
            const p = document.createElement('p');
            p.innerHTML = this.parseMarkdown(paragraph);
            contentDiv.appendChild(p);
        });
        
        // Render choices
        const choicesDiv = document.getElementById('chapterChoices');
        choicesDiv.innerHTML = '';
        
        if (chapter.choices && chapter.choices.length > 0) {
            chapter.choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.className = 'choice-btn';
                button.innerHTML = `
                    <span class="choice-number">${index + 1}</span>
                    <span class="choice-text">${choice.text}</span>
                    ${choice.effects ? '<span class="choice-indicator">•</span>' : ''}
                `;
                button.addEventListener('click', () => this.makeChoice(choice));
                choicesDiv.appendChild(button);
            });
        } else {
            // End of story branch
            const endMessage = document.createElement('div');
            endMessage.className = 'story-end';
            endMessage.innerHTML = `
                <h3>End of Chapter</h3>
                <p>This storyline is still under development. More chapters coming soon!</p>
                <button class="btn btn-primary" onclick="location.href='/stories.html'">Return to Stories</button>
            `;
            choicesDiv.appendChild(endMessage);
        }
        
        // Update metadata
        this.updateMetadata();
    }

    makeChoice(choice) {
        // Apply effects
        if (choice.effects) {
            Object.keys(choice.effects).forEach(key => {
                if (key === 'skill_unlock') {
                    if (!this.gameState.variables.skills) {
                        this.gameState.variables.skills = [];
                    }
                    if (!this.gameState.variables.skills.includes(choice.effects[key])) {
                        this.gameState.variables.skills.push(choice.effects[key]);
                    }
                } else {
                    // Handle numeric values
                    if (typeof choice.effects[key] === 'number') {
                        if (this.gameState.variables[key] === undefined) {
                            this.gameState.variables[key] = 0;
                        }
                        this.gameState.variables[key] += choice.effects[key];
                    } else {
                        // Handle string/other values
                        this.gameState.variables[key] = choice.effects[key];
                    }
                }
            });
        }
        
        // Load next chapter
        this.loadChapter(choice.next);
    }

    updateUI() {
        // Update progress bar
        const totalChapters = Object.keys(this.storyData.chapters).length;
        const currentProgress = this.gameState.history.length;
        const progressPercent = Math.min((currentProgress / totalChapters) * 100, 100);
        document.getElementById('progressFill').style.width = `${progressPercent}%`;
        
        // Update relationships
        this.updateRelationships();
        
        // Update skills
        this.updateSkills();
        
        // Update reputation
        this.updateReputation();
    }

    updateMetadata() {
        const metadata = this.currentChapter.metadata || {};
        
        // Update location
        if (metadata.location) {
            const locationEl = document.querySelector('#currentLocation .status-value');
            locationEl.textContent = metadata.location;
        }
        
        // Update mood
        if (metadata.mood) {
            const moodEl = document.querySelector('#currentMood .status-value');
            moodEl.textContent = this.formatMood(metadata.mood);
        }
    }

    updateRelationships() {
        const ravenTrust = this.gameState.variables.ravenTrust || 0;
        const crowTrust = this.gameState.variables.crowTrust || 0;
        
        // Convert to percentage (assuming range of -10 to +10)
        const ravenPercent = ((ravenTrust + 10) / 20) * 100;
        const crowPercent = ((crowTrust + 10) / 20) * 100;
        
        document.getElementById('ravenTrustBar').style.width = `${ravenPercent}%`;
        document.getElementById('crowTrustBar').style.width = `${crowPercent}%`;
    }

    updateSkills() {
        const skillsList = document.getElementById('skillsList');
        const skills = this.gameState.variables.skills || [];
        
        if (skills.length === 0) {
            skillsList.innerHTML = '<span class="empty-state">No skills yet</span>';
        } else {
            skillsList.innerHTML = skills.map(skill => 
                `<span class="skill-badge">${this.formatSkill(skill)}</span>`
            ).join('');
        }
    }

    updateReputation() {
        const reputation = this.gameState.variables.reputation || 'unknown';
        const repDisplay = document.getElementById('reputationDisplay');
        repDisplay.textContent = this.formatReputation(reputation);
        repDisplay.className = `reputation-badge ${reputation}`;
    }

    formatMood(mood) {
        return mood.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatSkill(skill) {
        return skill.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatReputation(rep) {
        return rep.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    parseMarkdown(text) {
        // Simple markdown parsing
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<em>$1</em>');
    }

    showSaveIndicator() {
        const indicator = document.getElementById('saveStatus');
        indicator.style.color = '#00ff88';
        setTimeout(() => {
            indicator.style.color = '#666';
        }, 1000);
    }

    showError(message) {
        const contentDiv = document.getElementById('chapterContent');
        contentDiv.innerHTML = `<div class="error-message">${message}</div>`;
    }

    setupEventListeners() {
        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.saveGameState();
            alert('Game saved!');
        });
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to restart? This will delete your current progress.')) {
                localStorage.removeItem('raven-crow-save');
                location.reload();
            }
        });
        
        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.remove('hidden');
        });
        
        // Close settings
        document.getElementById('closeSettings').addEventListener('click', () => {
            document.getElementById('settingsModal').classList.add('hidden');
        });
        
        // Font size setting
        document.getElementById('fontSize').addEventListener('change', (e) => {
            document.body.className = `story-reader-body font-${e.target.value}`;
        });
        
        // Auto-save setting
        document.getElementById('autoSave').addEventListener('change', (e) => {
            this.autoSave = e.target.checked;
        });
    }
}

// Initialize story when page loads
document.addEventListener('DOMContentLoaded', () => {
    new StoryEngine();
});
