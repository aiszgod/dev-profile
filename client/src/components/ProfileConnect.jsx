// ProfileConnect.jsx - IMPROVED UI/UX
import { useState } from 'react';
import { Github, Code2, Award, Loader2, Zap, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../utils/apiUrl';

const ProfileConnect = ({ setGithubData, setLeetcodeData, setHackerrankData }) => {
  const [githubUser, setGithubUser] = useState('');
  const [leetcodeUser, setLeetcodeUser] = useState('');
  const [hackerrankUser, setHackerrankUser] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState({});

  const handleFetchData = async () => {
    setLoading(true);
    setErrors({});
    setSuccess({});

    try {
      const promises = [];
      const apiUrl = getApiUrl();

      // GitHub
      if (githubUser.trim()) {
        promises.push(
          fetch(`${apiUrl}/github/${githubUser.trim()}`)
            .then(async res => {
              if (!res.ok) {
                const err = await res.json();
                if (res.status === 429) {
                  throw new Error('GitHub rate limit exceeded. Please wait a few minutes.');
                }
                throw new Error(err.error || 'GitHub fetch failed');
              }
              return res.json();
            })
            .then(data => {
              setGithubData(data);
              setSuccess(prev => ({ ...prev, github: true }));
            })
            .catch(err => {
              setErrors(prev => ({ ...prev, github: err.message }));
            })
        );
      }

      // LeetCode
      if (leetcodeUser.trim()) {
        promises.push(
          fetch(`${apiUrl}/leetcode/${leetcodeUser.trim()}`)
            .then(async res => {
              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'LeetCode fetch failed');
              }
              return res.json();
            })
            .then(data => {
              setLeetcodeData(data);
              setSuccess(prev => ({ ...prev, leetcode: true }));
            })
            .catch(err => {
              setErrors(prev => ({ ...prev, leetcode: err.message }));
            })
        );
      }

      // HackerRank
      if (hackerrankUser.trim()) {
        promises.push(
          fetch(`${apiUrl}/hackerrank/${hackerrankUser.trim()}`)
            .then(async res => {
              if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'HackerRank fetch failed');
              }
              return res.json();
            })
            .then(data => {
              setHackerrankData(data);
              setSuccess(prev => ({ ...prev, hackerrank: true }));
            })
            .catch(err => {
              setErrors(prev => ({ ...prev, hackerrank: err.message }));
            })
        );
      }

      await Promise.allSettled(promises);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, label, value, onChange, placeholder, error, success, color }) => (
    <div className="group">
      <label className="block mb-3 font-semibold text-slate-200 flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full p-4 bg-slate-800/50 border rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none transition-all duration-300 ${
            error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
              : success
              ? 'border-green-500/50 focus:border-green-500 focus:ring-2 focus:ring-green-500/20'
              : 'border-slate-700/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
          }`}
        />
        {success && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
              <Zap className="w-3 h-3 text-green-400" />
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl animate-slide-up">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
      {success && (
        <div className="mt-2 flex items-center gap-2 text-green-400 text-sm animate-slide-up">
          <Zap className="w-3 h-3" />
          <span>Successfully connected!</span>
        </div>
      )}
    </div>
  );

  const hasAnyInput = githubUser.trim() || leetcodeUser.trim() || hackerrankUser.trim();

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-indigo-900/40 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl hover:shadow-indigo-500/10 transition-shadow duration-500">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
          Connect Your Profiles
        </h2>
        <p className="text-slate-400 text-sm">Link your developer accounts for comprehensive analysis</p>
      </div>

      <div className="space-y-5 mb-8">
        <InputField
          icon={Github}
          label="GitHub Username"
          value={githubUser}
          onChange={e => setGithubUser(e.target.value)}
          placeholder="octocat"
          error={errors.github}
          success={success.github}
          color="text-purple-400"
        />

        <InputField
          icon={Code2}
          label="LeetCode Username"
          value={leetcodeUser}
          onChange={e => setLeetcodeUser(e.target.value)}
          placeholder="leetcode_user"
          error={errors.leetcode}
          success={success.leetcode}
          color="text-orange-400"
        />

        <InputField
          icon={Award}
          label="HackerRank Username"
          value={hackerrankUser}
          onChange={e => setHackerrankUser(e.target.value)}
          placeholder="hacker_rank_user"
          error={errors.hackerrank}
          success={success.hackerrank}
          color="text-green-400"
        />
      </div>

      <button
        onClick={handleFetchData}
        disabled={loading || !hasAnyInput}
        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
      >
        {/* Animated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin relative z-10" />
            <span className="relative z-10">Fetching Profiles...</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform" />
            <span className="relative z-10">Analyze Profiles</span>
          </>
        )}
      </button>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
        <p className="text-sm text-blue-300 flex items-start gap-2">
          <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Pro tip:</strong> Connect multiple profiles for a more comprehensive AI analysis
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProfileConnect;