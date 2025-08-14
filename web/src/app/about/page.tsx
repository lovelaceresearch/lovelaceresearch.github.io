import Sidebar from "../(components)/Sidebar";
import AboutClient from "./AboutClient";

export const metadata = {
  title: "About - Lovelace Research",
  description: "Our mission, team, and approach to personal and humane AI",
};

export default function AboutPage() {
  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content" style={{ gap: '12px' }}>
        <AboutClient />

        <section id="story">
          <div className="container">
            <div className="title-block">
              <h2>Story</h2>
            </div>
            <img 
              src="/images/general/imperial.jpg" 
              alt="Imperial College London" 
              className="story-image"
              style={{
                width: '100%',
                height: 'auto',
                marginTop: '4px',
                marginBottom: '12px',
                borderRadius: '4px'
              }}
            />
            <div className="story-content" style={{ paddingLeft: '12px', paddingRight: '12px' }}>
              <p>
                We believe that meaningful progress in AI requires a fundamental rethinking of current paradigms.
                Our methodology combines rigorous research with practical application, bringing together expertise 
                from AI research, design, and human-computer interaction.
              </p>
              <p>
                Our approach emphasizes research-led innovation that prioritizes long-term impact over short-term gains,
                applying design thinking principles to technical AI research with a focus on personal and humane AI 
                that augments human capabilities.
              </p>
            </div>
          </div>
        </section>

        <section id="contributors">
          <div className="container">
            <div className="title-block">
              <h2>contributors</h2>
            </div>
            <div style={{ paddingLeft: '12px', paddingRight: '12px' }}>
              <p>Our interdisciplinary team brings together expertise from AI research, design, and human-computer interaction.</p>
              <div className="contributors-grid" id="contributors-grid" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

