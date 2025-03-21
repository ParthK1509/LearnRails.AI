import "./home.css";
export default function Home() {
  return (
    <div className="root">
      <div className="logo">
        <div className="heading">LearnRails.AI</div>
        <div className="subtitle">AI Powered Learning Path for You</div>
      </div>
      <div className="main">
        <p className="whichTopic">Which Topic are we learning today?</p>
      <div className="searchbar">
      <input type="text" placeholder="e.g. Rigid Body Dynamics"/>
      <button>Search</button>
      </div>
      </div>
    </div>
  );
}
