import { useState } from 'react';
import styled from 'styled-components';

function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmil] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

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

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // create an accont
      // set the name of the user
      // redirect to the homepage
    } catch (error) {
      // setError
    } finally {
      setIsLoading(false);
    }

    console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>Log into X</Title>
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
    </Wrapper>
  );
}

export default CreateAccount;

const Wrapper = styled.div`
  height: 100%;
  width: 420px;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 42px;
`;

const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  width: 100%;
  font-size: 16px;
`;
