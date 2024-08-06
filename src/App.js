import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { Banner } from "./components/Banner";
import { Skills } from "./components/Skills";
import { Projects } from "./components/Projects";
import { Resume } from "./components/Resume";
import { About } from "./components/About";
import BurnDeck from "./components/BurnDeckTool/BurnDeck";
import FishingTool from "./components/FishingTool/FishingTool";
import {
  HashRouter as Router,
  Routes,
  Route
} from "react-router-dom";

const test = '';

function App() {

  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/burndeck" element={<BurnDeck />} />
          <Route path="/fishingTool" element={<FishingTool />} />
        </Routes>
      </div>
    </Router>
  );
}

const Home = () => (
  <>
    <Banner />
    <div id="skills">
      <Skills />
    </div>
    <div id="projects">
      <Projects />
    </div>
    <div id="resume">
      <Resume />
    </div>
  </>
);

export default App;
