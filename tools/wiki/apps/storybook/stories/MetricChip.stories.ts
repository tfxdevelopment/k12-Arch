import type { Meta, StoryObj } from '@storybook/html';

type MetricChipArgs = {
  label: string;
  value: string;
  healthy: boolean;
};

const meta: Meta<MetricChipArgs> = {
  title: 'Foundations/Metric Chip',
  tags: ['autodocs'],
  render: (args) => `
    <div style="
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 999px;
      border: 1px solid #334155;
      background: #0f172a;
      color: #e2e8f0;
      padding: 8px 12px;
      font-family: 'Public Sans', sans-serif;
      font-size: 13px;
      font-weight: 600;
    ">
      <span style="
        width: 8px;
        height: 8px;
        border-radius: 999px;
        background: ${args.healthy ? '#22c55e' : '#ef4444'};
        box-shadow: 0 0 10px ${args.healthy ? '#22c55e' : '#ef4444'}66;
      "></span>
      <span>${args.label}</span>
      <span style="color: #cbd5e1;">${args.value}</span>
    </div>
  `,
  args: {
    label: 'P95 Latency',
    value: '1.4s',
    healthy: true
  }
};

export default meta;
type Story = StoryObj<MetricChipArgs>;

export const Healthy: Story = {};

export const Unhealthy: Story = {
  args: {
    value: '3.9s',
    healthy: false
  }
};
