import { Container, Row, Col, Button } from "react-bootstrap";
import jamesfunk from "../assets/images/jamesfunk.jpg";

export const Banner = () => {
  return (
    <section className="banner" id="home">
      <Container>
        <Row className="align-items-center">
          <Col>
            <div>
              <h1>{`James Funk`}</h1>

              <Col>
                <div>
                  <img
                    src={jamesfunk}
                    alt="James Funk"
                    height="240"
                    width="190"
                  />
                </div>
              </Col>

              <p>
                I am an aspiring software developer who wants to bring
                my education background and collaborative skills to a fast-paced and rapid-changing
                environment.
                <br />
                <br />
                <br />
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Banner
