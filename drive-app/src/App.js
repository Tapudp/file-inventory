import './App.css';
import AddContainer from './containers/AddContainer';
import AppHeader from './containers/AppHeader';
import FolderContainer from './containers/FolderContainer';
import { AppContextProvider } from './context-store';
import AppRoutes from './Routes';

function App() {
  return (
    <div className="App">
      <AppHeader />
      <AppRoutes />
    </div>
  );
}

export default App;
