import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/GamePage.css";

const API_BASE_URL = process.env.REACT_APP_BASE_URL;

// ✅ Genres (Max 3)
const GENRES = [
    { id: 4, name: "Action" }, { id: 31, name: "Adventure" }, { id: 12, name: "RPG" },
    { id: 5, name: "Shooter" }, { id: 15, name: "Strategy" }, { id: 10, name: "Racing" },
    { id: 8, name: "Platform" }, { id: 2, name: "Point-and-click" }, { id: 13, name: "Simulator" },
    { id: 25, name: "Hack and Slash" }
];

// ✅ Themes (Max 2)
const THEMES = [
    { id: 17, name: "Fantasy" }, { id: 18, name: "Science Fiction" }, { id: 19, name: "Horror" },
    { id: 21, name: "Survival" }, { id: 22, name: "Historical" }, { id: 23, name: "Stealth" },
    { id: 38, name: "Open World" }
];

// ✅ Platforms
const PLATFORMS = [
    { id: 6, name: "PC" }, { id: 167, name: "PlayStation 5" }, { id: 48, name: "PlayStation 4" },
    { id: 9, name: "PlayStation 3" }, { id: 8, name: "PlayStation 2" }, { id: 7, name: "PlayStation 1" },
    { id: 169, name: "Xbox Series X|S" }, { id: 49, name: "Xbox One" }, { id: 12, name: "Xbox 360" },
    { id: 11, name: "Xbox" }, { id: 130, name: "Nintendo Switch" }, { id: 21, name: "GameCube" },
    { id: 5, name: "Wii" }, { id: 41, name: "Wii U" }
];

// ✅ ESRB Ratings
const ESRB_RATINGS = [
    { id: 1, name: "RP (Rating Pending)" }, { id: 2, name: "EC (Early Childhood)" },
    { id: 3, name: "E (Everyone)" }, { id: 4, name: "E10+ (Everyone 10+)" },
    { id: 5, name: "T (Teen)" }, { id: 6, name: "M (Mature)" }, { id: 7, name: "AO (Adults Only)" }
];

// ✅ Game Modes
const GAME_MODES = [
    { id: 1, name: "Singleplayer" }, { id: 2, name: "Multiplayer" }
];

function GamePage() {
    console.log("✅ Using IGDB API via Backend");

    const [games, setGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [query, setQuery] = useState("");
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedThemes, setSelectedThemes] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);
    const [selectedEsrb, setSelectedEsrb] = useState("");
    const [selectedMode, setSelectedMode] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const loadMoreRef = useRef(null);

    // Load games when filters or page changes
    useEffect(() => {
        fetchGames(true);
    }, [selectedGenres, selectedThemes, selectedPlatforms, selectedEsrb, selectedMode]);

    useEffect(() => {
        if (loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loading) {
                    setPage((prevPage) => prevPage + 1);  // Increment page
                }
            },
            { threshold: 0.8 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [loading]);

    // ✅ Fetch Games
    async function fetchGames(reset = false) {
        setLoading(true);
        try {
            const url = new URL(`${API_BASE_URL}/search`);
            if (query) url.searchParams.append("search", query);
            if (selectedGenres.length) url.searchParams.append("genres", selectedGenres.join(","));
            if (selectedThemes.length) url.searchParams.append("themes", selectedThemes.join(","));
            if (selectedPlatforms.length) url.searchParams.append("platforms", selectedPlatforms.join(","));
            if (selectedEsrb) url.searchParams.append("esrb", selectedEsrb);
            if (selectedMode) url.searchParams.append("mode", selectedMode);
            url.searchParams.append("page", reset ? 1 : page);

            console.log("🌎 Fetching Games from:", url.toString());
            const response = await fetch(url);
            const data = await response.json();

            if (!Array.isArray(data)) {
                console.error("🚨 API returned invalid data:", data);
                return;
            }

            // Avoid duplicates by checking IDs
            setGames((prevGames) => {
                const newGames = reset ? data : [...prevGames, ...data];
                const uniqueGames = Array.from(new Set(newGames.map((game) => game.id)))
                    .map((id) => newGames.find((game) => game.id === id));
                return uniqueGames;
            });
        } catch (error) {
            console.error("🚨 Error fetching games:", error.message);
        } finally {
            setLoading(false);
        }
    }

    function resetFilters() {
        setSelectedGenres([]);
        setSelectedThemes([]);
        setSelectedPlatforms([]);
        setSelectedEsrb("");
        setSelectedMode("");
        setPage(1);
    }

    function handleSelection(setFunction, limit, selectedItems, id) {
        setSearchTerm(""); // Reset search bar when using filters
        setQuery(""); // Reset search when using filters
        setFunction((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) :
            prev.length < limit ? [...prev, id] : prev
        );
        fetchGames(true);
    }

    return (
        <div className="game-page">
            <h2>Find Your Next Game</h2>

            {/* Search Bar */}
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                <button onClick={() => {
                    setQuery(searchTerm);
                    resetFilters();
                    fetchGames(true);
                }}>Find Game</button>
            </div>

            <h3>OR</h3>

            {/* Filters Section */}
            <div className="filters-container">
                <h3>Genres (Max 3)</h3>
                <div className="filter-group">
                    {GENRES.map((genre) => (
                        <span key={genre.id} className={selectedGenres.includes(genre.id) ? "selected" : ""} 
                            onClick={() => handleSelection(setSelectedGenres, 3, selectedGenres, genre.id)}>
                            {genre.name}
                        </span>
                    ))}
                </div>
            </div>

            <h3>Themes (Max 2)</h3>
            <div className="filter-group">
                {THEMES.map((theme) => (
                    <span key={theme.id} className={selectedThemes.includes(theme.id) ? "selected" : ""} 
                        onClick={() => handleSelection(setSelectedThemes, 2, selectedThemes, theme.id)}>
                        {theme.name}
                    </span>
                ))}
            </div>

            <h3>Platforms</h3>
            <div className="filter-group">
                {PLATFORMS.map((platform) => (
                    <span key={platform.id} className={selectedPlatforms.includes(platform.id) ? "selected" : ""} 
                        onClick={() => handleSelection(setSelectedPlatforms, 5, selectedPlatforms, platform.id)}>
                        {platform.name}
                    </span>
                ))}
            </div>

            <h3>ESRB Rating</h3>
            <div className="filter-group">
                {ESRB_RATINGS.map((rating) => (
                    <span key={rating.id} className={selectedEsrb === rating.id ? "selected" : ""} 
                        onClick={() => handleSelection(setSelectedEsrb, 1, selectedEsrb, rating.id)}>
                        {rating.name}
                    </span>
                ))}
            </div>

            <h3>Game Mode</h3>
            <div className="filter-group">
                {GAME_MODES.map((mode) => (
                    <span key={mode.id} className={selectedMode === mode.id ? "selected" : ""} 
                        onClick={() => handleSelection(setSelectedMode, 1, selectedMode, mode.id)}>
                        {mode.name}
                    </span>
                ))}
            </div>

            {/* Games Grid */}
            <div className="games-grid">
                {games.map((game) => (
                    <Link to={`/game/${game.id}`} key={game.id} className="game-card">
                        {game.cover ? (
                            <img 
                                src={game.cover.url.replace("t_thumb", "t_original")} 
                                alt={game.name} 
                                loading="lazy" 
                                className="game-cover"
                            />
                        ) : (
                            <div className="game-cover-placeholder">No Image</div>
                        )}
                        <h3>{game.name}</h3>
                        {game.rating && <p>⭐ {game.rating.toFixed(1)}</p>}
                    </Link>
                ))}
            </div>

            {/* Load More Button */}
            <div ref={loadMoreRef}>
                <button onClick={() => fetchGames(false)} disabled={loading}>
                    {loading ? "Loading..." : "Load More Games"}
                </button>
            </div>
        </div>
    );
}

export default GamePage;
