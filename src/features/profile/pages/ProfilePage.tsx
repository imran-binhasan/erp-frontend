import { useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { useChangePassword } from '@/features/profile/hooks/useProfile';

export function ProfilePage() {
  const { user } = useAuth();
  const changePasswordMutation = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-theme-xl font-semibold text-gray-800 dark:text-white/90">Profile</h1>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Account Info</h2>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
            <p className="text-gray-800 dark:text-white/90">{user?.name}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Email</span>
            <p className="text-gray-800 dark:text-white/90">{user?.email}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Role</span>
            <p className="text-gray-800 dark:text-white/90">{user?.role?.name}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-dark">
        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Change Password</h2>
        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {error && <p className="text-theme-sm text-error-500">{error}</p>}
          <Button type="submit" loading={changePasswordMutation.isPending}>Change Password</Button>
        </form>
      </div>
    </div>
  );
}
