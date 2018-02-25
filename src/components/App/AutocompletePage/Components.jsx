import styled from 'styled-components';

const BORDER_COLOR = '#c8dae3';
const BLUE_COLOR = '#4340de';
export const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  font-size: 18px;

  outline: none;
  transition: all 0.2s ease-in-out;
  border: 1px solid ${BORDER_COLOR};
  font-family: sans-serif;
  color: #2b303d;
  &:hover {
    border-color: #79818f;
  }
  &:focus {
    border-color: ${BLUE_COLOR};
  }

  &::placeholder {
    color: #a5b5c1;
    font-weight: 300;
  }
`;

export const ResultsContainer = styled.div`
  width: 100%;
  background-color: white;
  /* box-shadow: 0px 2px 4px 0px ${BORDER_COLOR}; */
  border-right: 1px solid ${BORDER_COLOR};
  border-left: 1px solid ${BORDER_COLOR};
  box-sizing: border-box;
`;

export const OuterContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0px;
  margin: 0px;
  font-family: sans-serif;
  font-weight: 300;

  li {
    padding: 12px;
    border-bottom: 1px solid ${BORDER_COLOR};
    cursor: pointer;
    &:hover {
      background-color: ${BORDER_COLOR};
    }
  }
`;
