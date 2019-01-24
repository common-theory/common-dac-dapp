import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  margin: 4px;
  font-family: Helvetica;
  border-radius: 3px;
  border: 1px solid black;
  padding: 2px;
`;

export default (props: any) => (
  // Set an random string to get chrome to not autocomplete
  <Input { ...props } type="none" autoComplete="rutjfkde">
    {props.children}
  </Input>
);
