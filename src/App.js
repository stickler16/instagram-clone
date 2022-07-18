import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import Post from './Post';
import { auth, db } from './firebase';
import { Button, makeStyles, Modal, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
// import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    borderRadius: '10px',
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),

  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [opensignIn, setOpensignIn] = useState('')
  const [posts, setposts] = useState([]);
  const [open, setopen] = useState(false);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState(null)


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);



      }
      else {
        setUser(null);
      }
    })

    return () => {
      unsubscribe();
    }


  }, [user, username]);


  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot()

    db.collection('posts').onSnapshot(snapshot => {
      setposts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    });

  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        })
      })
      .catch((error) => alert(error.message))

    setopen(false);
  }

  const signIn = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpensignIn(false);

  }

  return (
    <div className="App">


      {/* imageupload */}


      <Modal
        open={open}
        onclose={() => setopen(false)}

      >

        <div style={modalStyle} className={classes.paper}  >
          <form className="app__signup" >
            <center>
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/200px-Instagram_logo.svg.png"
                alt=""

              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={signUp} type="submit">Sign Up</Button>



          </form>
        </div>

      </Modal>

      <Modal
        open={opensignIn}
        onclose={() => setOpensignIn(false)}

      >

        <div style={modalStyle} className={classes.paper}  >
          <form className="app__signIn" >
            <center>
              <img
                className="app__headerImage"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/200px-Instagram_logo.svg.png"
                alt=""

              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button onClick={signIn} type="submit">Sign In</Button>



          </form>
        </div>

      </Modal>



      {/* Header */}
      <div className="app__header">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/200px-Instagram_logo.svg.png" alt="" className="app_headerImage"
        />
        {user ? (
          <Button onClick={() => auth.signOut()} >Logout</Button>

        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpensignIn(true)} >Sign In</Button>
            <Button onClick={() => setopen(true)} >Sign Up</Button>

          </div>
        )}
      </div>

      <div className="app__post">
        <div className="app__posts">
          {
            posts.map(({ id, post }) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        {/* <div className="app__postsRight">
          <InstagramEmbed
            url='https://instagr.am/p/Zw9o4/'
            clientAccessToken='{123}|{456}'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          /> 
        </div> */}
      </div>




      {user?.displayName ? (
        <ImageUpload username={user.displayName} />

      ) : (
        <h3>You need to be logged in</h3>
      )}



      {/* post */}
      {/* post */}
      {/* post */}



    </div>
  );
}

export default App;
