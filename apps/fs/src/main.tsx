import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { QueryClientProvider } from 'react-query';

import App from './app/app';
import { queryClient } from './queryClient';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
