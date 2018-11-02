import React from 'react';
import PieGraph, { PieGraphSection } from './PieGraph';
import { observer, inject } from 'mobx-react';
import DACStore from '../stores/DACStore';
import styled from 'styled-components';

const Container = styled.div`
  justify-content: space-around;
  flex-direction: row;
  display: flex;
  margin-horizontal: 100px;
`;

type ColorSampleProps = {
  section: PieGraphSection,
};
const ColorSample = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${(props: ColorSampleProps) => props.section.fillStyle};
  border-color: ${(props: ColorSampleProps) => props.section.strokeStyle};
  border-width: 1px;
  border-style: solid;
`;

@inject('dacStore', 'ethStore')
@observer
export default class Members extends React.Component <{ dacStore?: DACStore }> {

  randomColor() {
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;
    return `rgb(${r}, ${g}, ${b})`;
  }

  sections(): PieGraphSection[] {
    const sections: PieGraphSection[] = [];
    Object.keys(this.props.dacStore.members).forEach(address => {
      const member = this.props.dacStore.members[address];
      if (+member.value === 0) return;
      sections.push({
        value: member.value,
        fillStyle: this.randomColor(),
        extraData: address,
      });
    });
    return sections;
  }

  render() {
    const sections = this.sections();
    return (
      <div style={{
        maxWidth: 400
      }}>
        {sections.map((section, index) => (
          <Container key={index}>
            <ColorSample section={section} />
            <div style={{ marginLeft: 8, marginRight: 8 }}>
              <a href={this.props.ethStore.etherscanUrl(section.extraData)} target="_blank">
                {section.extraData.slice(0, 10)}...
              </a>
            </div>
            <div style={{}}>
              {section.value}
            </div>
          </Container>
        ))}
        <PieGraph sections={sections} radius={30} />
      </div>
    );
  }
}
