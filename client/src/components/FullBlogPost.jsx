import React, { useState, useEffect } from "react";
import * as contentful from "contentful";
import { useParams } from "react-router-dom";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import "../styles/FullBlogPost.css";

const client = contentful.createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
});

const FullBlogPost = () => {
  const [post, setPost] = useState(null);
  const { id } = useParams();
  console.log("id", id);
  useEffect(() => {
    client
      .getEntry(id) // Fetching entry by its ID
      .then((entry) => {
        setPost(entry);
      })
      .catch(console.error);
  }, [id]);

  if (!post) return <div>Loading...</div>; // Show loading state or spinner
  console.log("Blog Post: ", post);

  return (
    <div className="full-blog-post">
      <header className="full-blog-post-header">
        <h1 className="full-blog-post-title">{post.fields.heading}</h1>
        {post.fields.blogImages && (
          <img
            src={post.fields.blogImages[0].url}
            alt={post.fields.heading}
            className="full-blog-post-image"
          />
        )}
        <div className="full-blog-post-meta">
          <span>By {post.fields.authorLink.fields.name}</span>
          <span>{new Date(post.sys.createdAt).toLocaleDateString()}</span>
        </div>
      </header>

      <section className="full-blog-post-description">
        {post.fields.shortDescription}
      </section>

      {/* <article className="rich-text-body full-blog-post-body">
            <section>{post.fields.longDescription.content[0].content[0].value}</section>
        </article> */}

      <article className="rich-text-body full-blog-post-body">
        {documentToReactComponents(post.fields.longDescription)}
      </article>
    </div>
  );
};

export default FullBlogPost;
