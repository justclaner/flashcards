import {Routes, Route} from 'react-router-dom';
import Home from './components/Home.tsx';
import Loading from './components/Loading.tsx';
import DeleteSet from './components/DeleteSet.tsx';
import CreateSet from './components/CreateSet.tsx';
import EditSet from './components/EditSet.tsx';

const App = () => {
  return (
    <Routes>
      <Route path='/home' element={<Home />}></Route>
      <Route path='/loading' element={<Loading />}></Route>
      <Route path='/deleteSet/:setId' element={<DeleteSet />}></Route>
      <Route path='/createSet' element={<CreateSet />}></Route>
      <Route path='/editSet/:setId' element={<EditSet />}></Route>
    </Routes>
  )
}

export default App