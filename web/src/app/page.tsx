import Sidebar from "./(components)/Sidebar";

export default function Home() {
  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content home-hero">
        <div className="hero-center">
          <h1 className="blend-difference">
            Human-Centred AI.
          </h1>
        </div>
      </main>
    </div>
  );
}
