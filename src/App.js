import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Login from "./scenes/login";
import Signup from "./scenes/singup";
import ForgotPassword from "./scenes/forget_password";
import ConfirmOTPforgetPassword from "./scenes/confirme_opt_FP";
import Plateau from "./scenes/plateaux";
import Equipe from "./scenes/add_equipe";
import AddPlateau from "./scenes/add_plateau";


import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebarLogin, setIsSidebarLogin] = useState(true);
  const [isTopbarLogin, setIsTopbarLogin] = useState(true);
  
  const location = useLocation();
  

  // Set isSidebar to false if the current path is '/login', otherwise set it to true
  useState(() => {
    setIsSidebarLogin(location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/forgetPassword'&& location.pathname !== '/ConfirmOTPforgetPassword');
    setIsTopbarLogin(location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/forgetPassword'&& location.pathname !== '/ConfirmOTPforgetPassword');
    

   
  
  }, [location.pathname]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isSidebarLogin && <Sidebar />}
       
          <main className="content">
            {isTopbarLogin && <Topbar setIsSidebarLogin={setIsSidebarLogin} />}
          

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgetPassword" element={<ForgotPassword />} />
              <Route path="/ConfirmOTPforgetPassword" element={<ConfirmOTPforgetPassword />} />
              <Route path="/plateau" element={<Plateau />} />
              <Route path="/equipe" element={<Equipe />} />
              <Route path="/AddPlateau" element={<AddPlateau />} />

              

              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
