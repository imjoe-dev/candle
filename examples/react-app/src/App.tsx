import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🕯️ Candle React Example</h1>
        <p>A simple React application for testing analytics adapters</p>

        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            This is a basic React app that will be used to demonstrate the
            Candle analytics library.
          </p>
        </div>

        <div className="analytics-demo">
          <h2>Analytics Demo</h2>
          <p>Coming soon: Integration with Candle analytics adapters</p>
        </div>
      </header>
    </div>
  );
}

export default App;
