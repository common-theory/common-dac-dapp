import styled from 'styled-components';

export const Container = styled.div`
  padding: 8px;
`;

export const BlockContainer = styled.div`
  margin: 8px;
  box-shadow: 0 1px 5px 1px #444444;
  border-radius: 10px;
`;

export const BlockHeader = styled.div`
  padding: 8px;
  margin-bottom: 0px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
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
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: white;
`;

export const HFlex = styled.div`
  display: flex;
  flex-direction: row;
  margin: 2px;
  align-items: center;
  justify-content: space-evenly;
`;
