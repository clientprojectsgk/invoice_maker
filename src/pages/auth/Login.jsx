import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff,
  HiOutlineDocumentText, HiOutlineShieldCheck, HiOutlineChartBar, HiOutlineLightningBolt,
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { Input, FormField } from '../../components/common/FormField';
import { APP_NAME } from '../../utils/constants';

const features = [
  { icon: HiOutlineDocumentText, title: 'GST Invoices', desc: 'Create & download in seconds' },
  { icon: HiOutlineChartBar, title: 'Smart Reports', desc: 'Sales, GST & profit analytics' },
  { icon: HiOutlineShieldCheck, title: 'Secure & Reliable', desc: 'Your data stays protected' },
];

const stats = [
  { value: '10K+', label: 'Invoices created' },
  { value: '99.9%', label: 'Uptime' },
  { value: '500+', label: 'Businesses' },
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
    <div className="min-h-screen flex auth-page">
      {/* Left panel — brand & features */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden auth-panel-left">
        <div className="auth-panel-bg" aria-hidden="true" />
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full text-white">
          <div>
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <HiOutlineDocumentText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight m-0 leading-tight">{APP_NAME}</h1>
                <p className="text-xs text-blue-100/80 m-0 mt-0.5">Billing Management System</p>
              </div>
            </motion.div>
          </div>

          <div className="my-auto py-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-3xl xl:text-4xl font-bold leading-tight m-0 max-w-md"
            >
              Manage invoices smarter, grow faster
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-blue-100/90 mt-4 text-base leading-relaxed max-w-md m-0"
            >
              All-in-one platform for GST billing, customers, inventory, and business reports — built for Indian businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-10 space-y-4"
            >
              {features.map((f, i) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 border border-white/10">
                    <f.icon className="w-5 h-5 text-blue-100" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm m-0">{f.title}</p>
                    <p className="text-sm text-blue-100/70 m-0 mt-0.5">{f.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex gap-8 pt-6 border-t border-white/10"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold m-0">{s.value}</p>
                <p className="text-xs text-blue-100/60 m-0 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 auth-panel-right">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-[420px]"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
              <HiOutlineDocumentText className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">{APP_NAME}</span>
          </div>

          <div className="auth-card">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 m-0">Welcome back</h2>
              <p className="text-gray-500 text-sm mt-2 m-0">Sign in to your account to continue</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-start gap-2 p-3.5 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl"
              >
                <span className="flex-shrink-0 mt-0.5">⚠</span>
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
              <FormField label="Email address" error={errors.email?.message} required>
                <div className="relative auth-input-wrap">
                  <Input
                    {...register('email', { required: 'Email is required' })}
                    type="email"
                    className="auth-input pl-10"
                    placeholder="name@company.com"
                    autoComplete="email"
                  />
                </div>
              </FormField>

              <FormField label="Password" error={errors.password?.message} required>
                <div className="relative auth-input-wrap">
                  <Input
                    {...register('password', { required: 'Password is required' })}
                    type={showPass ? 'text' : 'password'}
                    className="auth-input pl-10 pr-10"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? <HiOutlineEyeOff className="w-4 h-4" /> : <HiOutlineEye className="w-4 h-4" />}
                  </button>
                </div>
              </FormField>

              <div className="flex items-center justify-between pt-1 pb-5">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500/30 w-4 h-4" />
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-sm font-medium text-primary-600 hover:text-primary-700 no-underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full py-2.5 text-sm font-semibold" loading={loading}>
                Sign in
              </Button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-400 uppercase tracking-wider">or try demo</span>
              </div>
            </div>

            <button
              type="button"
              onClick={fillDemo}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-sm text-gray-600 hover:text-primary-700 group"
            >
              <HiOutlineLightningBolt className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
              <span>Use demo account — <strong className="font-semibold">admin@invoicepro.com</strong></span>
            </button>

            <p className="text-center text-sm text-gray-500 mt-8 m-0">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 no-underline">
                Create free account
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6 m-0">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
