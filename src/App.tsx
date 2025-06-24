// src/App.tsx
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'; 
import { initializeAuth } from '@/store/authStore'; 
import AuthModals from '@/components/modals/AuthModals'; 
import ArticleModals from '@/components/modals/ArticleModals'; 
import CategoryModals from '@/components/modals/CategoryModals'; 
import { Toaster } from "@/components/ui/toaster"; 

function App() {
  useEffect(() => {
    initializeAuth().then(() => {
      console.log("Auth initialization complete.");
    });
  }, []);

  return (
    <>
      <Outlet /> 
      
      {/* Modal Global */}
      <AuthModals />
      <ArticleModals />
      <CategoryModals /> 
      
      <Toaster />
    </>
  );
}

export default App;
