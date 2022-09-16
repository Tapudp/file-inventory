import React from 'react';
import styled from 'styled-components';

const FolderWrapper = styled.div`
    background-color: ${props => props.isVideo ? '#BF99F2' : '#DAF7A6'};
    display: grid;
    grid-template-rows: 40px 40px 40px;
    padding: 1rem;
    height: 1fr;
    cursor: ${props => props.onClick ? 'pointer' : 'default'};
`;

export default function Folder({ fileName, fileContent, fileType, switchPath }) {
    return (
        <FolderWrapper onClick={fileType !== 'video' ? () => switchPath() : null} isVideo={fileType === 'video'}>
            <h2>{fileName || ''}</h2>
            <p>{fileContent || ''}</p>
            <h5>{fileType || ''}</h5>
        </FolderWrapper>
    )
}