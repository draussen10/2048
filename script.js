import { Grid } from "./grid.js"
import {Tile} from "./tile.js";

const gameBoard = document.getElementById("game-board")
const grid = new Grid(gameBoard)

grid.getRandomCell().linkTile(new Tile(gameBoard))
grid.getRandomCell().linkTile(new Tile(gameBoard))
setupInputOnce()

function setupInputOnce() {
	window.addEventListener("keydown", handleInput, {once: true})
}

async function handleInput(e) {
	switch (e.key) {
		case "ArrowUp":
			if(!canMoveUp()) {
				setupInputOnce()
				return
			}
			await moveUp()
			break

		case "ArrowDown":
			if(!canMoveDown()) {
				setupInputOnce()
				return
			}
			await moveDown()
			break

		case "ArrowLeft":
			if(!canMoveLeft()) {
				setupInputOnce()
				return
			}
			await moveLeft()
			break

		case "ArrowRight":
			if(!canMoveRight()) {
				setupInputOnce()
				return
			}
			await moveRight()
			break

		default:
			setupInputOnce()
			return
	}
	const newTile = new Tile(gameBoard)
	grid.getRandomCell().linkTile(newTile)

	if( !canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
		await newTile.waitForAnimationEnd()
		alert('Начни заново')
		location.reload()
	}

	if(grid.cells.some(cell => {
		if(!cell.isEmpty()) {
			return cell.linkedTile.value === 2048
		}
	})) {
		alert('Победа')
		setTimeout(() => {location.reload()}, 1000)
		await newTile.waitForAnimationEnd()



	}

	setupInputOnce()
}

async function moveUp() {
	await slideTiles(grid.cellsGroupedByColumn)
}
async function moveDown() {
	await slideTiles(grid.cellsGroupedByReversedColumn)
}
async function moveLeft() {
	await slideTiles(grid.cellsGroupedByRow)
}
async function moveRight() {
	await slideTiles(grid.cellsGroupedByReversedRow)
}

async function slideTiles(groupedCells) {
	const promises = []
	groupedCells.forEach(group => slideTilesInGroup(group, promises))

	await Promise.all(promises)

	grid.cells.forEach(cell => {
		cell.hasTileForMerge() && cell.mergeTiles()
	})
}

function slideTilesInGroup(group, promises) {
	for (let i = 1; i < group.length; i++) {
		if(group[i].isEmpty()) {
			continue
		}
		const cellWithTile = group[i]

		let targetCell
		let j = i - 1

		while(j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
			targetCell = group[j]
			j--
		}

		if(!targetCell) {
			continue
		}

		promises.push(cellWithTile.linkedTile.waitForTransitionEnd())

		if(targetCell.isEmpty()) {
			targetCell.linkTile(cellWithTile.linkedTile)
		} else {
			targetCell.linkTileForMerge(cellWithTile.linkedTile)
		}

		cellWithTile.unlinkTile()
	}
}

function canMoveUp() {
	return canMove(grid.cellsGroupedByColumn)
}
function canMoveDown() {
	return canMove(grid.cellsGroupedByReversedColumn)
}
function canMoveLeft() {
	return canMove(grid.cellsGroupedByRow)
}
function canMoveRight() {
	return canMove(grid.cellsGroupedByReversedRow)
}

function canMove(groupedCells) {
	return groupedCells.some(group => canMoveInGroup(group))
}

function canMoveInGroup(group) {
	return group.some((cell, index) => {
		if(index === 0) {
			return false
		}
		if(cell.isEmpty()) {
			return false
		}

		const targetCell = group[index - 1]
		return targetCell.canAccept(cell.linkedTile)
	})
}

let startX,startY,endX,endY;    // Определение четырех переменных для хранения значений по оси X и оси Y при касании и при выходе из касания
document.addEventListener("touchstart",function(event){  // Связывание события слушателя при начале касания пальцем
	startX = event.touches[0].pageX;
	startY = event.touches[0].pageY;
})

document.addEventListener("touchend",async function(event){    // Привязка события прослушивания, когда палец касается и уходит
	endX = event.changedTouches[0].pageX;
	endY = event.changedTouches[0].pageY;

	const x = endX - startX;
	const y = endY - startY;

	const absX = Math.abs(x) > Math.abs(y);
	const absY = Math.abs(y) > Math.abs(x);
	if (x > 0 && absX) {
		await moveRight()
	}
	else if (x < 0 && absX) {
		await moveLeft()
	}
	else if (y > 0 && absY) {
		await moveDown()
	}
	else if (y < 0 && absY) {
		await moveUp()
	}

})