// App.jsx - IMPROVED UI/UX VERSION
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CheckCircle, Sparkles, TrendingUp, LogOut, UserCheck, Menu, X } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Login from './components/Login';
import AuthCallback from './components/AuthCallback';
import ProfileConnect from './components/ProfileConnect';
import StatsDisplay from './components/StatsDisplay';
import CVUploader from './components/CVUploader';
import AIAnalysis from './components/AiAnalysis';
import ChatBot from './components/ChatBot';
import SocketTest from './components/SocketTest';
import CandidateForm from './components/CandidateForm';
import ChatRoom from './components/ChatRoom';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-3xl opacity-50 animate-pulse"></div>
            <Sparkles className="relative w-20 h-20 text-purple-400 animate-bounce mx-auto" />
          </div>
          <p className="text-slate-300 text-lg font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

// Dashboard Component - IMPROVED
function Dashboard() {
  const { user, logout } = useAuth();
  const [githubData, setGithubData] = useState(null);
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [hackerrankData, setHackerrankData] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-slate-950 text-white">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1400ms' }}></div>
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2100ms' }}></div>
      </div>

      {/* Improved Header */}
      <header className="relative border-b border-white/10 backdrop-blur-xl bg-gradient-to-r from-gray-900/50 via-slate-900/50 to-gray-900/50 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 max-w-7xl">
          <div className="flex justify-between items-center">
            {/* Logo & User Info */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <img 
                  src={user?.picture} 
                  alt={user?.name}
                  className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-purple-500 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-base sm:text-lg font-bold text-white">{user?.name}</h2>
                <p className="text-xs sm:text-sm text-slate-400">{user?.email}</p>
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href="/verification/new"
                className="group flex items-center gap-2 bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/30 hover:to-emerald-600/30 border border-green-500/50 hover:border-green-500/70 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-green-500/20"
              >
                <UserCheck className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>New Verification</span>
              </a>
              <button
                onClick={logout}
                className="group flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-pink-600/20 hover:from-red-600/30 hover:to-pink-600/30 border border-red-500/50 hover:border-red-500/70 px-4 py-2.5 rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-red-500/20"
              >
                <LogOut className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg border border-white/10 hover:bg-white/5 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mt-4 pt-4 border-t border-white/10 space-y-3 animate-fade-in">
              <div className="text-sm mb-3">
                <p className="font-medium text-white">{user?.name}</p>
                <p className="text-slate-400 text-xs">{user?.email}</p>
              </div>
              <a
                href="/verification/new"
                className="flex items-center gap-2 bg-green-600/20 border border-green-500/50 px-4 py-2.5 rounded-xl text-sm font-medium w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserCheck className="w-4 h-4" />
                <span>New Verification</span>
              </a>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 bg-red-600/20 border border-red-500/50 px-4 py-2.5 rounded-xl text-sm font-medium w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Improved */}
      <div className="relative border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-7xl">
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl opacity-60 group-hover:opacity-80 transition duration-500 animate-pulse"></div>
                <Sparkles className="relative w-16 h-16 sm:w-20 sm:h-20 text-blue-400 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent leading-tight animate-fade-in">
              Developer Profile Analyzer
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
              AI-powered professional evaluation + Real-time Background Verification
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300">AI Analysis</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300">Real-time Chat</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300">Instant Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Improved Layout */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-[95vw] 2xl:max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] xl:grid-cols-[35%_65%] 2xl:grid-cols-[32%_68%] gap-6 sm:gap-8 lg:gap-10">
          {/* Left Column - Input Forms */}
          <div className="space-y-6 sm:space-y-8 lg:sticky lg:top-24 lg:self-start">
            <div className="animate-slide-in-left">
              <ProfileConnect 
                setGithubData={setGithubData}
                setLeetcodeData={setLeetcodeData}
                setHackerrankData={setHackerrankData}
              />
            </div>
            <div className="animate-slide-in-left" style={{ animationDelay: '100ms' }}>
              <CVUploader 
                setResumeData={setResumeData}
                githubData={githubData}
                leetcodeData={leetcodeData}
                hackerrankData={hackerrankData}
                setAiAnalysis={setAiAnalysis}
              />
            </div>
          </div>

          {/* Right Column - Results Display */}
          <div className="space-y-6 sm:space-y-8 min-h-[600px]">
            {/* Empty State - Enhanced */}
            {!githubData && !leetcodeData && !hackerrankData && !resumeData && (
              <div className="bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-10 sm:p-16 text-center animate-fade-in shadow-2xl">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 blur-2xl opacity-50 animate-pulse"></div>
                  <TrendingUp className="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto text-indigo-400 animate-bounce" style={{ animationDuration: '3s' }} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Ready to Analyze Your Profile
                </h3>
                <p className="text-slate-400 text-base sm:text-lg max-w-md mx-auto leading-relaxed mb-8">
                  Connect your developer profiles and upload your resume to unlock powerful AI-driven insights
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-500">
                  <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">GitHub</span>
                  <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">LeetCode</span>
                  <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">HackerRank</span>
                  <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10">Resume</span>
                </div>
              </div>
            )}

            {/* Stats Display */}
            {(githubData || leetcodeData || hackerrankData) && (
              <div className="animate-slide-in-right">
                <StatsDisplay 
                  githubData={githubData}
                  leetcodeData={leetcodeData}
                  hackerrankData={hackerrankData}
                />
              </div>
            )}
            
            {/* Resume Parsed - Enhanced */}
            {resumeData && !aiAnalysis && (
              <div className="bg-gradient-to-br from-emerald-900/30 via-teal-900/30 to-green-900/30 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 sm:p-8 animate-slide-in-right shadow-2xl" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-50 animate-pulse"></div>
                    <CheckCircle className="relative w-8 h-8 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    Resume Successfully Parsed
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 text-sm sm:text-base">
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <span className="font-semibold text-emerald-300 block mb-2 text-xs uppercase tracking-wider">Name</span>
                    <span className="text-white text-lg group-hover:text-emerald-300 transition-colors">{resumeData.name}</span>
                  </div>
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <span className="font-semibold text-emerald-300 block mb-2 text-xs uppercase tracking-wider">Email</span>
                    <span className="text-white break-all group-hover:text-emerald-300 transition-colors">{resumeData.email}</span>
                  </div>
                  <div className="sm:col-span-2 bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                    <span className="font-semibold text-emerald-300 block mb-3 text-xs uppercase tracking-wider">Skills Detected</span>
                    <span className="text-white leading-relaxed group-hover:text-emerald-300 transition-colors">{resumeData.skills}</span>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span>AI analysis in progress...</span>
                </div>
              </div>
            )}
            
            {/* AI Analysis */}
            {aiAnalysis && (
              <div className="animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                <AIAnalysis analysis={aiAnalysis} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="relative border-t border-white/10 mt-16 sm:mt-20 bg-gradient-to-r from-gray-900/50 via-slate-900/50 to-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-3 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Powered by AI
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Built for Developers
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Real-time Verification
              </span>
            </div>
            <p className="text-xs text-slate-500">
              © 2025 Developer Profile Analyzer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot - Kept as is */}
      {/* <ChatBot 
        githubData={githubData}
        leetcodeData={leetcodeData}
        hackerrankData={hackerrankData}
        resumeData={resumeData}
        aiAnalysis={aiAnalysis}
      /> */}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/socket-test" element={<SocketTest />} />
            <Route path="/chat/:roomId" element={<ChatRoom />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/verification/new" 
              element={
                <ProtectedRoute>
                  <CandidateForm />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;