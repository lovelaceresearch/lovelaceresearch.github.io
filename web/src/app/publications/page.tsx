import ClientScripts from "../(components)/ClientScripts";
import Link from "next/link";
import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";

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
  return (
    <div className="page-container">
      <aside className="sidebar">
        <div className="sidebar-block">
          <Link href="/" className="sidebar-title">Lovelace Research</Link>
          <p className="sidebar-subtitle">Independent research-led innovation lab for personal & humane AI</p>
        </div>
        <div className="sidebar-block">
          <nav className="sidebar-nav">
            <ul>
              <li><Link href="/prototypes">Prototypes</Link></li>
              <li><Link href="/publications" className="nav-active">Publications</Link></li>
              <li><Link href="/reading-list">Reading List</Link></li>
              <li><Link href="/about">About</Link></li>
            </ul>
          </nav>
        </div>
        <div className="sidebar-block">
          <div className="sidebar-contact">
            <a href="https://instagram.com/lovelaceresearch" target="_blank">IG</a>
            <span className="email-container">
              <a href="#" id="email-link" data-email="office@lovelace-research.com">office@lovelace-research.com</a>
              <span id="hover-tooltip" className="hover-tooltip">Copy email</span>
              <span id="copied-message" className="copied-message">Copied!</span>
            </span>
          </div>
        </div>
      </aside>
      <main className="main-content">
        <section id="publications">
          <div className="container">
            <div className="title-block"><h2>Publications</h2></div>
            <div className="publications-list">
              {data.publications?.map((p: { title: string; authors?: string[]; venue?: string; year?: string; abstract?: string; tags?: string[]; links?: { url: string; label: string }[] }, i: number) => (
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
              ))}
            </div>
          </div>
        </section>
      </main>
    <ClientScripts />
    </div>
  );
}

