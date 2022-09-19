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
      cursor: pointer;
      padding: 5px 10px;
      font-weight: 600;
      font-size: 18px;
      margin: 0 20px;
      border: 1px solid #E3735E;
      border-radius: 15px;
      background-color: #E3735E;
      color: #fff;
      text-align: center;
    }
  }
`;

export default function Modal({ handleClose, show, children, title }) {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <ModalWrapper>
      <div className={showHideClassName}>
        <section className="modal-main-content">
          <div className='closeBtnContainer'>
            <h2>{title}</h2>
            <button className='close-btn' type="button" onClick={handleClose}>
              X
            </button>
          </div>
          {children}
        </section>
      </div>
    </ModalWrapper>
  );
};