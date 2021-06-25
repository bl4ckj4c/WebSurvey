import {Button, Container, Navbar, OverlayTrigger, Tooltip} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useState} from "react";

function MyNavBar(props) {
    const [message, setMessage] = useState(false);

    return (
        <Navbar bg="primary" variant="dark" sticky="top">
            <Container>
                <Navbar.Brand href="/" col="true">Surveys</Navbar.Brand>
            </Container>
            <Container>
                <Navbar.Toggle/>
                <Navbar.Collapse className="justify-content-end">
                    {props.loggedIn ?
                        <Navbar.Text>
                            <Button variant="outline-light"
                                    onMouseEnter={() => setMessage(true)}
                                    onMouseLeave={() => setMessage(false)}
                                    onClick={props.logout}>
                                {
                                    message ?
                                        "Log Out"
                                        :
                                        "Signed in as: " + props.loggedAdmin
                                }
                                {message}
                            </Button>
                        </Navbar.Text>
                        :
                        <Navbar.Text>
                            <Link to="/login">
                                <Button variant="light">
                                    Log In
                                </Button>
                            </Link>
                        </Navbar.Text>
                    }

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MyNavBar;