import styled from 'styled-components';
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function GithubBtn() {
  const navigate = useNavigate();
  const onClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Button onClick={onClick}>
      <Logo src="/github-logo.svg" />
      Continue with Github
    </Button>
  );
}

export default GithubBtn;

const Button = styled.span`
  cursor: pointer;
  margin-top: 50px;
  width: 100%;
  color: black;
  background-color: white;
  font-weight: 500;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const Logo = styled.img`
  height: 25px;
`;
