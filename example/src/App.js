import "./App.css";

import { useClientTrigger, usePresenceChannel } from "./use-pusher";

import React from "react";
import logo from "./logo.svg";

function App() {
  const { channel, ...rest } = usePresenceChannel("presence-my-channel");
  const trigger = useClientTrigger(channel);
  console.log(rest);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <span
          className="App-link"
          onClick={() => trigger("client-hello-world", {})}
          target="_blank"
          rel="noopener noreferrer"
        >
          Fire event
        </span>
      </header>
    </div>
  );
}

export default App;
