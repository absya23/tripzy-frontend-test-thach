'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Spin } from 'antd';

function SearchResults() {
	const searchParams = useSearchParams();

	const from = searchParams.get('from');
	const to = searchParams.get('to');
	const dep = searchParams.get('dep');
	const ret = searchParams.get('ret');
	const pax = searchParams.get('pax');

	return (
		<div className="flex w-full flex-col items-center">
			<div className="mt-20 w-full max-w-6xl">
				<div className="min-h-[600px] rounded-xl bg-white p-10 shadow-lg">
					<div className="space-y-4 text-lg font-bold">
						<p className="mb-5">
							From:  {from || 'N/A'}
						</p>
						<p className="mb-5">
							To:  {to || 'N/A'} </p>
						<p className="mb-5">
							Departure date: {dep || 'N/A'}</p>
						{ret && <p className="mb-5">
							Return date: {ret || 'N/A'}</p>}
						<p className="mb-5">
							No. of passenger: {pax || 'N/A'}</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function SearchPage() {
	return (
		<Suspense
			fallback={
				<div className="flex h-[500px] w-full items-center justify-center">
					<Spin size="large" />
				</div>
			}
		>
			<SearchResults />
		</Suspense>
	);
}