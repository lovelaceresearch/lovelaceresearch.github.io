import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import Sidebar from "../(components)/Sidebar";

export const metadata: Metadata = {
  title: "Publications - Lovelace Research",
};

async function getData() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "publications.json");
    const json = await fs.readFile(filePath, "utf8");
    return JSON.parse(json);
  } catch {
    return { publications: [] };
  }
}

export default async function PublicationsPage() {
  const data = await getData();
  
  const renderPublications = (publications: { title: string; authors?: string[]; venue?: string; year?: string; abstract?: string; tags?: string[]; links?: { url: string; label: string }[] }[]) => {
    return publications?.map((p, i) => (
      <div className="publication-item" key={i}>
        <div className="publication-title">{p.title}</div>
        <div className="publication-meta">
          <span>{p.authors?.join(', ')} · </span>
          <span className="publication-venue">{p.venue}</span>
          <span> · <span className="publication-year">{p.year}</span></span>
        </div>
        {p.abstract && <div className="publication-abstract">{p.abstract}</div>}
        <div className="publication-footer">
          <div className="publication-tags">
            {p.tags?.map((t: string, j: number) => (
              <span key={j} className="publication-tag">{t}</span>
            ))}
          </div>
          <div className="publication-links">
            {p.links?.map((l: { url: string; label: string }, k: number) => (
              <a key={k} className="publication-link" href={l.url} target="_blank">{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <section id="publications">
          <div className="container">
            <div className="title-block"><h2>Publications</h2></div>
            <div className="publications-list">
              {renderPublications(data.publications)}
            </div>
          </div>
        </section>
        
        {data.pastPublications && data.pastPublications.length > 0 && (
          <section id="past-publications">
            <div className="container">
              <div className="title-block"><h2>Past Publications</h2></div>
              <div className="publications-list past-publications-list">
                {renderPublications(data.pastPublications)}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

