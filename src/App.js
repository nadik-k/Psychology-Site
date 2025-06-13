import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import Footer from './Components/Footer/Footer';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import Settings from './Components/Settings/Settings';
import Chats from './Components/ChatBlock/ChatBlock';
import Services from './Components/Services/Services';
import Events from './Components/Events/Events';
import Blog from './Components/Blog/Blog';
import Contact from './Components/Contact/Contact';
import Test from './Components/Test/Test';
import TestResults from './Components/Test/TestResults';
import Diary from './Components/Diary/Diary';
import AnonymousHelp from './Components/AnonymousHelp/AnonymousHelp';
import AnonymousChat from './Components/AnonymousChat/AnonymousChat';
import AnonymousPage from './Components/AnonymousPage/AnonymousPage';
import ScrollToTop from './Components/ScrollToTop';
import MySessions from './Components/MySessions/MySessions';
import PsychologistSessions from './Components/PsychologistSessions/PsychologistSessions';
import LoginA from './Components/LoginAdmin/Login';
import AdminPanel from './Components/AdminPanel/AdminPanel';

function AppWrapper() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin-panel');
  return (
    <>
      {!isAdminPath && <Header />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/services" element={<Services />} />
        <Route path="/events" element={<Events />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contacts" element={<Contact />} />
        <Route path="/test" element={<Test />} />
        <Route path="/result" element={<TestResults />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/anonymous" element={<AnonymousHelp />} />
        <Route path="/anonymous-chat/:sessionId" element={<AnonymousChat />} />
        <Route path="/anon_req" element={<AnonymousPage />} />
        <Route path="/meetings" element={<MySessions />} />
        <Route path="/calendar" element={<PsychologistSessions />} />
        <Route path="/a-login" element={<LoginA />} />
        <Route path="/admin-panel/*" element={<AdminPanel />} />
      </Routes>
      {!isAdminPath && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
