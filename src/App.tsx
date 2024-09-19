import React, { useState } from "react";
import "./App.css";

function App() {
  const [hits, setHits] = useState<{ x: number; y: number }[]>([]);

  const handleTargetClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const newHit = { x, y };
    setHits([...hits, newHit]);
  };

  return (
    <div className="App">
      <div className="target" onClick={handleTargetClick}>
        {hits.map((hit, index) => (
          <div
            key={index}
            className="hit"
            style={{ left: hit.x, top: hit.y }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
