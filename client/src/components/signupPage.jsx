import React, { useState } from "react";
import "../styles/signupPage.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import axios from "axios"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { handleError } from "@apollo/client/link/http/parseAndCheckHttpResponse";

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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || !data.signUpCollection || !data.signUpCollection.items.length) {
    return <p>No data available</p>;
  }

  const { logo, signUp, signUpDescription, signUpData } =
    data.signUpCollection.items[0];

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };

    // // Check if passwords match
    // if (formData.password !== formData.confirmPassword) {
    //   setPasswordError("Passwords do not match");
    //   return;
    // } else {
    //   setPasswordError(""); // Clear any existing error message
    // }

    try {
      console.log("fomdata",formData)
      const response = await axios.post(
        "http://localhost:5000/customers",
        formData
      
      );
      console.log("......................",response)
      const data = response;
      // navigate("/login");
      alert("Success");
    } catch (error) {
      console.error("Registration process failed");
      console.error(error);
      alert("Failed");
    }
  };

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
              className="firstNameInput"
              name="firstname"
              type="text"
              placeholder={signUpData.namePlaceholder}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="lastNameInput"
              name="lastname"
              type="text"
              placeholder={signUpData.namePlaceholder}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
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
              value={password}
              placeholder={signUpData.passwordPlaceholder}
              onChange={(e) => setPassword(e.target.value)}
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
              <button className="signupBtn" onClick={handleSignUp}>
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
