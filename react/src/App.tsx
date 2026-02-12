import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Recharge from "./pages/Recharge";
import GenerateVideo from "./pages/GenerateVideo";
import Share from "./pages/Share";
import Memories from "./pages/Memories";
import Settings from "./pages/Settings";
import PersonManager from "./pages/PersonManager";

const queryClient = new QueryClient();

const App = () => {
  console.log('忆光年 app initialized - Memory video generation app with API integration');
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="mobile-container bg-background min-h-screen">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/configure" element={<ProductDetail />} />
            <Route path="/recharge" element={<Recharge />} />
            <Route path="/generate" element={<GenerateVideo />} />
            <Route path="/share" element={<Share />} />
            <Route path="/memories" element={<Memories />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/person-manager" element={<PersonManager />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
