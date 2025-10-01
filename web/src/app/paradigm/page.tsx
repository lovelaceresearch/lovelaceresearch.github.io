import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import Sidebar from "../(components)/Sidebar";
import Footer from "../(components)/Footer";

export const metadata: Metadata = {
  title: "Paradigm - Lovelace Research",
};

async function getPublications() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "publications.json");
    const json = await fs.readFile(filePath, "utf8");
    return JSON.parse(json);
  } catch {
    return { publications: [], pastPublications: [] };
  }
}

async function getReadingList() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "reading-list.json");
    const json = await fs.readFile(filePath, "utf8");
    return JSON.parse(json);
  } catch {
    return { readingList: [], watchList: [] };
  }
}

export default async function ParadigmPage() {
  const publicationsData = await getPublications();
  const readingData = await getReadingList();

  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <section id="paradigm">
          <div className="container">
            <div className="title-block"><h2>Paradigm</h2></div>
            <div className="subtitle-block">
              <h2>Publications and readings that shape our perspective.</h2>
            </div>

            <div className="publications-list" style={{ marginTop: '16px' }}>
              {(publicationsData.publications || []).map((p: any, i: number) => (
                <div className="publication-item" key={i}>
                  <div className="publication-title">{p.title}</div>
                  <div className="publication-meta">
                    <span>{(p.authors || []).join(', ')} · </span>
                    <span className="publication-venue">{p.venue}</span>
                    <span> · <span className="publication-year">{p.year}</span></span>
                  </div>
                  {p.abstract && <div className="publication-abstract">{p.abstract}</div>}
                  <div className="publication-footer">
                    <div className="publication-tags">
                      {(p.tags || []).map((t: string, j: number) => (
                        <span key={j} className="publication-tag">{t}</span>
                      ))}
                    </div>
                    <div className="publication-links">
                      {(p.links || []).map((l: any, k: number) => (
                        <a key={k} className="publication-link" href={l.url} target="_blank">{l.label}</a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(readingData.readingList || []).length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <div className="title-block"><h2>Reading List</h2></div>
                <div className="prototypes-grid">
                  {(readingData.readingList || []).map((book: any, i: number) => (
                    <div key={i} className="prototype-item">
                      <div className="prototype-header">
                        <div className="prototype-number">{book.category || "Book"}</div>
                      </div>
                      <div className="prototype-content">
                        <div className="prototype-left">
                          <div className="prototype-title">{book.title}</div>
                        </div>
                        <div className="prototype-right">
                          <div className="prototype-description">{book.summary}</div>
                          {book.author && (
                            <div className="prototype-collaborator-link" style={{ pointerEvents: 'none' }}>{book.author}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}




