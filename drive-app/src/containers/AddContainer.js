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

const Wrapper = styled.div`
    display: flex;
    padding: 10px 0px;
    margin: 1px 4rem;
    justify-content: flex-start;
`;

const AddButton = styled.button`
    cursor: pointer;
    padding: 10px;
    background-color: #8852CC;
    color: #fff;
    font-weight: 600;
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

const PathWrapper = styled.div`
    padding: 10px;
    background-color: ${props => props.onClick ? '#BC5C5C' : '#C552CC'};
    color: #fff;
    font-weight: 600;
    margin: 0 10px 0 0;
    cursor: ${props => props.onClick ? 'pointer' : 'default'};
`;

export default function AddContainer() {
    const [show, toggle] = useState(false);
    const [err, setErr] = useState('');
    const [itemDetails, setItemDetails] = useState(() => DEFAULT_FILE_DETAILS);

    const { listOfFiles, currentPath, currentPathId, rootPath, rootPathId, updatePathForUser, addFileToDrive } = useAppContext();

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
        setItemDetails(p => ({ ...p, fileType: e.target.value }))
    }

    const submitNewObject = () => {
        setErr('');
        const fileWithTheSameName = listOfFiles.find(item => item.fileName === itemDetails.fileName);
        if (fileWithTheSameName) {
            setErr('File already exists with this name, please try something different!');
            return;
        }

        const newFileId = uuidv4();
        const fileDetailsToPush = {
            ...itemDetails,
            parentPath: currentPath,
            fileParentId: currentPathId,
            newFileId
        };
        setErr('');
        addFileToDrive(fileDetailsToPush);
        closeModal();
    }

    return <Wrapper>
        {currentPath !== rootPath &&
            <PathWrapper
                onClick={() => updatePathForUser(rootPath, rootPathId)}
            >
                {'<-'} Go back to root
            </PathWrapper>
        }
        <PathWrapper>Current path : {currentPath === rootPath ? 'root' : currentPath}</PathWrapper>
        <AddButton onClick={openModal}>Add to drive</AddButton>
        <Modal show={show} handleClose={closeModal}>
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