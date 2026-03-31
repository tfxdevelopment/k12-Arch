import type { Meta, StoryObj } from '@storybook/html';

type ButtonArgs = {
  label: string;
  variant: 'primary' | 'secondary' | 'danger';
  disabled: boolean;
};

const meta: Meta<ButtonArgs> = {
  title: 'Components/Button',
  tags: ['autodocs'],
  render: (args) => {
    const palette: Record<ButtonArgs['variant'], { bg: string; fg: string; border: string }> = {
      primary: { bg: '#10b981', fg: '#052e16', border: '#34d399' },
      secondary: { bg: '#1e293b', fg: '#e2e8f0', border: '#475569' },
      danger: { bg: '#b91c1c', fg: '#fee2e2', border: '#ef4444' }
    };

    const colors = palette[args.variant];

    return `
      <button
        ${args.disabled ? 'disabled' : ''}
        style="
          border: 1px solid ${colors.border};
          background: ${colors.bg};
          color: ${colors.fg};
          border-radius: 10px;
          padding: 10px 14px;
          font-family: 'Public Sans', sans-serif;
          font-weight: 700;
          font-size: 14px;
          cursor: ${args.disabled ? 'not-allowed' : 'pointer'};
          opacity: ${args.disabled ? '0.65' : '1'};
        "
      >
        ${args.label}
      </button>
    `;
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger']
    }
  },
  args: {
    label: 'Run CAF Check',
    variant: 'primary',
    disabled: false
  }
};

export default meta;
type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    label: 'View WAF Details',
    variant: 'secondary'
  }
};

export const Danger: Story = {
  args: {
    label: 'Rollback Revision',
    variant: 'danger'
  }
};

export const Disabled: Story = {
  args: {
    label: 'Action Disabled',
    disabled: true
  }
};
