import React, { useState, useContext } from "react";
import "./signupPage.css";
import { useQuery } from "@apollo/client";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import LocaleContext from "../HelperComp/localeContextProvider";
import GET_SIGNUP_CONTENT from "./graphql";

const SignupPage = () => {
  const navigate = useNavigate();

  const { locale } = useContext(LocaleContext);
  const { loading, error, data } = useQuery(GET_SIGNUP_CONTENT, {
    variables: { locale },
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [responeMsg, setResponeMsg] = useState("");
  const [formErrors, setFormErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Clear errors when the user starts typing again
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));

    // Disable confirm password until password is entered
    if (name === "password") {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "", // Clear confirm password error when password changes
      }));
    }
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;
    return passwordRegex.test(password);
  };

  const validateField = (field) => {
    const errors = {};

    switch (field) {
      case "firstName":
        if (!formData[field].trim()) {
          errors[field] = "First Name is required";
        }
        break;
      case "lastName":
        if (!formData[field].trim()) {
          errors[field] = "Last Name is required";
        }
        break;
      case "email":
        if (!formData[field].trim()) {
          errors[field] = "Email is required";
        } else if (!isValidEmail(formData[field])) {
          errors[field] = "Invalid email format";
        }
        break;
      case "password":
        if (!formData[field].trim()) {
          errors[field] = "Password is required";
        } else if (formData[field].length < 10) {
          errors[field] = "Password must be at least 10 characters";
        } else if (!isValidPassword(formData[field])) {
          errors[field] =
            "Password must contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character";
        }
        break;
      case "confirmPassword":
        if (!formData[field].trim() || formData.password !== formData[field]) {
          errors[field] = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    return errors;
  };

  const handleBlur = (field) => {
    const errors = validateField(field);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errors[field] || "", // Clear the error message if no error
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate form before submission
    const errors = {};
    Object.keys(formData).forEach((field) => {
      const fieldErrors = validateField(field);
      if (Object.keys(fieldErrors).length > 0) {
        errors[field] = fieldErrors[field];
      }
    });
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return; // Prevent form submission if there are errors
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/customers",
        formData
      );
      console.log(response);
      // alert("Success");
      navigate("/signin");
    } catch (error) {
      console.error("Registration process failed");
      console.error(error);
      setResponeMsg(error.response.data.error);
      // alert("Failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || !data.signUpCollection || !data.signUpCollection.items.length) {
    return <p>No data available</p>;
  }

  const { logo, signUp, signUpDescription, signUpData } =
    data.signUpCollection.items[0];

  return (
    <div className="signupMainContainer">
      <div className="signupPage">
        <div className="sections">
          <div className="section1">
            <img src={logo[0].url} alt="logo" />
            <h3>{signUp}</h3>
            <p>{signUpDescription}</p>
          </div>
          <div className="section2">
            <div className="fullNameContainer">
              <input
                className={formErrors.firstName ? "inputError" : ""}
                name="firstName"
                type="text"
                placeholder={signUpData.firstnamePlaceholder}
                value={formData.firstName}
                onChange={handleChange}
                onBlur={() => handleBlur("firstName")}
              />
              {/* {formErrors.firstName && (
              <p className="errorText">{formErrors.firstName}</p>
            )} */}
              <input
                className={formErrors.lastName ? "inputError" : ""}
                name="lastName"
                type="text"
                placeholder={signUpData.lastnamePlaceholder}
                value={formData.lastName}
                onChange={handleChange}
                onBlur={() => handleBlur("lastName")}
              />
              {/* {formErrors.lastName && (
              <p className="errorText">{formErrors.lastName}</p>
            )} */}
            </div>
            <input
              className={formErrors.email ? "inputError" : ""}
              name="email"
              type="email"
              autoComplete="off"
              placeholder={signUpData.emailPlaceholder}
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur("email")}
            />
            {/* {formErrors.email && <p className="errorText">{formErrors.email}</p>} */}
            <input
              className={formErrors.password ? "inputError" : ""}
              name="password"
              type="password"
              value={formData.password}
              placeholder={signUpData.passwordPlaceholder}
              onChange={handleChange}
              onBlur={() => handleBlur("password")}
            />
            {/* {formErrors.password && (
            <p className="errorText">{formErrors.password}</p>
          )} */}
            <div className="confirmPasswordInputContainer">
              <input
                className={formErrors.confirmPassword ? "inputError" : ""}
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder={signUpData.confirmPasswordPlaceholder}
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur("confirmPassword")}
                disabled={!formData.password.trim()} // Disable confirm password if password is not entered
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className="passwordToggleIcon"
                onClick={() => setShowPassword(!showPassword)}
              />
              {
                <p className="errorText">
                  {formErrors.confirmPassword}
                  {responeMsg}
                </p>
              }
            </div>
            <div className="signupScreenButtons">
              <button
                className="alreadyregisteredBtn"
                onClick={() => navigate("/signin")}
              >
                {signUpData.alreadyHaveAccount}
              </button>
              <button className="cancelBtn" onClick={() => navigate("/")}>
                {signUpData.cancelBtn}
              </button>
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

export default SignupPage;
