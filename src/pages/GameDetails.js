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
            console.log(`🔍 Searching for game using ID: ${id}`);
    
            // Step 1: Try searching by ID first
            let response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/games?search=${id}`);
            if (!response.ok) throw new Error("Game search failed");
    
            let data = await response.json();
            console.log("✅ Game Data Received:", data);  // Debug log
    
            // Step 2: If search results don't contain the exact game, try a name search
            let gameData = data.find(game => game.id.toString() === id);
    
            // Step 3: If the game is still not found, try searching by name (if we have it)
            if (!gameData && data.length > 0) {
                console.log("🔄 Trying to find the game by name instead...");
                const gameName = data[0].name; // Get first game's name
                response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/games?search=${encodeURIComponent(gameName)}`);
                if (response.ok) {
                    let newData = await response.json();
                    gameData = newData.find(game => game.name.toLowerCase() === gameName.toLowerCase());
                }
            }
    
            if (!gameData) throw new Error("Game not found in search results");
    
            console.log("✅ Final Selected Game:", gameData);
    
            let releaseYear = gameData.first_release_date 
                ? new Date(gameData.first_release_date * 1000).getFullYear()
                : "Unknown";
    
            let validRatings = gameData.age_ratings?.map(a => a.category).filter(r => r >= 1 && r <= 7) || [];
            let highestRating = validRatings.length ? Math.max(...validRatings) : "Unknown";
    
            setGame({
                ...gameData,
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
