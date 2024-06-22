const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getCodeforcesData ,setPlatformUsernames,getUpcomingCodeforcesContests , getCodeChefData , getCodeChefContests ,getLeetCodeData, getLeetCodePOTD, getGFGData, getGFGPOTD, getProfile} = require('../controllers/dataController');

// @route    GET api/data/codeforces
// @desc     Get Codeforces user data
// @access   Private
router.get('/codeforces', auth, getCodeforcesData);

// Additional routes for other platforms can be added similarly


// @route    POST api/data/usernames
// @desc     Set usernames for various platforms
// @access   Private
router.post('/usernames', auth, setPlatformUsernames);

// @route    GET api/data/codeforces/contests
// @desc     Get upcoming Codeforces contests
// @access   Private
router.get('/codeforces/contests',  getUpcomingCodeforcesContests);


router.get('/codechef', auth, getCodeChefData);

router.get('/codechef/contests', getCodeChefContests);


router.get('/leetcode', auth, getLeetCodeData);

router.get('/leetcode/potd',  getLeetCodePOTD);

router.get('/gfg', auth, getGFGData);

router.get('/gfg/potd',  getGFGPOTD);

router.get('/profile',auth, getProfile);

module.exports = router;
