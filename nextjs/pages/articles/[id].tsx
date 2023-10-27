import { GetStaticPaths, GetStaticProps } from "next";
import Head from 'next/head';
import { useRouter } from 'next/router'
import { getSortedArticlesData, getArticleData, ArticleData } from 'lib/articles';
import Date from 'components/date';
import utilStyles from 'styles/utils.module.scss';

type PageProps = { article?: ArticleData };
type PageParams = Pick<ArticleData, 'id'>;

export default function Article(props: PageProps) {
  const { article } = props;
  const { isFallback } = useRouter();

  if (isFallback || !article) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>{article.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{article.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={article.date} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: article.contentHtml || '' }} />
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths<PageParams> = async () => {
  const articles = getSortedArticlesData();
  return {
    paths: articles.map(({ id }) => ({ params: { id }})),
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps<PageProps, PageParams> = async ({params}) => {

  try {
    if (!params?.id) throw new Error('page param not found');

    const { id } = params;
    const article = await getArticleData(id);
    return { props: { article }, revalidate: 1,};
  } catch (error) {
    return { notFound: true };
  }
}
