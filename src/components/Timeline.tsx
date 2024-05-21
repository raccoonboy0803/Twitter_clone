import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  collection,
  orderBy,
  query,
  onSnapshot,
  Unsubscribe,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import Tweet from './Tweet';

export interface TweetProps {
  id: string;
  createdAt: number;
  photo?: string;
  tweet: string;
  userId: string;
  username: string;
}

function Timeline() {
  const [tweet, setTweet] = useState<TweetProps[]>([]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;

    const fetchTweets = async () => {
      const tweetsQuery = query(
        collection(db, 'tweets'),
        orderBy('createdAt', 'desc'),
        limit(25)
      );
      unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
        const tweets = snapshot.docs.map((doc) => {
          const { createdAt, photo, tweet, userId, username } = doc.data();
          return {
            createdAt,
            photo,
            tweet,
            userId,
            username,
            id: doc.id,
          };
        });
        setTweet(tweets);
      });
    };
    fetchTweets();

    return () => {
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {tweet.map((item) => (
        <Tweet key={item.id} {...item} />
      ))}
    </Wrapper>
  );
}

export default Timeline;

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;
