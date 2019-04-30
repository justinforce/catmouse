import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";

const App = ({ name }) => {
  return <Typography variant="h1">{name}</Typography>;
};
App.propTypes = {
  name: PropTypes.string.isRequired,
};

export default App;
