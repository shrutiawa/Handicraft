import React, { useState } from "react";
import "../styles/footer.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

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

const FooterContent = ({ locale }) => {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });
  console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || !data.headerCollection || !data.headerCollection.items.length) {
    return <p>No data available</p>;
  }

  const { logo, title } = data.headerCollection.items[0];

  return (
    <div className="footerContent">
      <div className="section1">
        &copy; HandiCraft 2024, All Rights Reserved.
      </div>
      <div className="section2">
        <p>Connect with us on</p>
        <div className="socialIcons">
          <FontAwesomeIcon className="icons" icon={faFacebook} />
          <FontAwesomeIcon className="icons" icon={faInstagram} />
          <FontAwesomeIcon className="icons" icon={faTwitter} />
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [locale, setLocale] = useState("en-US");

  return (
    <ApolloProvider client={client}>
      <div className="footerMainContainer">
        <FooterContent locale={locale} />
        <div className="languageSwitcher">
          <select
            name="selectlanguage"
            id="selectlanguage"
            onChange={(event) => setLocale(event.target.value)}
          >
            <option value="en-US">English</option>
            <option value="hi-IN">Hindi</option>
          </select>
        </div>
      </div>
    </ApolloProvider>
  );
};

export default Footer;
