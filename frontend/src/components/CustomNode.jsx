import { History, Mail, UserRound } from "lucide-react";
import React, { useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

function CustomNode({ data, isConnectable }) {
  return (
    <div className="p-4 rounded-lg bg-secondary outline outline-2 outline-extra">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-lg bg-primary">
          {data.label.includes("Lead-Source") && (
            <UserRound className="text-extra" />
          )}
          {data.label.includes("Cold-Email") && <Mail className="text-extra" />}
          {data.label.includes("Wait/Delay") && (
            <History className="text-extra" />
          )}
        </div>
        <span className="text-extra">{data.label}</span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default CustomNode;
