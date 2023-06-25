import React from "react";
import { Spinner } from "reactstrap";

const Loader = () => {
  return (
    <div className="loader-container">
        <div className="loader">
            <Spinner
                className="loader-spin"
                color="primary"
                style={{
                height: "3rem",
                width: "3rem",
                }}
            />
            Loading ...
        </div>
    </div>
  );
};

export default Loader;
