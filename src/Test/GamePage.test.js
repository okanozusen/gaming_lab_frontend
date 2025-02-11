import { render, screen, fireEvent } from '@testing-library/react';
import GamePage from './GamePage';
import { BrowserRouter as Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('GamePage', () => {
    test('renders game list correctly', () => {
        render(
            <Router>
                <GamePage />
            </Router>
        );

        // Ensure that the game search bar and filter buttons are visible
        expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
        expect(screen.getByText(/genres/i)).toBeInTheDocument();
        expect(screen.getByText(/platforms/i)).toBeInTheDocument();
    });

    test('filters games based on selected genre', async () => {
        render(
            <Router>
                <GamePage />
            </Router>
        );

        const genreButton = screen.getByText(/Action/i);
        await userEvent.click(genreButton);

        // Ensure the genre button is selected
        expect(genreButton).toHaveClass('selected');

        // Check if the correct game list appears
        expect(screen.getByText(/Top Drives/i)).toBeInTheDocument();
    });

    test('load more games when scrolling reaches the bottom', async () => {
        render(
            <Router>
                <GamePage />
            </Router>
        );

        const loadMoreButton = screen.getByText(/Load more games/i);
        await userEvent.click(loadMoreButton);

        // Expect a new set of games to be displayed
        expect(screen.getByText(/New Game Title/i)).toBeInTheDocument();
    });
});
