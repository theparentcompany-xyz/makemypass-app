import { HashLoader } from 'react-spinners';

import Theme from './Theme/Theme';

const Loader = () => {
  return (
    <Theme>
      <div className='center'>
        <HashLoader color={'#46BF75'} size={50} />
      </div>
    </Theme>
  );
};

export default Loader;
