import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import axios from "axios";
import { addDeviceRoute } from "../utils/APIRoutes";
import { v4 as uuid } from "uuid";

const AddAsset = () => {
  // console.log("add asset- ",username);
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(undefined);

  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!localStorage.getItem("asset-tracker-user-info")) {
          navigate("/login");
        } else {
          const data = await JSON.parse(
            localStorage.getItem("asset-tracker-user-info").split(",")
          );
          // console.log(data);

          setCurrentUser(data[0]);

          setToken(data[1]);

          // console.log("home - ", data[0], data[1]);
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const [values, setValues] = useState({
    deviceId: "",
  });

  const [deviceAuthCode, setDeviceAuthCode] = useState("");

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
      const { deviceId } = values;
      try {
        const data = await axios.post(
          addDeviceRoute,
          {
            currentUser,
            deviceId,
            deviceAuthCode,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.status === 200) {
          navigate("/");
        } else {
          toast.error(data.data.message, toastOptions);
        }
      } catch (error) {
        toast.error(error.response.data.error, toastOptions);
      }
    }
  };

  const handleValidation = () => {
    const { deviceId } = values;

    if (deviceId.length > 20) {
      toast.error(
        "Device Id length must be less than 50 characters !!!",
        toastOptions
      );

      return false;
    } else return true;
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const uuidFromUuidV4 = () => {
    const newUuid = uuid();
    // console.log(newUuid);

    setDeviceAuthCode(newUuid);
    console.log("add asset -", deviceAuthCode);
  };

  const onGenerateButtonClick = () => {
    if (!currentUser || !values.deviceId)
      toast.error("Please fill the required fields...", toastOptions);
    else uuidFromUuidV4();
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={handleSubmit}>
          <div className="brand">
            {/* <img src={Logo} alt="" /> */}
            <h1>ASSET TRACKER</h1>
          </div>

          {/* DeviceId */}
          <input
            type="text"
            name="deviceId"
            id="deviceId"
            placeholder="Device Id"
            value={values.deviceId}
            onChange={handleChange}
            required
          />

          {/* Generating DeviceAuthCode */}
          <button
            type="button"
            name="deviceAuthCode"
            id="deviceAuthCode"
            onClick={onGenerateButtonClick}
          >
            <span>Generate Device_Auth_Code</span>
          </button>

          {/* Genrated DeviceAuthCode */}
          <input
            name="deviceAuthCode"
            id="deviceAuthCode"
            value={deviceAuthCode}
            placeholder="UUID"
            disabled={true}
            onChange={(e) => setDeviceAuthCode(e.target.value)}
          />

          {/* Submit */}
          <button type="submit">Add ASSETS</button>
          <span>
            <Link to="/">Go to Dashboard</Link>
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
  background-image: url("/Background Image Login & Register.gif");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  /* background-color: #1313247e; */
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
    p {
      color: white;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000072;
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
      text-align: center;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default React.memo(AddAsset);
