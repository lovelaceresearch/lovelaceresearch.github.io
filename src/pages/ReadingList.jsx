import React from 'react';
import Layout from '../components/Layout';

const ReadingList = () => {
  return (
    <Layout>
      <div className="container">
        <div className="title-block">
          <h2>Reading List</h2>
        </div>
        <p>A curated reading list from Lovelace Research.</p>
      </div>
    </Layout>
  );
};

export default ReadingList;
