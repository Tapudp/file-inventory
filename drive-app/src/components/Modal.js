import React from 'react';
import styled from 'styled-components';

const ModalWrapper = styled.div`
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width:100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
  }
  
  .modal-main-content {
    position:fixed;
    background: white;
    width: 60rem;
    height: auto;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    padding: 10px 20px;
  }
  
  .display-block {
    display: block;
  }
  
  .display-none {
    display: none;
  }
  
  .closeBtnContainer {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > button {
      padding: 5px 10px;
      font-weight: 900;
      font-size: 20px;
      margin: 0 20px;
      border: 2px solid #000;
      background-color: #E3735E;
      color: #fff;
      text-align: center;
    }
  }
`;

export default function Modal({ handleClose, show, children }) {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <ModalWrapper>
      <div className={showHideClassName}>
        <section className="modal-main-content">
          <div className='closeBtnContainer'>
            <h2>Create a new object</h2>
            <button type="button" onClick={handleClose}>
              X
            </button>
          </div>
          {children}
        </section>
      </div>
    </ModalWrapper>
  );
};