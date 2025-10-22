//import { Link } from 'react-router-dom';

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import InputField from './InputField';
import Button from './Button';
import Logo from './Logo';

function RegisterForm() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // ** API CALL FOR REGISTRATION **
        
        // Basic validation
        if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
        }

        console.log('Registering with:', { username, email, password });
        navigate('/preferences');
    };

    return (
        <form onSubmit={handleSubmit}>
        <Logo isColorful={true} />
        <h1>Create Account</h1>
        <InputField
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <InputField
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <InputField
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit">Sign Up</Button>
        <p className="auth-switch-text">
            Already have an account? <Link to="/login">Log In</Link>
        </p>
        </form>
    );
}

export default RegisterForm;