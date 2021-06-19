import {Card, Form, ListGroup, ListGroupItem, Button, Container, Modal} from "react-bootstrap";
import {useState} from "react";
import {Link, Redirect} from "react-router-dom";
import API from "./API";

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
        otherQIndex = questions.findIndex(x => x.pos === currQ.pos - 1);
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
        otherQIndex = questions.findIndex(x => x.pos === currQ.pos + 1);
        tmp = clonedQ[currQIndex];
        clonedQ[currQIndex] = clonedQ[otherQIndex];
        clonedQ[otherQIndex] = tmp;
        //setQuestions(clonedQ);
    }
}

function SurveysAdmin(props) {
    return (
        <ListGroup>
            {props.surveys.map((survey, index) =>
                <Link to={"/admin/survey/" + survey.id} key={survey.id}>
                    <ListGroup.Item action>
                        {survey.title}
                    </ListGroup.Item>
                </Link>
            )}
        </ListGroup>
    );
}

function AddNewQuestionModal(props) {
    // State to create the modal depending on closed or open question
    const [openClose, setOpenClose] = useState('Open');
    // State for the mandatory option
    const [mandatory, setMandatory] = useState(false);

    // States for the validity of the title
    const [validTitle, setValidTitle] = useState('init');
    const [title, setTitle] = useState('');

    // States for closed answers
    const [answers, setAnswers] = useState([]);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(10);

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>New Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Check
                        type="switch"
                        id="openclose-switch"
                        label={openClose}
                        onChange={(event) => {
                            if (event.target.checked)
                                setOpenClose('Closed');
                            else
                                setOpenClose('Open');
                        }}
                        checked={openClose !== 'Open'}
                    />
                    <br/>
                    <Form.Group controlId="formQuestionTitle">
                        <Form.Label>Question Title</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Enter the title of the question"
                                      value={title}
                                      onChange={(event) => {
                                          setTitle(event.target.value);

                                          if (event.target.value === '')
                                              setValidTitle('invalid');
                                          else
                                              setValidTitle('valid');
                                      }}
                                      isInvalid={validTitle === 'invalid'}/>
                        <Form.Control.Feedback type='invalid'>
                            Insert the title of the question please
                        </Form.Control.Feedback>
                    </Form.Group>
                    {openClose === 'Closed' ?
                        <>
                            {/*<Form.Group controlId="formQuestionClosedAnswers">
                                <Form.Label>Closed answer</Form.Label>
                                <Form.Control type="text"
                                              placeholder="Enter the title of the question"
                                              isInvalid={validTitle === 'invalid'}/>
                                <Form.Control.Feedback type='invalid'>
                                    Insert your username please
                                </Form.Control.Feedback>
                            </Form.Group>*/}
                        </>
                        :
                        <>
                        </>
                    }
                    <br/>
                    <Form.Check
                        type="switch"
                        id="mandatory-switch"
                        label="Mandatory"
                        onChange={(event) => {
                            if (event.target.checked)
                                setMandatory(true);
                            else
                                setMandatory(false);
                        }}
                        checked={mandatory}
                    />
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.handleClose}>
                    Cancel
                </Button>
                <Button variant="success" onClick={() => props.addQuestion({
                        surveyId: -1,  // This is a placeholder, the actual value will be set once the survey is created
                        type: openClose,
                        title: title,
                        answers: answers,
                        min: min,
                        max: max,
                        mandatory: mandatory
                    })
                }>
                    Add Question
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function QuestionsAdmin(props) {
    const [validInput, setValidInput] = useState(false);
    const [submitSurvey, setSubmitSurvey] = useState(false);

    // State and handler for the modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handlerAddQuestion = (question) => {
        question.position = props.questions.length;
        if(question.type === 'Open')
            question.type = 'open';
        else if (question.type === 'Closed')
            question.type = 'closed';
        console.log(props.questions.length);
        props.setQuestions((oldList) => [...oldList, question]);
        setShow(false);
    }

    return (
        <Container className="justify-content-center align-items-center">
            <br/>
            {props.questions.map((question, index) =>
                <>
                    <QuestionAdmin key={question.id}
                                   question={question}
                                   questions={props.questions}
                                   setQuestions={props.setQuestions}
                                   setValid={setValidInput}
                                   submitSurvey={submitSurvey}
                    />
                    <br/>
                </>
            )}
            <br/>
            <Button variant="success" onClick={handleShow}>Add question</Button>{' '}
            {validInput ?
                <Button variant="dark" type="submit" onClick={() => setSubmitSurvey(true)}>Create</Button>
                :
                <Button disabled variant="dark" type="submit">Create</Button>
            }
            <br/>
            <AddNewQuestionModal show={show}
                                 setShow={setShow}
                                 handleClose={handleClose}
                                 handleShow={handleShow}
                                 questions={props.questions}
                                 setQuestions={props.setQuestions}
                                 addQuestion={handlerAddQuestion}
            />
        </Container>
    );
}

function QuestionAdmin(props) {
    // Closed-answer question
    if (props.question.type === 'closed') {

        return (
            <Card bg="light">
                <Card.Body>
                    <Card.Title>{props.question.title}</Card.Title>
                    <Card.Text>{props.question.question}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    {props.answers.map((answer, index) =>
                        <ListGroupItem key={index}>
                            <Form.Group controlId={"answer" + index}>
                                <Form.Check disabled variant='success' label={answer}/>
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
                    <Form.Control value={"Open answer text field"}
                                  as="textarea"
                                  rows={1}
                                  placeholder="Enter here your answer"
                                  disabled
                    />
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

export {SurveysAdmin, QuestionsAdmin};