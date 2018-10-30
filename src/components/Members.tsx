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
  width: 20;
  height: 20;
  backgroundColor: ${(props: ColorSampleProps) => props.section.fillStyle};
  stroke: ${(props: ColorSampleProps) => props.section.strokeStyle}
`;

@inject('dacStore')
@observer
export default class Members extends React.Component {

  randomColor() {
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;
    return `rgb(${r}, ${g}, ${b})`;
  }

  sections(): PieGraphSection[] {
    const sections: PieGraphSection[] = [];
    Object.keys(this.props.dacStore.members).forEach((key, index) => {
      const member = this.props.dacStore.members[key];
      if (+member.value === 0) return;
      sections.push({
        value: member.value,
        fillStyle: this.randomColor(),
      });
    });
    return sections;
  }

  render() {
    const sections = this.sections();
    return (
      <Container>
        {sections.map((section, index) => (
          <Container key={index}>
            <ColorSample section={section} />
            <div style={{}}>
              {section.value}
            </div>
          </Container>
        ))}
        <PieGraph sections={sections} radius={50} />
      </Container>
    );
  }
}
