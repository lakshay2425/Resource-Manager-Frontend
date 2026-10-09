import { useEffect, useState } from 'react';
import { Loader2, UserRound } from 'lucide-react';
import { isValidUsername, formatUsernameForUrl } from '../utilis/collectionUrls.js';
import { updateUsername } from '../api/usersApi.js';

export default function UsernameSetupModal({
  isOpen,
  suggestedUsername,
  onConfigured,
  onDismiss,
}) {
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUsername(suggestedUsername ?? '');
      setErrorMessage('');
    }
  }, [isOpen, suggestedUsername]);

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const normalizedUsername = formatUsernameForUrl(username);
    if (!isValidUsername(normalizedUsername)) {
      setErrorMessage('Use 1-50 lowercase letters, numbers, or single hyphens.');
      return;
    }

    setIsSaving(true);
    setErrorMessage('');
    try {
      const result = await updateUsername(normalizedUsername);
      onConfigured(result.username);
    } catch (error) {
      if (error?.response?.data?.code === 'USERNAME_TAKEN') {
        setErrorMessage('That username is already taken. Try another one.');
      } else if (error?.response?.data?.code === 'USERNAME_ALREADY_CONFIGURED') {
        setErrorMessage('Your account already has a username. Refresh the page to continue.');
      } else {
        setErrorMessage(error?.response?.data?.message || 'Could not save your username. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/55 px-4 py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) onDismiss();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="username-setup-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-slate-700">
          <UserRound className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 id="username-setup-title" className="text-2xl font-bold text-stone-900">
          Choose your username
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Your username identifies you on public resources and collections. You can do this now or when you next make something public.
        </p>

        <form className="mt-6" onSubmit={handleSubmit}>
          <label htmlFor="account-username" className="mb-2 block text-sm font-medium text-stone-700">
            Username
          </label>
          <div className="flex items-center rounded-lg border border-stone-300 focus-within:border-slate-600 focus-within:ring-2 focus-within:ring-slate-200">
            <span className="pl-3 text-stone-400" aria-hidden="true">@</span>
            <input
              id="account-username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              maxLength={200}
              autoComplete="username"
              autoFocus
              className="min-w-0 flex-1 rounded-lg px-2 py-3 text-stone-900 outline-none"
              placeholder="your-username"
              aria-describedby={errorMessage ? 'username-setup-error' : 'username-setup-hint'}
            />
          </div>
          <p id="username-setup-hint" className="mt-2 text-xs text-stone-500">
            Lowercase letters, numbers, and hyphens; 1-50 characters. A suggested name may already be taken.
          </p>
          {errorMessage && (
            <p id="username-setup-error" role="alert" className="mt-3 text-sm text-red-700">
              {errorMessage}
            </p>
          )}
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={isSaving}
              onClick={onDismiss}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 disabled:opacity-50"
            >
              Not now
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {isSaving ? 'Saving...' : 'Save username'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
