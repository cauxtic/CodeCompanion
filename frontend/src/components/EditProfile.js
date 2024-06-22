import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfilePage = () => {
  const [formValues, setFormValues] = useState({
    leetCode: '',
    codeforces: '',
    codechef: '',
    geeksForGeeks: '',
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/data/profile')
     .then(response => {
        setFormValues({
          leetCode: response.data.leetCode,
          codeforces: response.data.codeforces,
          codechef: response.data.codechef,
          geeksForGeeks: response.data.geeksForGeeks,
        });
      })
     .catch(error => {
        console.error(error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/data/usernames', {
        codeforces: formValues.codeforces,
        codechef: formValues.codechef,
        leetcode: formValues.leetCode,
        gfg: formValues.geeksForGeeks,
      });
      console.log('Usernames updated:', response.data);
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error updating usernames:', error);
      // Handle error state or display error message to user
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-md shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* LeetCode Username */}
          <div className="mb-4">
            <label htmlFor="leetCode" className="block text-sm font-medium text-gray-700">
              LeetCode Username
            </label>
            <input
              type="text"
              id="leetCode"
              name="leetCode"
              value={formValues.leetCode}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter LeetCode Username"
            />
          </div>

          {/* Codeforces Username */}
          <div className="mb-4">
            <label htmlFor="codeforces" className="block text-sm font-medium text-gray-700">
              Codeforces Username
            </label>
            <input
              type="text"
              id="codeforces"
              name="codeforces"
              value={formValues.codeforces}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter Codeforces Username"
            />
          </div>

          {/* CodeChef Username */}
          <div className="mb-4">
            <label htmlFor="codechef" className="block text-sm font-medium text-gray-700">
              CodeChef Username
            </label>
            <input
              type="text"
              id="codechef"
              name="codechef"
              value={formValues.codechef}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter CodeChef Username"
            />
          </div>

          {/* GeeksforGeeks Username */}
          <div className="mb-6">
            <label htmlFor="geeksForGeeks" className="block text-sm font-medium text-gray-700">
              GeeksforGeeks Username
            </label>
            <input
              type="text"
              id="geeksForGeeks"
              name="geeksForGeeks"
              value={formValues.geeksForGeeks}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter GeeksforGeeks Username"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-smtext-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ml-4"
              onClick={() => window.location.href = '/dashboard'}
            >
              Go Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;