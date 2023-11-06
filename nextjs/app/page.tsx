import { Metadata } from 'next';
import Link from "next/link";
import { getSortedArticlesData } from 'lib/articles';
import Date from 'components/date';
import styles from "styles/Home.module.css";
import utilStyles from "styles/utils.module.scss";
import Image from "next/image";

if (process.env.USE_IN_MEMORY_STORAGE === "true") {
  require('@models');
}

export const metadata: Metadata = {
  title: 'Create Next App',
};

export default function Home() {
  const allPostsData = getSortedArticlesData();
  return (
    <>
      <article className={utilStyles.headingMd}>
        <p>
          {"Hi, this is KK, I'm a software enginer. I'm working on tutorial of Next.js based on Page Router."}
          {"After then, I do some private study with App Router."}
        </p>
        <ul>
          <li><Link href="https://github.com/Labratorite">Github</Link></li>
        </ul>
        <p>
          (This is a sample website - you’ll be building a site like this on{" "}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
        <p>Private Study with App Routing below.</p>
        <p>
          <Link href="/workflows">Here</Link> is changing route
        </p>
        <p>
          <Link href="/posts">Here</Link> is changing route2
        </p>
      </article>

      {/* Add this <section> tag below the existing <section> tag */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>

      <footer>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className={styles.logo}>
            Powered by{" "}
            <Image src="/vercel.svg" alt="Vercel" fill />
          </div>
        </a>
      </footer>
    </>
  );
}
