import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { Input, FormField } from '../../components/common/FormField';
import { APP_NAME } from '../../utils/constants';

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const otp = await registerUser(data);
      navigate('/verify-otp', { state: { email: data.email, demoOtp: otp } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f5f7fa]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">{APP_NAME}</h1>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-8 card-shadow">
          <h2 className="text-xl font-semibold text-gray-900">Create account</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">Start managing your invoices</p>
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-md">{error}</div>}
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Full Name" error={errors.name?.message} required>
              <Input {...register('name', { required: 'Name is required' })} placeholder="John Doe" />
            </FormField>
            <FormField label="Email" error={errors.email?.message} required>
              <Input {...register('email', { required: 'Email is required' })} type="email" placeholder="john@example.com" />
            </FormField>
            <FormField label="Password" error={errors.password?.message} required>
              <Input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} type="password" />
            </FormField>
            <FormField label="Confirm Password" error={errors.confirmPassword?.message} required>
              <Input {...register('confirmPassword', { required: 'Confirm password', validate: (v) => v === password || 'Passwords do not match' })} type="password" />
            </FormField>
            <Button type="submit" className="w-full mt-2" loading={loading}>Create Account</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
