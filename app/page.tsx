'use client';

import { useState } from 'react';
import { Tabs, Typography } from 'antd';
import {
	CarFilled,
	HomeFilled,
	RocketFilled,
} from '@ant-design/icons';
import SearchFormBus from '@/components/SearchFormBus';
import IconText from '@/components/ui/IconText';

const { Title, Text } = Typography;

export default function HomePage() {
	const [activeTab, setActiveTab] = useState<string>('bus');

	const tabItems = [
		{
			key: 'bus',
			label: (
				<IconText
					icon={<CarFilled />}
					backgroundActive="#EBF9FF"
					iconBackground="#D3F3FF"
					iconColor="#19C0FF"
					isActive={activeTab === 'bus'}
				>
					Bus & Shuttle
				</IconText>
			),
			children: <SearchFormBus />,
		},
		{
			key: 'hotel',
			label: (
				<IconText
					icon={<HomeFilled />}
					backgroundActive="#EBF9FF"
					iconBackground="#E8FBCC"
					iconColor="#447A11"
					isActive={activeTab === 'hotel'}
				>
					Hotel & Accommodation
				</IconText>
			),
			children: (
				<div className="p-8 text-center">
					No data
				</div>
			),
		},
		{
			key: 'flight',
			label: (
				<IconText
					icon={<RocketFilled />}
					backgroundActive="#EFF6FF"
					iconBackground="#E1EDFE"
					iconColor="#5664E1"
					isActive={activeTab === 'flight'}
				>
					Flight
				</IconText>
			),
			children: (
				<div className="p-8 text-center">
					No data
				</div>
			),
		}
	];

	return (
		<div className="flex w-full flex-col items-center">
			<div className="mt-16 text-center">
				<Title level={1} className="md:text-[40px]! mb-2! font-semibold text-3xl!">
					Travel Smarter, Not Harder
				</Title>
				<Text type="secondary" className="text-lg!">
					Make every trip effortless. Tripzy lets you book rides and plan journeys with ease
				</Text>
			</div>

			<div className="mt-8 w-full max-w-7xl mx-auto">
				<div className="rounded-2xl bg-white shadow-lg shadow-[rgba(32, 80, 118, 0.12)]">
					<Tabs
						activeKey={activeTab}
						onChange={(key) => setActiveTab(key)}
						size="large"
						items={tabItems}
						tabBarStyle={{ padding: "12px", marginBottom: 0, borderRadius: "16px", boxShadow: "0px 4px 12px rgba(32, 80, 118, 0.12)" }}
						tabBarGutter={0}
						className="full-width-tabs"
					/>
				</div>
			</div>
		</div>
	);
}
