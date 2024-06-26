import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import projectImage1 from "../assets/images/project-img1.png";
import projectImage2 from "../assets/images/project-img2.png";
import projectImage3 from "../assets/images/project-img3.png";

export const Projects = () => {
  return (
    <section className="projects" id="projects">
            <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Container>
        <Row>
          <Col size={12}>
            <div>
              <h2>Projects</h2>
              <p>Here is what I have been working on:</p>
              <Tab.Container id="projects-tabs" defaultActiveKey="first">
                <Nav
                  variant="pills"
                  className="nav-pills mb-5 justify-content-center align-items-center"
                  id="pills-tab"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="first">Website</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">
                      Yugioh Burn Deck Practice Tool
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third">Capstone</Nav.Link>
                  </Nav.Item>
                </Nav>
                <Tab.Content id="slideInUp">
                  <Tab.Pane eventKey="first">
                    <img
                      src={projectImage2}
                      alt="projectimage2"
                      height="200"
                      width="250"
                    />
                    <br />
                    <p>
                      This website you are reading now is a project that I will
                      always find myself coming back to. I enjoy returning to
                      update it with changes in my plans or any ideas that I
                      wish to experiment with!
                    </p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <img
                      src={projectImage3}
                      alt="projectimage3"
                      height="200"
                      width="250"
                    />
                    <br />
                    <p>
                      This app is an in-browser simulator designed to assist
                      Yugioh players in calculating the correct amount of burn
                      damage their cards will apply at any given time.
                    </p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <img
                      src={projectImage1}
                      alt="projectimage1"
                      height="200"
                      width="250"
                    />
                    <br />
                    <p>
                      This was my capstone project for while I was attending the
                      Dev10 program. This showcases use of a fullstack
                      application to create an app for joggers to meet up using
                      Java, SQL, and Javascript. Additionally, the app was to be
                      created by a team using Github and AWS to demonstrate our
                      abilities to work in a collaborative environment
                    </p>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
