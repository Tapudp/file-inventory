import React from 'react';
import styled from 'styled-components';

const FolderWrapper = styled.div`
    background-color: ${props => props.isFolder ? '#DAF7A6' : '#E3D5FE'};
    display: grid;
    grid-template-rows: 40px 40px 40px;
    padding: 1rem;
    height: 1fr;
    cursor: ${props => props.onClick ? 'pointer' : 'default'};
`;

export default function Folder({ fileName, fileContent, isFolder, switchPath }) {
    return (
        <FolderWrapper onClick={isFolder ? () => switchPath() : null} isFolder={isFolder}>
            <h2>{fileName || ''}</h2>
            <p>{fileContent || ''}</p>
            <h5>{isFolder ? 'Folder' : 'Video' || ''}</h5>
        </FolderWrapper>
    )
}