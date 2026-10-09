import React, { useState } from 'react';
import { loginAdmin } from '../../lib/api';
import { Shield, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { Tilt3D, TextEffect, Magnetic } from '../ui/MotionPrimitives';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToSite,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginAdmin(username, password);
      onLoginSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed. Check credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#7042f8]/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 noise-overlay opacity-30 pointer-events-none" />

      {/* Return to website button */}
      <button
        type="button"
        onClick={onBackToSite}
        className="absolute top-8 left-8 inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors py-2 px-3 rounded-lg bg-white/[0.04] border border-white/[0.08]"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Website</span>
      </button>

      {/* Login Box */}
      <div className="w-full max-w-md relative z-10">
        <Tilt3D
          rotationFactor={5}
          className="rounded-2xl bg-[#0b0b10]/90 border border-white/[0.1] p-8 md:p-10 shadow-2xl shadow-black/80"
        >
          <div className="relative z-20">
            {/* Studio Wordmark & Security Header */}
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-white/[0.04] border border-white/[0.1] text-violet-400 mb-4 shadow-inner">
                <Shield className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold font-display text-white uppercase tracking-tight mb-1">
                <TextEffect per="word">Asura Kinetics CMS</TextEffect>
              </h1>
              <p className="text-xs font-mono text-zinc-400">
                Restricted Administrator Control Plane
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                  Administrator ID
                </label>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter Administrator ID"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-zinc-500 focus:outline-none focus:border-[#7042f8] focus:ring-1 focus:ring-[#7042f8] text-sm transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white placeholder-zinc-500 focus:outline-none focus:border-[#7042f8] focus:ring-1 focus:ring-[#7042f8] text-sm transition-all"
                />
              </div>

              <Magnetic intensity={0.2} className="w-full">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-lg shadow-white/10 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {loading ? (
                    <span>AUTHENTICATING...</span>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4 text-zinc-900" />
                      <span>SIGN IN TO DASHBOARD</span>
                    </>
                  )}
                </button>
              </Magnetic>
            </form>
          </div>
        </Tilt3D>
      </div>
    </div>
  );
};
