import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app';
import { Link, useNavigate } from 'react-router-dom';
import {
  Error,
  Input,
  Switcher,
  Title,
  Wrapper,
  Form,
} from '../components/AuthComponents';
import GithubBtn from '../components/GithubBtn';

//Nico
//nico@nomadcoders.co
//123456789!
function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmil] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === 'name') {
      setName(value);
    } else if (name === 'email') {
      setEmil(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (isLoading || name === '' || email === '' || password == '') return;

    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(credentials.user, {
        displayName: name,
      });

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
      <Title>Join into X</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          type="text"
        />
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
        <Input
          type="submit"
          value={isLoading ? 'Loading...' : 'Create Account'}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account? <Link to={'/login'}>Log In &rarr;</Link>
      </Switcher>
      <GithubBtn />
    </Wrapper>
  );
}

export default CreateAccount;
