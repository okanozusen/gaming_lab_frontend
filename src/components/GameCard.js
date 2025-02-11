import React from 'react';
import { Link } from 'react-router-dom';

function GameCard({ game }) {
    return (
        <div>
            <h2>{game.name}</h2>
            <p>Rating: {game.rating}</p>
            <Link to={`/game/${game.id}`}>View Details</Link>
        </div>
    );
}

export default GameCard;
