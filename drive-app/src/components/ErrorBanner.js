import styled from "styled-components";

const ErrorBanner = styled.div`
    background-color: ${(props) => props.bannerColor};
    margin: 10px 0;
    padding: 10px;
    border-radius: 15px;
`;

export default ErrorBanner;