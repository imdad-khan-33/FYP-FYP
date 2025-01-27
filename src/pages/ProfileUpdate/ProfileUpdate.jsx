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



import React, { useContext, useEffect, useState } from 'react'; 
import './ProfileUpdate.css'; 
import assets from '../../assets/assets'; 
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth, db } from '../../config/firebase'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; 
import { AppContext } from '../../context/AppContext';

// Component definition start
const ProfileUpdate = () => { 
  const navigate = useNavigate(); // Navigation ke liye use hota hai, e.g., kisi page par redirect karna.
  const [name, setName] = useState(''); // User ka name store karne ke liye state.
  const [bio, setBio] = useState(''); // User ki profile bio store karne ke liye state.
  const [uid, setUid] = useState(''); // User ka unique Firebase ID store karne ke liye state.
  const [prevImage, setPrevImage] = useState(''); // Profile picture ka URL store karta hai.
  const { setUserData } = useContext(AppContext); // Global context function, jo user ke data ko update karta hai.

  // Function to handle profile update
  const profileUpdate = async (event) => {
    event.preventDefault(); // Form ke default behavior ko prevent karta hai (e.g., page reload).
    try {
      const docRef = doc(db, 'users', uid); // Firestore se user document ka reference.

      await updateDoc(docRef, { 
        bio: bio.trim(), // Bio ko trim kar ke update karta hai (extra spaces hata kar).
        name: name.trim(), // Name ko trim kar ke update karta hai.
      });

      const snap = await getDoc(docRef); // Updated document ko fetch karta hai.
      setUserData(snap.data()); // Global context mein updated data save karta hai.
      toast.success("Profile updated successfully!"); // Success message show karta hai.
      navigate('/chat'); // User ko chat page par redirect karta hai.
    } catch (error) {
      console.error("Error updating profile:", error); // Error ko console mein log karta hai.
      toast.error(error.message); // Error message show karta hai.
    }
  };

  // Effect to fetch user data when component mounts
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => { 
      if (user) { // Agar user logged in hai.
        try {
          setUid(user.uid); // User ka unique ID set karta hai.
          const docRef = doc(db, 'users', user.uid); // Firestore document ka reference.
          const docSnap = await getDoc(docRef); // Firestore se user ka data fetch karta hai.
          if (docSnap.exists()) { // Agar data mil jata hai.
            const data = docSnap.data();
            setName(data.name || ''); // Name ko state mein set karta hai.
            setBio(data.bio || ''); // Bio ko state mein set karta hai.
            setPrevImage(data.avatar || ''); // Avatar (profile image) ko state mein set karta hai.
          }
        } catch (error) {
          console.error("Error fetching user data:", error); // Error ko console mein log karta hai.
          toast.error("Failed to fetch user data."); // Error message show karta hai.
        }
      } else {
        navigate('/'); // Agar user logged in nahi hai, toh home page par redirect karta hai.
      }
    });
  }, [navigate]); // Dependency array mein navigate hai, taaki URL changes ka track rakha ja sake.

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3> 
          {/* Name input field */}
          <input
            onChange={(e) => setName(e.target.value)} // Name state ko update karta hai.
            value={name} // Input field mein current name show karta hai.
            type="text"
            placeholder="Your name"
            required // Input field ko required banata hai.
          />
          {/* Bio input field */}
          <textarea
            onChange={(e) => setBio(e.target.value)} // Bio state ko update karta hai.
            value={bio} // Input field mein current bio show karta hai.
            placeholder="Write profile bio"
            required // Input field ko required banata hai.
          />
          <button type="submit">Save</button> {/* Save button */}
        </form>
        {/* Profile picture */}
        <img
          src={prevImage || assets.logo_icon} // Avatar ko display karta hai, fallback ke liye logo.
          alt="Profile"
          className="profile-pic"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate; // Component export. 


