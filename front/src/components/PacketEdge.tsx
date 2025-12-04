import React from 'react';
import { BaseEdge, type EdgeProps, getBezierPath } from '@xyflow/react';

const PacketEdge: React.FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // data.activity could be a number representing packets/sec or boolean
  const isActive = data?.activity && (data.activity as number) > 0;

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {isActive && (
        <circle r="4" fill="#ff0072">
          <animateMotion dur="1s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
    </>
  );
};

export default PacketEdge;
