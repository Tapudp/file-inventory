import React from 'react';
import styled from 'styled-components';

const HeadWrapper = styled.div`
    text-align: center;
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #9052CC;
    font-weight: 800;
`;

export default function AppHeader() {
    return (
        <HeadWrapper>
            Citadel Drive
        </HeadWrapper>
    )
}