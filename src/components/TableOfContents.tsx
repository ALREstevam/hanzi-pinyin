import React from 'react';
import { Content } from '../@types/Item';
import styles from './TableOfContents.module.css';

interface TableOfContentsProps {
  sections: Content[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ sections }) => {
  return (
    <div className={styles.tableOfContents}>
      <h2>Table of Contents</h2>
      <ul>
        {sections.map((content, index) => (
          <li key={index}>
            <a href={`#${content.section.h1.replace(/\s+/g, '-').toLowerCase()}`}>
              {content.section.h1}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContents;