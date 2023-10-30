import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const articlesDirectory = path.join(process.cwd(), 'articles');

export type ArticleMeta = {
  title?: string;
  date?: string;
}
export type ArticleData = ArticleMeta & { id: string, contentHtml?: string };

export function getSortedArticlesData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(articlesDirectory);
  const allPostsData = fileNames.map<ArticleData>((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(articlesDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    const meta = matterResult.data as ArticleMeta;
    // Combine the data with the id
    return {
      id,
      ...meta,
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (`${a.date}` < `${b.date}`) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getArticleData(id: string) {
// export const getArticleData = async (id: string) => {
  const fullPath = path.join(articlesDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const meta = matterResult.data as ArticleMeta;

  // Combine the data with the id
  return {
    id,
    contentHtml,
    ...meta,
  };
}
