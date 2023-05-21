import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Container, Typography } from "@material-ui/core";
import { decode } from "html-entities";

function TriviaGame() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [numCorrectAnswers, setNumCorrectAnswers] = useState(0);

  // Fetch questions from API
  useEffect(() => {
    axios
      .get(
        "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
      )
      .then((response) => {
        setQuestions(response.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Show feedback when user selects an answer
  useEffect(() => {
    if (userAnswer !== "") {
      const correctAnswer = decode(questions[currentQuestionIndex].correct_answer);
      if (userAnswer === correctAnswer) {
        setIsCorrect(true);
        setNumCorrectAnswers(numCorrectAnswers + 1);
      } else {
        setIsCorrect(false);
      }
      setShowFeedback(true);
    }
  }, [userAnswer]);

  // Go to next question or end game if all questions answered
  const nextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      alert(`Game over! You answered ${numCorrectAnswers} questions correctly.`);
      // reset state to play again
      setCurrentQuestionIndex(0);
      setUserAnswer("");
      setShowFeedback(false);
      setIsCorrect(false);
      setNumCorrectAnswers(0);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer("");
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const question = questions[currentQuestionIndex];
  const answers = [...question.incorrect_answers, question.correct_answer].sort(
    () => Math.random() - 0.5
  );

  return (
    <Container>
      <Typography variant="h4">{decode(question.question)}</Typography>
      {answers.map((answer, index) => (
        <Button
          key={index}
          variant="contained"
          color="primary"
          style={{ margin: "8px" }}
          onClick={() => setUserAnswer(answer)}
          disabled={showFeedback}
        >
          {decode(answer)}
        </Button>
      ))}
      {showFeedback && (
        <Typography variant="h6" style={{ color: isCorrect ? "green" : "red" }}>
          {isCorrect ? "Correct!" : "Wrong!"} The correct answer is {decode(question.correct_answer)}
        </Typography>
      )}
      {showFeedback && (
        <Button variant="contained" color="secondary" onClick={nextQuestion}>
          Next
        </Button>
      )}
    </Container>
  );
}

export default TriviaGame;