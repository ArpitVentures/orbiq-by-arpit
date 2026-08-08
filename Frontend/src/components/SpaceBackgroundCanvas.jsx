import React, { useEffect, useRef } from "react";

function SpaceBackgroundCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        let animationFrameId;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);

        const dust = Array.from({ length: 70 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.15 + 0.05,
            opacity: Math.random() * 0.15 + 0.04
        }));

        const stars = Array.from({ length: 130 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.3 + 0.4,
            offset: Math.random() * 1000
        }));

        const meteors = [];
        const createMeteor = () => ({
            x: Math.random() * width * 1.2 + width * 0.1,
            y: -30,
            length: Math.random() * 90 + 60,
            speed: Math.random() * 3 + 2.5,
            alpha: 1,
            decay: Math.random() * 0.012 + 0.006
        });

        const spaceship = {
            x: width * 0.05,
            y: height * 0.4,
            speedX: 0.12,
            speedY: 0.03,
            angle: 0.15
        };

        const thrusterParticles = [];

        const render = () => {
            ctx.clearRect(0, 0, width, height);

            const nebula = ctx.createRadialGradient(
                width * 0.42, height * 0.42, 40,
                width * 0.42, height * 0.42, 520
            );
            nebula.addColorStop(0, "rgba(120, 80, 255, 0.08)");
            nebula.addColorStop(0.45, "rgba(30, 180, 255, 0.05)");
            nebula.addColorStop(1, "transparent");
            ctx.fillStyle = nebula;
            ctx.fillRect(0, 0, width, height);

            ctx.beginPath();
            ctx.arc(width * 0.78, height * 0.15, 18, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
            ctx.shadowBlur = 12;
            ctx.shadowColor = "rgba(56, 189, 248, 0.2)";
            ctx.fill();

            ctx.beginPath();
            ctx.arc(width * 0.22, height * 0.72, 28, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(168, 85, 247, 0.08)";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "rgba(168, 85, 247, 0.3)";
            ctx.fill();

            stars.forEach((star) => {
                const glow = 0.15 + Math.sin(Date.now() * 0.001 + star.offset) * 0.35;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
                ctx.shadowBlur = 4 + glow * 12;
                ctx.shadowColor = "#7dd3fc";
                ctx.fillStyle = `rgba(255, 255, 255, ${0.45 + glow})`;
                ctx.fill();
            });

            ctx.shadowBlur = 0;
            dust.forEach((p) => {
                p.y += p.speed;
                if (p.y > height) {
                    p.y = -10;
                    p.x = Math.random() * width;
                }
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                ctx.fill();
            });

            if (Math.random() < 0.003 && meteors.length < 2) {
                meteors.push(createMeteor());
            }

            for (let i = meteors.length - 1; i >= 0; i--) {
                const meteor = meteors[i];
                meteor.x -= meteor.speed * 1.3;
                meteor.y += meteor.speed;
                meteor.alpha -= meteor.decay;

                if (meteor.alpha <= 0 || meteor.y > height) {
                    meteors.splice(i, 1);
                } else {
                    const gradient = ctx.createLinearGradient(
                        meteor.x, meteor.y,
                        meteor.x + meteor.length, meteor.y - meteor.length
                    );
                    gradient.addColorStop(0, `rgba(251, 191, 36, ${meteor.alpha})`);
                    gradient.addColorStop(0.4, `rgba(56, 189, 248, ${meteor.alpha * 0.5})`);
                    gradient.addColorStop(1, "transparent");

                    ctx.beginPath();
                    ctx.moveTo(meteor.x, meteor.y);
                    ctx.lineTo(meteor.x + meteor.length, meteor.y - meteor.length);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 1.6;
                    ctx.stroke();
                }
            }

            spaceship.x += spaceship.speedX;
            spaceship.y -= spaceship.speedY;

            if (spaceship.x > width + 120) {
                spaceship.x = -100;
                spaceship.y = height * 0.45;
            }

            if (Math.random() < 0.6) {
                thrusterParticles.push({
                    x: spaceship.x - 20,
                    y: spaceship.y + Math.random() * 4 - 2,
                    r: Math.random() * 2 + 1,
                    alpha: 0.8,
                    speed: Math.random() * 0.8 + 0.4
                });
            }

            for (let i = thrusterParticles.length - 1; i >= 0; i--) {
                const tp = thrusterParticles[i];
                tp.x -= tp.speed;
                tp.alpha -= 0.03;
                if (tp.alpha <= 0) {
                    thrusterParticles.splice(i, 1);
                } else {
                    ctx.beginPath();
                    ctx.arc(tp.x, tp.y, tp.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(34, 211, 238, ${tp.alpha})`;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = "#38bdf8";
                    ctx.fill();
                }
            }

            ctx.save();
            ctx.translate(spaceship.x, spaceship.y);
            ctx.rotate(spaceship.angle);

            ctx.beginPath();
            ctx.moveTo(-12, 4);
            ctx.lineTo(-28, 7);
            ctx.lineTo(-12, 10);
            ctx.fillStyle = "#38bdf8";
            ctx.shadowBlur = 20;
            ctx.shadowColor = "#22d3ee";
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(28, 7);
            ctx.lineTo(-10, -4);
            ctx.lineTo(-2, 7);
            ctx.lineTo(-10, 18);
            ctx.closePath();
            ctx.fillStyle = "#6366f1";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#818cf8";
            ctx.fill();

            ctx.restore();

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                pointerEvents: "none",
                zIndex: 2
            }}
        />
    );
}

export default SpaceBackgroundCanvas;