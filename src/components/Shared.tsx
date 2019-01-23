import styled from 'styled-components';
import React from 'react';

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

export const InternalCell = styled.div`
  box-shadow: rgba(0, 0, 0, 0.35) 0px 0px 4px;
  padding: 4px;
  margin: 4px;
  border-radius: 8px;
`;

export const DarkLink = styled.a`
  color: black;
  font-family: Helvetica;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
`;

export const DiscordLogo = () => (
  <Logo>
    <span dangerouslySetInnerHTML={{ __html: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Discord icon</title><path d="M20.222 0c1.406 0 2.54 1.137 2.607 2.475V24l-2.677-2.273-1.47-1.338-1.604-1.398.67 2.205H3.71c-1.402 0-2.54-1.065-2.54-2.476V2.48C1.17 1.142 2.31.003 3.715.003h16.5L20.222 0zm-6.118 5.683h-.03l-.202.2c2.073.6 3.076 1.537 3.076 1.537-1.336-.668-2.54-1.002-3.744-1.137-.87-.135-1.74-.064-2.475 0h-.2c-.47 0-1.47.2-2.81.735-.467.203-.735.336-.735.336s1.002-1.002 3.21-1.537l-.135-.135s-1.672-.064-3.477 1.27c0 0-1.805 3.144-1.805 7.02 0 0 1 1.74 3.743 1.806 0 0 .4-.533.805-1.002-1.54-.468-2.14-1.404-2.14-1.404s.134.066.335.2h.06c.03 0 .044.015.06.03v.006c.016.016.03.03.06.03.33.136.66.27.93.4.466.202 1.065.403 1.8.536.93.135 1.996.2 3.21 0 .6-.135 1.2-.267 1.8-.535.39-.2.87-.4 1.397-.737 0 0-.6.936-2.205 1.404.33.466.795 1 .795 1 2.744-.06 3.81-1.8 3.87-1.726 0-3.87-1.815-7.02-1.815-7.02-1.635-1.214-3.165-1.26-3.435-1.26l.056-.02zm.168 4.413c.703 0 1.27.6 1.27 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.334.002-.74.573-1.338 1.27-1.338zm-4.543 0c.7 0 1.266.6 1.266 1.335 0 .74-.57 1.34-1.27 1.34-.7 0-1.27-.6-1.27-1.334 0-.74.57-1.338 1.27-1.338z"/></svg>` }} />
  </Logo>
);

export const GithubLogo = () => (
  <Logo>
    <span dangerouslySetInnerHTML={{ __html: `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub icon</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`}} />
  </Logo>
);
