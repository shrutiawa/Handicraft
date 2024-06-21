import React, { useState } from "react";
import axios from "axios"
import "../styles/signinPage.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

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
  const navigate =useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address.",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }
  };

  const handleSignInClick = () => {
    let valid = true;

    if (!validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address.",
      }));
      valid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    if (password.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password cannot be empty.",
      }));
      valid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }

    if (valid) {
      // Handle the sign-in logic here
      // console.log("Form is valid. Proceed with sign-in.");
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', { email, password }); // Adjust the URL if needed
      const data = response.data;
      console.log(data)
      setMessage(data.message);
      navigate("/product-list")

      localStorage.setItem("customer",data.customerId)
      if (data.token) {
        // Redirect user to another page upon successful login
        window.location.href = '/'; // Adjust the URL as needed.
      }
    } catch (error) {
      console.log("Login process failed")
      setMessage('Login failed. Please try again.');
      console.error(error);
    }
  };

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
            onBlur={handleEmailBlur}
          />
          {errors.email && <p className="error">{errors.email}</p>}
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
          {errors.password && <p className="error">{errors.password}</p>}
          <button className="forgotPasswordButton">
            {loginData.forgotPasswordBtn}
          </button>
          <div className="loginScreenButtons">
            <button className="registerButton" onClick={()=>navigate("/signup")}>{loginData.registerBtn}</button>
            <button
              className="loginButton"
              type="button"
              onClick={handleSignInClick}
            >
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
