import styled, { keyframes } from 'styled-components';

const grow = keyframes`
  0%, 100% {
    transform: scale(1) rotate(0deg);
  }

  20% {
    transform: scale(0.9) rotate(-40deg);
  }

  60% {
    transform: scale(1.1) rotate(40deg);
  }
`;

export default styled.div`
  animation: ${grow} 1.5s ease-in-out 1;
  animation-delay: 3s;
`;
