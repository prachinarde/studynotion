import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiConnector } from '../../../../services/apiconnector';
import { useSelector } from 'react-redux';
import IconBtn from "../../../common/IconBtn";
import Spinner from '../../../common/Spinner';
import { categories } from '../../../../services/apis';
import { toast } from 'react-hot-toast';
import { catalogData } from '../../../../services/apis';

const ShowCategory = () => {
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setCategoryList(res?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
      setLoading(false);
    };
    getCategories();
  }, []);

  const handleDelete = async (categoryId) => {
    const toastId = toast.loading("Deleting...");
    try {
      const response = await apiConnector("DELETE", catalogData.DELETE_CATEGORY_API, { categoryId }, {
        Authorization: `Bearer ${token}`,
      });
      if (response?.data?.success) {
        toast.success("Category deleted successfully");
        setCategoryList(prevCategories => prevCategories.filter(category => category._id !== categoryId));
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      console.error("Delete category error:", error);
      toast.error(error.message);
    }
    toast.dismiss(toastId);
  };

  if (loading) return (
    <div className='flex items-center justify-center h-screen'>
      <Spinner />
    </div>
  );

  return (
    <div className='p-4'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center mb-10'>
        <h1 className='text-3xl font-bold text-richblack-5 lg:text-left text-center uppercase tracking-wider'>
          Categories
        </h1>
        <div className='flex space-x-4'>
          <IconBtn
            type="btn"
            text="Add Category"
            customClasses="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClickHandler={() => navigate("/dashboard/add-category")}
          >
            {/* Add icon here if needed */}
          </IconBtn>
        </div>
      </div>

      <div>
        {categoryList.length === 0 ? (
          <div className='text-center'>
            <div className='h-[1px] mb-10 mx-auto bg-richblack-500'></div>
            <p className='text-2xl font-semibold text-richblack-100'>
              No Categories Available
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {categoryList.map((category) => (
              <div 
                key={category._id} 
                className="p-6 border border-gray-700 rounded-lg bg-richblack-800 shadow-lg transition-transform transform hover:scale-105"
              >
                <h2 className="text-2xl font-semibold text-richblack-5">{category.name}</h2>
                <p className="mt-2 text-sm text-richblack-300">{category.description}</p>
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={() => handleDelete(category._id)} 
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span className="font-semibold">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowCategory;
