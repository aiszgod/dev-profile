// Login.jsx - IMPROVED UI/UX
import { Sparkles, LogIn, Shield, Zap, TrendingUp, Award } from 'lucide-react';
import { getApiUrl } from '../utils/apiUrl';

export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href = getApiUrl('/auth/google');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 text-white flex items-center justify-center p-4 overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1400ms' }}></div>
        <div className="absolute top-1/4 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2100ms' }}></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Feature Showcase */}
        <div className="hidden lg:block space-y-8 animate-slide-in-left">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-sm text-purple-300">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Analysis</span>
            </div>
            <h1 className="text-5xl xl:text-6xl font-black leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Elevate Your
              </span>
              <br />
              <span className="text-white">Developer Profile</span>
            </h1>
            <p className="text-lg text-slate-400 leading-relaxed max-w-lg">
              Get instant AI-powered insights into your coding skills, analyze your GitHub activity, 
              LeetCode progress, and conduct real-time background verifications.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 rounded-2xl backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300 group">
              <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">Profile Analytics</h3>
                <p className="text-sm text-slate-400">Deep insights from GitHub, LeetCode, and HackerRank</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-2xl backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 group">
              <div className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">AI-Powered Scoring</h3>
                <p className="text-sm text-slate-400">Get a comprehensive profile score in seconds</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl backdrop-blur-sm hover:border-green-500/50 transition-all duration-300 group">
              <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">Background Verification</h3>
                <p className="text-sm text-slate-400">Real-time chat-based verification system</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="relative animate-slide-in-right">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
          
          <div className="relative bg-gradient-to-br from-slate-900/90 via-gray-900/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl">
            {/* Mobile Title */}
            <div className="lg:hidden mb-8 text-center">
              <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
                Welcome Back
              </h1>
              <p className="text-slate-400">Sign in to analyze your developer profile</p>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 blur-2xl opacity-50 group-hover:opacity-75 transition duration-500 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                  <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-white transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3 hidden lg:block">
                Developer Profile Analyzer
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">
                Unlock powerful insights with AI
              </p>
            </div>

            {/* Google Login Button - Enhanced */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 sm:py-5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] group relative overflow-hidden"
            >
              {/* Animated gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <svg className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="relative z-10 text-base sm:text-lg group-hover:translate-x-0.5 transition-transform duration-300">
                Continue with Google
              </span>
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-900 text-slate-400">Trusted by developers worldwide</span>
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-300 group">
                <div className="p-1.5 bg-green-500/20 rounded-lg border border-green-500/30 group-hover:scale-110 transition-transform">
                  <Shield className="w-4 h-4 text-green-400" />
                </div>
                <span>Secure OAuth 2.0 authentication</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300 group">
                <div className="p-1.5 bg-purple-500/20 rounded-lg border border-purple-500/30 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <span>AI-powered profile analysis</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300 group">
                <div className="p-1.5 bg-blue-500/20 rounded-lg border border-blue-500/30 group-hover:scale-110 transition-transform">
                  <LogIn className="w-4 h-4 text-blue-400" />
                </div>
                <span>Connect GitHub, LeetCode, HackerRank</span>
              </div>
            </div>

            {/* Privacy Note */}
            <div className="mt-8 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <p className="text-xs text-slate-400 text-center leading-relaxed">
                🔒 We only access your basic profile information. 
                <br />
                Your data is encrypted and never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Stats - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 via-gray-900/95 to-transparent backdrop-blur-sm border-t border-white/5 p-4">
        <div className="flex justify-around text-center text-xs">
          <div>
            <div className="font-bold text-blue-400 text-lg">10K+</div>
            <div className="text-slate-500">Developers</div>
          </div>
          <div>
            <div className="font-bold text-purple-400 text-lg">50K+</div>
            <div className="text-slate-500">Profiles Analyzed</div>
          </div>
          <div>
            <div className="font-bold text-green-400 text-lg">99%</div>
            <div className="text-slate-500">Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
}