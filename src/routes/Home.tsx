import styled from 'styled-components';
import PostTweetForm from '../components/PostTweetForm';
import Timeline from '../components/Timeline';

function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}

export default Home;

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 5fr;
  gap: 50px;
  overflow-y: scroll;
`;
