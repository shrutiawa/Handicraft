import React, { useState } from "react";
import "../styles/aboutusPage.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

const GET_CONTENT = gql`
  query GetAboutUsContent($locale: String!) {
    aboutUsCollection {
      items {
        title(locale: $locale)
        image
        description {
          json
        }
        facilitiesLinkCollection {
          items {
            ... on Facilities {
              heading
              icon
              facilityDesc
            }
          }
        }
      }
    }
  }
`;

const AboutUsContent = ({ locale }) => {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });

  // console.log("Locale: ", locale);
  // console.log("Query data: ", data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (
    !data ||
    !data.aboutUsCollection ||
    !data.aboutUsCollection.items.length
  ) {
    return <p>No data available</p>;
  }

  const { title, image, description, facilitiesLinkCollection } =
    data.aboutUsCollection.items[0];

  // console.log("description", description.json.content[0].content[0].value);
  const { value } = description.json.content[0].content[0];
  // console.log(value);

  // console.log(facilitiesLinkCollection.items[0].icon[0].url);

  return (
    <div className="aboutContent">
      <div className="section1">
        <img src={image[0].url} alt="image" />
        <div>
          <h3>{title}</h3>
          <pre>{value}</pre>
        </div>
      </div>
      <div className="section2">
        <p>What We Provide?</p>
        {facilitiesLinkCollection.items.map((item, idx) => (
          <div key={idx} className="facilityCard">
            <img src={item.icon[0].url} alt="img" />
            <p>{item.heading}</p>
            <p>{item.facilityDesc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutUs = () => {
  const [locale, setLocale] = useState("en-US");

  return (
    <ApolloProvider client={client}>
      <div className="aboutusMainContainer">
        <AboutUsContent locale={locale} />
      </div>
    </ApolloProvider>
  );
};

export default AboutUs;
