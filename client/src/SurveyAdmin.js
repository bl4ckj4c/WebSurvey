import {Card, Form, ListGroup, ListGroupItem, Button, Container} from "react-bootstrap";
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