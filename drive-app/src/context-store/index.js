import React from 'react';
import { TEMPLATE_FILES } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import FileService from '../services/fileService';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';

const LoadingContainer = styled.div`
    display: flex;
    margin: auto;
    width: 95vw;
    height: 90vh;
    align-items: center;
    justify-content: center;
    background-color: #E8E7EA;
    font-size: 20px;
`;

const getDefaultState = (pathFromUrl) => {
    const calculatedPathId = pathFromUrl === "/" ? "root" : pathFromUrl.replace('/', '')
    return {
        parentPath: '',
        parentPathId: '',
        currentPath: '/',
        currentPathId: calculatedPathId,
        rootPath: '/',
        rootPathId: 'root',
        listOfFiles: TEMPLATE_FILES.map(it => ({ ...it, parentId: null, ownPathId: uuidv4() })),
    }
}

const AppContext = React.createContext();

function AppContextProvider(props) {
    const location = useLocation();
    const [state, setState] = React.useState(getDefaultState(location.pathname));
    const [appError, setAppError] = React.useState('');
    const [isLoading, setLoader] = React.useState(false);

    const navigate = useNavigate();

    const updatePathForUser = (path, pathId) => {
        setContext({
            parentPath: state.parentPath,
            parentPathId: state.parentPathId,
            currentPathId: pathId,
            currentPath: path
        })
        navigate(pathId === 'root' ? '/' : `/${pathId}`)
    };

    const addFileToDrive = (fileDetails) => {
        setAppError('');
        FileService.createNewFileObject(fileDetails).then(({ error, data }) => {
            if (error !== null) {
                setAppError('Error :: creating this new file object', error);
                return;
            }
            setAppError('');
            const newList = [...state.listOfFiles, fileDetails];
            setContext({ listOfFiles: newList });
            getContextValue();
        });
    };

    const deleteFile = (fileDetails) => {
        setAppError('');
        if (!fileDetails) {
            // add toast to remind user to add file details
            console.log(":: :: file details are required for it to be deleted");
        }
        FileService.removeFileObject({ fileId: fileDetails.fileId }).then(({ error, data }) => {
            if (error !== null) {
                setAppError('Error :: creating this new file object', error);
                return;
            }
            setAppError('');
            const resultantList = state.listOfFiles.filter(it => it.fileId !== fileDetails.fileId);
            console.log('<><>result before delete<><>', resultantList);
            setContext({ listOfFiles: resultantList })
        });
    };

    const updateFile = (fileId, destinationId) => {
        setAppError('');
        if (!fileId || !destinationId) {
            // add toast to remind user to add file details
            console.log(":: :: fileId, and destinationId are required for to move this folder");
        }
        FileService.updateFileObject({ fileId, destinationId }).then(({ error, data }) => {
            if (error !== null) {
                setAppError('Error :: creating this new file object', error);
                return;
            }
            setAppError('');
            const resultantList = state.listOfFiles.filter(it => it.fileId !== fileId);
            console.log('<><>result before moving the file<><>', resultantList);
            setContext({ listOfFiles: resultantList })
        });
    }

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
        const currentPathId = location.pathname === "/" ? "root" : location.pathname.replace('/', '');
        console.log(':: :: :: ', currentPathId, state.currentPath, state.parentPath, state.parentPathId);
        setAppError('');
        FileService.getListOfFiles({ currentPathId }).then(({ error, data }) => {
            if (error !== null) {
                setAppError('Error :: while fetching list of files');
                return;
            }
            if (data.length < 1) {
                setContext({ listOfFiles: data, parentPath: '', parentPathId: '' });
                return;
            }
            setAppError('');
            const { parentId, parentName } = data[0];
            setContext({ listOfFiles: data, parentPath: parentName, parentPathId: parentId });
        });
    }, [location.pathname]);
    return (
        <AppContext.Provider value={getContextValue()}>
            {isLoading ? <LoadingContainer>L o a d i n g . . .</LoadingContainer> : props.children}
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