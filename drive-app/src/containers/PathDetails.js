import React from 'react';
import styled from 'styled-components';
import { useAppContext } from '../context-store';

const PathContainer = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 50%;
`;
const PathWrapper = styled.div`
    padding: 10px;
    background-color: ${props => props.onClick ? '#BC5C5C' : '#F989BA'};
    color: #fff;
    font-weight: 600;
    margin: 0 10px 0 0;
    cursor: ${props => props.onClick ? 'pointer' : 'default'};
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export default function PathDetails({ }) {

    const {
        previousPath,
        previousPathId,
        parentPath,
        currentPathId,
        rootPath,
        rootPathId,
        updatePathForUser
    } = useAppContext();

    return (
        <PathContainer>
            {
                currentPathId !== rootPathId &&
                <PathWrapper
                    onClick={() => updatePathForUser(
                        previousPath ? previousPath : rootPath,
                        previousPathId ? previousPathId : rootPathId
                    )}
                >
                    {'<-'} Go back to root
                </PathWrapper>
            }
            {parentPath !== '' && <PathWrapper>Current folder : {currentPathId === rootPathId ? 'root' : parentPath}</PathWrapper>}
        </PathContainer>
    )
}