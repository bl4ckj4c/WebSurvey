import {Card, Form, ListGroup, ListGroupItem, Button, Container} from "react-bootstrap";
import {useState} from "react";
import {Link} from "react-router-dom";

function swapQuestions(id, dir, questions, setQuestions) {
    const clonedQ = Object.assign({}, questions);

    const currQIndex = questions.findIndex(x => x.id === id);
    const currQ = questions[currQIndex];
    let otherQIndex = 0;
    let tmp = null;

    // Move the current question up by one position
    if (dir === "up") {
        // The question is already at the top
        if (currQ.pos === 1)
            return;
        // Swap the questions
        otherQIndex = questions.findIndex(x => x.pos === currQ.pos-1);
        tmp = clonedQ[currQIndex];
        clonedQ[currQIndex] = clonedQ[otherQIndex];
        clonedQ[otherQIndex] = tmp;
        //setQuestions(clonedQ);
    }
    // Move the current question down by one position
    else if (dir === "down") {
        // The question is already at the bottom
        if (currQ.pos === questions.length)
            return;
        // Swap the questions
        otherQIndex = questions.findIndex(x => x.pos === currQ.pos+1);
        tmp = clonedQ[currQIndex];
        clonedQ[currQIndex] = clonedQ[otherQIndex];
        clonedQ[otherQIndex] = tmp;
        //setQuestions(clonedQ);
    }
}

function Surveys(props) {
    return (
        <ListGroup>
            {props.surveys.map((survey, index) =>
                <Link to={"/survey/" + survey.id} key={survey.id}>
                    <ListGroup.Item action>
                        {survey.title}
                    </ListGroup.Item>
                </Link>
            )}
        </ListGroup>
    );
}

function Questions(props) {
    return (
        <Container className="justify-content-center align-items-center">
            <br/>
            {props.questions.map((question, index) =>
                <>
                    <Question key={question.id} question={question} questions={props.questions}
                              setQuestions={props.setQuestions}/>
                    <br/>
                </>
            )}
        </Container>
    );
}

function Question(props) {
    // Number of selected closed answers
    const [numberSelected, setNumberSelected] = useState(0);

    // Closed-answer question
    if (props.question.type === 'closed') {
        const answers = JSON.parse(props.question.answers);
        return (
            <Card bg="light">
                <Card.Body>
                    <Card.Title>{props.question.title}</Card.Title>
                    <Card.Text>{props.question.question}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    {answers.map((answer, index) =>
                        <ListGroupItem key={index}>
                            <Form.Group controlId={"answer" + index}>
                                <Form.Check variant='success' label={answer}/>
                            </Form.Group>
                        </ListGroupItem>
                    )}
                </ListGroup>
                <Card.Footer className="text-muted" defaultActiveKey="#up">
                    <Button variant="dark"
                            onClick={() => swapQuestions(
                                props.question.id,
                                "up",
                                props.questions,
                                props.setQuestions
                            )}
                    >
                        Up
                    </Button>{' '}
                    <Button variant="dark"
                            onClick={() => swapQuestions(
                                props.question.id,
                                "down",
                                props.questions,
                                props.setQuestions
                            )}
                    >
                        Down
                    </Button>
                </Card.Footer>
            </Card>
        );
    }


    // Open-ended question
    if (props.question.type === 'open') {
        return (
            <Card bg="light">
                <Card.Body>
                    <Card.Title>{props.question.title}</Card.Title>
                </Card.Body>
                <Form.Group controlId="openAnswer">
                    <Form.Control as="textarea" rows={5} placeholder="Enter here your answer"/>
                </Form.Group>
                <Card.Footer className="text-muted" defaultActiveKey="#up">
                    <Button variant="dark"
                            onClick={() => swapQuestions(
                                props.question.id,
                                "up",
                                props.questions,
                                props.setQuestions
                            )}
                    >
                        Up
                    </Button>{' '}
                    <Button variant="dark"
                            onClick={() => swapQuestions(
                                props.question.id,
                                "down",
                                props.questions,
                                props.setQuestions
                            )}
                    >
                        Down
                    </Button>
                </Card.Footer>
            </Card>
        );
    }
}

export {Surveys, Questions};