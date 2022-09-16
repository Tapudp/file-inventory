import './App.css';
import AddContainer from './containers/AddContainer';
import AppHeader from './containers/AppHeader';
import FolderContainer from './containers/FolderContainer';
import { AppContextProvider } from './context-store';

function App() {
  return (
    <AppContextProvider>
      <div className="App">
        <AppHeader />
        <AddContainer />
        <FolderContainer />
      </div>
    </AppContextProvider>
  );
}

export default App;
