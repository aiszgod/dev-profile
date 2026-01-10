// ProfileConnect.jsx - FIXED (No cursor jumping + Professional dark theme)
import { useState } from 'react';
import { Github, Code2, Award, Loader2, Zap, CheckCircle2, XCircle } from 'lucide-react';
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

  const hasAnyInput = githubUser.trim() || leetcodeUser.trim() || hackerrankUser.trim();

  return (
    <div className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 sm:p-7 shadow-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
          Connect Your Profiles
        </h2>
        <p className="text-gray-400 text-sm">Link your developer accounts for analysis</p>
      </div>

      <div className="space-y-4 mb-6">
        {/* GitHub Input */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300 flex items-center gap-2">
            <Github className="w-4 h-4 text-gray-400" />
            GitHub Username
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="octocat"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
            {success.github && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
            )}
          </div>
          {errors.github && (
            <div className="mt-2 flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
              <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errors.github}</span>
            </div>
          )}
          {success.github && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Connected successfully</span>
            </div>
          )}
        </div>

        {/* LeetCode Input */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-gray-400" />
            LeetCode Username
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="leetcode_user"
              value={leetcodeUser}
              onChange={(e) => setLeetcodeUser(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
            />
            {success.leetcode && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
            )}
          </div>
          {errors.leetcode && (
            <div className="mt-2 flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
              <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errors.leetcode}</span>
            </div>
          )}
          {success.leetcode && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Connected successfully</span>
            </div>
          )}
        </div>

        {/* HackerRank Input */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-gray-400" />
            HackerRank Username
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="hacker_rank_user"
              value={hackerrankUser}
              onChange={(e) => setHackerrankUser(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/20 transition-all"
            />
            {success.hackerrank && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
            )}
          </div>
          {errors.hackerrank && (
            <div className="mt-2 flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
              <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errors.hackerrank}</span>
            </div>
          )}
          {success.hackerrank && (
            <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Connected successfully</span>
            </div>
          )}
        </div>
      </div>

      {/* Fetch Button */}
      <button
        onClick={handleFetchData}
        disabled={loading || !hasAnyInput}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-700 disabled:to-gray-700 py-3.5 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Fetching Profiles...</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5" />
            <span>Fetch Profile Data</span>
          </>
        )}
      </button>

      {/* Info Tip */}
      <div className="mt-5 p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <p className="text-sm text-blue-300 flex items-start gap-2">
          <Zap className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Tip:</strong> Connect multiple profiles for comprehensive AI analysis
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProfileConnect;