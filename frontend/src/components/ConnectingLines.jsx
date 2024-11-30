import React from "react";

function ConnectingLines({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  // Create a curved path
  const edgePath = `M ${sourceX} ${sourceY} C ${sourceX + 50} ${sourceY} ${
    targetX - 50
  } ${targetY} ${targetX} ${targetY}`;

  return (
    <>
      <path
        id={id}
        style={{
          stroke: "url(#arrowGradient)",
          strokeWidth: 3,
          fill: "none",
          ...style,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      />
      {/* Gradient for arrow */}
      <svg>
        <defs>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
}

export default ConnectingLines;
