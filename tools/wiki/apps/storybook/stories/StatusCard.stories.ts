import type { Meta, StoryObj } from '@storybook/html';

type StatusCardArgs = {
  title: string;
  detail: string;
  status: 'On Track' | 'Attention' | 'Blocked';
};

const badgeMap: Record<StatusCardArgs['status'], { bg: string; fg: string; border: string }> = {
  'On Track': { bg: '#14532d', fg: '#bbf7d0', border: '#22c55e' },
  Attention: { bg: '#78350f', fg: '#fde68a', border: '#f59e0b' },
  Blocked: { bg: '#7f1d1d', fg: '#fecaca', border: '#ef4444' }
};

const meta: Meta<StatusCardArgs> = {
  title: 'Components/Status Card',
  tags: ['autodocs'],
  render: (args) => {
    const badge = badgeMap[args.status];

    return `
      <article style="
        width: 360px;
        border: 1px solid #1e293b;
        border-radius: 14px;
        background: #111827;
        color: #e2e8f0;
        padding: 16px;
        font-family: 'Public Sans', sans-serif;
      ">
        <h3 style="margin: 0; font-size: 18px;">${args.title}</h3>
        <p style="margin: 10px 0 14px; font-size: 14px; color: #94a3b8;">${args.detail}</p>
        <span style="
          display: inline-block;
          border-radius: 999px;
          border: 1px solid ${badge.border};
          background: ${badge.bg};
          color: ${badge.fg};
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 700;
        ">${args.status}</span>
      </article>
    `;
  },
  args: {
    title: 'CAF Workstream: Govern and Manage',
    detail: 'Governance controls are defined and ownership mapping is underway.',
    status: 'On Track'
  }
};

export default meta;
type Story = StoryObj<StatusCardArgs>;

export const OnTrack: Story = {};

export const Attention: Story = {
  args: {
    status: 'Attention',
    detail: 'Budget variance exceeded threshold and requires review.'
  }
};

export const Blocked: Story = {
  args: {
    status: 'Blocked',
    detail: 'Security gating dependency unresolved for this release train.'
  }
};
