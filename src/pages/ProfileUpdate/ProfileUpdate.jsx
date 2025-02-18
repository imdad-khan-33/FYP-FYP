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

const ProfileUpdate = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [uid, setUid] = useState('');
  const [prevImage, setPrevImage] = useState('');
  const { setUserData } = useContext(AppContext);

  const profileUpdate = async (event) => {
    event.preventDefault();
    try {
      const docRef = doc(db, 'users', uid);

      await updateDoc(docRef, {
        bio: bio.trim(),
        name: name.trim(),
      });

      const snap = await getDoc(docRef);
      setUserData(snap.data());
      toast.success("Profile updated successfully!");
      navigate('/chat');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setUid(user.uid);
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setName(data.name || '');
            setBio(data.bio || '');
            setPrevImage(data.avatar || '');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to fetch user data.");
        }
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className="profile">
      <div className="profile-container">
        <form onSubmit={profileUpdate}>
          <h3>Profile Details</h3>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your name"
            required
          />
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
          />
          <button type="submit">Save</button>
        </form>
        <img
          src={prevImage || assets.logo_icon}
          alt="Profile"
          className="profile-pic"
        />
      </div>
    </div>
  );
};

export default ProfileUpdate;

