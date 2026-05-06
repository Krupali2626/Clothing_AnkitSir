import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteSubscriber } from '../redux/slice/newsletter.slice';
import toast from 'react-hot-toast';

export default function Unsubscribe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error

    const handleUnsubscribe = async () => {
        setLoading(true);
        try {
            await dispatch(deleteSubscriber(id)).unwrap();
            setStatus('success');
            toast.success('You have been successfully unsubscribed.');
        } catch (error) {
            setStatus('error');
            toast.error(error.message || 'Failed to unsubscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-mainBG">
            <div className="bg-white p-10 max-w-lg w-full text-center border border-border/50">
                <h1 className="text-3xl font-bold text-primary mb-4 uppercase tracking-widest">
                    Newsletter Subscription
                </h1>
                
                {status === 'success' ? (
                    <div className="space-y-6">
                        <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-lightText font-light leading-relaxed">
                            Your email has been removed from our mailing list. You will no longer receive updates from us.
                        </p>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-primary text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors"
                        >
                            Return Home
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <p className="text-lightText font-light leading-relaxed">
                            Are you sure you want to unsubscribe from our newsletter? You will miss out on early access to new collections and exclusive updates.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                            <button 
                                onClick={() => navigate('/')}
                                className="border border-primary text-primary px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-primary/5 transition-colors"
                            >
                                Keep Subscription
                            </button>
                            <button 
                                onClick={handleUnsubscribe}
                                disabled={loading || !id}
                                className={`bg-primary text-white px-8 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-primary/90'}`}
                            >
                                {loading ? 'Processing...' : 'Unsubscribe'}
                            </button>
                        </div>
                        {status === 'error' && (
                            <p className="text-red-500 text-sm mt-4">
                                There was a problem processing your request. The link may be invalid or expired.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
