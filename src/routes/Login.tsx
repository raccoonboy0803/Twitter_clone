import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { Link, useNavigate } from 'react-router-dom';
import {
  Form,
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
} from '../components/AuthComponents';
import GithubBtn from '../components/GithubBtn';
//Nico
//nico@nomadcoders.co
//123456789!
function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmil] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') {
      setEmil(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || email === '' || password == '') return;

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>Log into X</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Email"
          type="email"
        />
        <Input
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          type="password"
          required
        />
        <Input type="submit" value={isLoading ? 'Loading...' : 'Login'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?{' '}
        <Link to={'/create-account'}>Create one &rarr;</Link>
      </Switcher>
      <GithubBtn />
    </Wrapper>
  );
}

export default CreateAccount;
