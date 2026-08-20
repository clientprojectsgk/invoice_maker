import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { Input, FormField } from '../../components/common/FormField';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const otp = await forgotPassword(data.email);
      navigate('/verify-otp', { state: { email: data.email, demoOtp: otp, reset: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f5f7fa]">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg border border-gray-200 p-8 card-shadow">
          <h2 className="text-xl font-semibold text-gray-900">Forgot password</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">Enter your email to receive OTP</p>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-md">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Email" error={errors.email?.message} required>
              <Input {...register('email', { required: 'Email is required' })} type="email" placeholder="you@company.com" />
            </FormField>
            <Button type="submit" className="w-full" loading={loading}>Send OTP</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            <Link to="/login" className="text-primary-600 font-medium hover:underline">Back to Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
