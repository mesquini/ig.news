import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head";
import { RichText } from "prismic-dom";

import styles from "../post.module.scss";
import { getPrismicClient } from "../../../services/prismic";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}
interface IPostPreviewProps {
  post: Post
}

export default function PostPreview({ post }: IPostPreviewProps) {
  const { data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (data?.activeSubscription)
      router.push(`/post/${post.slug}`)
  },[data, post.slug, router])

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
           className={`${styles.postContent} ${styles.previewContent}`}
           dangerouslySetInnerHTML={{__html: post.content}} />

           <div className={styles.continueReading}>
             Wanna continue reading?
             <Link href="/">
              <a>Subscribe now 🤗</a>
             </Link>
           </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID<any>('publication', String(slug), {});
  const post =  {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-Br', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return { 
    props: {
      post
    },
    revalidate: 60 * 60 * 24
  }
}