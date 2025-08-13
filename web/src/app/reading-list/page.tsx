import { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import Sidebar from "../(components)/Sidebar";

export const metadata: Metadata = {
  title: "Reading List - Lovelace Research",
};

async function getData() {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "reading-list.json");
    const json = await fs.readFile(filePath, "utf8");
    return JSON.parse(json);
  } catch {
    return { readingList: [] };
  }
}

export default async function ReadingListPage() {
  const data = await getData();
  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <section id="reading-list">
          <div className="container">
            <div className="title-block"><h2>Reading List</h2></div>
            <div className="projects-grid">
              {data.readingList?.map((b: { title: string; author?: string; category?: string; summary?: string }, i: number) => (
                <div key={i} className="project-item">
                  <div className="project-title">{b.title}</div>
                  <div className="project-description">
                    {b.author} · <em>{b.category}</em>
                  </div>
                  <p>{b.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

