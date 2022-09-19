import React from 'react';
import styled from 'styled-components';

const FolderWrapper = styled.div`
    background-color: ${props => props.isFolder ? '#DAF7A6' : '#E3D5FE'};
    display: grid;
    grid-template-rows: 40px 40px 40px;
    padding: 1rem;
    height: 1fr;
    cursor: ${props => props.onClick ? 'pointer' : 'default'};

    &:hover{
        background-color: ${props => props.isFolder ? '#89D5FA' : '#E3D5FE'};
    }

    .file-title {
        margin: 0;
        font-weight: 900;
        font-size: 20px;
        overflow: auto;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .file-text {
        margin: 0;
        font-weight: 400;
        font-size: 15px;
        overflow: auto;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .file-type {
        margin: 0;
        font-weight: 600;
        font-size: 14px;
    }
`;

export default function Folder({ fileName, fileContent, isFolder, switchPath }) {
    return (
        <FolderWrapper onClick={isFolder ? () => switchPath() : null} isFolder={isFolder}>
            <p className='file-title'>{fileName || ''}</p>
            <p className='file-text'>{fileContent || ''}</p>
            <p className='file-type'>{isFolder ? 'Folder' : 'Video' || ''}</p>
        </FolderWrapper>
    )
}