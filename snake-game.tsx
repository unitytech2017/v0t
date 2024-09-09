'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"

// Define types
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = [number, number]

const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SNAKE: Position[] = [[5, 5]]
const INITIAL_FOOD: Position = [10, 10]
const INITIAL_DIRECTION: Direction = 'RIGHT'
const GAME_SPEED = 100

export default function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)

  const moveSnake = useCallback(() => {
    const newSnake = [...snake]
    const [headY, headX] = newSnake[0]

    switch (direction) {
      case 'UP':
        newSnake.unshift([headY - 1, headX])
        break
      case 'DOWN':
        newSnake.unshift([headY + 1, headX])
        break
      case 'LEFT':
        newSnake.unshift([headY, headX - 1])
        break
      case 'RIGHT':
        newSnake.unshift([headY, headX + 1])
        break
    }

    if (headY === food[0] && headX === food[1]) {
      setFood(getRandomPosition())
      setScore(prevScore => prevScore + 1)
    } else {
      newSnake.pop()
    }

    setSnake(newSnake)
  }, [snake, direction, food])

  const checkCollision = useCallback(() => {
    const [headY, headX] = snake[0]
    if (
      headY < 0 ||
      headY >= GRID_SIZE ||
      headX < 0 ||
      headX >= GRID_SIZE ||
      snake.slice(1).some(([y, x]) => y === headY && x === headX)
    ) {
      setGameOver(true)
    }
  }, [snake])

  const getRandomPosition = (): Position => {
    return [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE),
    ]
  }

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        setDirection('UP')
        break
      case 'ArrowDown':
        setDirection('DOWN')
        break
      case 'ArrowLeft':
        setDirection('LEFT')
        break
      case 'ArrowRight':
        setDirection('RIGHT')
        break
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  useEffect(() => {
    if (!gameOver) {
      const gameLoop = setInterval(() => {
        moveSnake()
        checkCollision()
      }, GAME_SPEED)
      return () => clearInterval(gameLoop)
    }
  }, [gameOver, moveSnake, checkCollision])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection(INITIAL_DIRECTION)
    setGameOver(false)
    setScore(0)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <div className="mb-4">Score: {score}</div>
      <div
        className="grid bg-white border border-gray-300"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE,
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const y = Math.floor(index / GRID_SIZE)
          const x = index % GRID_SIZE
          const isSnake = snake.some(([sy, sx]) => sy === y && sx === x)
          const isFood = food[0] === y && food[1] === x

          return (
            <div
              key={index}
              className={`${
                isSnake
                  ? 'bg-green-500'
                  : isFood
                  ? 'bg-red-500'
                  : 'bg-gray-100'
              }`}
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
            />
          )
        })}
      </div>
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-xl font-bold mb-2">Game Over!</p>
          <Button onClick={resetGame}>Play Again</Button>
        </div>
      )}
      <div className="mt-4 text-center">
        <p>Use arrow keys to control the snake</p>
      </div>
    </div>
  )
}