import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaTrophy, FaStar } from 'react-icons/fa';
import { SiCodeforces, SiCodechef, SiLeetcode, SiGeeksforgeeks } from 'react-icons/si';

axios.defaults.withCredentials = true;

const api = "http://localhost:5000/api/data";

const Dashboard = () => {
  const [profiles, setProfiles] = useState({});
  const [codeforcesData, setCodeforcesData] = useState({});
  const [codechefData, setCodechefData] = useState({});
  const [leetcodeData, setLeetcodeData] = useState({});
  const [gfgData, setGfgData] = useState({});
  const [gfgPOTD, setGfgPOTD] = useState({});
  const [leetcodePOTD, setLeetcodePOTD] = useState({});
  const [codechefContests, setCodechefContests] = useState({});
  const [codeforcesContests, setCodeforcesContests] = useState({});
  const [isLoggedI, setIsLoggedIn] = useState(false);
  
  const handleLogout = async () => {
    try {
      await axios.post(`${api}/logout`);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {

    axios.get('http://localhost:5000/api/auth')
      .then(response => {
        if (response.status === 200) {
          setIsLoggedIn(true);
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          setIsLoggedIn(false);
        }
      });

    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(`${api}/profile`);
        setProfiles(profileResponse.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setProfiles({ error: 'Could not fetch profile data' });
      }

      try {
        const codeforcesResponse = await axios.get(`${api}/codeforces`);
        if(codeforcesResponse.status === 500)
          {
            throw new Error('Internal Server Error'); 
          }
        setCodeforcesData(codeforcesResponse.data);
      } catch (error) {
        console.error('Error fetching Codeforces data:', error);
        setCodeforcesData({ error: 'Could not fetch Codeforces data' });
      }

      try {
        const codechefResponse = await axios.get(`${api}/codechef`);
        setCodechefData(codechefResponse.data);
      } catch (error) {
        console.error('Error fetching Codechef data:', error);
        setCodechefData({ error: 'Could not fetch Codechef data' });
      }

      try {
        const leetcodeResponse = await axios.get(`${api}/leetcode`);
        setLeetcodeData(leetcodeResponse.data);
      } catch (error) {
        console.error('Error fetching Leetcode data:', error);
        setLeetcodeData({ error: 'Could not fetch Leetcode data' });
      }

      try {
        const gfgResponse = await axios.get(`${api}/gfg`);
        setGfgData(gfgResponse.data);
      } catch (error) {
        console.error('Error fetching GFG data:', error);
        setGfgData({ error: 'Could not fetch GFG data' });
      }

      try {
        const gfgPOTDResponse = await axios.get(`${api}/gfg/potd`);
        setGfgPOTD(gfgPOTDResponse.data);
      } catch (error) {
        console.error('Error fetching GFG POTD:', error);
        setGfgPOTD({ error: 'Could not fetch GFG POTD data' });
      }

      try {
        const leetcodePOTDResponse = await axios.get(`${api}/leetcode/potd`);
        setLeetcodePOTD(leetcodePOTDResponse.data);
      } catch (error) {
        console.error('Error fetching Leetcode POTD:', error);
        setLeetcodePOTD({ error: 'Could not fetch Leetcode POTD data' });
      }

      try {
        const codechefContestsResponse = await axios.get(`${api}/codechef/contests`);
        setCodechefContests(codechefContestsResponse.data);
      } catch (error) {
        console.error('Error fetching Codechef contests:', error);
        setCodechefContests({ error: 'Could not fetch Codechef contests data' });
      }

      try {
        const codeforcesContestsResponse = await axios.get(`${api}/codeforces/contests`);
        setCodeforcesContests(codeforcesContestsResponse.data);
      } catch (error) {
        console.error('Error fetching Codeforces contests:', error);
        setCodeforcesContests({ error: 'Could not fetch Codeforces contests data' });
      }
    };

    fetchData();
  }, []);
  return (
    <div className="container bg-slate-400 mx-auto p-4">
      <Navbar isLoggedIn={isLoggedI} handleLogout={handleLogout} />
      <ProfileCard profiles={profiles} isLoggedIn={isLoggedI} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <CodeforcesCard data={codeforcesData} />
        <CodeforcesContestsCard contests={codeforcesContests} />
        <CodechefCard data={codechefData} />
        <CodechefContestsCard contests={codechefContests} />
        <LeetcodeCard data={leetcodeData} />
        <GfgCard data={gfgData} />
        <POTDCard leetcodePOTD={leetcodePOTD} gfgPOTD={gfgPOTD} />
      </div>
    </div>
  );
};

const Navbar = ({ isLoggedIn, handleLogout }) => (
  <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
    <a href='/dashboard' className="text-2xl font-bold">Dashboard</a>
    <div>
    <a href="/land" className="mr-4">Homepage</a>
      {isLoggedIn? (
        <a href="/logout" className="mr-4" onClick={handleLogout}>Logout</a>
      ) : (
        <>
          <a href="/login" className="mr-4">Login</a>
          <a href="/signup" className="mr-4">Sign up</a>
        </>
      )}
    </div>
  </div>
);

const ProfileCard = ({ profiles, isLoggedIn }) => (
  <div className="bg-gray-200 shadow-md rounded-lg p-4 flex justify-around items-center">
    <div className="text-xl font-bold flex items-center">
      <FaUserCircle className="mr-2" /> {isLoggedIn? <a href='/edit'>Profile</a> : <span>Please log in</span>}
    </div>
    <div className="flex flex-wrap justify-center">
      {isLoggedIn? (
        <>
          <p className="p-2">
            <span className="font-bold">LeetCode:</span> {profiles.leetCode}
          </p>
          <p className="p-2">
            <span className="font-bold">Codeforces:</span> {profiles.codeforces}
          </p>
          <p className="p-2">
            <span className="font-bold">Codechef:</span> {profiles.codechef}
          </p>
          <p className="p-2">
            <span className="font-bold">GeeksForGeeks:</span> {profiles.geeksForGeeks}
          </p>
        </>
      ) : (
        <p className="p-2">Please log in to view your profile</p>
      )}
    </div>
  </div>
);

const CodeforcesCard = ({ data }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <a href="https://codeforces.com" target="_blank" rel="noopener noreferrer">
      <div className="bg-blue-500 text-white p-2 rounded-lg mb-4">
        <h2 className="text-2xl font-bold text-center"><SiCodeforces className="inline mr-2" /> <a href='https://codeforces.com'>Codeforces</a></h2>
      </div>
    </a>
    <div className="flex flex-wrap justify-center">
      {data.error ? (
        <p className="p-2 text-red-500">{data.error}</p>
      ) : (
        <>
          <p className="p-2"><span className="font-bold">Country:</span> {data.country}</p>
          <p className="p-2"><span className="font-bold">Last Online:</span> {new Date(data.lastOnlineTimeSeconds * 1000).toLocaleString()}</p>
          <p className="p-2"><span className="font-bold">City:</span> {data.city}</p>
          <p className="p-2"><span className="font-bold">Rating:</span> {data.rating}</p>
          <p className="p-2"><span className="font-bold">Rank:</span> {data.rank}</p>
          <p className="p-2"><span className="font-bold">Max Rating:</span> {data.maxRating}</p>
          <p className="p-2"><span className="font-bold">Max Rank:</span> {data.maxRank}</p>
          <p className="p-2"><span className="font-bold">Organization:</span> {data.organization}</p>
        </>
      )}
    </div>
  </div>
);

const CodeforcesContestsCard = ({ contests }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <div className="bg-blue-500 text-white p-2 rounded-lg mb-4">
      <h3 className="text-lg font-bold text-center"><FaTrophy className="inline mr-2" />  <a href='https://codeforces.com/contests'>Codeforces Contests</a></h3>
    </div>
    <div className="flex flex-wrap justify-center">
      {contests && Array.isArray(contests) && contests.slice().reverse().slice(0, 3).map(contest => (
        <div key={contest.id} className="p-2">
          <p><span className="font-bold">{contest.name}</span></p>
          <p>Start: {new Date(contest.startTimeSeconds * 1000).toLocaleString()}</p>
          <p>Duration: {Math.floor(contest.durationSeconds / 3600)} hours</p>
        </div>
      ))}
    </div>
  </div>
);

const CodechefCard = ({ data }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <a href="https://www.codechef.com" target="_blank" rel="noopener noreferrer">
      <div className="bg-yellow-500 text-white p-2 rounded-lg mb-4">
        <h2 className="text-2xl font-bold text-center"><SiCodechef className="inline mr-2" /> Codechef</h2>
      </div>
    </a>
    {data.error ? (
        <p className="p-2 text-red-500">{data.error}</p>
      ) : (
        <>
          <p className="p-2"><span className="font-bold">Name:</span> {data.name}</p>
          <p className="p-2"><span className="font-bold">Country:</span> {data.country}</p>
          <p className="p-2"><span className="font-bold">Rating:</span> {data.rating}</p>
          <p className="p-2"><span className="font-bold">Stars:</span> {data.stars}</p>
          <p className="p-2"><span className="font-bold">Highest Rating:</span> {data.highest_rating}</p>
          <p className="p-2"><span className="font-bold">Global Rank:</span> {data.global_rank}</p>
          <p className="p-2"><span className="font-bold">Country Rank:</span> {data.country_rank}</p>
        </>
      )}
  </div>
);

const CodechefContestsCard = ({ contests }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <div className="bg-yellow-500 text-white p-2 rounded-lg mb-4">
      <h3 className="text-lg font-bold text-center"><FaTrophy className="inline mr-2" /> <a href='https://codechef.com/contests'>Codechef Contests</a></h3>
    </div>

    
        <div className="flex flex-wrap justify-center">
          {contests.future_contests && contests.future_contests.map(contest => (
            <div key={contest.contest_code} className="w-full md:w-1/2 xl:w-1/3 p-2">
              <p>
                <span className=" font-bold p-1 rounded-lg mr-2">{contest.contest_name}</span>
              </p>
              <p>Start: {new Date(contest.contest_start_date_iso).toLocaleString()}</p>
              <p>End: {new Date(contest.contest_end_date_iso).toLocaleString()}</p>
            </div>
          ))}
        </div>
      
    



    {/* <div className="flex flex-wrap justify-center">
      {contests && Array.isArray(contests) && contests.slice().reverse().slice(0, 3).map(contest => (
        <div key={contest.code} className="p-2">
          <p><span className="font-bold">{contest.name}</span></p>
          <p>Start: {new Date(contest.startDate).toLocaleString()}</p>
          <p>End: {new Date(contest.endDate).toLocaleString()}</p>
        </div>
      ))}
    </div> */}
  </div>
);

const LeetcodeCard = ({ data }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <a href="https://leetcode.com" target="_blank" rel="noopener noreferrer">
      <div className="bg-orange-500 text-white p-2 rounded-lg mb-4">
        <h2 className="text-2xl font-bold text-center"><SiLeetcode className="inline mr-2" /> Leetcode</h2>
      </div>
    </a>
    <div className="flex flex-wrap justify-center">
      {data.error ? (
        <p className="p-2 text-red-500">{data.error}</p>
      ) : (
        <>
          <p className="p-2"><span className="font-bold">Ranking:</span> {data.ranking}</p>
      <p className="p-2"><span className="font-bold">Total Problems Solved:</span> {data.totalSolved}</p>
      <p className="p-2"><span className="font-bold">Acceptance Rate:</span> {data.acceptanceRate}</p>
      <p className="p-2"><span className="font-bold">Easy Problems Solved:</span> {data.easySolved}</p>
      <p className="p-2"><span className="font-bold">Medium Problems Solved:</span> {data.mediumSolved}</p>
      <p className="p-2"><span className="font-bold">Hard Problems Solved:</span> {data.hardSolved}</p>
        </>
      )}
    </div>
  </div>
);

const GfgCard = ({ data }) => (
  <div className="bg-white shadow-md rounded-lg p-4">
    <a href={`https://auth.geeksforgeeks.org/user/${data.userName}`} target="_blank" rel="noopener noreferrer">
      <div className="bg-green-500 text-white p-2 rounded-lg mb-4">
        <h2 className="text-2xl font-bold text-center"><SiGeeksforgeeks className="inline mr-2" /> GeeksForGeeks</h2>
      </div>
    </a>
    <div className="flex flex-wrap justify-center">
      {data.error ? (
        <p className="p-2 text-red-500">{data.error}</p>
      ) : (
        <>
          <p className="p-2"><span className="font-bold">Total Problems Solved:</span> {data.totalProblemsSolved}</p>
      <p className="p-2"><span className="font-bold">School Problems:</span> {data.School}</p>
      <p className="p-2"><span className="font-bold">Basic Problems:</span> {data.Basic}</p>
      <p className="p-2"><span className="font-bold">Easy Problems:</span> {data.Easy}</p>
      <p className="p-2"><span className="font-bold">Medium Problems:</span> {data.Medium}</p>
      <p className="p-2"><span className="font-bold">Hard Problems:</span> {data.Hard}</p>
        </>
      )}
    </div>
  </div>
);


const POTDCard = ({ leetcodePOTD, gfgPOTD }) => (
  <div className="bg-white shadow-md rounded-lg p-6">
    <div className="bg-indigo-500 text-white p-2 rounded-lg mb-4">
      <h3 className="text-lg font-bold text-center"><FaStar className="inline mr-2" /> Problems of the Day</h3>
    </div>
    <div className="flex flex-wrap justify-center mb-4">
      <div className="w-full md:w-1/2 xl:w-1/2 p-4">
        <a href={leetcodePOTD && leetcodePOTD.data && leetcodePOTD.data.activeDailyCodingChallengeQuestion ? `https://leetcode.com/problems/${leetcodePOTD.data.activeDailyCodingChallengeQuestion.question.titleSlug}` : '#'}>
          <div className="bg-indigo-100 shadow-md rounded-lg p-4">
            <h4 className="font-bold">LeetCode POTD</h4>
            {
              leetcodePOTD && leetcodePOTD.data && leetcodePOTD.data.activeDailyCodingChallengeQuestion? (
                <>
                  <p className="text-lg">{leetcodePOTD.data.activeDailyCodingChallengeQuestion.question.title}</p>
                  <p>Acceptance: {leetcodePOTD.data.activeDailyCodingChallengeQuestion.question.acRate !== undefined ? leetcodePOTD.data.activeDailyCodingChallengeQuestion.question.acRate.toFixed(2) : 'N/A'}%</p>
                  <p>Difficulty: {leetcodePOTD.data.activeDailyCodingChallengeQuestion.question.difficulty}</p>
                </>
              ) : (
                <p>No data available</p>
              )
            }
          </div>
        </a>
      </div>
      <div className="w-full md:w-1/2 xl:w-1/2 p-4">
        <a href={gfgPOTD ? `${gfgPOTD.problem_url}` : '#'}>
          <div className="bg-indigo-100 shadow-md rounded-lg p-4">
            <h4 className="font-bold">GFG POTD</h4>
            {
              gfgPOTD? (
                <>
                  <p className="text-lg">{gfgPOTD.problem_name}</p>
                  <p>Accuracy: {gfgPOTD.accuracy !== undefined ? gfgPOTD.accuracy.toFixed(2) : 'N/A'}%</p>
                  <p>Difficulty: {gfgPOTD.difficulty}</p>
                </>
              ) : (
                <p>No data available</p>
              )
            }
          </div>
        </a>
      </div>
    </div>
  </div>
);

export default Dashboard;
