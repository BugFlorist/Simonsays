import React from 'react';
import { Link } from 'react-router-dom';

function Home (){
    return (
    <div style={{backgroundImage: 'url(/images/Gemini_Generated_Image_sq0mdpsq0mdpsq0m.png)' , backgroundSize:'cover', backgroundPosition: 'center',  backgroundRepeat: 'no-repeat', height: '80vh', width: '80vw' , padding: '40px', color: '#fff', textAlign: 'center', borderRadius: '8px'}}>
        <h1 style={{color: 'white'}}>Welcome to Simon Says!</h1>
        <p style={{color: 'white', fontSize: '1.3rem'}}>
            This is a fun and interactive memory game where you will be challenged to remember and repeat a sequence of colors.
            The game will start with a simple sequence, and as you progress, the sequences will become longer and more complex.
        </p>
        <p style={{color: 'white', fontSize: '1.3rem'}}>
            To start playing, either navigate to the <strong>Play</strong> section from the menu above or click the button below. 
            You can also learn more about the game in the <strong>About Us</strong> section.
        </p>
        <p  style={{color: 'green', fontSize: '1.4rem'}}>
            Enjoy the game and have fun!
        </p>
        <Link to="/game">
            <button style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: 'rgb(36, 182, 84)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                Start Playing
            </button>
        </Link>
        
    </div>
    );
}

export default Home;