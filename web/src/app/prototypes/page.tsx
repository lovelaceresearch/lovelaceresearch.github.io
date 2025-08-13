import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import Sidebar from "../(components)/Sidebar";

export const metadata: Metadata = {
  title: "Prototypes - Lovelace Research",
};

async function getData() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "prototypes.json");
    const json = await fs.readFile(filePath, "utf8");
    return JSON.parse(json);
  } catch {
    return { prototypes: [] };
  }
}

export default async function PrototypesPage() {
  const data = await getData();
  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <section id="projects">
          <div className="container">
            <div className="title-block"><h2>Prototypes</h2></div>
            <div className="projects-grid">
              {data.prototypes?.map((p: { title: string; status?: string; description?: string; tags?: string[]; links?: { url: string; label: string }[] }, i: number) => (
                <div key={i} className="project-item">
                  <div className="project-title">{p.title}</div>
                  <div className={`project-status ${p.status}`}>{p.status}</div>
                  <div className="project-description">{p.description}</div>
                  <div className="project-footer">
                    <div className="project-tags">
                      {p.tags?.map((t: string, j: number) => (
                        <span key={j} className="project-tag">{t}</span>
                      ))}
                    </div>
                    <div className="project-links">
                      {p.links?.map((l: { url: string; label: string }, k: number) => (
                        <a key={k} href={l.url} target="_blank" className="project-link">{l.label}</a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

