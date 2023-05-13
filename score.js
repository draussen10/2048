export class Score {
	constructor(grid) {
		this.grid = grid
		this.current = 0
		this.best = +localStorage.getItem('best') || 0

		this.$currentScore = document.getElementById('current')
		this.$bestScore = document.getElementById('best')
		this.$bestScore.textContent = this.best
	}

	updateCurrentScore() {
		this.current = this.grid.scoreCells()
		this.$currentScore.textContent = this.current

		if (this.current > this.best) {
			this.updateBestScore()
		}
	}
	updateBestScore() {
		this.best = this.current
		this.$bestScore.textContent = this.best
		localStorage.setItem('best', this.best)
	}
}