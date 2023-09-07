// src/components/App.js
import React from "react";
import { CasinoProvider } from "./context/CasinoContext";
import Navbar from "./components/Navbar";
import GameList from "./components/GameList";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <CasinoProvider>
      <div className="App container">
        <Navbar />
        <GameList />
      </div>
    </CasinoProvider>
  );
}

export default App;
