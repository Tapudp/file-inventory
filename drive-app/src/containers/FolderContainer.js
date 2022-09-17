import React, { useEffect } from 'react';
import { useAppContext } from '../context-store';
import Folder from '../components/Folder';
import styled from 'styled-components';

const FolderWrapper = styled.div`
    display: grid;
    flex-wrap: wrap;
    grid-template-columns: 1fr 1fr 1fr;
    grid-auto-rows: minmax(150px, 200px);
    grid-gap: 1vh;
    height: 70%;
    width: 95%;
    overflow-y: auto;
    background-color: #F4F9EB;
    padding: 20px;
    margin: 10px 20px;
`;

const DeleteBtnContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    position: relative;
    top: -3rem;
    z-index: 9;

    button {
        border: 2px solid #EB6767;
        background-color: #EB6767;
        padding: 10px;
        color: #fff;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
    }
`;

export default function FolderContainer() {
    const { listOfFiles, currentPathId, updatePathForUser, deleteFile } = useAppContext();

    if (listOfFiles.length < 1) {
        return <FolderWrapper> Start creating new file/objects </FolderWrapper>
    }

    const filesToRender = listOfFiles.filter(file => file.parentId === currentPathId);

    if (filesToRender.length < 1) {
        return <FolderWrapper>Start creating new file/objects inside this folder</FolderWrapper>
    }

    return (
        <FolderWrapper>
            {
                filesToRender.map((file, fileIdx) => (
                    <div key={`${file.fileId}-${fileIdx}`}>
                        <Folder
                            switchPath={() => updatePathForUser(file.fileName, file.ownPathId)}
                            {...file}
                        />
                        <DeleteBtnContainer>
                            <button onClick={() => deleteFile(file)}>Delete</button>
                        </DeleteBtnContainer>
                    </div>
                ))
            }
        </FolderWrapper>
    )
}