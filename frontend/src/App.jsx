import React from "react";
import FlowChart from "./components/FlowChart";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="h-dvh w-dvw text-extra">
      <div className="w-full h-[90%] mx-auto">
        <FlowChart />
        <div>
          <Toaster />
        </div>
      </div>
    </div>
  );
}

export default App;
