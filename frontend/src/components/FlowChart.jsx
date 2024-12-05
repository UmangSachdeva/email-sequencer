import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "reactflow";
import axios from "axios";

import "reactflow/dist/style.css";
import { useState, useCallback, useEffect } from "react";
import Button from "./common/Button";
import Select from "./common/Select";
import CustomModal from "./CustomModal";
import customToast from "../utils/CustomToast";
import CustomNode from "./CustomNode";
import ConnectingLines from "./ConnectingLines";
import { Loader } from "lucide-react";

// Adding node types to render diffrent node styles for diffrent types of nodes
const nodeTypes = {
  customNode: CustomNode,
};

const edgeTypes = {
  custom: ConnectingLines,
};

const FlowChart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [nodeCount, setNodeCount] = useState(1);
  const [selectedNodeType, setSelectedNodeType] = useState("Lead-Source");
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [editingNode, setEditingNode] = useState(null);

  // Callback to handle node changes
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Callback to handle edge changes
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Function to add a new node and connect it to previous node
  const addNode = (label, content) => {
    const newNodeId = (nodeCount + 1).toString();
    const newNode = {
      id: newNodeId,
      type: "customNode",
      data: { label: `${label}\n${content}` },
      position: { x: 100, y: nodeCount * 100 },
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeCount((count) => count + 1);

    const newEdge = {
      id: `${nodeCount}-${newNodeId}`,
      source: `${nodeCount}`,
      target: newNodeId,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 20,
        height: 20,
        color: "#493628",
      },
      style: {
        strokeWidth: 2,
        stroke: "#493628",
      },
    };
    setEdges((eds) => eds.concat(newEdge));
  };

  // Handle the addition of a new node
  const handleAddNode = () => {
    if (selectedNodeType) {
      setModalContent(selectedNodeType);
      setIsOpen(true);
      setEditingNode(null);
    } else {
      alert("Please select a valid node type.");
    }
  };

  // Handle form submission for adding/updating nodes
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const subject = formData.get("subject");
    const text = formData.get("content");
    const delay = formData.get("delay");
    const email = formData.get("email");
    let nodeContent = "";

    if (modalContent === "Cold-Email") {
      nodeContent = `- (${subject}) ${text}`;
    } else if (modalContent === "Wait/Delay") {
      nodeContent = `- (${delay})`;
    } else {
      nodeContent = `- (${email})`;
    }

    // Update the existing node if editing, otherwise add a new node
    if (editingNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode.id
            ? { ...node, data: { label: `${modalContent}\n${nodeContent}` } }
            : node
        )
      );
    } else {
      if (selectedNodeType === "Lead-Source") {
        setSelectedNodeType("Cold-Email");
      }
      addNode(modalContent, nodeContent);
    }
    setIsOpen(false);
  };

  // Render the modal content based on the selected node type
  const renderModalContent = () => {
    switch (modalContent) {
      case "Cold-Email":
        return (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between"
          >
            <label htmlFor="subject">Subject:</label>
            <input
              type="text"
              name="subject"
              id="subject"
              defaultValue={
                editingNode?.data.label.split("- (")[1]?.split(")")[0] || ""
              }
              required
              className="p-1 border border-black rounded-md"
            />
            <label htmlFor="content">Content:</label>
            <input
              type="text"
              name="content"
              id="content"
              defaultValue={editingNode?.data.label.split(") ")[1] || ""}
              required
              className="p-1 border border-black rounded-md"
            />
            <Button type="submit" className="mt-2">
              {editingNode ? "Update Cold Email" : "Add Cold Email"}
            </Button>
          </form>
        );
      case "Wait/Delay":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="delay">Delay:</label>
              <Select
                name="delay"
                id="delay"
                defaultValue={
                  editingNode?.data.label.split("- (")[1]?.split(" min")[0] +
                    " min" || ""
                }
                required
              >
                {[...Array(6).keys()].map((i) => (
                  <option key={i} value={`${i + 1} min`}>
                    {i + 1} min
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit" className="mt-2">
              {editingNode ? "Update Delay" : "Add Delay"}
            </Button>
          </form>
        );
      case "Lead-Source":
        return (
          <form onSubmit={handleSubmit} className="flex flex-col h-full gap-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="email">Recipient Email:</label>
              <input
                name="email"
                id="email"
                defaultValue={
                  editingNode?.data.label.split("- (")[1]?.split(")")[0] || ""
                }
                required
                className="p-1 border border-black rounded-md"
              />
            </div>
            <Button type="submit" className="mt-2">
              {editingNode ? "Update Lead Source" : "Add Lead Source"}
            </Button>
          </form>
        );
      default:
        return null;
    }
  };

  // Handle node click to open modal for editing
  const handleNodeClick = (event, node) => {
    setModalContent(node.data.label.split("\n")[0]);
    setIsOpen(true);
    setEditingNode(node);
  };

  // Handle the process start
  const handleStartProcess = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/sequence/start-process`,
        {
          nodes,
          edges,
        }
      );
      if (response.status === 200) {
        setIsLoading(false);
        customToast("Process Started Successfully", { type: "success" });
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      customToast(error.response.data.message, { type: "error" });
    }
  };

  // Add the initial lead-source node on component mount
  useEffect(() => {
    handleAddNode();
  }, []);

  return (
    <div className="w-full h-full mt-4">
      <div className="flex items-center justify-between w-full p-5">
        <h1 className="w-full text-lg font-semibold text-extra">
          Design an Email Sequence 🚀
        </h1>
        <div className="flex items-center justify-center w-full gap-4">
          <Select
            value={selectedNodeType}
            onChange={(e) => setSelectedNodeType(e.target.value)}
          >
            <option value="Cold-Email">Cold Email</option>
            <option value="Wait/Delay">Wait/Delay</option>
          </Select>
          {nodes.length == 0 && (
            <Button onClick={handleAddNode}>Add Recipient</Button>
          )}
          <Button onClick={handleAddNode}>Add Node</Button>
          <Button
            className="!bg-extra flex gap-2 !text-primary hover:!bg-primary hover:!text-extra"
            onClick={handleStartProcess}
            disabled={isLoading}
          >
            Start Process
            <span>
              {isLoading && <Loader className="delay-300 animate-spin" />}
            </span>
          </Button>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        className="rounded-md bg-[#E4E0E1]"
        nodeTypes={nodeTypes}
      >
        <Controls />
        <Background />
      </ReactFlow>

      <CustomModal modalIsOpen={modalIsOpen} setModalIsOpen={setIsOpen}>
        {renderModalContent()}
      </CustomModal>
    </div>
  );
};

export default FlowChart;
