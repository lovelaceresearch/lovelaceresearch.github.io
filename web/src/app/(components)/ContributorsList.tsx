"use client";

import { useEffect, useState } from 'react';

interface Contributor {
  name: string;
  city: string;
  role?: string;
  affiliation?: string;
  bio?: string;
  image?: string;
  links?: { url: string; label: string }[];
}

interface ContributorsData {
  contributors: Contributor[];
}

interface ContributorsListProps {
  onHover: (contributor: Contributor | undefined) => void;
  onHoverLeave: () => void;
}

export default function ContributorsList({ onHover, onHoverLeave }: ContributorsListProps) {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    fetch('/data/contributors.json')
      .then(response => response.json())
      .then((data: ContributorsData) => {
        setContributors(data.contributors);
      })
      .catch(error => {
        console.error('Error loading contributors:', error);
      });
  }, []);

  return (
    <div className="contributors-list">
      {contributors.map((contributor, index) => (
        <div 
          key={index} 
          className="contributor-item"
          onMouseEnter={() => onHover(contributor)}
          onMouseLeave={onHoverLeave}
        >
          <span className="contributor-name">{contributor.name}</span>
          <span className="contributor-city">{contributor.city}</span>
        </div>
      ))}
    </div>
  );
}
