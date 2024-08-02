// ref: https://github.com/johnkueh/prosemirror-react-nodeviews/blob/b12f917/src/components/ReactNodeViewPortals.tsx
import React, { useContext, useReducer } from 'react';

interface Props {}

const initialState = {};

export interface IReactNodeViewPortalsContext {
  createPortal: (portal: React.ReactPortal) => void;
  destroyPortal: (portalId: string) => void;
  state: Partial<State>;
}

export const ReactNodeViewPortalsContext = React.createContext<IReactNodeViewPortalsContext>({
  createPortal: () => {},
  destroyPortal: () => {},
  state: {},
});

const ReactNodeViewPortalsProvider: React.FC<React.PropsWithChildren<Props>> = ({ children }) => {
  const [data, dispatch] = useReducer(reducer, initialState);

  return (
    <ReactNodeViewPortalsContext.Provider
      value={{
        createPortal: (portal) =>
          dispatch({ type: 'createPortal', key: portal.key as string, portal }),
        destroyPortal: (portalId) => dispatch({ type: 'destroyPortal', key: portalId }),
        state: data,
      }}>
      {children}
      {Object.values(data)}
    </ReactNodeViewPortalsContext.Provider>
  );
};

type State = {
  [key: string]: any;
};

type Action = {
  type: 'createPortal' | 'destroyPortal';
  key: string;
  portal?: React.ReactPortal;
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'createPortal':
      return { ...state, [action.key]: action.portal };
    case 'destroyPortal': {
      const { [action.key]: prev, ...newState } = state;
      return newState;
    }
    default:
      return state;
  }
}

export const useReactNodeViewPortals = () => useContext(ReactNodeViewPortalsContext);

export default ReactNodeViewPortalsProvider;
