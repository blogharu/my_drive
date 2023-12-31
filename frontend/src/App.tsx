
import { useSelector } from 'react-redux';
import Files from './components/Files';
import Header from './components/Header';
import { RootState } from "./store";
import SelectedButtons from './components/SelectedButtons';
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios';
import { axiosInit } from './utils/axios';
import { useCookies } from 'react-cookie';

function App() {
  const path = useSelector((state: RootState) => state.myDrive.path)
  const selected = useSelector((state: RootState) => state.myDrive.selected)
  const [cookies] = useCookies(["access_token"])

  axiosInit(cookies.access_token)

  return (<>
    <Header />
    <div className="App h-100">
      <Files path={path} />
    </div>
    <SelectedButtons />
    <ToastContainer />
  </>);
}

export default App;
