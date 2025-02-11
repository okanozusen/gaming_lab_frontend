import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from './LoginPage'; // Import the LoginPage component
import userEvent from '@testing-library/user-event';

describe('LoginPage', () => {
    test('renders login form correctly', () => {
        render(<LoginPage />);

        // Check if input fields are rendered
        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('allows user to type into the input fields', async () => {
        render(<LoginPage />);

        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        await userEvent.type(emailInput, 'user@example.com');
        await userEvent.type(passwordInput, 'password123');

        expect(emailInput).toHaveValue('user@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    test('submits the form when the login button is clicked', async () => {
        const mockSubmit = jest.fn();

        render(<LoginPage />);
        
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);
        const loginButton = screen.getByRole('button', { name: /login/i });

        await userEvent.type(emailInput, 'user@example.com');
        await userEvent.type(passwordInput, 'password123');
        await userEvent.click(loginButton);

        // Ensure the mock function is called when the form is submitted
        expect(mockSubmit).toHaveBeenCalled();
    });

    test('displays an error when no email or password is provided', async () => {
        render(<LoginPage />);

        const loginButton = screen.getByRole('button', { name: /login/i });
        await userEvent.click(loginButton);

        // Here you can check if error messages are displayed based on validation
        expect(screen.getByText(/please enter your email/i)).toBeInTheDocument();
        expect(screen.getByText(/please enter your password/i)).toBeInTheDocument();
    });
});
