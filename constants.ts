
import React from 'react';
import type { Tab, IconProps } from './types';

// Icon Components
const Icon: React.FC<IconProps & { children?: React.ReactNode }> = ({ className = "w-6 h-6", children }) => (
    React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        className: className
    }, children)
);

export const OverviewIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props,
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" }),
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" })
    )
);
export const AllocationIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-15c-.621 0-1.125-.504-1.125-1.125v-9.75c0-.621.504-1.125 1.125-1.125h1.5" }))
);
export const EmergencyIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 13.036h.008v.008h-.008v-.008Z" }))
);
export const InvestmentsIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12M3.75 3h16.5M3.75 12h16.5m0 0v1.125c0 .621-.504 1.125-1.125 1.125H9.75M8.25 21a2.25 2.25 0 0 1-2.25-2.25v-3.875M16.5 21a2.25 2.25 0 0 0 2.25-2.25v-3.875" }))
);
export const AssetsIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" }))
);
export const DebtsIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-1.5h5.25m-5.25 0h3m-3 0h-1.5m3 0h.75M9 12l3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" }))
);
export const GoalsIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L6 12Z" }))
);
export const WalletIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 3a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m15-3a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3m12 0c0 1.657-1.343 3-3 3H9c-1.657 0-3-1.343-3-3" }))
);
export const RocketIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.82m5.84-2.56a17.96 17.96 0 0 0-5.84-2.56m0 0a17.96 17.96 0 0 1 3.922 9.24a1.95 1.95 0 0 0 .385 1.045 2.25 2.25 0 0 1-3.274 3.274 2.25 2.25 0 0 1-3.275-3.275a1.95 1.95 0 0 0-.384-1.046 17.959 17.959 0 0 1-3.922-9.24m9.24-8.982a17.96 17.96 0 0 0-5.84-2.56m0 0a17.96 17.96 0 0 1-5.84 2.56m11.68 0a2.25 2.25 0 0 1 3.274 3.274c.43 1.11.304 2.343-.317 3.32-1.12 1.83-2.126 3.76-2.126 3.76-2.126 5.84V19.25m0 0a2.25 2.25 0 0 1-2.25 2.25H7.5A2.25 2.25 0 0 1 5.25 19.25V16.5c0-2.08 1.006-4.01 2.126-5.84.621-.977.747-2.21.317-3.32a2.25 2.25 0 0 1-3.274-3.274 2.25 2.25 0 0 1 3.275-3.275 1.95 1.95 0 0 0 1.045-.384 17.959 17.959 0 0 1 9.24-3.922Z" }))
);
export const PartyIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M14.25 9.75v-4.5m0 4.5h4.5m-4.5 0 6-6m-3 18c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.055.917-.44 1.257l-1.096 1.096c.07.19.128.387.197.583a11.001 11.001 0 0 0 4.463 4.463c.196.069.393.127.583.197l1.096-1.096c.34-.385.818-.55 1.257-.44l4.423 1.106c.5.125.852.575.852 1.091V19.5A2.25 2.25 0 0 1 19.5 21.75h-2.625m-7.5-1.5-1.5-1.5" }))
);
export const DiamondIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM18 15.75l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 0 0-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 0 0-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 0 0 2.456-2.456Z" }))
);
export const SparklesIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 0 0-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 0 0 2.456-2.456Z" }))
);
export const XMarkIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 18 18 6M6 6l12 12" }))
);
export const PaperAirplaneIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L6 12Zm0 0h7.5" }))
);
export const ChatBubbleLeftRightIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.355 0-2.697-.056-4.024-.166-2.063-.17-3.924-1.058-5.403-2.395-1.367-1.235-2.342-2.913-2.66-4.792-.15-3.084 2.269-5.808 5.675-6.368 3.058-.504 6.196.21 8.776 1.805ZM8.625 6.75a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" }))
);
export const Cog6ToothIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.795 23.91 23.91 0 0 1-1.014 5.795m-3.8-11.59a23.8 23.8 0 0 1 6.59 5.795 23.8 23.8 0 0 1-6.59 5.795m0-11.59a23.8 23.8 0 0 0-6.59 5.795 23.8 23.8 0 0 0 6.59 5.795" }))
);
export const ArrowDownTrayIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" }))
);
export const ArrowUpTrayIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" }))
);
export const TrashIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" }))
);
export const ScaleIcon: React.FC<IconProps> = (props) => (
    React.createElement(Icon, props, React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" }))
);

export const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Visão Geral', icon: React.createElement(OverviewIcon) },
    { id: 'allocation', label: 'Alocação 50-15-35', icon: React.createElement(AllocationIcon) },
    { id: 'emergency', label: 'Reserva de Emergência', icon: React.createElement(EmergencyIcon) },
    { id: 'investments', label: 'Investimentos', icon: React.createElement(InvestmentsIcon) },
    { id: 'assets', label: 'Patrimônio', icon: React.createElement(AssetsIcon) },
    { id: 'debts', label: 'Dívidas', icon: React.createElement(DebtsIcon) },
    { id: 'goals', label: 'Objetivos', icon: React.createElement(GoalsIcon) },
];
