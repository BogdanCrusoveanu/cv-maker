import { useNavigate } from 'react-router-dom';
import { FileText, Edit, Trash2, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCvs, useDeleteCv } from '../hooks/useCv';
import { useAuth } from '../context/AuthContext';
import { useDialog } from '../context/DialogContext';
import { useToast } from '../context/ToastContext';
import { useState } from 'react';
import { ChangePasswordDialog } from '../components/auth/ChangePasswordDialog';
import { Navbar } from '../components/layout/Navbar';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { logout, deleteAccount } = useAuth();
    const { data: cvs, isLoading, isError } = useCvs();
    const deleteCvMutation = useDeleteCv();
    const dialog = useDialog();
    const { showToast } = useToast();
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

    const handleDeleteAccount = async () => {
        const isConfirmed = await dialog.confirm({
            title: 'Delete Account',
            message: 'Are you sure you want to delete your account? All your CVs and data will be permanently lost. This action cannot be undone.'
        });

        if (isConfirmed) {
            try {
                await deleteAccount();
                showToast('Account deleted successfully', 'success');
                navigate('/login');
            } catch (error) {
                console.error("Failed to delete account", error);
                showToast('Failed to delete account', 'error');
            }
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        const isConfirmed = await dialog.confirm({
            title: 'Delete CV',
            message: 'Are you sure you want to delete this CV? This action cannot be undone.'
        });

        if (isConfirmed) {
            try {
                await deleteCvMutation.mutateAsync(id);
                showToast('CV deleted successfully', 'success');
            } catch (error) {
                console.error("Failed to delete CV", error);
                showToast('Failed to delete CV', 'error');
            }
        }
    };

    const handleEdit = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/editor/${id}`);
    };

    const handleCreate = () => {
        navigate('/editor');
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (isError) return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-red-500 gap-4">
            <p className="text-xl font-semibold">Error loading CVs</p>
            <Button onClick={() => window.location.reload()} variant="ghost">Retry</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar
                onLogout={logout}
                onChangePassword={() => setIsPasswordDialogOpen(true)}
                onCreateCv={handleCreate}
                onDeleteAccount={handleDeleteAccount}
            />

            <ChangePasswordDialog
                isOpen={isPasswordDialogOpen}
                onClose={() => setIsPasswordDialogOpen(false)}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
                        <p className="mt-2 text-gray-600">Manage and edit your professional CVs</p>
                    </div>
                    <div className="text-sm text-gray-500 hidden sm:block">
                        {cvs?.length || 0} {cvs?.length === 1 ? 'Resume' : 'Resumes'}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Create New Card (First Item) */}
                    <div
                        onClick={handleCreate}
                        className="group relative bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center h-80 animate-fade-in-up"
                        style={{ animationDelay: '0ms' }}
                    >
                        <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors mb-4">
                            <FileText className="text-blue-600" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">Create New CV</h3>
                        <p className="text-sm text-gray-500 mt-2 text-center px-4">Start from scratch with a professional template</p>
                    </div>

                    {cvs && cvs.map((cv, index) => (
                        <div
                            key={cv.id}
                            onClick={() => navigate(`/editor/${cv.id}`)}
                            className="group bg-white rounded-xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-blue-200 transition-all duration-300 cursor-pointer flex flex-col h-80 relative overflow-hidden animate-fade-in-up"
                            style={{ animationDelay: `${(index + 1) * 100}ms` }}
                        >
                            {/* Card Header / Preview Area */}
                            <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative p-6 flex items-center justify-center group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors">
                                <div className="bg-white shadow-md p-4 w-32 h-40 transform rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 border border-gray-200 flex flex-col gap-2">
                                    <div className="h-2 w-16 bg-gray-200 rounded"></div>
                                    <div className="h-2 w-24 bg-gray-200 rounded"></div>
                                    <div className="h-1 w-full bg-gray-100 rounded mt-2"></div>
                                    <div className="h-1 w-full bg-gray-100 rounded"></div>
                                    <div className="h-1 w-20 bg-gray-100 rounded"></div>
                                </div>

                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex gap-2">
                                    <button
                                        onClick={(e) => handleEdit(cv.id, e)}
                                        className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 text-blue-600 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(cv.id, e)}
                                        className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-900 truncate pr-2 group-hover:text-blue-600 transition-colors" title={cv.title}>
                                        {cv.title}
                                    </h3>
                                </div>

                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                                    {cv.data ? JSON.parse(cv.data).personalInfo?.summary || 'No summary provided.' : 'No summary provided.'}
                                </p>

                                <div className="flex items-center text-xs text-gray-400 border-t pt-4 mt-auto">
                                    <Clock size={14} className="mr-1" />
                                    <span>Updated {new Date(cv.updatedAt || cv.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div >
            </main >
        </div >
    );
}
