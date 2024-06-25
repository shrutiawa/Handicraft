import React, { useState } from "react";
import "../styles/header.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";

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
  const location = useLocation();
  const { pathname } = location;
  const [showDropdown, setShowDropdown] = useState(false);

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
      </div>
      <div className="section2">
        <ul>
          <li
            className={pathname === "/aboutus" ? "active" : "navLinkBar"}
            onClick={() => navigate("/aboutus")}
          >
            About Us
          </li>
          <li
            className={pathname === "/product-list" ? "active" : "navLinkBar"}
            onClick={() => navigate("/product-list")}
          >
            Buy Products
          </li>
          <li
            className={pathname === "/tutorials" ? "active" : "navLinkBar"}
            onClick={() => navigate("/tutorials")}
          >
            Tutorials
          </li>
          <li
            className={pathname === "/blogs" ? "active" : "navLinkBar"}
            onClick={() => navigate("/blogs")}
          >
            Blogs
          </li>
          <li className="navLinkBar" onClick={() => navigate("/")}>
            Become a<br />
            Seller &#x2192;
          </li>
        </ul>
      </div>
      <div className="section3">
        <FontAwesomeIcon className="cartIcon" icon={faShoppingCart} />

        <div
          className="userIconContainer"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <FontAwesomeIcon className="userIcon" icon={faUser} />
          {showDropdown && (
            <>
              <div className="caret-up"></div> {/* Triangular shape */}
              <div className="userDropdown">
                <div className="dropdownContent">
                  <div
                    className="dropdownItem"
                    onClick={() => navigate("/")}
                  >
                    SignIn
                  </div>
                  <div
                    className="dropdownItem"
                    onClick={() => navigate("/signup")}
                  >
                    SignUp
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
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
      </div>
    </ApolloProvider>
  );
};

export default Header;
