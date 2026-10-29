import React, { Suspense } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import CustomPopup from "./components/CustomPopup/CustomPopup";
import { withTableIdCheck } from "./hooks/withTableIdCheck ";
import CaptureIdAndRedirect from "./pages/CaptureIdAndRedirect";
import ProtectedRoute from "./ProtectedRoute";
import CustomLoader from "./components/CustomLoader";
import "./styles/CustomPopup.css"

const HomePage = React.lazy(() => import("./pages/HomePage"));
const LoginPage = withTableIdCheck(React.lazy(() => import("./auth/LoginPage")));
const SignUpPage = withTableIdCheck(React.lazy(() => import("./auth/SignUpPage")));
const ResetPassword = withTableIdCheck(React.lazy(() => import("./pages/ResetPassword")));
const RecoverEmail = withTableIdCheck(React.lazy(() => import("./pages/RecoverEmail")));
const MainPage = withTableIdCheck(React.lazy(() => import("./pages/MainPage")));

function App() {
  return (

    <Router>
      <Suspense fallback={<div className="popup-overlay open">
      <div style={{ minHeight: '100dvh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src="/images/loader.svg" alt="Loading..." style={{ width: '50px', height: '50px' }} />
      </div>
    </div>}>
        <CustomPopup />
        <CustomLoader/>
        <Routes>
          <Route path="/table" element={<CaptureIdAndRedirect />} />
          <Route path="/signup/:mode" element={<SignUpPage />} />
          <Route path="/login/:mode" element={<LoginPage />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/recover" element={<RecoverEmail />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/" element={<ProtectedRoute />} >
            <Route path="/*" element={
              <MainPage />
            } />
          </Route>
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
