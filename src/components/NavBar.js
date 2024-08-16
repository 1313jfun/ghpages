import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import logo from "../assets/images/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import lightbulb from "./componentassets/lightbulb.svg";
import "../App.css";

export const NavBar = () => {
  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [expanded, setExpanded] = useState(false); // State to manage navbar collapse
  const navigate = useNavigate();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onUpdateActiveLink = (value, path) => {
    setActiveLink(value);
    navigate(path);
    setExpanded(false); // Collapse the navbar after a link is clicked
  };

  const handleNavClick = (section) => {
    navigate('/');
    setTimeout(() => {
      document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
    }, 100);
    setExpanded(false); // Collapse the navbar after a link is clicked
  };

  return (
    <Navbar expand="md" fixed="top" className={`navbar ${scrolled ? "scrolled" : ""}`} expanded={expanded}>
      <Container>
        <div className={`${theme}`}>
          <img
            src={lightbulb}
            className="lightbulb"
            title="DarkMode"
            onClick={toggleTheme}
            width="25"
            height="25"
          />
        </div>
        <Navbar.Brand as={Link} to="/" onClick={() => onUpdateActiveLink("home", "/")}>
          <img src={logo} alt="Logo" height="100" width="216" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Dropdown>
              <Dropdown.Toggle as={Nav.Link} className="navbar-link">
                Sections
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleNavClick("skills")}>Skills</Dropdown.Item>
                <Dropdown.Item onClick={() => handleNavClick("projects")}>Projects</Dropdown.Item>
                <Dropdown.Item onClick={() => handleNavClick("resume")}>Resume</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown>
              <Dropdown.Toggle as={Nav.Link} className="navbar-link">
                Portfolio
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => onUpdateActiveLink("fishingTool", "/fishingTool")}>Fishing/Weather Assistant</Dropdown.Item>
                <Dropdown.Item onClick={() => onUpdateActiveLink("burndeck", "/burndeck")}>YGO Burn Deck Practice Tool</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Nav.Link
              as={Link}
              to="/about"
              className={activeLink === "/about" ? "active navbar-link" : "navbar-link"}
              onClick={() => onUpdateActiveLink("about", "/about")}
            >
              <font color="#29a329">About</font>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};