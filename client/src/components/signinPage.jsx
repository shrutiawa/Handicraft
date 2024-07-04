import React, { useState, useContext } from "react";
import axios from "axios";
import "../styles/signinPage.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import LocaleContext from "./localeContextProvider";

const GET_CONTENT = gql`
  query GetLoginContent($locale: String!) {
    loginCollection(locale: $locale) {
      items {
        logo
        signIn
        signInDescription
        loginData
      }
    }
  }
`;

const SigninContent = () => {
  const { locale, handleAuthChange } = useContext(LocaleContext);
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();

  const handleSignInClick = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      const data = response.data;
      setMessage(data.message);
      localStorage.setItem("customer", data.customerId);
      if (data.message === "Login success") {
        localStorage.setItem("loggedIn", "true");
        handleAuthChange();
        navigate("/product-list");
      }
    } catch (error) {
      console.log(error.response.data.error);
      setErrors(error.response.data.error);
    }
  };

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
          <p className="signInError">{errors}</p>
          <input
            className={`emailInput ${errors ? "inputError" : ""}`}
            name="email"
            type="email"
            placeholder={loginData.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="passwordInputContainer">
            <input
              className={`passwordInput ${errors ? "inputError" : ""}`}
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
            <button
              className="registerButton"
              onClick={() => navigate("/signup")}
            >
              {loginData.registerBtn}
            </button>
            <button className="loginButton" onClick={handleSignInClick}>
              {loginData.loginBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SigninPage = () => {
  return (
    // <ApolloProvider client={client}>
    <div className="loginMainContainer">
      <SigninContent />
    </div>
    // </ApolloProvider>
  );
};

export default SigninPage;
