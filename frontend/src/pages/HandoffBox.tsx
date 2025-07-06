import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * @deprecated This component is deprecated in favor of the new handoff flow.
 * It's kept for backward compatibility but will redirect to the new flow.
 */
const HandoffBox: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new handoff flow
    navigate('/handoff', { replace: true });
  }, [navigate]);

  return null; // This component doesn't render anything as it just redirects
};

export default HandoffBox;
