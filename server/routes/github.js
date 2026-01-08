const express = require('express');
const axios = require('axios');
const router = express.Router();

// Cache
const githubCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const headers = {
  'User-Agent': 'DevProfileAnalyzer',
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
};
router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const cacheKey = `github_${username.toLowerCase()}`;
    const cached = githubCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return res.json(cached.data);
    }

    const headers = {
      'User-Agent': 'DevProfileAnalyzer',
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      })
    };

    const [userResponse, reposResponse] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}`, { headers }),
      axios.get(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=stars&direction=desc`,
        { headers }
      )
    ]);

    const repos = reposResponse.data.filter(repo => !repo.fork);

    // ⭐ Total stars
    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);

    // 🧠 Top languages (weighted by stars)
    const languages = {};
    repos.forEach(repo => {
      if (repo.language) {
        languages[repo.language] =
          (languages[repo.language] || 0) + repo.stargazers_count;
      }
    });

    const topLanguages = Object.entries(languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([language, stars]) => ({ language, stars }));

    // 🏆 Top 8 repos
    const topRepos = repos.slice(0, 8).map(repo => ({
      name: repo.name,
      description: repo.description,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      url: repo.html_url,
      updated: repo.updated_at
    }));

    const result = {
      profile: {
        username: userResponse.data.login,
        name: userResponse.data.name,
        avatar: userResponse.data.avatar_url,
        bio: userResponse.data.bio,
        publicRepos: userResponse.data.public_repos,
        followers: userResponse.data.followers,
        following: userResponse.data.following,
        profileUrl: userResponse.data.html_url
      },
      stats: {
        totalStars,
        topLanguages
      },
      topRepos
    };

    githubCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });

    res.json(result);
  } catch (error) {
    console.error('GitHub API Error:', error.message);

    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'GitHub user not found' });
    }

    if (error.response?.status === 403) {
      return res.status(429).json({ error: 'GitHub API rate limit exceeded' });
    }

    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
});

module.exports = router;