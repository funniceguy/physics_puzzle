export class LeaderboardManager {
    constructor() {
        this.storageKey = 'physicsGameLeaderboard';
        this.maxScores = 10;
    }

    saveScore(name, score, level) {
        const scores = this.getTopScores(100); // Get all scores first

        scores.push({
            name: name.trim() || 'Anonymous',
            score: score,
            level: level,
            date: new Date().toISOString()
        });

        // Sort by score (descending)
        scores.sort((a, b) => b.score - a.score);

        // Keep only top scores
        const topScores = scores.slice(0, this.maxScores);

        localStorage.setItem(this.storageKey, JSON.stringify(topScores));
        return topScores;
    }

    getTopScores(limit = 10) {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return [];

            const scores = JSON.parse(data);
            return scores.slice(0, limit);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
            return [];
        }
    }

    isHighScore(score) {
        const scores = this.getTopScores();
        if (scores.length < this.maxScores) return true;
        return score > scores[scores.length - 1].score;
    }

    clearScores() {
        localStorage.removeItem(this.storageKey);
    }
}
