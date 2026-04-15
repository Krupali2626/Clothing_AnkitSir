import './App.css';
import UserRoutes from './routes/UserRoutes';
import AdminRoutes from './routes/AdminRoutes';

function App() {
  return (
    <>
      <UserRoutes />
      <AdminRoutes />
    </>
  );
}

export default App;
