import React, { useState, useEffect } from "react";
import "./App.css";

const TARGET_DIAMETER_MM = 115;
const TARGET_AREA_SIZE_MM = 230;

function App() {
  const [hits, setHits] = useState<
    { normalizedX: number; normalizedY: number }[]
  >([]);
  const [targetSizeInPixels, setTargetSizeInPixels] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  useEffect(() => {
    updateTargetSize();
    window.addEventListener('resize', updateTargetSize);
    return () => window.removeEventListener('resize', updateTargetSize);
  }, []);

  const updateTargetSize = () => {
    const rect = document.querySelector(".target")?.getBoundingClientRect();
    if (rect) {
      setTargetSizeInPixels({ width: rect.width, height: rect.height });
    }
  };

  const handleTargetClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Normalize coordinates to [-0.5, 0.5]
    const normalizedX = x / rect.width - 0.5;
    const normalizedY = y / rect.height - 0.5;

    const newHit = { normalizedX, normalizedY };
    setHits([...hits, newHit]);
  };

  function toRealWorldCoordinates(normalizedX: number, normalizedY: number) {
    const realX = normalizedX * TARGET_AREA_SIZE_MM;
    const realY = normalizedY * TARGET_AREA_SIZE_MM;
    return { realX, realY };
  }

  const toPixelCoordinates = (normalizedX: number, normalizedY: number) => {
    const x = (normalizedX + 0.5) * targetSizeInPixels.width;
    const y = (normalizedY + 0.5) * targetSizeInPixels.height;
    return { x, y };
  };

  return (
    <div className="App">
      <div
        className="target"
        onClick={handleTargetClick}
      >
        {hits.map((hit, index) => {
          const { x, y } = toPixelCoordinates(hit.normalizedX, hit.normalizedY);
          const { realX, realY } = toRealWorldCoordinates(
            hit.normalizedX,
            hit.normalizedY
          );
          return (
            <div
              key={index}
              className="hit"
              style={{ left: x, top: y }}
              title={`Real-world coordinates: (${realX.toFixed(
                2
              )} mm, ${realY.toFixed(2)} mm)`}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
