import { useState } from 'react'
import './PollCreation.css'

function PollCreation({ onNavigateToLivePolling }) {
  const [question, setQuestion] = useState('Rahul Bajaj')
  const [timer, setTimer] = useState('60 seconds')
  const [options, setOptions] = useState(['Rahul Bajaj', 'Rahul Bajaj'])
  const [correctAnswer, setCorrectAnswer] = useState('Yes')

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value)
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const addMoreOption = () => {
    setOptions([...options, ''])
  }

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index)
      setOptions(newOptions)
    }
  }

  const handleAskQuestion = () => {
    const pollData = {
      question,
      timer,
      options,
      correctAnswer
    }
    console.log('Poll data:', pollData)
    // Here you would send the poll data to your backend
    // Navigate to live polling interface
    if (onNavigateToLivePolling) {
      onNavigateToLivePolling()
    }
  }

  return (
    <div className="poll-creation">
      <div className="logo-container">
        <div className="logo">
          <span className="logo-icon">✨</span>
          <span className="logo-text">Intervue Poll</span>
        </div>
      </div>

      <div className="content">
        <h1 className="main-title">Let's Get Started</h1>
        <p className="subtitle">
          you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>

        <div className="question-section">
          <div className="question-header">
            <label className="question-label">Enter your question</label>
            <div className="timer-dropdown">
              <select value={timer} onChange={(e) => setTimer(e.target.value)}>
                <option value="30 seconds">30 seconds</option>
                <option value="60 seconds">60 seconds</option>
                <option value="90 seconds">90 seconds</option>
                <option value="120 seconds">120 seconds</option>
              </select>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>

          <div className="question-input-container">
            <textarea
              className="question-input"
              value={question}
              onChange={handleQuestionChange}
              placeholder="Enter your question here..."
              maxLength={100}
            />
            <div className="character-count">
              {question.length}/100
            </div>
          </div>
        </div>

        <div className="options-section">
          <div className="edit-options">
            <h3 className="section-title">Edit Options</h3>
            <div className="options-list">
              {options.map((option, index) => (
                <div key={index} className="option-item">
                  <div className="option-number">{index + 1}</div>
                  <input
                    type="text"
                    className="option-input"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  {options.length > 2 && (
                    <button
                      className="remove-option"
                      onClick={() => removeOption(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button className="add-option-btn" onClick={addMoreOption}>
              + Add More option
            </button>
          </div>

          <div className="correct-answer">
            <h3 className="section-title">Is it Correct?</h3>
            <div className="radio-group">
              <div className="radio-options">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="correctAnswer"
                    value="Yes"
                    checked={correctAnswer === 'Yes'}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  Yes
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="correctAnswer"
                    value="No"
                    checked={correctAnswer === 'No'}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                  />
                  <span className="radio-custom"></span>
                  No
                </label>
              </div>
            </div>
          </div>
        </div>

        <button className="ask-question-btn" onClick={handleAskQuestion}>
          Ask Question
        </button>
      </div>
    </div>
  )
}

export default PollCreation