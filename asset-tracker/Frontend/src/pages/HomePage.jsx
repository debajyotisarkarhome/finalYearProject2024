import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!localStorage.getItem("asset-tracker-user")) {
          navigate("/login");
        } else {
          setCurrentUser(
            await JSON.parse(localStorage.getItem("asset-tracker-user"))
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {/* <h1>Welcome {currentUser}. This is your HomePage!!!</h1> */}
      <Navbar />
    </>
  );
};

export default HomePage;
