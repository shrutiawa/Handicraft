import React, { useState } from "react";
import "../styles/signupPage.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const GET_CONTENT = gql`
  query GetSignUpContent($locale: String!) {
    signUpCollection {
      items {
        logo
        signUp(locale: $locale)
        signUpDescription(locale: $locale)
        signUpData(locale: $locale)
      }
    }
  }
`;

const SignupContent = ({ locale }) => {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || !data.signUpCollection || !data.signUpCollection.items.length) {
    return <p>No data available</p>;
  }

  const { logo, signUp, signUpDescription, signUpData } =
    data.signUpCollection.items[0];

  return (
    <div className="signupPage">
      <img src={logo[0].url} alt="logo" />
      <div className="sections">
        <div className="section1">
          <h3>{signUp}</h3>
          <p>{signUpDescription}</p>
        </div>
        <div className="section2">
            <div className="subsection1">
              <input
                className="nameInput"
                name="fullname"
                type="text"
                placeholder={signUpData.namePlaceholder}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                className="emailInput"
                name="email"
                type="email"
                placeholder={signUpData.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="passwordInpt"
                name="password"
                type="password"
                placeholder={signUpData.passwordPlaceholder}
              />
              <div className="confirmPasswordInputContainer">
                <input
                  name="confirmpassword"
                  type={showPassword ? "text" : "password"}
                  placeholder={signUpData.confirmPasswordPlaceholder}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <FontAwesomeIcon
                  icon={showPassword ? faEye : faEyeSlash}
                  className="passwordToggleIcon"
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
              <div className="signupScreenButtons">
                <button className="alreadyregisteredBtn">
                  {signUpData.alreadyHaveAccount}
                </button>
                <button className="cancelBtn">{signUpData.cancelBtn}</button>
                <button className="signupBtn">
                  {signUpData.signupBtn}
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const SignupPage = () => {
  const [locale, setLocale] = useState("en-US");

  return (
    <ApolloProvider client={client}>
      <div className="signupMainContainer">
        <SignupContent locale={locale} />
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

export default SignupPage;
