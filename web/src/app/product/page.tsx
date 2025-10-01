import { Metadata } from "next";
import Sidebar from "../(components)/Sidebar";
import Footer from "../(components)/Footer";

export const metadata: Metadata = {
  title: "Product - Lovelace Research",
};

export default function ProductPage() {
  return (
    <div className="page-container">
      <Sidebar />
      <main className="main-content">
        <section id="product">
          <div className="container">
            <div className="title-block"><h2>Product</h2></div>
            <div className="subtitle-block">
              <h2>Selected products and outcomes from our R&D practice.</h2>
            </div>
            <p style={{ paddingLeft: '12px', paddingRight: '12px' }}>
              This page will showcase product initiatives and releases. Content coming soon.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}


