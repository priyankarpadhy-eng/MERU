import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { LeadDetail } from './pages/LeadDetail';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { LeadDrawer } from './components/leads/LeadDrawer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useLead } from './hooks/useLeads';
import { Toaster } from 'sonner';

// Route-aware LeadDrawer Wrapper for /leads/new and /leads/:id/edit
const LeadsWithDrawer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();

  const isNew = location.pathname === '/leads/new';
  const isEdit = location.pathname.endsWith('/edit') && Boolean(params.id);

  // If editing, load the specific lead
  const { data: leadToEdit } = useLead(isEdit ? params.id : null);

  const [activeLead, setActiveLead] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (isNew) {
      setActiveLead(null);
      setDrawerOpen(true);
    } else if (isEdit) {
      if (leadToEdit) {
        setActiveLead(leadToEdit);
      }
      setDrawerOpen(true);
    } else if (!isNew && !isEdit) {
      setDrawerOpen(false);
      setActiveLead(null);
    }
  }, [isNew, isEdit, leadToEdit]);

  const handleClose = () => {
    setDrawerOpen(false);
    setActiveLead(null);
    if (isNew || isEdit) {
      navigate('/leads');
    }
  };

  const handleOpenAdd = () => {
    setActiveLead(null);
    setDrawerOpen(true);
    navigate('/leads/new');
  };

  const handleOpenEdit = (lead) => {
    setActiveLead(lead);
    setDrawerOpen(true);
    navigate(`/leads/${lead.id}/edit`);
  };

  return (
    <>
      <Leads onOpenAdd={handleOpenAdd} onOpenEdit={handleOpenEdit} />
      <LeadDrawer
        isOpen={drawerOpen}
        onClose={handleClose}
        lead={activeLead}
      />
    </>
  );
};

// Route-aware LeadDrawer Wrapper for LeadDetail Edit button
const LeadDetailWithDrawer = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isEdit = location.pathname.endsWith('/edit');
  const { data: lead } = useLead(id);

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (isEdit) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  }, [isEdit]);

  const handleClose = () => {
    setDrawerOpen(false);
    navigate(`/leads/${id}`);
  };

  return (
    <>
      <LeadDetail onOpenEdit={() => navigate(`/leads/${id}/edit`)} />
      <LeadDrawer
        isOpen={drawerOpen}
        onClose={handleClose}
        lead={lead}
      />
    </>
  );
};

export function App() {
  const location = useLocation();

  // Document title updates per route
  useEffect(() => {
    const path = location.pathname;
    let title = 'Lead Manager';

    if (path === '/') title = 'Dashboard | Lead Manager';
    else if (path.startsWith('/leads')) title = 'Leads | Lead Manager';
    else if (path === '/profile') title = 'Profile | Lead Manager';
    else if (path === '/login') title = 'Sign in | Lead Manager';
    else if (path === '/signup') title = 'Create Account | Lead Manager';

    document.title = title;
  }, [location.pathname]);

  return (
    <ErrorBoundary>
      <OfflineBanner />
      <Routes>
        {/* Public Authentication Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Application Routes inside AppShell */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <AppShell title="Dashboard">
                <Dashboard onOpenAddLead={() => window.location.assign('/leads/new')} />
              </AppShell>
            }
          />
          <Route
            path="/leads"
            element={
              <AppShell title="Leads">
                <LeadsWithDrawer />
              </AppShell>
            }
          />
          <Route
            path="/leads/new"
            element={
              <AppShell title="Leads">
                <LeadsWithDrawer />
              </AppShell>
            }
          />
          <Route
            path="/leads/:id/edit"
            element={
              <AppShell title="Leads">
                <LeadsWithDrawer />
              </AppShell>
            }
          />
          <Route
            path="/leads/:id"
            element={
              <AppShell title="Lead details">
                <LeadDetailWithDrawer />
              </AppShell>
            }
          />
          <Route
            path="/profile"
            element={
              <AppShell title="Profile">
                <Profile />
              </AppShell>
            }
          />
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Unified Toaster */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          className:
            'bg-surface border border-border text-text-primary text-xs rounded-[8px] shadow-floating',
          duration: 3000,
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
