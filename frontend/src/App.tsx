import {Routes, Route} from 'react-router-dom';
import Home from './components/Home.tsx';
import Loading from './components/Loading.tsx';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/loading' element={<Loading />}></Route>
    </Routes>
  )
}

export default App