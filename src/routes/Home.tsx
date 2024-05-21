import styled from 'styled-components';
import PostTweetForm from '../components/PostTweetForm';

function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
    </Wrapper>
  );
}

export default Home;

const Wrapper = styled.div``;
