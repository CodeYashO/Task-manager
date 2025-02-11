import {Routes , Route} from "react-router-dom";
import SignUp from "./Components/SignUp"
import Home from "./Components/Home"
import EmailVerification from "./Components/EmailVerification";
import Login from "./Components/Login"
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUp/>}/>
      <Route path="/email-verification" element={<EmailVerification/>}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password/:token" element={<ResetPassword/>}/>
    </Routes>
  );
}

export default App;
