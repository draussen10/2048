

export class Tile {
	constructor(gridElement) {
		this.tileElement = document.createElement("div")
		this.tileElement.classList.add("tile")
		this.tileText = document.createElement("div")
		this.tileText.classList.add("tile-text")
		this.tileElement.append(this.tileText)
		this.setValue(Math.random() > 0.5 ? 2 : 4)
		gridElement.append(this.tileElement)
	}

	setXY(x, y) {
		this.x = x
		this.y = y
		this.tileElement.style.setProperty("--x", x)
		this.tileElement.style.setProperty("--y", y)
	}

	setValue(value) {
		this.value = value
		this.tileText.textContent = value
		const bgLightness = 100 - Math.log2(value) * 5;
		this.tileElement.style.setProperty("--bg-lightness", `${bgLightness}%`)
		this.tileElement.style.setProperty("--text-lightness", `${bgLightness < 50 ? 90 : 10}%`)
		this.tileElement.style.setProperty('background',  `url(./static/${value}.jpg)`)
	}

	removeFromDOM() {
		this.tileElement.remove()
	}

	waitForTransitionEnd() {
		return new Promise(resolve => {
			this.tileElement.addEventListener("transitionend", resolve, {once: true})
		})
	}
	waitForAnimationEnd() {
		return new Promise(resolve => {
			this.tileElement.addEventListener("animitionend", resolve, {once: true})
		})
	}
}