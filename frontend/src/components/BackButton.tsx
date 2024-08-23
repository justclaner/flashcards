import {Link} from 'react-router-dom';
import {BsArrowLeft} from 'react-icons/bs';

const BackButton = ({path = '/home'} : {path?: string}) => {
  return (
    <div className="flex">
        <Link to={path} className='text-black px-4 py-1 rounded-lg w-fit border border-black'><BsArrowLeft className="text-2xl"></BsArrowLeft></Link>
    </div>
  )
}

export default BackButton