import styled from "styled-components";

const StyledFormField = styled.div`
    display: grid;
    align-items: center;
    grid-template-columns: 1fr 2fr;
    width: 30rem;
    margin: 10px;

    .field-title {
        margin: 0;
        font-weight: 900;
        font-size: 16px;
    }
    
    .field-text {
        margin: 0;
        font-weight: 500;
        font-size: 15px;
    }
`;

export default StyledFormField;