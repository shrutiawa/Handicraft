import TutorialsDisplay from "./TutorialsDisplay";
import Header from "./header";
import Footer from "./footer";

function TutorialsPage() {
  return (
    <div className="tutorial-container" style={{width:"1200px", margin:"auto"}}>
      <Header />
      <TutorialsDisplay />
      <Footer />
    </div>
  );
}

export default TutorialsPage;
