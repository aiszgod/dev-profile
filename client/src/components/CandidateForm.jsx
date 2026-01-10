import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { getApiUrl } from '../../utils/apiUrl';

const CandidateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
    employerEmail: '',
    recruiterEmail: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [chatLink, setChatLink] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // ✅ FIXED: Use getApiUrl helper to avoid double /api
      const apiUrl = getApiUrl();
      const url = `${apiUrl}/verification/submit`;
      
      console.log('📤 Submitting to:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setChatLink(data.data.chatLink);
        setFormData({
          name: '',
          email: '',
          skills: '',
          experience: '',
          employerEmail: '',
          recruiterEmail: ''
        });
        
        console.log('✅ Verification submitted:', data);
      } else {
        throw new Error(data.error || 'Submission failed');
      }

    } catch (err) {
      console.error('❌ Submit error:', err);
      setError(err.message || 'Failed to submit verification request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Background Verification
            </h1>
            <p className="text-gray-600">
              Submit candidate details to initiate verification process
            </p>
          </div>

          {success ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Initiated!
              </h2>
              <p className="text-gray-600 mb-6">
                Emails have been sent to the candidate and employer.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-500 mb-2">Chat Room Link:</p>
                <a 
                  href={chatLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 font-mono text-sm break-all"
                >
                  {chatLink}
                </a>
              </div>
              <button
                onClick={() => setSuccess(false)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Submit Another Verification
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Candidate Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Candidate Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills *
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                  min="0"
                  max="50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Employer/Faculty Email *
                </label>
                <input
                  type="email"
                  name="employerEmail"
                  value={formData.employerEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="employer@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recruiter Email *
                </label>
                <input
                  type="email"
                  name="recruiterEmail"
                  value={formData.recruiterEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="recruiter@company.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Verification Request
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateForm;