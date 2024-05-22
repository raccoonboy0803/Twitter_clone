import styled, { css } from 'styled-components';
import { auth, db, storage } from '../firebase';
import { useEffect, useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  Unsubscribe,
  limit,
  orderBy,
  query,
  where,
  onSnapshot,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { TweetProps } from '../components/Timeline';
import Tweet from '../components/Tweet';

function Profile() {
  const user = auth.currentUser;
  console.log('user::', auth);

  const [avatar, setAvatar] = useState(user?.photoURL);
  const [tweets, setTweets] = useState<TweetProps[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState(user?.displayName);

  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);
      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };

  const onEdit = () => {
    setIsEditing(true);
  };

  const onCancel = () => {
    setIsEditing(false);
    setNewNickname(user?.displayName);
  };

  const onSave = async () => {
    if (!user) return;

    try {
      const userTweetsQuery = query(
        collection(db, 'tweets'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(userTweetsQuery);
      const batch = writeBatch(db);

      querySnapshot.forEach((document) => {
        const docRef = doc(db, 'tweets', document.id);
        batch.update(docRef, { username: newNickname });
      });

      await batch.commit();

      await updateProfile(user, {
        displayName: newNickname,
      });

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = async () => {
      const tweetQuery = query(
        collection(db, 'tweets'),
        where('userId', '==', user?.uid),
        orderBy('createdAt', 'desc'),
        limit(25)
      );

      unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { tweet, createdAt, userId, username, photo } = doc.data();
          return {
            createdAt,
            photo,
            tweet,
            userId,
            username,
            id: doc.id,
          };
        });
        setTweets(tweets);
      });
    };
    fetchTweets();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        id="avatar"
        type="file"
        accept="image/*"
        onChange={onAvatarChange}
      />
      {isEditing ? (
        <>
          <EditInput
            value={newNickname}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewNickname(e.target.value)
            }
            maxLength={180}
          />
          <div>
            <SaveButton onClick={onSave}>Save</SaveButton>
            <CancelButton onClick={onCancel}>Cancel</CancelButton>
          </div>
        </>
      ) : (
        <>
          <Name>{user?.displayName ?? 'Anonymous'}</Name>
          <EditButton onClick={onEdit}>Edit</EditButton>
        </>
      )}

      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Tweets>
    </Wrapper>
  );
}

export default Profile;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50px;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;

const AvatarInput = styled.input`
  display: none;
`;

const Name = styled.span`
  font-size: 22px;
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const EditInput = styled.textarea`
  text-align: center;
  width: 200px;
  height: 25px;
  margin: 10px 0px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  resize: none;
`;

const buttonStyle = css`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: none;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  ${buttonStyle}
`;
const SaveButton = styled.button`
  ${buttonStyle}
  margin-right: 10px;
`;
const CancelButton = styled.button`
  ${buttonStyle}
`;
