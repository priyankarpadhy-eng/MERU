import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="font-mono text-7xl sm:text-8xl font-bold tracking-tight text-text-primary mb-2">
        404
      </div>
      <p className="text-sm text-text-secondary max-w-sm mb-6">
        The page you are looking for does not exist or has been moved.
      </p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Back to dashboard
      </Button>
    </div>
  );
};
