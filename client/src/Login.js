import {Container, ListGroup} from "react-bootstrap";
import {Redirect} from "react-router-dom";

function UserAdmin(props) {
    return (
        <Container fluid="sm">
            <ListGroup>
                <ListGroup.Item action onClick={() => {
                    props.setUserAdmin('user');
                    return <Redirect to="/user"/>;
                }}>
                    User
                </ListGroup.Item>
                <ListGroup.Item action onClick={() => {
                    props.setUserAdmin('admin');
                    return <Redirect to="/admin"/>;
                }}>
                    Administrator
                </ListGroup.Item>
            </ListGroup>
        </Container>);
}

export {UserAdmin};