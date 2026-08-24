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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-[420px]"
      >
        <div className="auth-card bg-white rounded-2xl shadow-lg border border-gray-100 px-6 ">
  
          {/* Logo */}
          <div className="flex flex-col items-center justify-center ">
            <div className="w-16 h-16 flex items-center justify-center">
              <img
                src="/logo.png"
                alt={APP_NAME}
                className="w-full h-full object-contain"
              />
            </div>
  
            {/* <h1 className="text-xl font-bold text-gray-900 m-0">
              {APP_NAME}
            </h1> */}
          </div>
  
          {/* Heading */}
          <div className="mb-7 text-center">
           
  
            <p className="text-gray-500 fs-6 text-sm mt-2 m-0">
             Rajlakshami Fruite and Vegetable Suppliers
            </p>

             <h2 className="text-2xl font-bold text-gray-900 m-0">
             Login
            </h2>
          </div>
  
          {/* Error */}
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
  
          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-1">
  
            <FormField
              // label="Email address"
              error={errors.email?.message}
              required
            >
              <div className="relative auth-input-wrap">
                <Input
                  {...register('email', {
                    required: 'Email is required'
                  })}
                  type="email"
                  className="auth-input"
                  placeholder="Email"
                  autoComplete="email"
                />
              </div>
            </FormField>
  
            <FormField
              // label="Password"
              error={errors.password?.message}
              required
            >
              <div className="relative auth-input-wrap">
                <Input
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  type={showPass ? 'text' : 'password'}
                  className="auth-input pr-10"
                  placeholder="Password"
                  autoComplete="current-password"
                />
  
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? (
                    <HiOutlineEyeOff className="w-4 h-4" />
                  ) : (
                    <HiOutlineEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </FormField>
  
            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500/30 w-4 h-4 me-2"
                />
                Remember me
              </label>
  
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 no-underline"
              >
                Forgot password?
              </Link>
            </div>
  
            {/* Sign In */}
            <Button
              type="submit"
              className="w-full text-sm font-semibold"
              loading={loading}
            >
              Sign in
            </Button>
          </form>
  
          {/* Demo */}
          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
  
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-gray-400 uppercase tracking-wider">
                or try demo
              </span>
            </div>
          </div>
  
          <button
            type="button"
            onClick={fillDemo}
            className="w-full flex items-center justify-center gap-2 px-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all text-sm text-gray-600 hover:text-primary-700 group"
          >
            <HiOutlineLightningBolt className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
  
            <span>
              Use demo account —{' '}
              <strong className="font-semibold">
                admin@invoicepro.com
              </strong>
            </span>
          </button>
  
          {/* Register */}
          <p className="text-center text-sm text-gray-500 mt-8 m-0">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary-600 hover:text-primary-700 no-underline"
            >
              Create free account
            </Link>
          </p>
        </div>
  
        {/* Copyright */}
        <p className="text-center text-xs text-gray-400 mt-5 m-0">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
