import React, { useState, useEffect } from "react";
import "./App.css";

const TARGET_AREA_SIZE_MM = 230;
const STANDING_TARGET_DIAMETER_MM = 115;
const PRONE_TARGET_DIAMETER_MM = 45;
// Set CSS variables
document.documentElement.style.setProperty('--target-area-size', TARGET_AREA_SIZE_MM.toString());
document.documentElement.style.setProperty('--prone-target-diameter', PRONE_TARGET_DIAMETER_MM.toString());
document.documentElement.style.setProperty('--standing-target-diameter', STANDING_TARGET_DIAMETER_MM.toString());

function App() {
  const [shots, setShots] = useState<
    { normalizedX: number; normalizedY: number }[]
  >([]);
  const [avgShot, setAvgShot] = useState<{
    normalizedX: number;
    normalizedY: number;
  } | null>(null);
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
    const rect = document.querySelector(".target-area")?.getBoundingClientRect();
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

    const newShot = { normalizedX, normalizedY };
    setShots(prevShots => {
      const updatedShots = [...prevShots, newShot];
      updateAvgShot(updatedShots);
      return updatedShots;
    });
  };

  function updateAvgShot(updatedShots: { normalizedX: number; normalizedY: number }[]) {
    console.log("Updating avg shot");
    console.log("Nof. shots:", updatedShots.length);
    if (updatedShots.length > 0) {
      const sumX = updatedShots.reduce((acc, shot) => acc + shot.normalizedX, 0);
      const sumY = updatedShots.reduce((acc, shot) => acc + shot.normalizedY, 0);
      const avgShot = { normalizedX: sumX / updatedShots.length, normalizedY: sumY / updatedShots.length };
      setAvgShot(avgShot);
    }
  }

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

  const renderAvgShot = () => {
    if (!avgShot) return null;
    const { x, y } = toPixelCoordinates(avgShot.normalizedX, avgShot.normalizedY);
    return <div className="avg-shot" style={{ left: x, top: y }} />;
  };

  return (
    <div className="App">
      <div
        className="target-area"
        onClick={handleTargetClick}
      >
        <div className="standing-target" />
        <div className="prone-target" />
        {shots.map((shot, index) => {
          const { x, y } = toPixelCoordinates(shot.normalizedX, shot.normalizedY);
          const { realX, realY } = toRealWorldCoordinates(
            shot.normalizedX,
            shot.normalizedY
          );
          return (
            <div
              key={index}
              className="shot"
              style={{ left: x, top: y }}
              title={`Real-world coordinates: (${realX.toFixed(
                2
              )} mm, ${realY.toFixed(2)} mm)`}
            />
          );
        })}
        {renderAvgShot()}
      </div>
    </div>
  );
}

export default App;
