import { React } from "react";
import { Col, Row } from "react-bootstrap";
import "./CSS/RoundedButton.css";
import { HomePageLogged, ProfileDescription } from "./HomepageLogged";
import "./CSS/Homepage.css";

export function MenuLayout(props) {
    const text = `Welcome Back ${props.user?.username}`;
    return <>
        <Row className="d-flex flex-column align-items-center" style={{ margin: 20 }}><h1>{text}</h1></Row>
        <Row>
            <Col xs={12} md={6} className="d-flex flex-column align-items-center">
                <HomePageLogged />
            </Col>
            <Col xs={12} md={6} className="d-flex flex-column align-items-center">
                <ProfileDescription />
            </Col>
        </Row>
    </>
}