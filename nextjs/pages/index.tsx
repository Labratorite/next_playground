import { GetStaticProps } from "next";
import Link from "next/link";
import Head from "next/head";
import { getSortedArticlesData, ArticleData } from 'lib/articles';
import Date from 'components/date';
import styles from "styles/Home.module.css";
import utilStyles from "styles/utils.module.scss";

type Props = {
  allPostsData: ArticleData[];
};

export default function Home(props: Props) {
  const { allPostsData } = props;
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={utilStyles.headingMd}>
        <p>
          Hi, this is KK, I'm a software enginer. I'm working on tutorial of Next.js.
        </p>
        <ul>
          <li><Link href="https://github.com/Labratorite">Github</Link></li>
        </ul>
        <p>
          (This is a sample website - you’ll be building a site like this on{" "}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
        <p>
          <Link href="/posts/first-post">Here</Link> is changing route
        </p>
      </section>

      {/* Add this <section> tag below the existing <section> tag */}
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/articles/${id}`}>{title}</Link>
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
          Powered by{" "}
          <img src="/vercel.svg" alt="Vercel" className={styles.logo} />
        </a>
      </footer>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const allPostsData = getSortedArticlesData();
  return {
    props: {
      allPostsData,
    },
  };
}
