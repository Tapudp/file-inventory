import React from 'react';
import { TEMPLATE_FILES } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import FileService from '../services/fileService';

const getDefaultState = () => ({
    currentPath: '/',
    currentPathId: 'root',
    rootPath: '/',
    rootPathId: 'root',
    listOfFiles: TEMPLATE_FILES.map(it => ({ ...it, parentId: null, ownPathId: uuidv4() })),
})

const AppContext = React.createContext();

function AppContextProvider(props) {
    const [state, setState] = React.useState(getDefaultState());
    const [appError, setAppError] = React.useState('');

    const updatePathForUser = (path, pathId) => setContext({ currentPath: path, currentPathId: pathId });
    const addFileToDrive = (fileDetails) => {
        FileService.createNewFileObject(fileDetails).then(({ error, data }) => {
            if (error !== null) {
                setAppError('Error :: creating this new file object', error);
                return;
            }
            setContext({ listOfFiles: state.listOfFiles.concat(fileDetails) })
        });
    };
    const deleteFile = (fileDetails) => {
        const resultantList = state.listOfFiles.filter(it => it.ownPathId !== fileDetails.ownPathId);
        console.log('<><>result before delete<><>', resultantList);
        setContext({ listOfFiles: resultantList })
    };

    // here we only re-create setContext when its dependencies change ([state, setState])
    const setContext = React.useCallback(
        updates => {
            setState(p => ({ ...p, ...updates }))
        },
        [state, setState],
    )

    // here context value is just returning an object, but only re-creating the object when its dependencies change ([state, setContext])
    const getContextValue = React.useCallback(
        () => ({
            ...state,
            appError,
            setContext,
            updatePathForUser,
            addFileToDrive,
            deleteFile
        }),
        [state, setContext],
    )

    React.useEffect(() => {
        FileService.getListOfFiles({ currentPathId: state.rootPathId }).then(({ error, data }) => {
            if (error !== null) {
                setAppError('Error :: while fetching list of files');
                return;
            }
            setContext({ listOfFiles: data });
        });
    }, []);
    return (
        <AppContext.Provider value={getContextValue()}>
            {props.children}
        </AppContext.Provider>
    )

}

function useAppContext() {
    const context = React.useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within a AppContextProvider')
    }
    return context;
}

export { AppContextProvider, useAppContext };