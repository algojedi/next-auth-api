import React from 'react';
import styles from './log-list.module.css';

type LogListProps = {
  logs: string[];
  title?: string;
  redText?: string;
};

const LogList = ({ logs, title, redText }: LogListProps) => {
  return (
    <section>
      {title && <h2>{title}</h2>}
      <ul className={styles.logList}>
        {logs.map((log, i) => (
          <li
            key={i}
            className={redText && log.includes(redText) ? styles.redText : ''}
          >
            {log}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default LogList;
