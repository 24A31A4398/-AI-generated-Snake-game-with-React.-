import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    onScoreChange(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  }, [generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver && e.key === ' ') {
        resetGame();
        return;
      }

      if (e.key === ' ' && !gameOver) {
        setIsPaused(p => !p);
        return;
      }

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, resetGame]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, score, generateFood, onScoreChange]);

  return (
    <div className="relative flex flex-col items-center justify-center bg-black p-4 border-2 border-[#00ffff]/30 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
      <div 
        className="grid bg-[#050505] border-4 border-[#00ffff] relative overflow-hidden screen-tear"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: 'min(85vw, 450px)',
          height: 'min(85vw, 450px)',
        }}
      >
        {/* Static scanlines for game area */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((segment, i) => i !== 0 && segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`
                w-full h-full border-[0.5px] border-[#00ffff]/10
                ${isSnakeHead ? 'bg-[#ff00ff] shadow-[0_0_15px_#ff00ff] z-10' : ''}
                ${isSnakeBody ? 'bg-[#00ffff] shadow-[0_0_5px_#00ffff]' : ''}
                ${isFood ? 'bg-[#ff00ff] shadow-[0_0_20px_#ff00ff] animate-pulse' : ''}
              `}
            />
          );
        })}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-[60] border-8 border-[#ff00ff] animate-pulse">
            <h2 
              className="text-6xl md:text-8xl font-glitch text-[#ff00ff] mb-8 tracking-tighter uppercase glitch-text"
              data-text="CRITICAL_FAILURE"
            >
              CRITICAL_FAILURE
            </h2>
            <p 
              className="text-[#00ffff] text-4xl mb-12 font-digital glitch-text" 
              data-text={`DATA_LOST: ${score}`}
            >
              DATA_LOST: {score}
            </p>
            <button
              onClick={resetGame}
              className="px-12 py-4 bg-transparent border-4 border-[#00ffff] text-[#00ffff] font-glitch text-2xl hover:bg-[#00ffff] hover:text-black transition-all duration-100 uppercase tracking-widest magenta-glow"
            >
              REBOOT_SYSTEM
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-[60]">
            <h2 
              className="text-7xl md:text-9xl font-glitch text-[#00ffff] tracking-tighter uppercase glitch-text"
              data-text="STASIS_MODE"
            >
              STASIS_MODE
            </h2>
            <p className="text-[#ff00ff] mt-8 font-mono text-[10px] tracking-[0.5em] animate-pulse">
              [ PRESS_SPACE_TO_RESUME ]
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex gap-12 text-[10px] font-mono text-[#00ffff]/60 uppercase tracking-widest">
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <span className="w-6 h-6 border border-[#00ffff] flex items-center justify-center">W</span>
            <span className="w-6 h-6 border border-[#00ffff] flex items-center justify-center">A</span>
            <span className="w-6 h-6 border border-[#00ffff] flex items-center justify-center">S</span>
            <span className="w-6 h-6 border border-[#00ffff] flex items-center justify-center">D</span>
          </div>
          <span>// NAVIGATE</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 h-6 border border-[#ff00ff] text-[#ff00ff] flex items-center justify-center">SPACE</span>
          <span>// STASIS</span>
        </div>
      </div>
    </div>
  );
}
