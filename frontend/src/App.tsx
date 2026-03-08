import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="alwyn-dev-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
