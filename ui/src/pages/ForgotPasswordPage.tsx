import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AuthLayout } from '../components/auth/AuthLayout';
import api from '../services/api';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [resetLink, setResetLink] = useState(''); // For demo purposes

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setResetLink('');

        try {
            const response = await api.post('/auth/forgot-password', { email });
            setIsSubmitted(true);
            // In a real app, this would be sent via email.
            // For this demo, we'll display it or log it.
            // The user requested: "it will send to it an email with the instructions... and a url"
            // Since we can't send email, we'll simulate it by showing the link.
            const token = response.data.token;
            setResetLink(`${window.location.origin}/reset-password?token=${token}&email=${email}`);
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                setError('Email not found');
            } else {
                setError('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <AuthLayout
                title="Check your email"
                subtitle={`We've sent password reset instructions to ${email}`}
            >
                <div className="space-y-6">
                    <div className="bg-green-50 p-4 rounded-lg text-green-700 text-sm">
                        If an account exists for {email}, you will receive an email with instructions on how to reset your password.
                    </div>

                    {/* DEMO ONLY: Display the link because we can't send emails */}
                    {resetLink && (
                        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 text-xs break-all border border-yellow-200">
                            <strong>DEMO ONLY (Email Simulation):</strong><br />
                            <a href={resetLink} className="underline text-blue-600 hover:text-blue-800">
                                Click here to reset password
                            </a>
                        </div>
                    )}

                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">
                            Did not receive the email? Check your spam filter or
                        </p>
                        <Button
                            variant="ghost"
                            onClick={() => setIsSubmitted(false)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            try another email address
                        </Button>
                    </div>
                    
                    <div className="text-center mt-4">
                         <Link to="/login" className="text-sm text-gray-500 hover:text-gray-700">
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="Enter your email address and we'll send you a link to reset your password"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded animate-pulse">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="h-12"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending Link...' : 'Send Reset Link'}
                </Button>

                <div className="text-center">
                    <Link
                        to="/login"
                        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                        Back to Sign In
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
