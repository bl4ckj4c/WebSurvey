import {
    Card,
    Form,
    ListGroup,
    ListGroupItem,
    Button,
    Container,
    Modal,
    Badge,
    Col,
    InputGroup,
    FormControl, Row, Spinner, Pagination, ButtonGroup
} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import API from "./API";
import {Surveys} from "./Survey";

function swapQuestions(pos, dir, questions, setQuestions) {
    let currItem = questions[pos];

    // Move the current question up by one position
    if (dir === "up") {
        let otherItem = questions[pos - 1];
        // The question is already at the top
        if (pos === 0)
            return;
        // Swap the questions
        currItem.position = pos - 1;
        otherItem.position = pos;
        setQuestions(oldList => oldList.filter(q => q.position !== pos));
        setQuestions(oldList => oldList.filter(q => q.position !== (pos - 1)));
        setQuestions(oldList => [...oldList, currItem]);
        setQuestions(oldList => [...oldList, otherItem]);
        setQuestions(oldList => oldList.sort((a, b) => {
            return a.position - b.position;
        }));
    }
    // Move the current question down by one position
    else if (dir === "down") {
        let otherItem = questions[pos + 1];
        // The question is already at the bottom
        if (pos === (questions.length - 1))
            return;
        // Swap the questions
        currItem.position = pos + 1;
        otherItem.position = pos;
        setQuestions(oldList => oldList.filter(q => q.position !== pos));
        setQuestions(oldList => oldList.filter(q => q.position !== (pos + 1)));
        setQuestions(oldList => [...oldList, currItem]);
        setQuestions(oldList => [...oldList, otherItem]);
        setQuestions(oldList => oldList.sort((a, b) => {
            return a.position - b.position;
        }));
    }
}

function deleteQuestion(pos, setQuestions, questions) {
    let size = questions.length;
    setQuestions(oldList => oldList.filter(q => q.position !== pos));
    //setQuestions(oldList => oldList.map((q, index) => q.position = index));
}

function SurveysAdmin(props) {
    // Survey of a specified admin
    const [surveysAdmin, setSurveysAdmin] = useState([]);

    useEffect(() => {
        API.getSurveyByIdForAdmin(props.admin)
            .then(r => {
                setSurveysAdmin(r);
            })
            .catch(r => {
                setSurveysAdmin([]);
            });
    }, []);


    return (
        <ListGroup>
            {surveysAdmin.map((survey, index) =>
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

    // State for valid question
    const [validQuestion, setValidQuestion] = useState(false);

    // States for the validity of the title
    const [validTitle, setValidTitle] = useState('init');
    const [title, setTitle] = useState('');

    // States for closed answers
    const [answers, setAnswers] = useState([]);
    const [numAnswers, setNumAnswers] = useState(1);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(10);

    // States for valid answers
    const [checkedMCQ0, setCheckedMCQ0] = useState('init');
    const [checkedMCQ1, setCheckedMCQ1] = useState('init');
    const [checkedMCQ2, setCheckedMCQ2] = useState('init');
    const [checkedMCQ3, setCheckedMCQ3] = useState('init');
    const [checkedMCQ4, setCheckedMCQ4] = useState('init');
    const [checkedMCQ5, setCheckedMCQ5] = useState('init');
    const [checkedMCQ6, setCheckedMCQ6] = useState('init');
    const [checkedMCQ7, setCheckedMCQ7] = useState('init');
    const [checkedMCQ8, setCheckedMCQ8] = useState('init');
    const [checkedMCQ9, setCheckedMCQ9] = useState('init');
    let checkedMCQ = [
        checkedMCQ0,
        checkedMCQ1,
        checkedMCQ2,
        checkedMCQ3,
        checkedMCQ4,
        checkedMCQ5,
        checkedMCQ6,
        checkedMCQ7,
        checkedMCQ8,
        checkedMCQ9
    ];
    let setCheckedMCQ = [
        setCheckedMCQ0,
        setCheckedMCQ1,
        setCheckedMCQ2,
        setCheckedMCQ3,
        setCheckedMCQ4,
        setCheckedMCQ5,
        setCheckedMCQ6,
        setCheckedMCQ7,
        setCheckedMCQ8,
        setCheckedMCQ9
    ]

    useEffect(() => {
        if (answers.length === 0)
            setAnswers(oldList => [...oldList, '']);
    }, []);

    useEffect(() => {
        setAnswers([]);
        for (let i = 0; i < numAnswers; i++)
            setAnswers(oldList => [...oldList, '']);
        for (let i = 0; i < 10; i++)
            setCheckedMCQ[i]('init');

    }, [numAnswers]);

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

                                          if (event.target.value === '') {
                                              setValidTitle('invalid');
                                              setValidQuestion(false);
                                          } else {
                                              setValidTitle('valid');
                                              setValidQuestion(true);
                                          }
                                      }}
                                      isInvalid={validTitle === 'invalid'}/>
                        <Form.Control.Feedback type='invalid'>
                            Insert the title of the question please
                        </Form.Control.Feedback>
                    </Form.Group>
                    {openClose === 'Closed' ?
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} controlId="totalAnswers">
                                    <Form.Label>Number of answers</Form.Label>
                                    <Form.Control as="select"
                                                  value={numAnswers}
                                                  onChange={(event) => setNumAnswers(parseInt(event.target.value))}>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="minimumAnswers">
                                    <Form.Label>Minimum answers</Form.Label>
                                    <Form.Control as="select"
                                                  value={min}
                                                  onChange={(event) => {
                                                      setMin(parseInt(event.target.value));
                                                      if (parseInt(event.target.value) > 0)
                                                          setMandatory(true);
                                                      else
                                                          setMandatory(false);
                                                  }}>
                                        <option>0</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="maximumAnswers">
                                    <Form.Label>Maximum answers</Form.Label>
                                    <Form.Control as="select"
                                                  value={max}
                                                  onChange={(event) => setMax(parseInt(event.target.value))}>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Container className="justify-content-center align-items-center">
                                {answers.map((a, index) =>
                                    <InputGroup className="mb-2 mr-sm-2">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text><Form.Check type="checkbox"/></InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl placeholder="Answer"
                                                     value={a}
                                                     onChange={(event) => {
                                                         setAnswers(oldList => oldList.map((a, index2) =>
                                                             index2 === index ? event.target.value : a
                                                         ));

                                                         if (event.target.value === '') {
                                                             setCheckedMCQ[index]('invalid');
                                                             setValidQuestion(false);
                                                         } else {
                                                             setCheckedMCQ[index]('valid');
                                                             setValidQuestion(true);
                                                         }
                                                     }}
                                                     isInvalid={checkedMCQ[index] === 'invalid'}/>
                                        <Form.Control.Feedback type='invalid'>
                                            The answer cannot be empty, please fill the field
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                )}
                            </Container>
                        </Form>
                        :
                        <>
                        </>
                    }
                    <br/>
                    {openClose === 'Open' ?
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
                        :
                        <></>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.handleClose}>
                    Cancel
                </Button>
                {validQuestion ?
                    <Button variant="success" onClick={() => {
                        props.addQuestion({
                            surveyId: -1,  // This is a placeholder, the actual value will be set once the survey is created
                            type: openClose,
                            title: title,
                            answers: answers,
                            min: min,
                            max: max,
                            mandatory: mandatory
                        });
                        props.setValidSurvey(true);
                    }}>
                        Add Question
                    </Button>
                    :
                    <Button variant="success" disabled>
                        Add Question
                    </Button>}
            </Modal.Footer>
        </Modal>
    );
}

function QuestionsAdmin(props) {
    const [validSurvey, setValidSurvey] = useState(false);
    const [surveyTitle, setSurveyTitle] = useState('');
    const [validSurveyTitle, setValidSurveyTitle] = useState('init');

    // State and handler for the modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handlerAddQuestion = (question) => {
        question.position = props.questions.length;
        if (question.type === 'Open')
            question.type = 'open';
        else if (question.type === 'Closed')
            question.type = 'closed';
        props.setQuestions((oldList) => [...oldList, question]);
        setShow(false);
    }

    // Redirect
    const [redirect, setRedirect] = useState(false);
    // Create the new survey
    const handlerSubmitSurvey = () => {
        API.createSurvey(surveyTitle, props.questions, props.owner)
            .then(() => setRedirect(true))
            .catch(() => setRedirect(true));
    }

    if (redirect) {
        props.setQuestions([]);
        return (<Redirect to="/admin"/>);
    }

    return (
        <Container className="justify-content-center align-items-center">
            <br/>
            <SurveyTitleField surveyTitle={surveyTitle}
                              setSurveyTitle={setSurveyTitle}
                              validSurveyTitle={validSurveyTitle}
                              setValidSurveyTitle={setValidSurveyTitle}
                              setValid={setValidSurvey}/>
            <br/>
            {props.questions.map((question, index) =>
                <>
                    <QuestionAdmin key={question.id}
                                   question={question}
                                   questions={props.questions}
                                   setQuestions={props.setQuestions}
                    />
                    <br/>
                </>
            )}
            <br/>
            <Button variant="success" onClick={handleShow}>Add question</Button>{' '}
            {validSurvey ?
                <Button variant="dark" type="submit" onClick={handlerSubmitSurvey}>Create</Button>
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
                                 setValidSurvey={setValidSurvey}
            />
        </Container>
    );
}

function SurveyTitleField(props) {
    return (
        <Card bg="light">
            <Card.Body>
                <Card.Title>Survey Title</Card.Title>
            </Card.Body>
            <Form.Group controlId="surveyTitle">
                <Form.Control value={props.surveyTitle}
                              onChange={(event) => {
                                  props.setSurveyTitle(event.target.value);

                                  if (event.target.value === '') {
                                      props.setValidSurveyTitle('invalid');
                                      props.setValid(false);
                                  } else {
                                      props.setValidSurveyTitle('valid');
                                      props.setValid(true);
                                  }
                              }}
                              isInvalid={props.setValidSurveyTitle === 'invalid'}
                              type="text"
                              placeholder="Enter here the title of the survey"/>
                <Form.Control.Feedback type='invalid'>
                    Please insert the title of the survey
                </Form.Control.Feedback>
            </Form.Group>
        </Card>
    );
}

function QuestionAdmin(props) {
    // Closed-answer question
    if (props.question.type === 'closed') {

        return (
            <Card bg="light">
                <Card.Header>
                    <Button variant="danger"
                            onClick={() => deleteQuestion(props.question.position, props.setQuestions, props.questions)}
                    >
                        Delete
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        {props.question.title}
                        {props.question.mandatory ?
                            <>
                                {' '}<Badge variant="danger">Mandatory</Badge>
                            </>
                            :
                            <>
                            </>
                        }
                    </Card.Title>
                    <Card.Text>{props.question.question}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    {props.question.answers.map((answer, index) =>
                        <ListGroupItem key={index}>
                            <Form.Group controlId={"answer" + index}>
                                <Form.Check disabled variant='success' label={answer}/>
                            </Form.Group>
                        </ListGroupItem>
                    )}
                </ListGroup>
                <Card.Footer className="text-muted" defaultActiveKey="#up">
                    {props.question.position === 0 ?
                        <>
                            <Button variant="dark"
                                    onClick={() => swapQuestions(
                                        props.question.position,
                                        "up",
                                        props.questions,
                                        props.setQuestions
                                    )}
                                    disabled
                            >
                                Up
                            </Button>{' '}
                        </>
                        :
                        <>
                            <Button variant="dark"
                                    onClick={() => swapQuestions(
                                        props.question.position,
                                        "up",
                                        props.questions,
                                        props.setQuestions
                                    )}
                            >
                                Up
                            </Button>{' '}
                        </>
                    }
                    {props.question.position === (props.questions.length - 1) ?
                        <Button variant="dark"
                                onClick={() => swapQuestions(
                                    props.question.position,
                                    "down",
                                    props.questions,
                                    props.setQuestions
                                )}
                                disabled
                        >
                            Down
                        </Button>
                        :
                        <Button variant="dark"
                                onClick={() => swapQuestions(
                                    props.question.position,
                                    "down",
                                    props.questions,
                                    props.setQuestions
                                )}
                        >
                            Down
                        </Button>
                    }
                </Card.Footer>
            </Card>
        );
    }


    // Open-ended question
    if (props.question.type === 'open') {

        return (
            <Card bg="light">
                <Card.Header>
                    <Button variant="danger"
                            onClick={() => deleteQuestion(props.question.position, props.setQuestions, props.questions)}
                    >
                        Delete
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        {props.question.title}
                        {props.question.mandatory ?
                            <>
                                {' '}<Badge variant="danger">Mandatory</Badge>
                            </>
                            :
                            <>
                            </>
                        }
                    </Card.Title>
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
                    {props.question.position === 0 ?
                        <>
                            <Button variant="dark"
                                    onClick={() => swapQuestions(
                                        props.question.position,
                                        "up",
                                        props.questions,
                                        props.setQuestions
                                    )}
                                    disabled
                            >
                                Up
                            </Button>{' '}
                        </>
                        :
                        <>
                            <Button variant="dark"
                                    onClick={() => swapQuestions(
                                        props.question.position,
                                        "up",
                                        props.questions,
                                        props.setQuestions
                                    )}
                            >
                                Up
                            </Button>{' '}
                        </>
                    }
                    {props.question.position === (props.questions.length - 1) ?
                        <Button variant="dark"
                                onClick={() => swapQuestions(
                                    props.question.position,
                                    "down",
                                    props.questions,
                                    props.setQuestions
                                )}
                                disabled
                        >
                            Down
                        </Button>
                        :
                        <Button variant="dark"
                                onClick={() => swapQuestions(
                                    props.question.position,
                                    "down",
                                    props.questions,
                                    props.setQuestions
                                )}
                        >
                            Down
                        </Button>
                    }
                </Card.Footer>
            </Card>
        );
    }
}

function ViewAnswersOneSurvey(props) {
    // Answers by one user
    const [answers, setAnswers] = useState([]);

    // Loading
    const [loading, setLoading] = useState(true);

    // Current answer shown
    const [currentAnswer, setCurrentAnswer] = useState(0);
    const [currentAnswersArray, setCurrentAnswersArray] = useState([]);
    const [totalAnswers, setTotalAnswers] = useState(1);
    // All groups of answers present
    const [groupsId, setGroupsId] = useState([]);

    useEffect(() => {
        API.getAllAnswersBySurveyId(props.surveyId, props.loggedAdmin)
            .then(r => {
                setAnswers(r);
                for (const id in r) {
                    setGroupsId(old => [...old, id]);
                    setTotalAnswers(old => old++);
                }
                setCurrentAnswer(0);
                setLoading(false);
            })
            .catch(r => {
                setAnswers([]);
            });
    }, []);

    useEffect(() => {
        if (loading)
            return;
        let tmpArray = Object.create(answers[groupsId[currentAnswer]]);
        tmpArray.sort((a, b) => {
            return a.position - b.position;
        });
        setCurrentAnswersArray(tmpArray);
    }, [currentAnswer, loading]);

    return (
        <Container className="justify-content-center align-items-center">
            {loading ?
                <>
                    <br/>
                    <br/>
                    <Spinner animation="border"/>
                    <br/>
                    <br/>
                    <br/>
                </>
                :
                <>
                    <br/>
                    // TODO: insert user name and enable buttons
                    <br/>
                    {currentAnswersArray.map(question =>
                        <>
                            <ViewAnswersAdmin question={question}/>
                            <br/>
                        </>
                    )}
                </>}
            <br/>
            <ButtonGroup aria-label="Pagination">
                <Button variant="primary">First</Button>
                <Button variant="primary">Previous</Button>
            </ButtonGroup>
            {' '}
            <Button variant="light" disabled>{currentAnswer} out of {totalAnswers}</Button>
            {' '}
            <ButtonGroup aria-label="Pagination">
                <Button variant="primary">Next</Button>
                <Button variant="primary">Last</Button>
            </ButtonGroup>
        </Container>
    );
}

function ViewAnswersAdmin(props) {
    console.log(props.question);

    // Closed-answer question
    if (props.question.type === 'closed') {
        let answerIndex = JSON.parse(props.question.answer);
        let answers = JSON.parse(props.question.answers);
        return (
            <Card bg="light">
                <Card.Body>
                    <Card.Title>
                        {props.question.title}
                    </Card.Title>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    {answers.map((answer, index) => {
                        let checked = false;
                        if (answerIndex.find(item => item === (index + 1)))
                            checked = true;
                        return (
                            <ListGroupItem key={index}>
                                <Form.Group controlId={"answer" + index}>
                                    <Form.Check disabled checked={checked} variant='success' label={answer}/>
                                </Form.Group>
                            </ListGroupItem>
                        );
                    })}
                </ListGroup>
            </Card>
        );
    }


    // Open-ended question
    if (props.question.type === 'open') {
        return (
            <Card bg="light">
                <Card.Body>
                    <Card.Title>
                        {props.question.title}
                    </Card.Title>
                    <Card.Text>
                        {props.question.answer === '' ?
                            "Empty answer"
                            :
                            props.question.answer
                        }
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

export {SurveysAdmin, QuestionsAdmin, ViewAnswersOneSurvey}