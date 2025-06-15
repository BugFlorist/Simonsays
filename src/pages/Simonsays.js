import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import './Simonsays.css';

const colorThemes = { // Define color themes with arrays of colors
  Classic: ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'cyan', 'magenta'],
  Pastel: ['pink', 'lightblue', 'lightgreen', 'peachpuff', 'lavender', 'mintcream', 'beige', 'thistle', 'plum', 'wheat'],
  Neon: ['magenta', 'cyan', 'lime', 'orange', 'yellow', 'hotpink', 'deepskyblue', 'chartreuse', 'tomato', 'orchid']
};

function getRandomColor(colors) { // Function to get a random color from the provided array
  return colors[Math.floor(Math.random() * colors.length)];
}

const tilesPerLevel = {
  1: 2,
  2: 4,
  3: 6,
  4: 8,
};

function Simonsays() {
  const [sequence, setSequence] = useState([]); // Store the sequence of colors
  const [userSequence, setUserSequence] = useState([]); // Store the user's input sequence
  const [level, setLevel] = useState(1); // Current game level
  const [isUserTurn, setIsUserTurn] = useState(false); // Flag to check if it's the user's turn
  const [message, setMessage] = useState('Select level and theme, then click Start'); // Message to display to the user
  const [highlight, setHighlight] = useState(null); // Color currently highlighted in the sequence
  const [score, setScore] = useState(0); // User's score
  const [theme, setTheme] = useState('Classic'); // Current color theme

  const timeoutsRef = useRef([]); // Store timeouts to clear them later

  const clearPlayTimeouts = () => { // Function to clear all timeouts
    timeoutsRef.current.forEach((t) => clearTimeout(t)); // Clear each timeout
    timeoutsRef.current = []; // Reset the timeouts array
  };

  const resetGame = () => { // Function to reset the game state
    clearPlayTimeouts(); // Clear any existing timeouts
    setSequence([]); // Reset the sequence
    setUserSequence([]); // Reset the user's input sequence
    // setLevel(1); // Reset the level
    setScore(0); // Reset the score
    setIsUserTurn(false); // Reset the user turn flag
    setHighlight(null); // Reset the highlight color
    setMessage('Select level and theme, then click Start'); // Reset the message
  };

  const getSpeedFromLevel = (lvl) => {
    return Math.max(200, 800 - (lvl - 1) * 150);
  };

  const playSequence = (seq, speed) => { // Function to play the sequence of colors
    clearPlayTimeouts(); // Clear any existing timeouts before playing a new sequence
    setIsUserTurn(false); // Set user turn to false while playing the sequence
    setMessage('Watch the sequence...');
    seq.forEach((color, i) => { // Iterate through the sequence and set timeouts for highlighting colors
      const onTime = i * (speed + 200); // Calculate the time when the color should be highlighted
      const offTime = onTime + speed; // Calculate the time when the color should be unhighlighted
      timeoutsRef.current.push( // Store the timeouts for highlighting and unhighlighting colors
        setTimeout(() => setHighlight(color), onTime), 
        setTimeout(() => setHighlight(null), offTime)
      );
    });
    const userTurnTime = seq.length * (speed + 200); // Calculate the time after which the user can start inputting their sequence
    timeoutsRef.current.push( // Store the timeout for allowing user input
      setTimeout(() => {
        setIsUserTurn(true);
      }, userTurnTime)
    );
  };

  const startGame = () => {
    clearPlayTimeouts(); // Clear any existing timeouts
    setSequence([]); // Reset the sequence
    setUserSequence([]);
    setIsUserTurn(false); // Reset the user turn flag
    setHighlight(null); // Reset the highlight color
    const colors = colorThemes[theme].slice(0, tilesPerLevel[level]); // Get the colors for the current theme and level
    const initialSequence = Array.from({ length: level }, () => getRandomColor(colors)); // Generate an initial sequence based on the level
    setSequence(initialSequence); // Set the initial sequence
    setUserSequence([]); // Reset the user's input sequence
    const speed = getSpeedFromLevel(level);
    playSequence(initialSequence, speed);
  };


  useEffect(() => {
    if (!isUserTurn || userSequence.length === 0) return; // If it's not the user's turn or the user hasn't made any moves, do nothing

    const currentIndex = userSequence.length - 1;

    if (userSequence[currentIndex] !== sequence[currentIndex]) { // Check if the user's last move matches the sequence
      setMessage(`Wrong move! Game Over. Final Score: ${score}`);
      setIsUserTurn(false); // Set user turn to false
      return;
    }

    if (userSequence.length === sequence.length) { // If the user has completed the sequence
      setIsUserTurn(false); // Set user turn to false
      setMessage('Correct! Get ready for next sequence...');
      const colors = colorThemes[theme].slice(0, tilesPerLevel[level]); // Get the colors for the current theme and level
      const nextColor = getRandomColor(colors); // Get a random color for the next sequence
      const newSequence = [...sequence, nextColor]; // Create a new sequence by adding the new color
      const speed = getSpeedFromLevel(level); // Get the speed based on the current level
      setTimeout(() => { // Set a timeout to allow the user to see the new sequence
        setSequence(newSequence); // Update the sequence with the new color
        setUserSequence([]); // Reset the user's input sequence
        setScore((prev) => prev + 1); // Increment the score
        setMessage('Watch the sequence...'); 
        playSequence(newSequence, speed); // Play the new sequence
      }, 1000); 
    }
  }, [userSequence]); // Whenever the userSequence changes, check if the user has made a correct move

  const currentColors = colorThemes[theme].slice(0, tilesPerLevel[level]); // Get the current colors based on the selected theme and level

  const handleColorClick = (color) => { // Function to handle color clicks by the user
    if (!isUserTurn) return; // If it's not the user's turn, do nothing
    setUserSequence((prev) => [...prev, color]); // Add the clicked color to the user's input sequence
  };

  return (
    <Container style={{backgroundImage: 'url(https://img.freepik.com/free-vector/modern-business-background-with-digital-technology-design_1361-3299.jpg?semt=ais_hybrid&w=740)', backgroundSize:'cover', backgroundPosition: 'center',  backgroundRepeat: 'no-repeat', height: '80vh', width: '80vw' , padding: '40px', color: '#fff', textAlign: 'center', borderRadius: '8px'}}>
    
      <h1>Simon Says</h1>
      <p>{message}</p>

      <Row className="justify-content-center mb-3">
        <Col xs={12} md={4}>
          <Form.Group controlId="levelSelect">
            <Form.Label>Select level:</Form.Label>
            <Form.Select
              value={level}
              onChange={(e) => setLevel(parseInt(e.target.value))}
            >
              {[1, 2, 3, 4].map((lvl) => (
                <option key={lvl} value={lvl}>
                  Level {lvl}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <Form.Group controlId="themeSelect">
            <Form.Label>Select color theme:</Form.Label>
            <Form.Select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              {Object.keys(colorThemes).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row className="justify-content-center mb-3">
        {currentColors.map((color) => (
          <Col key={color} xs={6} md={3} className="mb-2">
            <button
              type="button"
              className="btn btn-color"
              style={{
                backgroundColor: color,
                opacity: highlight === color ? 1 : 0.8,
                height: '80px',
                borderRadius: '10px',
                cursor: isUserTurn ? 'pointer' : 'default',
                boxShadow: highlight === color ? '0 0 15px 5px white' : 'none',
                transition: 'opacity 0.3s, box-shadow 0.3s',
                border: 'none',
                outline: 'none',
                width: '100%',
              }}
              onClick={() => handleColorClick(color)}
              disabled={!isUserTurn}
              aria-pressed={highlight === color}
            />
          </Col>
        ))}
      </Row>

      <Row className="justify-content-center mb-3">
        <Col xs="auto">
          <Button onClick={startGame} variant="primary">
            Start
          </Button>
        </Col>
        <Col xs="auto">
          <Button onClick={resetGame} variant="secondary">
            Reset
          </Button>
        </Col>
      </Row>

      <div>
        <p>
          <strong>Score:</strong> {score}
        </p>
      </div>
    </Container>
  );
}

export default Simonsays;
