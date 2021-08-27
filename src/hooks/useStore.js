import { useContext } from 'react';
import { StoreContext } from 'Store';

export const useStore = () => useContext(StoreContext);

export default {};
