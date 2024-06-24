import React, { useState } from "react";
import "../styles/header.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const GET_CONTENT = gql`
  query GetHeaderContent($locale: String!) {
    headerCollection {
      items {
        logo
        title(locale: $locale)
      }
    }
  }
`;

const HeaderContent = ({ locale }) => {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });
  const navigate = useNavigate();
  console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || !data.headerCollection || !data.headerCollection.items.length) {
    return <p>No data available</p>;
  }

  const { logo, title } = data.headerCollection.items[0];
  

  return (
    <div className="headerContent">
      <div className="section1">
        <img src={logo[0].url} alt="logo" onClick={() => navigate("/")} />
        {/* <p>{title}</p> */}
      </div>
      <div className="section2">
        <ul>
          <li onClick={() => navigate("/")}>About Us</li>
          <li onClick={() => navigate("/product-list")}>Buy Products</li>
          <li onClick={() => navigate("/tutorials")}>Tutorials</li>
          <li onClick={() => navigate("/")}>Blogs</li>
          <li onClick={() => navigate("/")}>Become a Seller &#x2192; </li>
        </ul>
      </div>
      <div className="section3">
        <FontAwesomeIcon className="cartIcon" icon={faShoppingCart} />
        <FontAwesomeIcon className="userIcon" icon={faUser} />
      </div>
    </div>
  );
};

const Header = () => {
  const [locale, setLocale] = useState("en-US");

  return (
    <ApolloProvider client={client}>
      <div className="headerMainContainer">
        <HeaderContent locale={locale} />
        {/* <div className="languageSwitcher">
          <select
            name="selectlanguage"
            id="selectlanguage"
            onChange={(event) => setLocale(event.target.value)}
          >
            <option value="en-US">English</option>
            <option value="hi-IN">Hindi</option>
          </select>
        </div> */}
        <hr />
      </div>
    </ApolloProvider>
  );
};

export default Header;
