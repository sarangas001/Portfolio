import React from "react";
import WindowWrapper from "../hoc/WindowWrapper";

const Terminal = () => {
  return (
    <>
      <div id="window-header">
        <p>Window Controls</p>
        <h2>Tech Stack</h2>
      </div>
      <div className="techstack">
        <p>
          <span className="font-bold">@Saranga %</span>
          show tech stack
        </p>
      </div>
    </>
  );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow;
