import java from "../assets/images/java.svg";
import sql from "../assets/images/sql.svg";
import js from "../assets/images/js.svg";
import aws from "../assets/images/aws.svg";
import gitcat from "../assets/images/gitcat.svg";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import arrow1 from "../assets/images/arrow1.svg";
import arrow2 from "../assets/images/arrow2.svg";
import python from "../assets/images/python.svg";

function myArrow({ type, onClick }) {
  const pointer = type === pointer.PREV ? { arrow1 } : { arrow2 };
  return <button onClick={onClick}>{pointer}</button>;
}

export const Skills = () => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 4,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <section className="skill" id="skills">
            <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="skill-bx wow zoomIn">
              <h2>My Current Skills</h2>
              <p>Always working on more!</p>
              <p>
                <i>Learning is a never ending journey</i>
              </p>
              <Carousel
                responsive={responsive}
                infinite={true}
                className="owl-carousel owl-theme skill-slider"
                renderArrow={myArrow}
              >
                <div className="item">
                  <img src={java} alt="Image" height="200" width="200" />
                </div>
                <div className="item">
                  <img src={python} alt="Image" height="200" width="200" />
                  <h5>python</h5>
                </div>
                <div className="item">
                  <img src={sql} alt="Image" height="200" width="200" />
                </div>
                <div className="item">
                  <img src={js} alt="Image" height="200" width="200" />
                  <h5>javascript</h5>
                </div>
                <div className="item">
                  <img src={aws} alt="Image" height="200" width="200" />
                </div>
                <div className="item">
                  <img src={gitcat} alt="Image" height="200" width="200" />
                  <h5>GitHub</h5>
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
