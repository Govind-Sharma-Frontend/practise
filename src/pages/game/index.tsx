import { useEffect, useRef, useState } from "react";

import { Ball, Paddle } from "@/types";

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paddleRef = useRef<Paddle>({
    x: 0,
    y: 580,
    width: 20,
    height: 10,
    speed: 10,
  });
  const ballRef = useRef<Ball>({ x: 200, y: 300, dx: 3, dy: 3, radius: 20 });

  const [isMobile, setIsMobile] = useState(false);
  console.log("isMobile", isMobile);

  // Check for mobile device
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth <= 768); // Adjust based on your target mobile screen size
      };
      checkIfMobile();

      // Resize the canvas on screen resize
      window.addEventListener("resize", checkIfMobile);

      return () => {
        window.removeEventListener("resize", checkIfMobile);
      };
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure the window object is available

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const paddle = paddleRef.current;
    const ball = ballRef.current;

    let isLeftPressed = false;
    let isRightPressed = false;
    let touchStartX = 0;

    // Keydown event for keyboard
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") isLeftPressed = true;
      if (e.key === "ArrowRight") isRightPressed = true;
    };

    // Keyup event for keyboard
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") isLeftPressed = false;
      if (e.key === "ArrowRight") isRightPressed = false;
    };

    // Touch start event for mobile
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };

    // Touch move event for mobile
    const handleTouchMove = (e: TouchEvent) => {
      const touchEndX = e.touches[0].clientX;
      if (touchEndX > touchStartX) {
        // Move paddle right
        if (paddle.x + paddle.width < canvas.width) paddle.x += paddle.speed;
      } else if (touchEndX < touchStartX) {
        // Move paddle left
        if (paddle.x > 0) paddle.x -= paddle.speed;
      }
    };

    // Game loop for updating positions
    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw paddle
      ctx.fillStyle = "blue";
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

      // Draw ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();

      // Move paddle (on desktop)
      if (isLeftPressed && paddle.x > 0) paddle.x -= paddle.speed;
      if (isRightPressed && paddle.x + paddle.width < canvas.width)
        paddle.x += paddle.speed;

      // Update ball position
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collision with walls
      if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
        ball.dx *= -1;
      if (ball.y - ball.radius < 0) ball.dy *= -1;

      // Ball collision with paddle
      if (
        ball.y + ball.radius > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width
      ) {
        ball.dy *= -1;
      }

      // Ball out of bounds
      if (ball.y + ball.radius > canvas.height) {
        console.log("Game Over!");
        document.location.reload();
      }

      requestAnimationFrame(gameLoop);
    };

    // Event listeners for desktop or mobile controls
    if (isMobile) {
      canvas.addEventListener("touchstart", handleTouchStart);
      canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    } else {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
    }

    gameLoop();

    // Cleanup the event listeners on component unmount
    return () => {
      if (isMobile) {
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
      } else {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("keyup", handleKeyUp);
      }
    };
  }, [isMobile]);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <canvas
        ref={canvasRef}
        width={isMobile ? window.innerWidth * 0.9 : 360} // Resize the canvas for mobile
        height={600}
        style={{ backgroundColor: "#f0f0f0", margin: "auto" }}
      />
    </div>
  );
};

export default Game;
