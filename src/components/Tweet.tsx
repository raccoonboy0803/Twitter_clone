import styled from 'styled-components';
import { TweetProps } from './Timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

function Tweet({ username, photo, tweet, userId, id }: TweetProps) {
  const user = auth.currentUser;

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
    } finally {
      //
    }
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>Delete</DeleteButton>
        ) : null}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
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

const DeleteButton = styled.button`
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
