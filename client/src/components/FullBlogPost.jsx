import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import "../styles/FullBlogPost.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import LocaleContext from "./localeContextProvider";

const GET_CONTENT = gql`
  query GetBlogContent($locale: String!) {
    blogCollection(locale: $locale) {
      items {
        heading
        shortDescription
        longDescription {
          json
        }
        blogImages
        authorLink {
          name
        }
      }
    }
  }
`;

const FullBlogContent = ({ locale }) => {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });

  const { index } = useParams();

  console.log("index", index);
  console.log("data: ", data);
  // console.log("post: ", post);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data?.blogCollection?.items.length) {
    return <p>No data available</p>;
  }

  // console.log("Blog Post: ", post);
  console.log("post: ", data.blogCollection.items[index]);
  const post = data.blogCollection.items[index];

  return (
    <div className="full-blog-post">
      <header className="full-blog-post-header">
        <h1 className="full-blog-post-title">{post.heading}</h1>
        {post.blogImages && (
          <img
            src={post.blogImages[0].url}
            alt={post.heading}
            className="full-blog-post-image"
          />
        )}
        <div className="full-blog-post-meta">
          <span>By {post.authorLink.name}</span>
          {/* <span>{new Date(post.sys.createdAt).toLocaleDateString()}</span> */}
        </div>
      </header>

      <section className="full-blog-post-description">
        {post.shortDescription}
      </section>

      {/* <article className="rich-text-body full-blog-post-body">
            <section>{post.fields.longDescription.content[0].content[0].value}</section>
        </article> */}

      <article className="rich-text-body full-blog-post-body">
        {/* {documentToReactComponents(post.longDescription)} */}
      </article>
    </div>
  );
};

const FullBlogPost = () => {
  const { locale } = useContext(LocaleContext);

  return (
    <ApolloProvider client={client}>
      <FullBlogContent locale={locale} />
    </ApolloProvider>
  );
};

export default FullBlogPost;
