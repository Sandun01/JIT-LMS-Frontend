import React from "react";
import { Card } from "reactstrap";

const MainContainer = ({ children }) => {
  return (
    <div>
      <Card className="mainContainer-card">{children}</Card>
    </div>
  );
};

export default MainContainer;
