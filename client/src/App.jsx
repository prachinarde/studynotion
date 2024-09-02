import './App.css';
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import Login from "./pages/LoginPage";
import Signup from './pages/Signup';
import OpenRoute from "./components/core/Auth/OpenRoute";
import ForgotPassword from './pages/ForgotPassword';
import UpdatePassword from './pages/UpdatePassword';
import VerifyEmail from './pages/VerifyEmail';
import { ACCOUNT_TYPE } from "./Util/constants"
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './components/core/Dashboard/MyProfile';
import Dashboard from "./pages/Dashboard";
import PrivateRoute from './components/core/Auth/PrivateRoute';
import Error from "./pages/Error";
import Settings from './components/core/Dashboard/Settings';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import EnrolledCourses from './components/core/Dashboard/EnrolledCourses';
import Cart from './components/core/Dashboard/Cart';
import MyCourses from './components/core/Dashboard/MyCourses';
import AddCourse from './components/core/Dashboard/AddCourses';
import EditCourse from './components/core/Dashboard/EditCourse';
import Catalog from './pages/Catalog';
import ViewCourse from './pages/ViewCourse';
import VideoDetails from './components/core/ViewCourse/VideoDetails';
import CourseDetails from './pages/CourseDetails';
import Instructor from './components/core/Dashboard/InstructorDashboard/Instructor';
import CreateCategory from './components/core/Dashboard/Admin';
import ShowCategory from './components/core/Dashboard/Admin/showCategory';

function App() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.profile)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = JSON.parse(localStorage.getItem("token"))
      //dispatch(getUserDetails(token, navigate))
    }

  }, [])
  
  return (
   <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inte'>
    <Navbar/>
    <Routes>
      <Route path = "/" element={<Home/>}/>
      <Route path = "catalog/:catalogName" element={<Catalog/>}/>
      <Route path="courses/:courseId" element={<CourseDetails />} />
      <Route
          path="about"
          element={
           
                <About/>
      
          }
        />
                <Route  path="contact" element={<Contact/>} />
      
      <Route
          path="login"
          element={
            <OpenRoute>
              <Login />
            </OpenRoute>
          }
        />
         <Route
          path="signup"
          element={
            <OpenRoute>
              <Signup />
            </OpenRoute>
          }
        />
        <Route
          path="forgot-password"
          element={
            <OpenRoute>
              <ForgotPassword />
            </OpenRoute>
          }
        />
         <Route
          path="update-password/:id"
          element={
            <OpenRoute>
                <UpdatePassword/>
            </OpenRoute>
          }
        />
         <Route
          path="verify-email"
          element={
            <OpenRoute>
                <VerifyEmail/>
            </OpenRoute>
          }
        />
        

        
         <Route  
         element ={
          <PrivateRoute>
              <Dashboard/>

          </PrivateRoute>
        
         }

         
         >
           <Route
          path="dashboard/my-profile" element={<MyProfile/>}
        
        />
           <Route
          path="dashboard/settings" element={<Settings/>} />
          {
            user?.accountType === ACCOUNT_TYPE.INSTRUCTOR && (
              <>
              <Route path = "dashboard/my-courses" element = {<MyCourses/>} />
              <Route path = "dashboard/add-course" element = {<AddCourse/>} />
              <Route path = "dashboard/instructor" element = {<Instructor/>} />
              <Route
                path="dashboard/edit-course/:courseId"
                element={<EditCourse />}
              />
              </>
            )
          }

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
               <Route  path='dashboard/enrolled-courses' element = {<EnrolledCourses/> } />
               <Route  path='dashboard/cart' element = {<Cart/> } />
              </>
            )
          }
          {
            user?.accountType === ACCOUNT_TYPE.ADMIN && (
              <>
              <Route  path='dashboard/add-category' element = {<CreateCategory/>} />
              <Route  path='dashboard/show-category' element = {<ShowCategory/>}/>
              </>
            )
          }

         </Route>
         
        <Route path="*" element = {
          <Error/>
        }/>
        <Route
        element = {
          <PrivateRoute>
            <ViewCourse/>
          </PrivateRoute>
        }
        
        >

          {
            user?.accountType === ACCOUNT_TYPE.STUDENT && (
              <>
              <Route
                path="view-course/:courseId/section/:sectionId/sub-section/:subSectionId"
                element={<VideoDetails />}
              />
            </>
            )
          }
        </Route>


    </Routes>
    

   </div>
  );
}

export default App;
