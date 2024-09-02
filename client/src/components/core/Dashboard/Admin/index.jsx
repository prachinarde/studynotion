import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createCategory } from '../../../../services/Operation/pageAndComponentData';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
  const { token } = useSelector(state => state.auth);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name,
      description,
    };

    const result = await createCategory(data, token);
    navigate('/dashboard/show-category');

    if (result) {
      setName('');
      setDescription('');
     
    }
  };

  return (
    <div className="flex w-full items-start gap-x-6 p-6">
      <div className="flex flex-1 flex-col">
        <h1 className="mb-14 text-3xl font-semibold text-richblack-5 uppercase tracking-wider lg:text-left text-center">
          Create New Category
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-lg font-medium text-richblack-5">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="block w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              placeholder="Enter category name"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-lg font-medium text-richblack-5">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="block w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              placeholder="Enter category description"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-transform transform hover:scale-105"
          >
            Create Category
          </button>
        </form>
      </div>
      {/* Sidebar with tips */}
      <div className="sticky top-10 max-w-[400px] flex-1 rounded-lg border-[1px] border-richblack-700 bg-richblack-800 p-6 hidden lg:block">
        <p className="mb-6 text-xl font-semibold text-richblack-5">⚡ Category Creation Tips</p>
        <ul className="ml-5 list-item list-disc space-y-4 text-sm text-richblack-5 tracking-wide">
          <li>Ensure the category name is unique and descriptive.</li>
          <li>Use a clear and concise description to provide details about the category.</li>
          <li>Categories help in organizing your content effectively.</li>
          <li>Consider using categories for better navigation and user experience.</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateCategory;
