import React, { useState, useContext } from "react";
import "../styles/header.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import LocaleContext from "./localeContextProvider";

const GET_CONTENT = gql`
  query GetHeaderContent($locale: String!) {
    headerCollection {
      items {
        logo
        links(locale: $locale)
      }
    }
  }
`;

const HeaderContent = ({ locale, setLocale }) => {
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

  const switchLang = () =>{
    if(locale === "en-US"){
      setLocale("hi-IN")
    }
    else{
      setLocale("en-US")
    }
  }

  const { logo, links } = data.headerCollection.items[0];
  const {
    aboutUs,
    buyProduct,
    tutorials,
    blogs,
    becomeSeller,
    signIn,
    signUp,
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
          <li className="navLinkBar" onClick={() => navigate("/")}>
            {becomeSeller} &#x2192;
          </li>
        </ul>
      </div>
      <div className="section3">
        <button onClick={() => switchLang()}>Switch Language</button>
        <FontAwesomeIcon className="cartIcon" icon={faShoppingCart} />

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
                  <div className="dropdownItem" onClick={() => navigate("/")}>
                    {signIn}
                  </div>
                  <div
                    className="dropdownItem"
                    onClick={() => navigate("/signup")}
                  >
                    {signUp}
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
  const { locale, setLocale } = useContext(LocaleContext);

  return (
    <ApolloProvider client={client}>
      <div className="headerMainContainer">
        <HeaderContent locale={locale} setLocale={setLocale} />
      </div>
    </ApolloProvider>
  );
};

export default Header;
