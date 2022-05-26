import React, { ChangeEvent, useState } from "react";

function Signup() {
  const [name, setName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.name === "name") {
      setName(event.target.value);
    } else if (event.target.name === "username") {
      setUserName(event.target.value);
    } else {
      setPassword(event.target.value);
    }
  };

  return (
    <div>
      sign up
      <input
        placeholder="name"
        name="name"
        value={name}
        onChange={handleChange}
      ></input>
      <input
        placeholder="username"
        name="username"
        value={userName}
        onChange={handleChange}
      ></input>
      <input
        placeholder="password"
        name="password"
        value={password}
        onChange={handleChange}
      ></input>
      <button>submit</button>
    </div>
  );
}

export default Signup;
