import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context-store';
import Folder from '../components/Folder';
import styled from 'styled-components';
import CreateObjectContainer from '../components/CreateObjectContainer';
import StyledFormField from '../components/StyledFormField';
import StyledInput from '../components/StyledInput';
import StyledSelect from '../components/StyledSelect';
import ErrorBanner from '../components/ErrorBanner';
import Modal from '../components/Modal';

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
`;

const StyledButton = styled.button`
    border: 2px solid ${(props) => props.buttonColor};
    border-radius: 20%;
    background-color: ${(props) => props.buttonColor};
    padding: 10px;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    cursor: pointer;
    margin: 0 10px 0 0;
`;

const SubmitButton = styled.button`
    cursor: pointer;
    padding: 10px;
    background-color: #8852CC;
    color: #fff;
    font-weight: 600;
    width: 100px;
    margin: 20px 0 0 0;
`;

export default function FolderContainer() {
    const [show, toggle] = useState(false);
    const [err, setErr] = useState('');
    const [selectedFileDetails, setSelectedFileDetails] = useState(null);
    const [destination, setDestination] = useState(null);

    const openModal = (e, fileDetails) => {
        setSelectedFileDetails(fileDetails);
        toggle(true);
    }

    const closeModal = (e) => {
        if (e) e.stopPropagation();
        toggle(false);
    }

    const { listOfFiles, currentPathId, parentPath, parentPathId, updatePathForUser, deleteFile, updateFile } = useAppContext();

    if (listOfFiles.length < 1) {
        return <FolderWrapper> Start creating new file/objects </FolderWrapper>
    }

    const filesToRender = listOfFiles.filter(file => file.parentId === currentPathId);

    if (filesToRender.length < 1) {
        return <FolderWrapper>Start creating new file/objects inside this folder</FolderWrapper>
    }

    const folderList = filesToRender.filter(file => file.isFolder === true).concat({
        fileId: 'root',
        fileName: 'Root-path'
    }, {
        fileId: parentPathId,
        fileName: parentPath
    })

    const changeDestination = (e) => {
        if (e) e.stopPropagation();
        if (e.target.value === '') return;
        const destinationFolder = folderList.filter(item => item.fileId === e.target.value);
        if (destinationFolder.length < 1) return;
        setDestination(destinationFolder[0]);
    }

    const moveFile = () => {
        if (destination === null) {
            alert("Destination folder details are required");
            return;
        }
        updateFile(selectedFileDetails.fileId, destination.fileId, destination.fileName)
        closeModal();
    }

    return (
        <FolderWrapper>
            {
                filesToRender.map((file, fileIdx) => (
                    <div key={`${file.fileId}-${fileIdx}`}>
                        <Folder
                            switchPath={() => updatePathForUser(file.fileName, file.fileId, file.parentName, file.parentId)}
                            {...file}
                        />
                        <DeleteBtnContainer>
                            <StyledButton
                                buttonColor='#8A78FA'
                                className='move-button'
                                onClick={(e) => openModal(e, file)}
                            >
                                Move
                            </StyledButton>
                            <StyledButton
                                buttonColor='#EB6767'
                                className='delete-button'
                                onClick={(e) => {
                                    if (e) e.stopPropagation();
                                    deleteFile(file)
                                }}
                            >
                                Delete
                            </StyledButton>
                        </DeleteBtnContainer>
                    </div>
                ))
            }

            <Modal
                show={show}
                handleClose={closeModal}
                title="Move to another folder"
            >
                {selectedFileDetails ? <CreateObjectContainer>
                    <StyledFormField>
                        <p className='field-title'>File Name</p>
                        <p className='field-text'>{selectedFileDetails?.fileName || ''}</p>
                    </StyledFormField>
                    <StyledFormField>
                        <p className='field-title'>File Content</p>
                        <p className='field-text'>{selectedFileDetails?.fileContent || ''}</p>
                    </StyledFormField>
                    <StyledFormField>
                        <p className='field-title'>File Type</p>
                        <p className='field-text'>{selectedFileDetails?.fileType ? 'Folder' : 'Video' || ''}</p>
                    </StyledFormField>
                    <StyledFormField>
                        <p className='field-title'>New destination</p>
                        <StyledSelect selected={destination} onChange={changeDestination}>
                            <option value="">Select a new parent folder</option>
                            {folderList.map((file, idx) => (
                                <option disabled={file.fileId === selectedFileDetails.fileId} key={`${file.fileId}-${idx}`} value={file.fileId}>{file.fileName}</option>
                            ))}
                        </StyledSelect>
                    </StyledFormField>
                    {/* <button onClick={submitNewObject} disabled={err}> */}
                    <SubmitButton
                        isDisabled={destination === null}
                        onClick={moveFile}
                    >
                        Move
                    </SubmitButton>
                    <ErrorBanner bannerColor={err !== '' ? '#FAA0A0' : null}>
                        {err}
                    </ErrorBanner>
                </CreateObjectContainer> : null}
            </Modal>
        </FolderWrapper>
    )
}