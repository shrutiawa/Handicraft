import React, { useState } from "react";
import "../styles/signinPage.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const GET_CONTENT = gql`
  query GetLoginContent($locale: String!) {
    loginCollection {
      items {
        logo
        signIn(locale: $locale)
        signInDescription(locale: $locale)
        loginData(locale: $locale)
      }
    }
  }
`;

const SigninContent = ({ locale }) => {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  console.log(locale);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || !data.loginCollection || !data.loginCollection.items.length) {
    return <p>No data available</p>;
  }

  const { logo, signIn, signInDescription, loginData } =
    data.loginCollection.items[0];

  return (
    <div className="loginPage">
      <img src={logo[0].url} alt="logo" />
      <div className="sections">
        <div className="section1">
          <h3>{signIn}</h3>
          <p>{signInDescription}</p>
        </div>
        <div className="section2">
          <input
            className="emailInput"
            name="email"
            type="email"
            placeholder={loginData.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="passwordInputContainer">
            <input
              className="passwordInput"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder={loginData.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="passwordToggleIcon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <button className="forgotPasswordButton">
            {loginData.forgotPasswordBtn}
          </button>
          <div className="loginScreenButtons">
            <button className="registerButton">{loginData.registerBtn}</button>
            <button className="loginButton" type="submit">
              {loginData.loginBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SigninPage = () => {
  const [locale, setLocale] = useState("en-US");

  return (
    <ApolloProvider client={client}>
      <div className="loginMainContainer">
        <SigninContent locale={locale} />
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

export default SigninPage;
