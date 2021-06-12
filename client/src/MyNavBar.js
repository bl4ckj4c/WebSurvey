import {Container, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

function MyNavBar(props) {
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
                            Signed in as: <Link to="/login">{props.loggedAdmin}</Link>
                        </Navbar.Text>
                        :
                        <Navbar.Text>
                            Signed in as: <Link to="/login">Anonymous</Link>
                        </Navbar.Text>
                    }

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default MyNavBar;