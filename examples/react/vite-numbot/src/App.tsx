import React from "react";
import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as numbot from "numbot";
import { exampleRules } from "numbot/dist/src/parsers";

function App() {
  const [log, setLog] = React.useState("");
  const [parsed, setParsed] = React.useState<any>();
  const [stats, setStats] = React.useState<any>();

  React.useEffect(() => {
    setParsed(numbot.parser(log, exampleRules));
  }, [log]);

  React.useEffect(() => {}, [parsed]);

  return (
    <div>
      <div>Write the stats </div>
      <div>
        <textarea
          onChange={(e) => {
            setLog(e.target.value);
          }}
        ></textarea>
      </div>

      <pre>{JSON.stringify(parsed, null, 2)}</pre>
    </div>
  );
}

export default App;
