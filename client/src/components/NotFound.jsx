import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

const NotFound = () => {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate('/');
    };
    return (
        <Row className='homepage' style={{ justifyContent: "center" }}>
            <Col>
                <h1>Where are you going?</h1>
                <Row style={{ justifyContent: "center" }}><img src="../assets/DoveAndavi.png" alt="404" className='image' style={{ width: "20%" }} /></Row>
                <button className="rounded-button" onClick={handleGoHome} style={{ width: "40%" }}>Come back to homepage</button>
            </Col>
        </Row>
    );
};

export default NotFound;