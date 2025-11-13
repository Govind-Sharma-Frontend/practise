import { useEffect, useRef, useState } from "react";

const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [booster, setBooster] = useState<{ x: number; y: number } | null>(null);
  const [direction, setDirection] = useState("RIGHT");
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [snakeColor, setSnakeColor] = useState("green");

  const gridSize = 20;
  const tileCount = 20;

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
    setScore(0);
    setIsGameOver(false);
    setFood({
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    });
    setBooster(null);
    setIsGameStarted(true);
  };

  const gameLoop = () => {
    const snakeCopy = [...snake];
    const head = { ...snakeCopy[0] };

    if (direction === "LEFT") head.x -= 1;
    if (direction === "RIGHT") head.x += 1;
    if (direction === "UP") head.y -= 1;
    if (direction === "DOWN") head.y += 1;

    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 1);
      setFood({
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
      });
      if (Math.random() > 0.7) {
        setBooster({
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount),
        });
      }
    } else {
      snakeCopy.pop();
    }

    if (booster && head.x === booster.x && head.y === booster.y) {
      setScore((prev) => prev + 5);
      setBooster(null);
    }

    snakeCopy.unshift(head);

    if (
      head.x < 0 ||
      head.x >= tileCount ||
      head.y < 0 ||
      head.y >= tileCount ||
      snakeCopy
        .slice(1)
        .some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setIsGameOver(true);
      setIsGameStarted(false);
    }

    setSnake(snakeCopy);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft" && direction !== "RIGHT") setDirection("LEFT");
    if (e.key === "ArrowRight" && direction !== "LEFT") setDirection("RIGHT");
    if (e.key === "ArrowUp" && direction !== "DOWN") setDirection("UP");
    if (e.key === "ArrowDown" && direction !== "UP") setDirection("DOWN");
  };

  useEffect(() => {
    if (isGameStarted && !isGameOver) {
      const interval = setInterval(gameLoop, 100);
      return () => clearInterval(interval);
    }
  }, [snake, direction, food, booster, isGameStarted, isGameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = theme === "light" ? "#f0f0f0" : "#333";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw food
        ctx.fillStyle = "red";
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

        // Draw booster
        if (booster) {
          ctx.fillStyle = "blue";
          ctx.fillRect(
            booster.x * gridSize,
            booster.y * gridSize,
            gridSize,
            gridSize
          );
        }

        // Draw snake
        ctx.fillStyle = snakeColor;
        snake.forEach((segment) =>
          ctx.fillRect(
            segment.x * gridSize,
            segment.y * gridSize,
            gridSize,
            gridSize
          )
        );
      }
    }
  }, [snake, food, booster, theme, snakeColor]);

  return (
    <div
      style={{
        textAlign: "center",
        background: theme === "light" ? "#ffffff" : "#111111",
        minHeight: "100dvh",
        transition: "background 0.3s",
      }}
    >
      {!isGameStarted && (
        <div>
          <h1>{isGameOver ? "Game Over" : "Snake Game"}</h1>
          {isGameOver && <p>Your Score: {score}</p>}
          <button onClick={startGame}>Play Again</button>
          <div>
            <label>Select Theme: </label>
            <select
              onChange={(e) => setTheme(e.target.value)}
              value={theme}
              style={{ color: "#000000" }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label>Select Snake Color: </label>
            <input
              type="color"
              value={snakeColor}
              onChange={(e) => setSnakeColor(e.target.value)}
            />
          </div>
        </div>
      )}
      {isGameStarted && (
        <div>
          <h1>Score: {score}</h1>
          <canvas
            ref={canvasRef}
            width={tileCount * gridSize}
            height={tileCount * gridSize}
            style={{ border: "1px solid black" }}
          />
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
