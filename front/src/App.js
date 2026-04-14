import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';
import { configureStore } from './redux/Store';
import Layout from './components/Layout';
import Home from './pages/Home';
const { store, persistor } = configureStore();
function App() {
  return (
 <>
 <Provider store={store}>
 <Layout>
  <Home />
 </Layout>
 </Provider>
 </>
  );
}

export default App;
