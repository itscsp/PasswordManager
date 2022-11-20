import "./App.css";
import { useState, useEffect } from "react";
import Axios from 'axios'

function App() {

  const [url, setUrl] = useState("");
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordList, setPasswordList] = useState([])
  const [showme, setShowme] = useState(false);

  useEffect(() => {
    Axios.get('http://localhost:3001/showpassword').then((response) => {
      setPasswordList(response.data);
    })
  }, [])

  const addPassword = () => {
    Axios.post('http://localhost:3001/addpassword', {
      password: password,
      url: url,
      username: username
    });

    setUsername('');
    setUrl('');
    setPassword('');

  }

  const decryptedPassword = (encryption) => {
    Axios.post("http://localhost:3001/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {

      setShowme(true);
      console.log(response.data)
      setPasswordList(passwordList.map((val) => {
        return val.id === encryption.id ?
          {
            id: val.id,
            url: val.url,
            username: val.username,
            password: response.data,
            iv: val.iv
          }
          :
          val;
      }))
    });
  }


  return (
    <div className="App">
      <div className="container">
        <input
          type="text"
          value={url}
          placeholder="Ex. https://chethanspoojary.com"
          onChange={(event) => {
            setUrl(event.target.value);

          }}
        />

        <input
          type="text"
          value={username}
          placeholder="Ex. hello@chethanspoojary.com"

          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />

        <input
          type="text"
          value={password}
          placeholder="Ex. ************"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />

        <button onClick={addPassword}>Add Password</button>

      </div>

      {passwordList.length ?
        <div className="ResultContainer" >
          {passwordList.map((val, key) => {
            return <div className="resultValue" key={key}>
              <div>
                <p>Site: {val.url}</p>
                
                <button className={!showme ? '' : 'd-none' } onClick={() => {
                  decryptedPassword({
                    password: val.password,
                    iv: val.iv,
                    id: val.id
                  })
                }}>Show Credentials</button>
              </div>
              <div  className={showme ? '' : 'd-none' }>
              <p>username: {val.username}</p>
              <p>Password: {val.password}</p>
              </div>
    
            </div>
          })}
        </div>
        : <div></div>
      }

    </div>
  );
}

export default App;
