import React, { useState, useContext } from "react";
import "../styles/BlogPage.css";
import { Link } from "react-router-dom";
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

const BlogPageContent = ({ locale }) => {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });

  const [searchTerm, setSearchTerm] = useState("");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data?.blogCollection?.items.length) {
    return <p>No data available</p>;
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPosts = data.blogCollection.items.filter((post) =>
    post.heading.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("Filtered Posts: ", filteredPosts);

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search here..."
          onChange={handleSearchChange}
          value={searchTerm}
        />
      </div>
      <div className="blog-container">
        {filteredPosts.map((post, index) => (
          <Link
            key={index}
            to={`/blogcontent/${index}`}
            className="blog-card"
            style={{ textDecoration: "none" }}
          >
            {post.blogImages && post.blogImages.length > 0 && (
              <img
                src={post.blogImages[0].url}
                alt={post.heading}
              />
            )}
            <div className="blog-card-content">
              <h2>{post.heading}</h2>
              {post.shortDescription && (
                <p>{post.shortDescription}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const BlogPage = () => {
  const { locale } = useContext(LocaleContext);

  return (
    <ApolloProvider client={client}>
      <BlogPageContent locale={locale} />
    </ApolloProvider>
  );
};

export default BlogPage;
