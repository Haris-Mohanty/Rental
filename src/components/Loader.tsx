import React from "react";
import styled from "styled-components";

const Loader = () => {
    return (
        <Overlay>
            <StyledWrapper>
                <div className="loader">
                    <div className="truckWrapper">
                        <div className="truckBody">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 64 32"
                                className="carSvg"
                            >
                                <path
                                    d="M4 20 L12 10 H40 L52 20 H60 V26 H4 Z"
                                    fill="#257ce0"
                                    stroke="#282828"
                                    strokeWidth="2"
                                />
                                <circle cx="16" cy="26" r="4" fill="#282828" stroke="#fff" strokeWidth="2" />
                                <circle cx="48" cy="26" r="4" fill="#282828" stroke="#fff" strokeWidth="2" />
                                <rect x="18" y="12" width="20" height="6" fill="#fff" stroke="#282828" strokeWidth="1" />
                            </svg>
                        </div>

                        <div className="truckTires">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 30 30"
                                className="tiresvg"
                            >
                                <circle
                                    strokeWidth="3"
                                    stroke="#282828"
                                    fill="#282828"
                                    r="13.5"
                                    cy="15"
                                    cx="15"
                                ></circle>
                                <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
                            </svg>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 30 30"
                                className="tiresvg"
                            >
                                <circle
                                    strokeWidth="3"
                                    stroke="#282828"
                                    fill="#282828"
                                    r="13.5"
                                    cy="15"
                                    cx="15"
                                ></circle>
                                <circle fill="#DFDFDF" r="7" cy="15" cx="15"></circle>
                            </svg>
                        </div>

                        <div className="road" />
                    </div>
                </div>
            </StyledWrapper>
        </Overlay>
    );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0; 
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
`;

const StyledWrapper = styled.div`
  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .truckWrapper {
    width: 200px;
    height: 100px;
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: center;
    justify-content: flex-end;
    overflow-x: hidden;
  }

  .truckBody {
    width: 130px;
    margin-bottom: 6px;
    animation: motion 1s linear infinite;
  }

  @keyframes motion {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(3px);
    }
    100% {
      transform: translateY(0px);
    }
  }

  .truckTires {
    width: 130px;
    display: flex;
    justify-content: space-between;
    padding: 0px 10px 0px 15px;
    position: absolute;
    bottom: 0;
  }

  .truckTires svg {
    width: 24px;
  }

  .road {
    width: 100%;
    height: 1.5px;
    background-color: #282828;
    position: relative;
    bottom: 0;
    border-radius: 3px;
  }

  .road::before {
    content: "";
    position: absolute;
    width: 20px;
    height: 100%;
    background-color: #282828;
    right: -50%;
    border-radius: 3px;
    animation: roadAnimation 1.4s linear infinite;
    border-left: 10px solid white;
  }

  .road::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 100%;
    background-color: #282828;
    right: -65%;
    border-radius: 3px;
    animation: roadAnimation 1.4s linear infinite;
    border-left: 4px solid white;
  }

  @keyframes roadAnimation {
    0% {
      transform: translateX(0px);
    }
    100% {
      transform: translateX(-350px);
    }
  }
`;

export default Loader;
