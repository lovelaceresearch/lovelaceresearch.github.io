import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import Sidebar from "../(components)/Sidebar";

export const metadata: Metadata = {
  title: "Opinion Notes - Lovelace Research",
};

async function getData() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "opinion-notes.json");
    const json = await fs.readFile(filePath, "utf8");
    return JSON.parse(json);
  } catch {
    return { notes: [] };
  }
}

export default async function OpinionNotesPage() {
  const data = await getData();
  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <section id="notes">
          <div className="container">
            <div className="title-block"><h2>Opinion Notes</h2></div>
            <div className="projects-grid">
              {data.notes?.map((n: { title: string; date?: string; summary?: string; link?: string }, i: number) => (
                <div key={i} className="project-item">
                  <div className="project-title">{n.title}</div>
                  <div className="project-description">{n.date}</div>
                  <p>{n.summary}</p>
                  {n.link && <div className="project-links"><a href={n.link} className="project-link" target="_blank">Read</a></div>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

