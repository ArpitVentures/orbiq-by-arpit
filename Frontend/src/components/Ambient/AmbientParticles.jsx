import React, { useMemo, useState, useEffect } from "react";
import "./AmbientParticles.css";

function AmbientParticles() {
    const [shootingStar, setShootingStar] = useState(null);

    const getRandomStarColor = () => {
        const rand = Math.random();
        if (rand < 0.55) return "#ffffff";
        if (rand < 0.75) return "#22d3ee";
        if (rand < 0.90) return "#38bdf8";
        return "#818cf8";
    };

    const particles = useMemo(() => {
        return Array.from({ length: 140 }).map((_, index) => {
            const rand = Math.random();
            let size = 1;
            if (rand > 0.75 && rand <= 0.92) size = 2;
            else if (rand > 0.92 && rand <= 0.98) size = 3;
            else if (rand > 0.98) size = 4;

            const isBright = rand > 0.96;
            const color = getRandomStarColor();
            const opacity = isBright ? 0.9 : 0.15 + Math.random() * 0.45;

            const floatDuration = (12 + Math.random() * 16).toFixed(2);
            const twinkleDuration = (3 + Math.random() * 5).toFixed(2);
            const delay = -(Math.random() * 20).toFixed(2);

            return {
                id: index,
                size,
                isBright,
                color,
                opacity,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                floatDuration: `${floatDuration}s`,
                twinkleDuration: `${twinkleDuration}s`,
                delay: `${delay}s`
            };
        });
    }, []);

    useEffect(() => {
        const triggerShootingStar = () => {
            const startX = Math.random() * 80 + 10;
            const startY = Math.random() * 40;

            setShootingStar({
                id: Date.now(),
                left: `${startX}%`,
                top: `${startY}%`,
            });

            setTimeout(() => {
                setShootingStar(null);
            }, 1200);
        };

        const intervalTime = 18000 + Math.random() * 7000; // ~18 - 25 sec
        const interval = setInterval(triggerShootingStar, intervalTime);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="ambient-engine">
            {particles.map((p) => (
                <span
                    key={p.id}
                    className={`ambient-particle ${p.isBright ? "bright" : ""}`}
                    style={{
                        left: p.left,
                        top: p.top,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                        color: p.color,
                        "--base-opacity": p.opacity,
                        animationDuration: `${p.floatDuration}, ${p.twinkleDuration}`,
                        animationDelay: `${p.delay}, ${p.delay}`
                    }}
                />
            ))}

            {shootingStar && (
                <span
                    key={shootingStar.id}
                    className="shooting-star-streak"
                    style={{
                        left: shootingStar.left,
                        top: shootingStar.top
                    }}
                />
            )}
        </div>
    );
}

export default AmbientParticles;