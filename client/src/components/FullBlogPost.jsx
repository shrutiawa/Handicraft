import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import "../styles/FullBlogPost.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import LocaleContext from "./localeContextProvider";
import { useLocation } from "react-router-dom";

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

  const location = useLocation();
  console.log("Location state: ", location.state);
  const { post } = location.state;

  console.log("id", post);
  console.log("data: ", data);
  // console.log("post: ", post);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data?.blogCollection?.items.length) {
    return <p>No data available</p>;
  }

  // console.log("Blog Post: ", post);
  // console.log("post: ", data.blogCollection.items[index]);
  // const post = data.blogCollection.items[index];

  const {
    heading,
    blogImages,
    shortDescription,
    longDescription,
    authorLink,
    sys,
  } = post;

  console.log("Longdescription: ", longDescription.json.content);
  // const { value } = longDescription.json.content[0].content[0];
  // console.log(value);

  return (
    <div className="full-blog-post">
      <header className="full-blog-post-header">
        <h1 className="full-blog-post-title">{heading}</h1>
        {blogImages && (
          <img
            src={blogImages[0].url}
            alt={heading}
            className="full-blog-post-image"
          />
        )}
        <div className="full-blog-post-meta">
          <span>By {authorLink.name}</span>
          <span>{new Date(sys.publishedAt).toLocaleDateString()}</span>
        </div>
      </header>

      <section className="full-blog-post-description">
        {shortDescription}
      </section>

      {/* <article className="rich-text-body full-blog-post-body">
            <section>{fields.longDescription.content[0].content[0].value}</section>
        </article> */}

      <article className="rich-text-body full-blog-post-body">
        {longDescription && documentToReactComponents(longDescription.json)}
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
