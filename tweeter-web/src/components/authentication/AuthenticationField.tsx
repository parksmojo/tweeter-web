import { useState } from "react";

interface Props {
  onKeyFunc: () => Promise<void>;
  checkSubmitButtonStatus: () => boolean;
  setAlias: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const AuthenticationField = (props: Props) => {
  const onEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !props.checkSubmitButtonStatus()) {
      props.onKeyFunc();
    }
  };

  return (
    <>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          size={50}
          id="aliasInput"
          placeholder="name@example.com"
          onKeyDown={onEnter}
          onChange={(event) => props.setAlias(event.target.value)}
        />
        <label htmlFor="aliasInput">Alias</label>
      </div>
      <div className="form-floating mb-3">
        <input
          type="password"
          className="form-control bottom"
          id="passwordInput"
          placeholder="Password"
          onKeyDown={onEnter}
          onChange={(event) => props.setPassword(event.target.value)}
        />
        <label htmlFor="passwordInput">Password</label>
      </div>
    </>
  );
};

export default AuthenticationField;
