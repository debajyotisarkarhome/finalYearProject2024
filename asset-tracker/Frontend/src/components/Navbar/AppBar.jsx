import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AnchorTemporaryDrawer from "./Drawer";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getDeviceList } from "../../utils/APIRoutes";
import axios from "axios";

const ResponsiveAppBar = ({ setLocationMarkers }) => {
  const navigate = useNavigate();
  // console.log("appbar - token",token);

  const [currentUser, setCurrentUser] = useState(undefined);
  const [token, setToken] = useState(false);

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

  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("asset-tracker-user-info");
    navigate("/login");
  };

  return (
    currentUser && (
      <AppBar position="fixed">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AnchorTemporaryDrawer setLocationMarkers={setLocationMarkers} currentUser={currentUser} token={token} />

            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                m: 2,
                display: { xs: "flex" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              ASSET TRACKER
            </Typography>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={currentUser} src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem sx={{ justifyContent: "center" }}>
                  <Typography>{currentUser}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ marginRight: 2 }} />
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    )
  );
};
export default React.memo(ResponsiveAppBar);
