import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Autocomplete from './Autocomplete';

const BORDER_COLOR = '#c8dae3';
const BLUE_COLOR = '#4340de';
const LinkInner = styled(Link)`
  text-decoration: none;
  color: ${BLUE_COLOR};
  &:hover {
    text-decoration: underline;
  }
`;

const HelpfulHint = styled.span`
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  font-size: 0.8em;
  font-family: sans-serif;
  padding: 8px;
  background-color: ${BORDER_COLOR};
  margin-right: 12px;
  font-weight: 300;
  margin-bottom: -1px;
  height 100%;
`;

const TopSection = styled.div`
  margin-bottom: 20px;
  font-family: sans-serif;
  font-size: 16px;
`;

const diamond = '\u0020\u25C6 ';

const H1 = styled.h1`
  text-align: center;
  margin-bottom: 30px;
`;

const HintContainer = styled.div`
  border: 1px solid ${BORDER_COLOR};
  line-height: 40px;
  display: inline-block;
  padding-right: 20px;
`;

export default () => (<div style={{ maxWidth: 800, margin: '50px auto' }}>
  <H1>Autocomplete Stage 0</H1>
  <TopSection>
    <HintContainer>
      <HelpfulHint>Hint</HelpfulHint>
      You can try searching
      for: <LinkInner to="/autocomplete?searchText=Don">Don</LinkInner>{diamond}
      <LinkInner to="/autocomplete?searchText=Jason">Jason</LinkInner>{diamond}
      <LinkInner to="/autocomplete?searchText=Batman">Batman</LinkInner>{diamond}
      <LinkInner to="/autocomplete?searchText=Iceman">Iceman</LinkInner>{diamond}
      <LinkInner to="/autocomplete?searchText=Rick">Rick</LinkInner>{diamond}
      <LinkInner to="/autocomplete?searchText=Harry">Harry</LinkInner>
    </HintContainer>
  </TopSection>
  <Autocomplete />
</div>);
