import React from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "reactstrap";

const NotFound = () => {
const navigate = useNavigate();
  return (
    <div>
        <div className="not-found-img-container">
            <img className="not-found-img" alt="not found" src="/images/404.jpg" />
            <Button color="primary" onClick={() => navigate('/')}>Back to Home</Button>
        </div>
    </div>
  );
};

export default NotFound;
