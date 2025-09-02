import { useState } from "react";
import { CandleClient, amplitudeAdapter, consoleAdapter } from "candle";
import { CandleProvider, useCandle } from "candle/react";

const client = new CandleClient([
  amplitudeAdapter(import.meta.env.VITE_AMPLITUDE_API_KEY),
  consoleAdapter(),
]);

function Dashboard() {
  const candle = useCandle();
  const [userId, setUserId] = useState("user-123");
  const [groupId, setGroupId] = useState("company-456");

  const handleTrackEvent = () => {
    candle.track("button_clicked", {
      location: "dashboard",
      timestamp: Date.now(),
      plan: "premium",
    });
  };

  const handleIdentifyUser = () => {
    candle.identify(userId, {
      email: "user@example.com",
      name: "John Doe",
      plan: "premium",
      signupDate: "2024-01-15",
    });
  };

  const handleGroupUser = () => {
    candle.group(groupId, "organization", {
      name: "Acme Corp",
      industry: "Technology",
      employees: 150,
    });
  };

  const handleReset = () => {
    candle.reset();
  };

  const handlePageView = () => {
    candle.track("page_viewed", {
      page: "dashboard",
      referrer: document.referrer,
      url: window.location.href,
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Candle Analytics Example</h1>
      <p>Open your browser console to see the console adapter output!</p>

      <div style={{ marginBottom: "20px" }}>
        <h2>Event Tracking</h2>
        <button onClick={handleTrackEvent} style={buttonStyle}>
          Track Button Click
        </button>
        <button onClick={handlePageView} style={buttonStyle}>
          Track Page View
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>User Identification</h2>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="User ID"
          style={inputStyle}
        />
        <button onClick={handleIdentifyUser} style={buttonStyle}>
          Identify User
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Group Assignment</h2>
        <input
          type="text"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          placeholder="Group ID"
          style={inputStyle}
        />
        <button onClick={handleGroupUser} style={buttonStyle}>
          Assign to Group
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Reset</h2>
        <button
          onClick={handleReset}
          style={{ ...buttonStyle, backgroundColor: "#dc3545" }}
        >
          Reset User Data
        </button>
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h3>How to use:</h3>
        <ol>
          <li>Open your browser's developer console</li>
          <li>Click any button above to see console adapter output</li>
          <li>Add your Amplitude API key to see Amplitude events</li>
          <li>Events are queued if adapters aren't ready yet</li>
        </ol>
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  margin: "5px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const inputStyle = {
  padding: "8px",
  margin: "5px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  width: "200px",
};

function App() {
  return (
    <CandleProvider client={client}>
      <Dashboard />
    </CandleProvider>
  );
}

export default App;
