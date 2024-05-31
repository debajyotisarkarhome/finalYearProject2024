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
import DirectionsCarFilledTwoToneIcon from "@mui/icons-material/DirectionsCarFilledTwoTone";
import TwoWheelerTwoToneIcon from "@mui/icons-material/TwoWheelerTwoTone";
import PedalBikeTwoToneIcon from "@mui/icons-material/PedalBikeTwoTone";
import DirectionsTransitTwoToneIcon from "@mui/icons-material/DirectionsTransitTwoTone";
import LocalShippingTwoToneIcon from "@mui/icons-material/LocalShippingTwoTone";
import AirplanemodeActiveTwoToneIcon from "@mui/icons-material/AirplanemodeActiveTwoTone";
import CottageTwoToneIcon from "@mui/icons-material/CottageTwoTone";
import MapsHomeWorkTwoToneIcon from "@mui/icons-material/MapsHomeWorkTwoTone";
import { useState } from "react";

export default function AnchorTemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  let allAssetData = [
    {
      name: "Car",
      type: <DirectionsCarFilledTwoToneIcon />,
      present: false,
    },
    {
      name: "Bike",
      type: <TwoWheelerTwoToneIcon />,
      present: false,
    },
    {
      name: "Cycle",
      type: <PedalBikeTwoToneIcon />,
      present: false,
    },
    {
      name: "Train",
      type: <DirectionsTransitTwoToneIcon />,
      present: false,
    },
    {
      name: "Truck",
      type: <LocalShippingTwoToneIcon />,
      present: false,
    },
    {
      name: "Airplane",
      type: <AirplanemodeActiveTwoToneIcon />,
      present: false,
    },
    {
      name: "Home",
      type: <CottageTwoToneIcon />,
      present: false,
    },
    {
      name: "Apartment",
      type: <MapsHomeWorkTwoToneIcon />,
      present: false,
    },
  ];

  localStorage.setItem("asset-data", [
    "Car",
    "Cycle",
    "Truck",
    "Bike",
    "Train", 
    "Apartment",
  ]);

  let assetData = localStorage.getItem("asset-data").split(",");
  console.log(assetData);

  if (assetData)
    assetData.map((data) => {
      let ind = allAssetData.findIndex((p) => p.name === data.trim());
      if (ind) 
        allAssetData = [...allAssetData, (allAssetData[ind].present = true)];
    });

  console.log(assetData[0].present);

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
              <AddIcon />
            </Fab>
          </Box>
          <Box sx={{ paddingTop: 3 }}>
            <h3>Add Assets</h3>
          </Box>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row-reverse", p: 1.5 }}>
          <Fab size="small" color="tertiary" aria-label="add">
            <CloseIcon />
          </Fab>
        </Box>
      </Box>

      <List>
        {allAssetData.map((data, index) => {
          if (data.present)
            return (
              <ListItem key={index} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{data.type}</ListItemIcon>
                  <ListItemText primary={data.name} />
                </ListItemButton>
              </ListItem>
            );
        })}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
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
    </div>
  );
}
