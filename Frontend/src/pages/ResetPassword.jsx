
import React from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
    return (
        <div className="text-center">
            <h1 className="text-2xl font-bold">Reset Password</h1>
            <p>This feature is coming soon.</p>
            <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
        </div>
    );
};

export default ResetPassword;
