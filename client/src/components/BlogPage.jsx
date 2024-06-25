import React, { useState, useEffect } from "react";
import * as contentful from "contentful";
import "../styles/BlogPage.css";
import { Link } from "react-router-dom";

const client = contentful.createClient({
  space: process.env.REACT_APP_CONTENTFUL_SPACE_ID,
  accessToken: process.env.REACT_APP_CONTENTFUL_ACCESS_TOKEN,
});

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    client
      .getEntries({ content_type: "blog" })
      .then((response) => {
        console.log(response.items);
        setBlogPosts(response.items);
      })
      .catch(console.error);
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPosts = blogPosts.filter((post) =>
    post.fields.heading.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search blog posts..."
          onChange={handleSearchChange}
          value={searchTerm}
        />
      </div>
      <div className="blog-container">
        {filteredPosts.map((post) => (
          <Link
            key={post.sys.id}
            to={`/blogcontent/${post.sys.id}`}
            className="blog-card"
            style={{ textDecoration: "none" }}
          >
            {post.fields.blogImages && (
              <img
                src={post.fields.blogImages[0].url}
                alt={post.fields.heading}
              />
            )}
            <div className="blog-card-content">
              <h2>{post.fields.heading}</h2>
              {post.fields.shortDescription && (
                <p>{post.fields.shortDescription}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
