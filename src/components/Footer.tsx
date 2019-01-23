import React from 'react';
import styled from 'styled-components';
import { GithubLogo, DiscordLogo } from './Shared';

const Container = styled.div`
  margin-top: 16px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FooterLink = styled.a`
  margin: 8px;
`;

export default class Footer extends React.Component {
  render() {
    return (
      <Container>
        <FooterLink href="https://github.com/common-theory" target="_blank">
          <GithubLogo />
        </FooterLink>
        <FooterLink href="https://discord.gg/4FFVg8a" target="_blank">
          <DiscordLogo />
        </FooterLink>
      </Container>
    );
  }
}
