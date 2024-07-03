import React, { useContext, useState } from "react";
import "../styles/header.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import LocaleContext from "./localeContextProvider";

const GET_CONTENT = gql`
  query GetHeaderContent($locale: String!) {
    headerCollection(locale: $locale) {
      items {
        logo
        links
      }
    }
  }
`;

const HeaderContent = () => {
  const { locale, setLocale, loggedIn, handleAuthChange } =
    useContext(LocaleContext);
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

  const switchLang = () => {
    if (locale === "en-US") {
      setLocale("hi-IN");
    } else {
      setLocale("en-US");
    }
  };

  const { logo, links } = data.headerCollection.items[0];
  const {
    aboutUs,
    buyProduct,
    tutorials,
    blogs,
    becomeSeller,
    signIn,
    signUp,
    signOut,
    orderHistory,
  } = links;

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
            {aboutUs}
          </li>
          <li
            className={pathname === "/product-list" ? "active" : "navLinkBar"}
            onClick={() => navigate("/product-list")}
          >
            {buyProduct}
          </li>
          <li
            className={pathname === "/tutorials" ? "active" : "navLinkBar"}
            onClick={() => navigate("/tutorials")}
          >
            {tutorials}
          </li>
          <li
            className={pathname === "/blogs" ? "active" : "navLinkBar"}
            onClick={() => navigate("/blogs")}
          >
            {blogs}
          </li>
          <li className="navLinkBar" onClick={() => navigate("/add-product")}>
            {becomeSeller}
          </li>
        </ul>
      </div>
      <div className="section3">
        <div className="button-container">
          <label className="switch">
            <input
              type="checkbox"
              onChange={switchLang}
              checked={locale === "hi-IN"}
            />
            <span className="slider"></span>
            <span id="hi-icon">अ</span>
            <span id="eng-icon">A</span>
          </label>
        </div>

        <FontAwesomeIcon
          className="cartIcon"
          icon={faShoppingCart}
          onClick={() => navigate("/cart")}
        />

        <div
          className="userIconContainer"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <FontAwesomeIcon className="userIcon" icon={faUser} />
          {showDropdown && (
            <>
              <div className="caret-up"></div>
              <div className="userDropdown">
                <div className="dropdownContent">
                  {loggedIn ? (
                    <>
                      <div
                        className="dropdownItem"
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/order-history");
                        }}
                      >
                        {orderHistory}
                      </div>
                      <div
                        className="dropdownItem"
                        onClick={() => {
                          setShowDropdown(false);
                          localStorage.setItem("loggedIn", "false");
                          handleAuthChange();
                          navigate("/");
                        }}
                      >
                        {signOut}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="dropdownItem"
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/signin");
                        }}
                      >
                        {signIn}
                      </div>
                      <div
                        className="dropdownItem"
                        onClick={() => {
                          setShowDropdown(false);
                          navigate("/signup");
                        }}
                      >
                        {signUp}
                      </div>
                    </>
                  )}
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
  return (
    // <ApolloProvider client={client}>
    <div className="headerMainContainer">
      <HeaderContent />
    </div>
    // </ApolloProvider>
  );
};

export default Header;
