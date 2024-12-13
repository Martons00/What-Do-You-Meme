import PropTypes from "prop-types";
import { Col, Container, Row } from "react-bootstrap/";
import { LogoutButton, LoginButton, RegisterButton } from './Auth';
import './CSS/Header.css';

function Header(props) {
    return <header className="py-1 py-md-3 border-bottom TopNav">
        <Container fluid className="gap-3 align-items-center">
            <Row>
                <Col xs={3} className="d-md-none">
                    {props.loggedIn &&

                        <a href="/"
                            className="d-flex align-items-center justify-content-center h-100 link-light text-decoration-none">
                            <i className="bi bi-collection-play me-2 flex-shrink-0"></i>
                            <span className="h5 mb-0">Meme Game</span>
                        </a>
                    }
                </Col>
                <Col xs={4} md={8}>
                    <Row className="align-items-center h-100">
                        <Col md={6} className="d-flex justify-content-center">
                            <Container href="/"
                                className="d-flex align-items-center justify-content-center justify-content-md-start h-100 link-light text-decoration-none">
                                {props.user && <span className="h5 mb-0">Welcome {props.user?.username}</span>}
                            </Container>
                        </Col>
                        <Col md={6} className="d-flex justify-content-center">
                            <a href="/"
                                className="d-flex align-items-center justify-content-center h-100 link-light text-decoration-none">
                                <span className="h5 mb-0">Meme Game</span>
                            </a>
                        </Col>
                    </Row>
                </Col>
                <Col xs={5} md={4} className="d-flex align-items-center justify-content-end">
                    <span className="ml-md-auto">
                        {props.loggedIn ? <LogoutButton logout={props.logout} /> : <NotLoggedButtons />}
                    </span>
                </Col>
            </Row>
        </Container>
    </header>;
}

function NotLoggedButtons() {
    return <Row style={{ padding: 10 }}>
        <Col>
            <RegisterButton />
        </Col>
        <Col>
            <LoginButton />
        </Col>
    </Row>
}

Header.propTypes = {
    logout: PropTypes.func,
    user: PropTypes.object,
    loggedIn: PropTypes.bool
}

export default Header;
