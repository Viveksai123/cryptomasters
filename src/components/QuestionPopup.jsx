import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setUser } from "../userSlice";

const QuestionPopup = ({ question, onClose, userId, timeLeft, betAmount, fetchQuestions }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
<<<<<<< HEAD
  const dispatch = useDispatch();
  
=======
  const dispatch = useDispatch();  
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

>>>>>>> f6b0799ae5140861931ff228c0a3bcf0d27bdd15

  const handleSubmit = async () => {
    setIsSubmitting(true);
  
    let isCorrect = false;
  
    if (question.question_type === "mcq") {
      const correctOption = question.options[question.correct_ans - 1]; 
      isCorrect = correctOption === selectedOption;
    } else if (question.question_type === "fib") {
      const correctAnswer = String(question.correct_ans).trim().toLowerCase();
      const userAnswer = selectedOption ? selectedOption.trim().toLowerCase() : "";
      isCorrect = userAnswer === correctAnswer;
    }
  
    console.log("User ID:", userId);
    console.log("Time Left:", timeLeft, "seconds");
    console.log("Answer is", isCorrect ? "Correct" : "Incorrect");
  
    const requestData = {
      user_id: userId,
      question_id: question.question_id,
      spent_amt: betAmount,
      multiplier: question.multiplier,
      time_left: timeLeft,
      solved: isCorrect,
    };

    console.log(requestData)
  
    try {
      const response = await fetch(`${API_URL}/update`, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          API_KEY: API_KEY,
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
      console.log("Server Response:", data);
  
      if (response.ok) {
        const userResponse = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            API_KEY: API_KEY,
          },
          body: JSON.stringify({ user_id: userId }),
        });
  
        if (userResponse.ok) {
          const updatedUserData = await userResponse.json();
          dispatch(setUser(updatedUserData));
        }
      }
    } catch (error) {
      console.error("Error updating result:", error);
    }
  
    setTimeout(() => {
      fetchQuestions(); 
      onClose();
    }, 1000);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-wrapper">
        <div className="popup-content">
          <div className="question-section">
            <h2>{question.question}</h2>
            {question.question_image_url != null && (
              <img 
                src={question.question_image_url} 
                alt="Question Image" 
                className="question-image" 
              />
            )}
          </div>

          {question.question_type === "mcq" && question.options ? (
            <div className="options-section">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  className={`option-item ${selectedOption === option ? "selected" : ""}`}
                  onClick={() => setSelectedOption(option)}
                >
                  <div className="option-number">{index + 1}</div>
                  <div className="option-text">{option}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="fib-section">
              <input
                type="text"
                value={selectedOption || ""}
                onChange={(e) => setSelectedOption(e.target.value)}
                placeholder="Type your answer here..."
              />
            </div>
          )}

          <div className="action-buttons">
            <button
              className="cancel-button"
              onClick={() => {
                fetchQuestions(); 
                onClose();
              }}
            >
              Exit
            </button>
            <button
              className={`submit-button ${isSubmitting ? "submitting" : ""}`}
              onClick={handleSubmit}
              disabled={selectedOption === null || isSubmitting}
            >
              {isSubmitting ? <FaCheck /> : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPopup;
