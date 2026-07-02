import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Mail, Lock, User as UserIcon, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register, error, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("USER");
  const [loading, setLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const validatePassword = (pass: string) => {
    if (pass.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(pass)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pass)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(pass)) return "Password must contain at least one number.";
    if (!/[^A-Za-z0-9]/.test(pass)) return "Password must contain at least one special character.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email || !password) {
      setValidationError("All fields are required.");
      return;
    }

    if (!isLogin) {
      if (!name) {
        setValidationError("Name is required.");
        return;
      }
      const passError = validatePassword(password);
      if (passError) {
        setValidationError(passError);
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password, role);
      }
      onClose();
    } catch (err: any) {
      // Error is set in AuthContext, we just catch to prevent crash
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setName("");
    setEmail("");
    setPassword("");
    setValidationError(null);
    clearError();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl glass-panel text-white shadow-2xl"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-2xl font-bold font-barlow tracking-wider text-yellow">
              {isLogin ? "ENTERPRISE LOGIN" : "CREATE ACCOUNT"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Display Errors */}
            {(validationError || error) && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{validationError || error}</span>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm"
                  placeholder="john@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg glass-input text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
              {!isLogin && (
                <p className="mt-1 text-[10px] text-white/50 leading-relaxed">
                  Requires 8+ characters, uppercase, lowercase, number, and special character.
                </p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-1.5">
                  Select User Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg glass-input text-sm appearance-none cursor-pointer"
                >
                  <option className="bg-slate-900 text-white" value="USER">
                    USER (View Dashboard & Read Tasks)
                  </option>
                  <option className="bg-slate-900 text-white" value="ADMIN">
                    ADMIN (Full Task CRUD Access)
                  </option>
                  <option className="bg-slate-900 text-white" value="SUPER_ADMIN">
                    SUPER_ADMIN (Full Task CRUD Access)
                  </option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-lg bg-yellow hover:bg-[#ffe540] text-dark font-bold font-barlow tracking-widest text-lg transition duration-200 shadow-md hover:shadow-yellow/10 disabled:opacity-50"
            >
              {loading ? "PROCESSING..." : isLogin ? "LOGIN" : "REGISTER"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={toggleMode}
                className="text-xs text-white/60 hover:text-yellow transition underline"
              >
                {isLogin
                  ? "Don't have an account? Register here"
                  : "Already have an account? Login here"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
