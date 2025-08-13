import Sidebar from "../(components)/Sidebar";

export const metadata = {
  title: "About - Lovelace Research",
  description: "Our mission, team, and approach to personal and humane AI",
};

export default function AboutPage() {
  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <section className="hero">
          <div className="container">
            <h1>Independent research-led innovation lab for personal & humane AI</h1>
            <p className="subtitle">Alternative research, Innovative product, Thoughtful impact.</p>
            <p>
              Lovelace Research aims to be a new PARC, infused with design thinking.
              We believe in fundamental paradigm redesign that ultimately translates into
              transformative products.
            </p>
            <p className="description">
              We explore fundamental questions about AI systems, focusing on mental models, frameworks,
              and architectures that prioritize human values and personal alignment. Our work aims to
              create meaningful change in how we think about and build AI technologies.
            </p>
          </div>
        </section>

        <section id="contributors">
          <div className="container">
            <div className="title-block">
              <h2>Contributors</h2>
            </div>
            <p>Our interdisciplinary team brings together expertise from AI research, design, and human-computer interaction.</p>
            <div className="contributors-grid" id="contributors-grid" />
          </div>
        </section>

        <section id="approach">
          <div className="container">
            <div className="title-block">
              <h2>Approach</h2>
            </div>
            <p>
              We believe that meaningful progress in AI requires a fundamental rethinking of current paradigms.
              Our methodology combines rigorous research with practical application.
            </p>
            <ul className="approach-points">
              <li>Research-led innovation that prioritizes long-term impact over short-term gains</li>
              <li>Design thinking principles applied to technical AI research</li>
              <li>Focus on personal and humane AI that augments human capabilities</li>
              <li>Interdisciplinary collaboration across technology, design, and social sciences</li>
              <li>Open research culture that shares insights with the broader community</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

