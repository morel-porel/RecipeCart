import { Outlet } from 'react-router-dom';
import { PopupProvider } from './components/CustomPopup';
import { ConfirmProvider } from './components/CustomConfirm';

function App() {
  return (
    <PopupProvider>
      <ConfirmProvider>
        <div>
          <Outlet />
        </div>
      </ConfirmProvider>
    </PopupProvider>
  );
}

export default App;