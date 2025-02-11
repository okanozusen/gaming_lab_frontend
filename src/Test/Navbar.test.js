import { render, screen } from '@testing-library/react';
import Navbar from './Navbar';
import { BrowserRouter as Router } from 'react-router-dom'; // Wrapping the navbar with Router

describe('Navbar', () => {
    test('renders the navbar correctly', () => {
        render(
            <Router>
                <Navbar />
            </Router>
        );

        // Check if all the links are rendered correctly
        expect(screen.getByText(/genres/i)).toBeInTheDocument();
        expect(screen.getByText(/users/i)).toBeInTheDocument();
        expect(screen.getByText(/posts/i)).toBeInTheDocument();
        expect(screen.getByText(/login/i)).toBeInTheDocument();
        expect(screen.getByText(/register/i)).toBeInTheDocument();
        expect(screen.getByText(/gaming lab/i)).toBeInTheDocument();
    });

    test('links navigate to the correct pages', () => {
        render(
            <Router>
                <Navbar />
            </Router>
        );

        // Ensure that links navigate to the right paths
        expect(screen.getByText(/genres/i).closest('a')).toHaveAttribute('href', '/genres');
        expect(screen.getByText(/users/i).closest('a')).toHaveAttribute('href', '/users');
        expect(screen.getByText(/posts/i).closest('a')).toHaveAttribute('href', '/posts');
        expect(screen.getByText(/login/i).closest('a')).toHaveAttribute('href', '/login');
        expect(screen.getByText(/register/i).closest('a')).toHaveAttribute('href', '/register');
        expect(screen.getByText(/gaming lab/i).closest('a')).toHaveAttribute('href', '/');
    });
});
