import React, { useContext, useEffect, useState } from "react";
import "../styles/HomePage.css";
import { Link } from "react-router-dom";
import { ApolloProvider, gql, useQuery } from "@apollo/client";
import client from "./apolloClient";
import LocaleContext from "./localeContextProvider";

const GET_CONTENT = gql`
  query GetHomePageContent($locale: String!) {
    heroBannerCollection(locale: $locale) {
      items {
        bannerImage
        bannerDescription
        textAboveImage
        shopSectionHeading
        shopSectionDesc
        shopSectionButton
        shopSectionImage
        blogHeading
        blogDescription
        blogButton
        stepsToSell
      }
    }
    stepsForSellCollection(locale: $locale) {
      items {
        icon
        text
        order
      }
    }
    blogCollection(locale: $locale, limit: 4) {
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

const HomePageContent = ({ locale }) => {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });
  const [sortedStepsToSell, setSortedStepsToSell] = useState([]);

  useEffect(() => {
    if (data && data.stepsForSellCollection) {
      const sortedSteps = [...data.stepsForSellCollection.items].sort(
        (a, b) => a.order - b.order
      );
      setSortedStepsToSell(sortedSteps);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (
    !data ||
    !data.heroBannerCollection ||
    !data.heroBannerCollection.items.length ||
    !data.stepsForSellCollection ||
    !data.stepsForSellCollection.items.length ||
    !data.blogCollection ||
    !data.blogCollection.items.length
  ) {
    return <p>No data available</p>;
  }

  console.log("Banner heroData: ", data.heroBannerCollection.items[0]);
  console.log("Sell Data: ", data.stepsForSellCollection.items);
  console.log("Blog Data: ", data.blogCollection.items);

  const {
    bannerImage,
    bannerDescription,
    textAboveImage,
    shopSectionImage,
    shopSectionButton,
    shopSectionDesc,
    shopSectionHeading,
    blogButton,
    blogHeading,
    blogDescription,
    stepsToSellTitle,
  } = data.heroBannerCollection.items[0];

  return (
    <>
      <div
        className="homepage-background"
        style={{ backgroundImage: `url(${bannerImage[0].url})` }}
      >
        <div className="overlay">
          <div className="message-container">
            <h1 className="welcome-message">{textAboveImage}</h1>
            <h2 className="welcome-description">{bannerDescription}</h2>
          </div>
        </div>
      </div>

      <div
        className="shop-section"
        style={{ backgroundImage: `url(${shopSectionImage[0].url})` }}
      >
        <div className="shop-overlay"></div>
        <div className="shop-section-content">
          <p className="shop-section-description">{shopSectionDesc}</p>
          <h2 className="shop-section-title">{shopSectionHeading}</h2>
          <button className="shop-section-button">
            <Link to="/product-list">{shopSectionButton}</Link>
          </button>
        </div>
      </div>
      <div className="blog-section">
        <h4>{blogDescription}</h4>
        <h1>{blogHeading}</h1>
        <div className="blogs">
          {data.blogCollection.items.map((post, index) => (
            <div key={index} className="blog-post">
              <img src={post.blogImages[0].url} alt={post.heading} />
              <div className="blog-title-overlay">
                <h3>{post.heading}</h3>
              </div>
            </div>
          ))}
        </div>
        <button className="shop-section-button">
          <Link to="/blogs">{blogButton}</Link>
        </button>
      </div>

      <div className="steps-to-sell-section">
        <h1 className="steps-to-sell-heading">{stepsToSellTitle}</h1>
        <div className="steps-to-sell-content">
          {sortedStepsToSell.map((step, index) => (
            <div key={index} className="step-card">
              {step.icon && step.icon.length > 0 && (
                <img src={step.icon[0].url} alt={step.text} />
              )}
              <div className="step-text">{step.text}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const HomePage = () => {
  const { locale } = useContext(LocaleContext);
  return (
    <ApolloProvider client={client}>
      <HomePageContent locale={locale} />
    </ApolloProvider>
  );
};

export default HomePage;
