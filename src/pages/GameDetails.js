import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/GameDetails.css";

const API_BASE_URL = process.env.REACT_APP_BASE_URL;

const ESRB_LABELS = {
    1: "RP (Rating Pending)",
    2: "EC (Early Childhood)",
    3: "E (Everyone)",
    4: "E10+ (Everyone 10+)",
    5: "T (Teen)",
    6: "M (Mature)",
    7: "AO (Adults Only)",
};

function GameDetails() {
    const { id } = useParams();
    const [game, setGame] = useState(null);

    useEffect(() => {
        if (id) {
            fetchGameDetails();
        }
    }, [id]);

    // Fetch game details from the API
    async function fetchGameDetails() {
        try {
            console.log(`🔍 Fetching game details from: ${API_BASE_URL}/api/games/${id}`);
            
            const response = await fetch(`${API_BASE_URL}/api/games/${id}`);
            if (!response.ok) throw new Error("Game not found");
    
            const data = await response.json();
            console.log("✅ Game Data Received:", data);  // <== LOG THE RESPONSE
            
            let releaseYear = data.releaseYear || "Unknown";
    
            if (!releaseYear || releaseYear === "Unknown") {
                if (data.first_release_date) {
                    releaseYear = new Date(data.first_release_date * 1000).getFullYear();
                } else if (data.release_dates?.length > 0) {
                    const sortedDates = data.release_dates.sort((a, b) => a.y - b.y);
                    releaseYear = sortedDates[0].y || "Unknown";
                }
            }
    
            let validRatings = data.age_ratings?.map(a => a.category).filter(r => r >= 1 && r <= 7) || [];
            let highestRating = validRatings.length ? Math.max(...validRatings) : "Unknown";
    
            setGame({
                ...data,
                releaseYear,
                esrbRating: ESRB_LABELS[highestRating] || "Unknown",
            });
        } catch (error) {
            console.error("🚨 Error fetching game details:", error.message);
        }
    }
    
    // Show loading message if game is not yet loaded
    if (!game) return <h2>Loading game details...</h2>;

    return (
        <div className="game-details page-container">
            <img src={game.cover?.url.replace("t_thumb", "t_original")} alt={game.name} className="game-cover small-cover" />

            <h1>{game.name}</h1>
            <p><strong>Release Year:</strong> {game.releaseYear}</p>
            <p><strong>Platforms:</strong> {game.platforms?.map((p) => p.name).join(", ") || "Unknown"}</p>
            <p><strong>ESRB Rating:</strong> {game.esrbRating}</p>
            <p><strong>Description:</strong> {game.summary || "No description available"}</p>
        </div>
    );
}

export default GameDetails;
