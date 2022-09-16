import React, { useEffect } from 'react';
import { TEMPLATE_FILES } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import FileService from '../services/fileService';

const AppContext = React.createContext();

function AppContextProvider(props) {
    const rootId = uuidv4();
    const [state, setState] = React.useState({
        currentPath: '/',
        currentPathId: rootId,
        rootPath: '/',
        rootPathId: rootId,
        listOfFiles: TEMPLATE_FILES.map(it => ({ ...it, parentPathId: rootId, ownPathId: uuidv4() })),
    });

    useEffect(() => {
        FileService.getListOfFiles();
    }, [])

    const updateFilesBasedOnDB = (resultantList) => setState(p => ({ ...p, listOfFiles: resultantList }));
    const updatePathForUser = (path, pathId) => setState(p => ({ ...p, currentPath: path, currentPathId: pathId }));
    const addFileToDrive = (fileDetails) => setState(p => ({ ...p, listOfFiles: [...p.listOfFiles, fileDetails] }));
    const deleteFile = (fileDetails) => {
        const resultantList = state.listOfFiles.filter(it => it.ownPathId !== fileDetails.ownPathId);
        console.log('<><>result before delete<><>', resultantList);
        setState(p => ({ ...p, listOfFiles: resultantList }))
    };

    return (
        <AppContext.Provider value={{ state, updatePathForUser, addFileToDrive, deleteFile }}>
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