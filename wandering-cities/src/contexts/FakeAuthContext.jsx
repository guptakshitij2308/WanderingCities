import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { ...state, isAuthenticated: true, user: action.payload };
    case "logout":
      return { ...state, isAuthenticated: false, user: null };
    default:
      throw new Error("Action type is not supported");
  }
}

const FAKE_USER = {
  name: "Kshitij",
  email: "kshitij@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }) {
  function login(email, password) {
    if (FAKE_USER.email === email && FAKE_USER.password === password)
      dispatch({ type: "login", payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, isAuthenticated } = state;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthenticate() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext used outside AuthProvider");
  return context;
}

export { AuthProvider, useAuthenticate };
