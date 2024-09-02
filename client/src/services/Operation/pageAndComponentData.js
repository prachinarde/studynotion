import React from 'react'
import {toast} from "react-hot-toast";
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';
import { categories } from '../apis';

const getCatalogPageData = async(categoryId) => {
    const toastId = toast.loading("Loading...")
    let result  = [];
    try{

        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, {categoryId: categoryId});

        if(!response?.data?.success)
            throw new Error("Could not fetch Category Page Data")
        result = response?.data;
    }catch(error){
        console.log("Catalog Page Data APi Error...", error);
        toast.error(error.message);
        result = error.response?.data;


    }
    toast.dismiss(toastId);
    return result;
}
export const createCategory = async(data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
        const response = await apiConnector("POST", catalogData.CREATECATEGORY_API, data, {
          Authorization: `Bearer ${token}`,
        })
        console.log("CREATE Category API RESPONSE............", response)
        if (!response?.data?.success) {
          throw new Error("Could Not Add Category")
        }
        toast.success("Category Added")
        result = response?.data?.data
      } catch (error) {
        console.log("CREATE Category API ERROR............", error)
        toast.error(error.message)
      }
      toast.dismiss(toastId)
     
      return result
}
export const getALlCategory = async() =>{
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", categories.CATEGORIES_API)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Categories")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("GET_ALL_Categories_API API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}



export default getCatalogPageData;
