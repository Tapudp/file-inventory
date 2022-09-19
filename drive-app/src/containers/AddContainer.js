import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

import Modal from '../components/Modal';
import { DEFAULT_FILE_DETAILS, DEFAULT_OBJECT_TYPES } from '../constants';
import { useAppContext } from '../context-store';
import CreateObjectContainer from '../components/CreateObjectContainer';
import StyledFormField from '../components/StyledFormField';
import StyledInput from '../components/StyledInput';
import StyledSelect from '../components/StyledSelect';
import ErrorBanner from '../components/ErrorBanner';
import PathDetails from './PathDetails';

const Wrapper = styled.div`
    display: grid;
    padding: 10px 0px;
    margin: 1px 40px;
    grid-template-columns: 1fr 1fr;
`;

const AddButton = styled.button`
    cursor: pointer;
    padding: 10px;
    background-color: #8852CC;
    color: #fff;
    font-weight: 600;
    justify-self: flex-end;
    width: 20%;
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

export default function AddContainer() {
    const [show, toggle] = useState(false);
    const [err, setErr] = useState('');
    const [itemDetails, setItemDetails] = useState(() => DEFAULT_FILE_DETAILS);

    const { listOfFiles, currentPath, currentPathId, parentPath, parentPathId, addFileToDrive } = useAppContext();

    const openModal = () => {
        toggle(true);
    }

    const closeModal = () => {
        // To-Do: only delete items when the items are submitted
        setItemDetails(() => DEFAULT_FILE_DETAILS);
        toggle(false);
    }

    const fieldEditHandler = (e, fieldName) => {
        if (err) {
            setErr('');
        }
        setItemDetails(p => ({ ...p, [fieldName]: e.target.value }))
    }

    const fileTypeChange = (e) => {
        if (e) e.stopPropagation();
        if (e.target.value === '') return;
        setItemDetails(p => ({ ...p, fileType: e.target.value, isFolder: e.target.value.toString().toLowerCase() === 'folder' }))
    }

    const submitNewObject = () => {
        if (!itemDetails.fileName || !itemDetails.fileType || !itemDetails.fileContent) {
            alert('All fields are required!!!');
            return;
        }
        setErr('');
        const fileWithTheSameName = listOfFiles.find(item => item.fileName === itemDetails.fileName);
        if (fileWithTheSameName) {
            setErr('File already exists with this name, please try something different!');
            return;
        }

        const newFileId = uuidv4();
        const fileDetailsToPush = {
            ...itemDetails,
            parentName: parentPath,
            parentId: currentPathId,
            newFileId
        };
        setErr('');
        addFileToDrive(fileDetailsToPush);
        closeModal();
    }

    return <Wrapper>
        <PathDetails />
        <AddButton onClick={openModal}>Create a new file</AddButton>
        <Modal
            show={show}
            handleClose={closeModal}
            title="Create a new object"
        >
            <CreateObjectContainer>
                <StyledFormField>
                    <label><h4>File Name</h4></label>
                    <StyledInput value={itemDetails.fileName} onChange={(e) => fieldEditHandler(e, 'fileName')} />
                </StyledFormField>
                <StyledFormField>
                    <label><h4>File Content</h4></label>
                    <StyledInput value={itemDetails.fileContent} onChange={(e) => fieldEditHandler(e, 'fileContent')} />
                </StyledFormField>
                <StyledFormField>
                    <label><h4>File Type</h4></label>
                    <StyledSelect selected={itemDetails.fileType} onChange={fileTypeChange}>
                        <option value="">Select an object type</option>
                        {DEFAULT_OBJECT_TYPES.map((type, idx) => (
                            <option key={`${type}-${idx}`} value={type}>{type}</option>
                        ))}
                    </StyledSelect>
                </StyledFormField>
                <SubmitButton onClick={submitNewObject} disabled={err}>
                    Submit
                </SubmitButton>
                <ErrorBanner bannerColor={err !== '' ? '#FAA0A0' : null}>
                    {err}
                </ErrorBanner>
            </CreateObjectContainer>
        </Modal>
    </Wrapper>
}