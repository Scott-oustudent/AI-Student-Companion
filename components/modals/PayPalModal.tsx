import React, { useState } from 'react';
import { XCircleIcon } from '../icons/Icons';

interface PayPalModalProps {
    onSuccess: () => void;
    onClose: () => void;
}

const PayPalModal: React.FC<PayPalModalProps> = ({ onSuccess, onClose }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        // Simulate a payment processing delay
        setTimeout(() => {
            onSuccess();
        }, 2500);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm text-center p-6 relative">
                <button onClick={onClose} className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" disabled={isProcessing}>
                    <XCircleIcon className="w-6 h-6 text-gray-400" />
                </button>
                <img src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_SbyPP_mc_vs_dc_ae.jpg" alt="Payment Methods" className="h-8 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Confirm Your Upgrade</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">You will be charged £9.99 for a one-year subscription to StudyWell Premium.</p>

                {isProcessing ? (
                    <div className="flex items-center justify-center flex-col">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-500">Processing payment...</p>
                    </div>
                ) : (
                    <button
                        onClick={handlePayment}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-4 rounded-full text-lg transition-colors"
                    >
                        Pay with <span className="italic font-serif">PayPal</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default PayPalModal;
