import "./App.css";

function App() {
  const buttons = [
    "Dashboard",
    "Profile",
    "Settings",
    "Analytics",
    "Logout",
  ];

  return (
    <div className="container">
      <div className="card">
        <h1>CSRC Project</h1>
        <p>Select an option below</p>

        <div className="button-group">
          {buttons.map((button, index) => (
            <button key={index}>{button}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;