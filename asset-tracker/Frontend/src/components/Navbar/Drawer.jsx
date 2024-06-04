import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDeviceList, getDeviceLogs } from "../../utils/APIRoutes";
import axios from "axios";
import { toast } from "react-toastify";

const AnchorTemporaryDrawer = ({ setLocationMarkers, currentUser, token }) => {
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [state, setState] = useState({
    left: false,
  });

  const [assetData, setAssetData] = useState(null);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await axios.post(
          getDeviceList,
          {
            username: currentUser,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.status === 200) {
          setAssetData(data.data.deviceList);
        } else {
          toast.error("Please try again...", toastOptions);
        }
      } catch (error) {
        toast.error(error.response.data.error, toastOptions);
      }
    }
    currentUser && fetchData();
  }, []);

  const [selectedIndex, setSelectedIndex] = React.useState(null);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const handleOnClickAssetData = async (deviceId) => {
    try {
      // console.log(deviceId);

      const data = await axios.post(
        getDeviceLogs,
        {
          deviceId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );


      if (data.status === 200) {
        setLocationMarkers(JSON.stringify(data.data));
      } else {
        toast.error(data.data.deviceList, toastOptions);
      }

      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error, toastOptions);
    }
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 300 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Box sx={{ p: 1.5 }}>
            <Fab size="small" color="primary" aria-label="add">
              <AddIcon onClick={handleOnClickAddAsset} />
            </Fab>
          </Box>
          <Box sx={{ paddingTop: 3, cursor: "pointer" }}>
            <h3 onClick={handleOnClickAddAsset}>Add Assets</h3>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row-reverse", p: 1.5 }}>
          <Fab size="small" color="tertiary" aria-label="add">
            <CloseIcon />
          </Fab>
        </Box>
      </Box>

      {assetData ? (
        <List>
          {assetData.map((data, index) => {
            return (
              <div
                style={{
                  backgroundColor: selectedIndex === index ? "skyblue" : "",
                }}
                key={index}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={(event) => handleListItemClick(event, index)}
                  >
                    <ListItemIcon>
                      <RadioButtonCheckedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={data.deviceId}
                      onClick={() => handleOnClickAssetData(data.deviceId)}
                    />
                  </ListItemButton>
                </ListItem>
              </div>
            );
          })}
        </List>
      ) : (
        <></>
      )}
    </Box>
  );

  const handleOnClickAddAsset = () => {
    navigate("/addDevice");
  };

  return (
    <>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          {/* <Button onClick={toggleDrawer(anchor, true)}> */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={toggleDrawer(anchor, true)}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          {/* </Button> */}
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </>
  );
};

export default React.memo(AnchorTemporaryDrawer);
