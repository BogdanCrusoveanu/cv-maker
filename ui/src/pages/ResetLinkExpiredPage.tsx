import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Button } from '../components/ui/Button';
import { AlertCircle } from 'lucide-react';

export default function ResetLinkExpiredPage() {
    return (
        <AuthLayout
            title="Link Expired"
            subtitle="The password reset link is invalid or has expired"
        >
            <div className="flex flex-col items-center space-y-6">
                <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                
                <p className="text-center text-gray-600">
                    For security reasons, password reset links expire after 24 hours. 
                    Please request a new password reset link.
                </p>

                <Link to="/forgot-password" className="w-full">
                    <Button
                        variant="primary"
                        className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        Request New Link
                    </Button>
                </Link>

                <div className="text-center">
                    <Link
                        to="/login"
                        className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                    >
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}
