import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  HiOutlineEye, HiOutlineEyeOff, HiOutlineLightningBolt,
  HiOutlineDocumentText, HiOutlineChartBar, HiOutlineShieldCheck,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { APP_NAME } from '../../utils/constants';

const features = [
  { icon: HiOutlineDocumentText, title: 'GST Invoices', desc: 'Create & download in seconds' },
  { icon: HiOutlineChartBar, title: 'Smart Reports', desc: 'Sales, GST & profit analytics' },
  { icon: HiOutlineShieldCheck, title: 'Secure & Reliable', desc: 'Your data stays protected' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setValue('email', 'admin@invoicepro.com');
    setValue('password', 'admin123');
    setError('');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', overflow: 'hidden', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Left panel ── */}
      <div style={{
        flex: '0 0 42%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '48px 52px',
        background: 'linear-gradient(145deg, #1e3a5f 0%, #0f6cbd 60%, #38bdf8 100%)',
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 36 }}>
            <img src="/logo.png" alt={APP_NAME} style={{ width: 58, height: 58, objectFit: 'contain', filter: '' }} className="rounded-3" />
            <h5 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.3px' }} className="text-white">
              Rajlakshami Fruite &amp;<br />Vegetable Suppliers
            </h5>
          </div>

          {/* <h2 style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.25, margin: '0 0 12px' }} className="text-white">
            Rajlakshami Fruite &amp;<br />Vegetable Suppliers
          </h2> */}
          <p style={{ fontSize: 14, opacity: 0.8, margin: '0 0 40px', lineHeight: 1.6 }}>
            Manage invoices, track payments and grow your business — all in one place.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon style={{ width: 20, height: 20 }} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{title}</p>
                  <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f8fafc', padding: '32px 24px',
      }}>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Welcome back 👋</h1>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Sign in to your account to continue</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
              style={{
                marginBottom: 18, display: 'flex', gap: 8, padding: '10px 14px',
                background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10,
                color: '#dc2626', fontSize: 13,
              }}
            >
              <span>⚠</span><span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                style={{ ...inputStyle, ...(errors.email ? errorBorder : {}) }}
              />
              {errors.email && <p style={errMsg}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{ ...inputStyle, paddingRight: 42, ...(errors.password ? errorBorder : {}) }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4,
                  }}
                >
                  {showPass ? <HiOutlineEyeOff style={{ width: 18, height: 18 }} /> : <HiOutlineEye style={{ width: 18, height: 18 }} />}
                </button>
              </div>
              {errors.password && <p style={errMsg}>{errors.password.message}</p>}
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 15, height: 15, accentColor: '#0f6cbd' }} />
                Remember me
              </label>
              <Link to="/forgot-password" style={{ fontSize: 13, fontWeight: 600, color: '#0f6cbd', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>

            <Button type="submit" loading={loading} style={{ width: '100%', marginTop: 4 }}>
              Sign in
            </Button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>or try demo</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          <button
            type="button"
            onClick={fillDemo}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '10px 16px', borderRadius: 10, border: '2px dashed #cbd5e1',
              background: 'transparent', cursor: 'pointer', fontSize: 13, color: '#475569',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f6cbd'; e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#0f6cbd'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; }}
          >
            <HiOutlineLightningBolt style={{ width: 16, height: 16, color: '#f59e0b' }} />
            Use demo — <strong>admin@invoicepro.com</strong>
          </button>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginTop: 24 }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: '#0f6cbd', textDecoration: 'none' }}>
              Create free account
            </Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 16 }}>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 };
const inputStyle = {
  width: '100%', padding: '10px 14px', fontSize: 14, borderRadius: 10,
  border: '1.5px solid #e2e8f0', background: '#fff', outline: 'none',
  boxSizing: 'border-box', color: '#0f172a', transition: 'border-color 0.2s',
};
const errorBorder = { borderColor: '#f87171' };
const errMsg = { margin: '4px 0 0', fontSize: 12, color: '#dc2626' };
