import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import axios from "axios";
import { registerRoute } from "../utils/APIRoutes";
import { useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { username, email, password } = values;
      try {
        const data = await axios.post(registerRoute, {
          username,
          email,
          password,
        });

        console.log(data);

        if (data.status === 201) {
          navigate("/login");
        } else {
          toast.error(data.message, toastOptions);
        }
      } catch (error) {
        toast.error(error.response.data.error, toastOptions);
      }
    }
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values;

    if (username.trim() === "" || username.length < 3) {
      toast.error(
        "Username should be between 3 to 15 characters !!!",
        toastOptions
      );

      return false;
    } else if (email.length > 50) {
      toast.error(
        "Email length must be less than 50 characters !!!",
        toastOptions
      );

      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password length must be atleast 8 characters !!!",
        toastOptions
      );

      return false;
    } else if (password !== confirmPassword) {
      toast.error(
        "Password and Confirmed password must be same !!!",
        toastOptions
      );

      return false;
    } else return true;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (localStorage.getItem("asset-tracker-user-info")) navigate("/");
  }, []);

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={handleSubmit}>
          <div className="brand">
            <h1>ASSET TRACKER</h1>
          </div>

          {/* Username */}
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={values.username}
            onChange={handleChange}
            required
          />
          {/* Email */}
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            required
          />
          {/* Password */}
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={values.password}
            onChange={handleChange}
            required
          />
          {/* Confirm Password */}
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={values.confirmPassword}
            onChange={handleChange}
            required
          />

          {/* Submit */}
          <button type="submit">Create User</button>
          <span>
            Already have an account ? <Link to="/login">Login</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  background-image: url("/Background Image Login & Register.jpeg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  /* background-color: #131324; */
  .brand {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    img {
      height: 5rem;
      border-radius: 50%;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #000000d6;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.8rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    button {
      background-color: #997af0;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.8rem;
      font-size: 1rem;
      text-transform: uppercase;
      &:hover {
        background-color: #4e0eff;
        transition: 0.5s ease-in-out;
      }
    }
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default React.memo(Register);
