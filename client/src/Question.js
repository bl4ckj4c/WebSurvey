import {Card, CardDeck, Form, ListGroup, ListGroupItem} from "react-bootstrap";
import {useState} from "react";
import {Button} from "bootstrap";

function Question(props) {
    // Number of selected closed answers
    const [numberSelected, setNumberSelected] = useState(0);

    // Closed-answer question
    if (props.type === 'closed') {
        return (
            <Card style={{ width: '70%' }} border="dark">
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text>{props.question}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    {props.answers.map((answer, index) =>
                        <ListGroupItem>
                            <Form.Group controlId={"answer"+index}>
                                <Form.Check variant='success' label={answer}/>
                            </Form.Group>
                        </ListGroupItem>
                    )}
                </ListGroup>
                <Card.Footer className="text-muted" defaultActiveKey="#up">
                    <Card.Link href="#">Up</Card.Link>
                    <Card.Link href="#">Down</Card.Link>
                </Card.Footer>
            </Card>
        );
    }


    // Open-ended question
    if (props.type === 'open') {
        return (
            <Card style={{ width: '70%' }} border="dark">
                <Card.Body>
                    <Card.Title>{props.title}</Card.Title>
                    <Card.Text>{props.question}</Card.Text>
                </Card.Body>
                <Form.Group controlId="openAnswer">
                    <Form.Control as="textarea" rows={5} placeholder="Enter here your answer" />
                </Form.Group>
                <Card.Footer className="text-muted" defaultActiveKey="#up">
                    <Card.Link href="#">Up</Card.Link>
                    <Card.Link href="#">Down</Card.Link>
                </Card.Footer>
            </Card>
        );
    }
}

export {Question};