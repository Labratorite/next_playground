import { Metadata } from 'next';
import { getSortedArticlesData, getArticleData, ArticleData } from 'lib/articles';
import Date from 'components/date';
import utilStyles from 'styles/utils.module.scss';

type PageParams = Pick<ArticleData, 'id'>;

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  // read route params then fetch data
  const { id } = params;
  const article = await getArticleData(id);
  // return an object
  return {
    title: article.title,
  };
}

export default async function Article({ params }: { params: PageParams }) {
  const { id } = params;
  const article = await getArticleData(id);

  return (
    <>
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

export const dynamicParams = true;
export const generateStaticParams = async () => {
  const articles = getSortedArticlesData();
  return articles.map(({ id }) => ({ id }));
}
/*
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
*/
