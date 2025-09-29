import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

export function Unsubscribe() {
  const { token } = useParams();
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState<string | null>(null);
  const baseUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!token) return;

    fetch(`${baseUrl}/newsletter/unsubscribe/${token}`)
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error?.message || 'Ismeretlen hiba.');
        }
        setMessage(data.message || 'Sikeres leiratkozás.');
        setStatus('success');
      })
      .catch(err => {
        setMessage(err.message || 'Hiba történt a leiratkozás során.');
        setStatus('error');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-2xl p-8 md:p-12 max-w-md w-full text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          [davelopment]<sup className="text-sm font-semibold">®</sup>
        </h1>

        {status === 'pending' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-10 h-10 text-gray-400" />
            <p className="text-orange-400 text-lg">Leiratkozás folyamatban...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <p className="text-green-600 text-lg font-medium">{message}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <AlertTriangle className="w-10 h-10 text-red-500" />
            <p className="text-red-600 text-lg font-medium">{message}</p>
          </div>
        )}

        {(status === 'success' || status === 'error') && (
          <Link
            to="/"
            className="mt-6 inline-block bg-gray-900 text-white px-6 py-2 rounded-full text-sm hover:bg-gray-700 transition"
          >
            Vissza a főoldalra
          </Link>
        )}
      </motion.div>
    </div>
  );
}
