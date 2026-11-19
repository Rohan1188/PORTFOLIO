import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { pub } from "../lib/api";
import { useSeo, useSite } from "../lib/site";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import NotFound from "./NotFound";

const when = (d?: string) => (d ? new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "");

export function BlogList() {
  const [posts, setPosts] = useState<any[] | null>(null);
  useSeo("Blog", "Articles and notes.");
  useEffect(() => { pub("/posts").then(setPosts).catch(() => setPosts([])); }, []);
  return (
    <>
      <Nav />
      <main id="main-content" className="container-x pt-36 pb-24">
        <h1 className="font-display font-semibold mb-10" style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>Blog</h1>
        {posts === null ? <p>Loading…</p> : posts.length === 0 ? <p style={{ color: "var(--text-muted)" }}>No posts yet.</p> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <article key={p.id} className="card p-6">
                {p.cover?.url && <img src={p.cover.url} alt="" loading="lazy" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 10, marginBottom: 14 }} />}
                <p className="font-mono text-[11px] mb-2" style={{ color: "var(--text-faint)" }}>{when(p.publishedAt)}{p.category?.name ? ` · ${p.category.name}` : ""}</p>
                <h2 className="font-display text-lg font-semibold mb-2"><Link to={`/blog/${p.slug}`} data-cursor>{p.title}</Link></h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{p.excerpt}</p>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const SITE = useSite();
  const [post, setPost] = useState<any | null | false>(null);
  useEffect(() => { setPost(null); pub(`/posts/${slug}`).then(setPost).catch(() => setPost(false)); }, [slug]);
  useSeo(post ? post.seoTitle || post.title : undefined, post ? post.seoDescription || post.excerpt : undefined, post?.cover?.url);
  useEffect(() => {
    if (!post) return;
    const el = document.createElement("script"); el.type = "application/ld+json";
    el.text = JSON.stringify({ "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, datePublished: post.publishedAt, dateModified: post.updatedAt, author: { "@type": "Person", name: SITE.name }, image: post.cover?.url });
    document.head.appendChild(el); return () => { el.remove(); };
  }, [post, SITE.name]);
  if (post === false) return <NotFound />;
  return (
    <>
      <Nav />
      <main id="main-content" className="container-x pt-36 pb-24" style={{ maxWidth: 760 }}>
        {!post ? <p>Loading…</p> : (
          <article>
            <Link to="/blog" className="text-sm" style={{ color: "var(--crimson)" }}>← All posts</Link>
            <h1 className="font-display font-semibold mt-4 mb-3" style={{ fontSize: "clamp(2rem,4vw,3rem)", lineHeight: 1.1 }}>{post.title}</h1>
            <p className="font-mono text-xs mb-8" style={{ color: "var(--text-faint)" }}>{when(post.publishedAt)}{post.readTime ? ` · ${post.readTime} read` : ""}</p>
            {post.cover?.url && <img src={post.cover.url} alt="" style={{ width: "100%", borderRadius: 14, marginBottom: 28 }} />}
            {/* Body HTML is sanitised on the server before it is stored. */}
            <div className="prose-post" dangerouslySetInnerHTML={{ __html: post.body }} />
            {post.tags?.length > 0 && <div className="flex flex-wrap gap-2 mt-10">{post.tags.map((t: string) => <span key={t} className="tag">{t}</span>)}</div>}
          </article>
        )}
      </main>
      <Footer />
    </>
  );
}
