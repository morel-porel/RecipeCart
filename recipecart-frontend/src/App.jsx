import { Outlet } from 'react-router-dom';
import { PopupProvider } from './components/CustomPopup';

function App() {
  return (
    <PopupProvider>
      <div>
        <Outlet />
      </div>
    </PopupProvider>
  );
}

export default App;