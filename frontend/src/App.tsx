import {Routes, Route} from 'react-router-dom';
import Home from './components/Home.tsx';
import Loading from './components/Loading.tsx';
import DeleteSet from './components/DeleteSet.tsx';

const App = () => {
  return (
    <Routes>
      <Route path='/home' element={<Home />}></Route>
      <Route path='/loading' element={<Loading />}></Route>
      <Route path='/deleteSet/:setId' element={<DeleteSet />}></Route>
    </Routes>
  )
}

export default App