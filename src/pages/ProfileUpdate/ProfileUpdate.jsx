// import React, { useContext, useEffect, useState } from 'react';
// import './ProfileUpdate.css';
// import assets from '../../assets/assets';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth, db } from '../../config/firebase';
// import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import upload from '../../lib/upload';
// import { AppContext } from '../../context/AppContext';

// const ProfileUpdate = () => {
//   const navigate = useNavigate();
//   const [image, setImage] = useState(false);
//   const [name, setName] = useState('');
//   const [bio, setBio] = useState('');
//   const [uid, setUid] = useState('');
//   const [prevImage, setPrevImage] = useState('');
//   const { setUserData } = useContext(AppContext);

//   const profileUpdate = async (event) => {
//     event.preventDefault();
//     try {
//       if (!prevImage && !image) {
//         toast.error("Upload profile image");
//         return;
//       }
//       const docRef = doc(db, 'users', uid);

//       let imageUrl = prevImage;
//       if (image) {
//         imageUrl = await upload(image);
//         setPrevImage(imageUrl);
//       }

//       await updateDoc(docRef, {
//         avatar: imageUrl,
//         bio: bio.trim(),
//         name: name.trim(),
//       });

//       const snap = await getDoc(docRef);
//       setUserData(snap.data());
//       toast.success("Profile updated successfully!");
//       navigate('/chat');
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error(error.message);
//     }
//   };

//   useEffect(() => {
//     onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           setUid(user.uid);
//           const docRef = doc(db, 'users', user.uid);
//           const docSnap = await getDoc(docRef);
//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setName(data.name || '');
//             setBio(data.bio || '');
//             setPrevImage(data.avatar || '');
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//           toast.error("Failed to fetch user data.");
//         }
//       } else {
//         navigate('/');
//       }
//     });
//   }, [navigate]);

//   return (
//     <div className="profile">
//       <div className="profile-container">
//         <form onSubmit={profileUpdate}>
//           <h3>Profile Details</h3>
//           <label htmlFor="avatar">
//             <input
//               onChange={(e) => setImage(e.target.files[0])}
//               type="file"
//               id="avatar"
//               accept=".png, .jpg, .jpeg"
//               hidden
//             />
//             <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} alt="" />
//             Upload profile image
//           </label>
//           <input
//             onChange={(e) => setName(e.target.value)}
//             value={name}
//             type="text"
//             placeholder="Your name"
//             required
//           />
//           <textarea
//             onChange={(e) => setBio(e.target.value)}
//             value={bio}
//             placeholder="Write profile bio"
//             required
//           />
//           <button type="submit">Save</button>
//         </form>
//         <img
//           src={image ? URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon}
//           alt=""
//           className="profile-pic"
//         />
//       </div>
//     </div>
//   );
// };

// export default ProfileUpdate;














import React, { useContext, useEffect, useState } from 'react'; // Importing React hooks for state management, effects, and context
import './ProfileUpdate.css'; // Importing CSS file for styling
import assets from '../../assets/assets'; // Importing asset files like images/icons
import { onAuthStateChanged } from 'firebase/auth'; // Firebase function to monitor authentication state
import { auth, db } from '../../config/firebase'; // Firebase auth and Firestore database instances
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore functions to fetch and update data
import { useNavigate } from 'react-router-dom'; // Navigation hook for routing
import { toast } from 'react-toastify'; // Importing toast for showing notifications
import { AppContext } from '../../context/AppContext'; // Importing custom context to manage global state

const ProfileUpdate = () => {
  const navigate = useNavigate(); // Hook for navigating between pages
  const [name, setName] = useState(''); // State to store and update user's name
  const [bio, setBio] = useState(''); // State to store and update user's bio
  const [uid, setUid] = useState(''); // State to store user's unique ID from Firebase
  const [prevImage, setPrevImage] = useState(''); // State to store existing profile image
  const { setUserData } = useContext(AppContext); // Extracting setUserData function from AppContext to update global user data

  // Function to handle profile update when the form is submitted
  const profileUpdate = async (event) => {
    event.preventDefault(); // Prevents default form submission behavior (page refresh)

    try {
      const docRef = doc(db, 'users', uid); // Creating a reference to the user's document in Firestore

      // Updating the user's document with the new name and bio
      await updateDoc(docRef, {
        bio: bio.trim(), // Trim whitespace from bio
        name: name.trim(), // Trim whitespace from name
      });

      const snap = await getDoc(docRef); // Fetching the updated document
      setUserData(snap.data()); // Updating the global user data in AppContext
      toast.success("Profile updated successfully!"); // Showing success notification
      navigate('/chat'); // Redirecting user to the chat page
    } catch (error) {
      console.error("Error updating profile:", error); // Logging error
      toast.error(error.message); // Showing error notification
    }
  };

  // useEffect hook to handle authentication state and fetch user data
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => { // Listening for authentication state changes
      if (user) { // If user is authenticated
        try {
          setUid(user.uid); // Setting the user's UID
          const docRef = doc(db, 'users', user.uid); // Reference to Firestore document
          const docSnap = await getDoc(docRef); // Fetching user data from Firestore

          if (docSnap.exists()) { // Checking if document exists
            const data = docSnap.data(); // Extracting data
            setName(data.name || ''); // Setting name from database
            setBio(data.bio || ''); // Setting bio from database
            setPrevImage(data.avatar || ''); // Setting avatar image if available
          }
        } catch (error) {
          console.error("Error fetching user data:", error); // Logging error
          toast.error("Failed to fetch user data."); // Showing error notification
        }
      } else {
        navigate('/'); // Redirecting to home/login if user is not authenticated
      }
    });
  }, [navigate]); // Dependency array ensures effect runs when navigate changes

  return (
    <div className="profile"> {/* Main container for profile update section */}
      <div className="profile-container"> {/* Inner container for layout */}
        <form onSubmit={profileUpdate}> {/* Form submission triggers profileUpdate function */}
          <h3>Profile Details</h3> {/* Heading for the form */}

          <input
            onChange={(e) => setName(e.target.value)} // Updating name state on input change
            value={name} // Controlled input field bound to name state
            type="text"
            placeholder="Your name"
            required // Making the field mandatory
          />

          <textarea
            onChange={(e) => setBio(e.target.value)} // Updating bio state on input change
            value={bio} // Controlled textarea bound to bio state
            placeholder="Write profile bio"
            required // Making the field mandatory
          />

          <button type="submit">Save</button> {/* Submit button to save changes */}
        </form>

        <img
          src={prevImage || assets.logo_icon} // Displaying user's avatar or default logo
          alt="Profile"
          className="profile-pic" // CSS class for styling
        />
      </div>
    </div>
  );
};

export default ProfileUpdate; // Exporting the component for use in other parts of the app
