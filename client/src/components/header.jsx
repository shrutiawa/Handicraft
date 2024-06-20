import React, { useState } from "react";
import "../styles/signinPage.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

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
  console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || !data.headerCollection || !data.headerCollection.items.length) {
    return <p>No data available</p>;
  }

  const {logo, title} = data.headerCollection.items[0];

  return <div>
    <img src={logo[0].url} alt="logo" />
    <p>{title}</p>
  </div>;
};

const Header = () => {
  const [locale, setLocale] = useState("en-US");

  return (
    <ApolloProvider client={client}>
      <div className="headerMainContainer">
        <HeaderContent locale={locale} />
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

export default Header;
