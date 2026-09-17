import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, Loader2 } from 'lucide-react';
import { validateCode, setAdminSession } from '@/lib/adminAuth';

export default function AdminLogin() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setError('');
    const valid = await validateCode(code);
    setVerifying(false);
    if (valid) {
      setSuccess(true);
      setAdminSession();
      setTimeout(() => navigate('/admin'), 600);
    } else {
      setError('Invalid access code. Try again.');
      setCode('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 border border-primary/30 mb-4">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold">Admin Access</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your access code to manage projects
          </p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="font-mono text-sm text-primary text-glow">
              ✓ ACCESS GRANTED
            </div>
            <div className="text-xs text-muted-foreground mt-2">redirecting...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Access code"
              autoComplete="off"
              spellCheck="false"
              className="w-full bg-card border border-border rounded-md px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
            {error && (
              <div className="text-xs text-destructive text-center">{error}</div>
            )}
            <button
              type="submit"
              disabled={verifying || !code}
              className="w-full bg-primary text-primary-foreground font-medium text-sm px-5 py-3 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
            >
              {verifying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enter'}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
