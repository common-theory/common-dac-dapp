import styled from 'styled-components';

export const Container = styled.div`
  padding: 8px;
`;

export const BlockContainer = styled.div`
  margin: 8px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 4px;
`;

export const BlockHeader = styled.div`
  padding: 8px;
  margin-bottom: 0px;
  border: 1px solid #eff0f4;
  background-color: ${(props: {
    backgroundColor?: string
  }) => props.backgroundColor || 'white'};
  // height: 30px;
  font-size: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
`;

export const BlockElement = styled.div`
  padding: 8px;
  background-color: white;
  border: 1px solid #eff0f4;
  border-bottom: 0px;
  border-top: 0px;
`;

export const BlockFooter = styled.div`
  padding: 8px;
  background-color: white;
`;

export const HFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`;

export const VFlex = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  text-align: center;
  line-height: 150%;
`;

export const GrayContainer = styled.div`
  background-color: #EEE;
  padding: 4px;
  margin: 4px;
  border-radius: 8px;
`;

export const DarkLink = styled.a`
  color: black;
  font-family: Helvetica;
`;
