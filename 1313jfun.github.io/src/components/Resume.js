import pdficon from "../assets/images/pdf.svg";
import myresume from "./componentassets/ResumeFunk.pdf";

export const Resume = () => {
  return (
    <section className="resume" id="resume">
            <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div>
        <h2>Resume</h2>
        <p>
          If a traditional resume is what you are looking for, I have it on my
          website as a pdf file.
          <br />
          Click on the pdf icon below to open a new tab to view or download it.
        </p>
        <a href={myresume} target="_blank">
          <img src={pdficon} height="50" width="50" />
        </a>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    </section>
  );
};
