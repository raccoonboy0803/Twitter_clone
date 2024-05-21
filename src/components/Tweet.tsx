import styled, { css } from 'styled-components';
import { TweetProps } from './Timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, updateDoc, doc } from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { useState } from 'react';

function Tweet({ username, photo, tweet, userId, id }: TweetProps) {
  const user = auth.currentUser;
  const [isEditing, setIsEditing] = useState(false);
  const [editedTweet, setEditedTweet] = useState(tweet);
  const [newFile, setNewFile] = useState<File | null>(null);
  // const [newPhotoUrl, setNewPhotoUrl] = useState<string | null>(null);

  const onDelete = async () => {
    const ok = confirm('Are you sure you want to delete this tweet?');

    if (!ok || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, 'tweets', id));
      if (photo) {
        const PhotoRef = ref(storage, `tweets/${user?.uid}/${id}`);
        await deleteObject(PhotoRef);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = () => {
    setIsEditing(true);
  };

  const onSave = async () => {
    if (!user || editedTweet === '' || editedTweet.length > 180) return;

    try {
      let newPhotoUrl = photo;

      if (newFile) {
        if (photo) {
          const oldPhotoRef = ref(storage, `tweets/${user.uid}/${id}`);
          await deleteObject(oldPhotoRef);
        }

        const locationRef = ref(storage, `tweets/${user.uid}/${id}`);
        const fileUploadResult = await uploadBytes(locationRef, newFile);
        newPhotoUrl = await getDownloadURL(fileUploadResult.ref);
      }

      await updateDoc(doc(db, 'tweets', id), {
        tweet: editedTweet,
        photo: newPhotoUrl,
      });

      setIsEditing(false);
      setNewFile(null);
      // setNewPhotoUrl(newPhotoUrl!);
    } catch (error) {
      console.log(error);
    }
  };

  const onCancel = () => {
    setIsEditing(false);
    setEditedTweet(tweet);
    setNewFile(null);
    // setNewPhotoUrl(null);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1) {
      if (files[0].size >= 1048576) {
        alert('The image size must be 1 MB or less.');
      } else {
        setNewFile(files[0]);
        // setNewPhotoUrl(URL.createObjectURL(files[0]));
      }
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <>
            <EditInput
              value={editedTweet}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEditedTweet(e.target.value)
              }
              maxLength={180}
            />
            <FileInput type="file" accept="image/*" onChange={onFileChange} />
            <SaveButton onClick={onSave}>Save</SaveButton>
            <CancelButton onClick={onCancel}>Cancel</CancelButton>
          </>
        ) : (
          <Payload>{tweet}</Payload>
        )}
        {user?.uid === userId && !isEditing ? (
          <>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            <EditButton onClick={onEdit}>Edit</EditButton>
          </>
        ) : null}
      </Column>
      {photo && !newFile && (
        <Column>
          <Photo src={photo} />
        </Column>
      )}
      {newFile && (
        <Column>
          <PhotoPreview src={URL.createObjectURL(newFile)} />
        </Column>
      )}
    </Wrapper>
  );
}

export default Tweet;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
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

const DeleteButton = styled.button`
  ${buttonStyle}
  margin-right: 10px;
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

const EditInput = styled.textarea`
  width: 100%;
  padding: 10px;
  margin: 10px 0px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 14px;
  resize: none;
`;

const FileInput = styled.input`
  margin-bottom: 10px;
`;

const PhotoPreview = styled.img`
  width: 100px;
  height: 100px;
`;
