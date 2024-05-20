import { auth } from '../firebase';

function Home() {
  const logOut = () => {
    auth.signOut();
  };
  return (
    <h1>
      <button onClick={logOut}>Log out</button>
    </h1>
  );
}

export default Home;
