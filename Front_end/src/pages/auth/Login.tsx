import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(loginStart());
    
    // Simulate API call
    setTimeout(() => {
      let role: any = 'USER';
      if (formData.email.includes('admin')) role = 'ADMIN';
      else if (formData.email.includes('staff')) role = 'STAFF';

      const user = {
        id: '1',
        name: role === 'ADMIN' ? 'Admin User' : role === 'STAFF' ? 'Staff Member' : 'John Doe',
        email: formData.email,
        role: role
      };

      dispatch(loginSuccess({ user, token: 'mock-jwt-token' }));
      
      setLoading(false);
      if (role === 'ADMIN' || role === 'STAFF') navigate('/admin');
      else navigate('/');
    }, 1500);
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 bg-dark-base relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-primary mb-2 tracking-widest">KANT</h1>
          <p className="text-gray-400">Welcome back to excellence</p>
        </div>

        <div className="glass-card p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="input-luxury w-full pl-12"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" size={18} />
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="input-luxury w-full pl-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="rounded border-white/10 bg-dark-soft text-primary focus:ring-primary" />
              <label htmlFor="remember" className="text-sm text-gray-400">Remember me for 30 days</label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-gold w-full py-4 text-lg flex items-center justify-center group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-dark-base border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  SIGN IN <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account? <button onClick={() => navigate('/register')} className="text-primary font-bold hover:underline">Create account</button>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-2 text-gray-500 text-xs">
          <ShieldCheck size={14} />
          <span>Secure Enterprise Authentication</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
