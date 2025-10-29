import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LoginScreen } from './screens/auth/LoginScreen';
import { RegisterScreen } from './screens/auth/RegisterScreen';
import { EmailVerificationScreen } from './screens/auth/EmailVerificationScreen';
import { PasswordScreen } from './screens/auth/PasswordScreen';
import { NameScreen } from './screens/auth/NameScreen';
import { AboutScreen } from './screens/auth/AboutScreen';
import { AccountCreatedScreen } from './screens/auth/AccountCreatedScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CampaignDetailScreen } from './screens/CampaignDetailScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { EditProfileScreen } from './screens/EditProfileScreen';
import { SocialMediaScreen } from './screens/SocialMediaScreen';
import { MyCampaignsScreen } from './screens/MyCampaignsScreen';
import { HeraScreen } from './screens/HeraScreen';
import { MessagesScreen } from './screens/MessagesScreen';
import { InstagramProgressScreen } from './screens/InstagramProgressScreen';
import { TikTokProgressScreen } from './screens/TikTokProgressScreen';
import { ScriptHistoryScreen } from './screens/ScriptHistoryScreen';
import { AddScriptScreen } from './screens/AddScriptScreen';
import { ProposalDetailsScreen } from './screens/ProposalDetailsScreen';
import { AudienceStatsScreen } from './screens/AudienceStatsScreen';

// Configuración de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (antes cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Componente para rutas protegidas
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <OfflineIndicator />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#191919',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#8F2AF3',
              secondary: '#fff',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas - Auth */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/register/verify" element={<EmailVerificationScreen />} />
          <Route path="/register/password" element={<PasswordScreen />} />
          <Route path="/register/name" element={<NameScreen />} />
          <Route path="/register/about" element={<AboutScreen />} />
          <Route path="/register/success" element={<AccountCreatedScreen />} />
          
          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomeScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/proposals/:id"
            element={
              <ProtectedRoute>
                <ProposalDetailsScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/campaigns/:id"
            element={
              <ProtectedRoute>
                <CampaignDetailScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/campaigns/:id/posts/:postId/instagram-progress"
            element={
              <ProtectedRoute>
                <InstagramProgressScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/campaigns/:id/posts/:postId/tiktok-progress"
            element={
              <ProtectedRoute>
                <TikTokProgressScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/campaigns/:id/posts/:postId/script-history"
            element={
              <ProtectedRoute>
                <ScriptHistoryScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/campaigns/:id/posts/:postId/add-script"
            element={
              <ProtectedRoute>
                <AddScriptScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/audience-stats"
            element={
              <ProtectedRoute>
                <AudienceStatsScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfileScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile/social"
            element={
              <ProtectedRoute>
                <SocialMediaScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/my-campaigns"
            element={
              <ProtectedRoute>
                <MyCampaignsScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/hera"
            element={
              <ProtectedRoute>
                <HeraScreen />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessagesScreen />
              </ProtectedRoute>
            }
          />
          
          {/* Redirect por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
