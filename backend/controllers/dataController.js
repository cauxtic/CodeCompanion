

const axios = require('axios');
const User = require('../models/User');
const cheerio = require('cheerio');


exports.getCodeforcesData = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('platforms.codeforces');
        const username = user.platforms.codeforces;
        if (!username) {
            return res.status(400).json({ msg: 'Codeforces username not set' });
        }

        const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
        res.json(response.data.result[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Additional functions for other platforms can be added similarly
exports.setPlatformUsernames = async (req, res) => {
    const { codeforces, codechef, leetcode, gfg } = req.body;

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.platforms.codeforces = codeforces || user.platforms.codeforces;
        user.platforms.codechef = codechef || user.platforms.codechef;
        user.platforms.leetcode = leetcode || user.platforms.leetcode;
        user.platforms.gfg = gfg || user.platforms.gfg;

        await user.save();

        res.json(user.platforms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getUpcomingCodeforcesContests = async (req, res) => {
    try {
        const response = await axios.get('https://codeforces.com/api/contest.list');
        const contests = response.data.result.filter(contest => contest.phase === 'BEFORE');
        res.json(contests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getCodeChefData = async (req, res) => {
    try {
        // Assuming req.user.id contains the authenticated user's ID
        const user = await User.findById(req.user.id).select('platforms.codechef');
        const username = user.platforms.codechef;

        if (!username) {
            return res.status(400).json({ msg: 'CodeChef username not set' });
        }

        // Fetch user data from CodeChef
        const url = `https://www.codechef.com/users/${username}`;
        const response = await axios.get(url);

        // Load HTML data into Cheerio
        const $ = cheerio.load(response.data);

        // Extract user data
        const rating = $('.rating-number').text().trim();
        const stars = $('.rating').text().trim();
        const highestRating = $('.rating-header small').last().text().trim().split(' ')[2].slice(0, -1);
        const globalRank = $('.rating-ranks a strong').first().text().trim();
        const countryRank = $('.rating-ranks a strong').last().text().trim();

        const contests = [];
        $('.rating-table').find('tr').each((i, el) => {
            if (i > 0) {
                const contestName = $(el).find('td').first().text().trim();
                const rating = $(el).find('td').eq(1).text().trim();
                const globalRank = $(el).find('td').eq(2).find('a').text().trim();
                const countryRank = $(el).find('td').eq(3).find('a').text().trim();
                contests.push({
                    name: contestName,
                    rating: parseInt(rating),
                    global_rank: globalRank === 'NA' ? null : parseInt(globalRank),
                    country_rank: countryRank === 'NA' ? null : parseInt(countryRank)
                });
            }
        });

        //const allRating = JSON.parse(response.data.match(/(?<=\[).*?(?=\])/s)[0].replace(/'/g, '"'));

        const fullySolved = {};
        $('.rating-data-section.problems-solved article').each((i, el) => {
            const categoryName = $(el).find('h5').text().trim();
            fullySolved[categoryName] = [];
            $(el).find('p').each((j, prob) => {
                const problemName = $(prob).find('a').text().trim();
                const problemLink = 'https://www.codechef.com' + $(prob).find('a').attr('href');
                fullySolved[categoryName].push({ name: problemName, link: problemLink });
            });
        });

        const userData = {
            status: 'Success',
            rating: parseInt(rating),
            stars: stars,
            highest_rating: parseInt(highestRating),
            global_rank: globalRank === 'NA' ? null : parseInt(globalRank),
            country_rank: countryRank === 'NA' ? null : parseInt(countryRank),
            contests: contests,
            //contest_ratings: allRating,
            fully_solved: fullySolved
        };

        res.json(userData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};



exports.getCodeChefContests = async (req, res) => {
    try {
        const url = 'https://www.codechef.com/api/list/contests/all';
        const response = await axios.get(url);

        if (response.data.status !== 'success') {
            return res.status(500).json({ msg: 'Failed to fetch contests' });
        }

        // Extract contests data
        const { present_contests, future_contests, practice_contests, past_contests } = response.data;

        const contestsData = {
            present_contests,
            future_contests,
            practice_contests,
            past_contests
        };

        res.json(contestsData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};


exports.getLeetCodeData = async (req,res) => {
    try {
      // Make GET request to the API endpoint
      const user = await User.findById(req.user.id).select('platforms.leetcode');
      const username = user.platforms.leetcode;

      if (!username) {
          return res.status(400).json({ msg: 'Leetcode username not set' });
      }
      const response = await axios.get(`https://leetcode-stats-api.herokuapp.com/${username}`);
  
      // Extract data from response
      const data = response.data;
  
      // Construct response object with relevant fields
      const stats = {
        totalSolved: data.totalSolved,
        totalQuestions: data.totalQuestions,
        easySolved: data.easySolved,
        totalEasy: data.totalEasy,
        mediumSolved: data.mediumSolved,
        totalMedium: data.totalMedium,
        hardSolved: data.hardSolved,
        totalHard: data.totalHard,
        acceptanceRate: data.acceptanceRate,
        ranking: data.ranking,
        contributionPoints: data.contributionPoints,
        reputation: data.reputation,
        submissionCalendar: data.submissionCalendar || {}, // Handle if submissionCalendar is null
      };
  
      res.json(stats); 
    } catch (error) {
      console.error('Error fetching LeetCode stats:', error);
      res.status(500).send('Failed to fetch LeetCode stats');
    }
  };

 
exports.getLeetCodePOTD = async (req, res) => {
    try {
      const query = `
        query questionOfToday {
          activeDailyCodingChallengeQuestion {
            date
            userStatus
            link
            question {
              acRate
              difficulty
              freqBar
              frontendQuestionId: questionFrontendId
              isFavor
              paidOnly: isPaidOnly
              status
              title
              titleSlug
              hasVideoSolution
              hasSolution
              topicTags {
                name
                id
                slug
              }
            }
          }
        }
      `;
  
      const response = await axios({
        url: 'https://leetcode.com/graphql',
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          query: query,
        },
      });
  
      const data = response.data;
      res.json(data);
    } catch (error) {
      console.error('Error fetching LeetCode POTD:', error);
      res.status(500).send('Failed to fetch LeetCode POTD');
    }
  };

  exports.getGFGData = async (req, res) => {
    try {
      // Retrieve the Geeks for Geeks username from request parameters
      const user = await User.findById(req.user.id).select('platforms.gfg');
      const username = user.platforms.gfg;

      if (!username) {
          return res.status(400).json({ msg: 'gfg username not set' });
      }
  
      // Construct the URL for the Geeks for Geeks API
      const apiUrl = `https://geeks-for-geeks-stats-api.vercel.app/?raw=Y&userName=${username}`;
  
      // Send GET request to the Geeks for Geeks API
      const response = await axios.get(apiUrl);
  
      // Extract data from the API response
      const data = response.data;
  
      // Send JSON response with the fetched data
      res.json(data);
    } catch (error) {
      // Handle errors
      console.error('Error fetching GFG data:', error);
      res.status(500).json({ error: 'Failed to fetch GFG data' });
    }
  };



 
  exports.getGFGPOTD = async (req, res) => {
    try {
      
  
      const response = await axios.get("https://practiceapi.geeksforgeeks.org/api/vr/problems-of-day/problem/today");
  
      const data = response.data;
      res.json(data);
    } catch (error) {
      console.error('Error fetching LeetCode POTD:', error);
      res.status(500).send('Failed to fetch LeetCode POTD');
    }
  };

  
  exports.getProfile = async (req, res) => {
    try {
      console.log(req.user);      
      const user = await User.findById(req.user.id);

      const data = {
        leetCode  : user.platforms.leetcode, 
        codeforces : user.platforms.codeforces,
         codechef : user.platforms.codechef,
          geeksForGeeks : user.platforms.gfg
      };
  
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching profile', error);
      res.status(500).send('Failed to fetch LeetCode POTD');
    }
  };