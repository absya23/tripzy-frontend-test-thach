'use client';

import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Form,
    AutoComplete,
    DatePicker,
    InputNumber,
    Button,
    Checkbox,
    message,
    Input,
    type GetRef,
} from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import {
    CalendarOutlined,
    CarFilled,
    SearchOutlined,
    SwapOutlined,
    UserOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { locations, Location } from '@/app/data/locations';

type DatePickerRef = GetRef<typeof DatePicker>;

interface FormValues {
    from?: string;
    to?: string;
    departureDate?: dayjs.Dayjs | null;
    returnDate?: dayjs.Dayjs | null;
    passengers?: number;
}

function formatLocation(loc: Location) {
    return `${loc.short_code} - ${loc.english_name}`;
}

const renderItemOption = (title: string, subTitle: string) => ({
    value: title,
    label: (
        <div className="p-2">
            <p className="mb-0 text-text text-sm font-semibold">{title}</p>
            <p className="mb-0 text-desc text-xs font-semibold">{subTitle}</p>
        </div>
    ),
});

export default function SearchFormBus() {
    const router = useRouter();
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const depPickerRef = useRef<DatePickerRef | null>(null);
    const retPickerRef = useRef<DatePickerRef | null>(null);
    const [form] = Form.useForm<FormValues>();
    const [messageApi, contextHolder] = message.useMessage();

    const disabledDateToday = (current: dayjs.Dayjs) => {
        return current && current < dayjs().startOf('day');
    };

    const options = useMemo(
        () => locations.map((l) => renderItemOption(formatLocation(l), l.code_state)),
        []
    );

    const onRoundTripChange = (e: CheckboxChangeEvent) => {
        setIsRoundTrip(e.target.checked);
        if (!e.target.checked) {
            form.setFieldsValue({ returnDate: undefined });
            form.validateFields(['returnDate']).catch(() => { });
        }
    };

    const onSwap = async () => {
        const from = form.getFieldValue('from');
        const to = form.getFieldValue('to');
        form.setFieldsValue({ from: to, to: from });
        try {
            await form.validateFields(['from', 'to']);
        } catch {
        }
    };

    const validateDates = (values: FormValues) => {
        const fromVal = String(values.from ?? '').trim();
        const toVal = String(values.to ?? '').trim();

        if (!fromVal || !toVal) {
            messageApi.error('From and To are required');
            return false;
        }

        if (fromVal.toLowerCase() === toVal.toLowerCase()) {
            messageApi.error('From and To must be different');
            return false;
        }

        if (!values.departureDate) {
            messageApi.error('Departure date is required');
            return false;
        }

        if (isRoundTrip) {
            if (!values.returnDate) {
                messageApi.error('Return date is required');
                return false;
            }
            if (values.returnDate && values.departureDate && values.returnDate.isBefore(values.departureDate, 'day')) {
                messageApi.error('Return date must be same or after departure date');
                return false;
            }
        }

        if (!values.passengers || values.passengers < 1) {
            messageApi.error('Passengers must be at least 1');
            return false;
        }

        return true;
    };

    const onFinish = (values: FormValues) => {
        if (!validateDates(values)) return;

        // Build query params
        const params = new URLSearchParams();
        params.set('mode', 'bus');
        params.set('from', values.from ?? '');
        params.set('to', values.to ?? '');

        if (values.departureDate) params.set('dep', values.departureDate.format('YYYY-MM-DD'));
        if (isRoundTrip && values.returnDate) params.set('ret', values.returnDate.format('YYYY-MM-DD'));
        params.set('pax', String(values.passengers ?? 1));

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="py-6">
            <div className="p-4">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <div className="flex gap-4 items-start">
                        <div className="flex-3 flex items-start gap-2">
                            <Form.Item
                                name="from"
                                label={<span className="text-desc font-medium text-xs mb-0">FROM</span>}
                                className="flex-1 mb-0!"
                                rules={[
                                    { required: true, message: 'From is required' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const to = getFieldValue('to');
                                            if (!value || !to) return Promise.resolve();
                                            if (String(value).trim().toLowerCase() === String(to).trim().toLowerCase()) {
                                                return Promise.reject(new Error('From and To must be different'));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                                dependencies={['to']}
                                validateTrigger={['onChange', 'onBlur']}
                            >
                                <AutoComplete
                                    options={options}
                                    filterOption={(input, option) =>
                                        (option?.value ?? '').toLowerCase().includes(String(input).toLowerCase())
                                    }
                                >
                                    <Input
                                        className="w-full px-4! py-4! text-sm! leading-5!"
                                        size="large"
                                        placeholder="Enter city, terminal..."
                                        prefix={<CarFilled className="text-text text-lg mr-2" />}
                                    />
                                </AutoComplete>
                            </Form.Item>

                            <div className="hidden md:flex md:justify-center mt-8">
                                <Button
                                    className="swap-btn"
                                    variant="filled"
                                    shape="circle"
                                    icon={<SwapOutlined />}
                                    size="large"
                                    onClick={onSwap}
                                />
                            </div>

                            <Form.Item
                                name="to"
                                label={<span className="text-desc font-medium text-xs mb-0">TO</span>}
                                className="flex-1"
                                rules={[
                                    { required: true, message: 'Destination is required' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            const from = getFieldValue('from');
                                            if (!value || !from) return Promise.resolve();
                                            if (String(value).trim().toLowerCase() === String(from).trim().toLowerCase()) {
                                                return Promise.reject(new Error('From and To must be different'));
                                            }
                                            return Promise.resolve();
                                        },
                                    }),
                                ]}
                                dependencies={['from']}
                                validateTrigger={['onChange', 'onBlur']}
                            >
                                <AutoComplete
                                    options={options}
                                    filterOption={(input, option) =>
                                        (option?.value ?? '').toLowerCase().includes(String(input).toLowerCase())
                                    }
                                >
                                    <Input
                                        className="w-full px-4! py-4! text-sm! leading-5!"
                                        size="large"
                                        placeholder="Enter city, terminal..."
                                        prefix={<CarFilled className="text-gray-800 text-lg mr-2" />}
                                    />
                                </AutoComplete>
                            </Form.Item>
                        </div>

                        <div className="flex-3 flex items-start gap-2">
                            <Form.Item
                                name="departureDate"
                                label={<span className="text-desc font-medium text-xs">DEPARTURE DATE</span>}
                                className="flex-1 mb-0!"
                                rules={[{ required: true, message: 'Please select departure date' }]}
                                validateTrigger={['onChange', 'onBlur']}
                            >
                                <div className="picker-with-icon">
                                    <span
                                        tabIndex={0}
                                        role="button"
                                        aria-label="Open departure date picker"
                                        className="picker-icon-left text-desc cursor-pointer"
                                        onClick={() => depPickerRef.current?.focus?.()}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') depPickerRef.current?.focus?.();
                                        }}
                                    >
                                        <CalendarOutlined style={{ fontSize: 18 }} />
                                    </span>

                                    <DatePicker
                                        ref={depPickerRef}
                                        className="w-full px-4! py-4! text-sm! leading-5!"
                                        size="large"
                                        format="DD / MM / YYYY"
                                        placeholder="DD / MM / YYYY 00:00"
                                        suffixIcon={null}
                                        disabledDate={disabledDateToday}
                                        onChange={(val) => {
                                            form.setFieldsValue({ departureDate: val });
                                            form.validateFields(['departureDate', 'returnDate']).catch(() => { });
                                        }}
                                    />
                                </div>
                            </Form.Item>

                            <Form.Item
                                label={
                                    <Checkbox checked={isRoundTrip} onChange={onRoundTripChange}>
                                        <span className="text-desc font-medium text-xs">ROUND TRIP?</span>
                                    </Checkbox>
                                }
                                name="returnDate"
                                className="flex-1 mb-0!"
                                rules={isRoundTrip ? [{ required: true, message: 'Please select return date' }] : []}
                                validateTrigger={['onChange', 'onBlur']}
                            >
                                <div className={`picker-with-icon ${!isRoundTrip ? 'opacity-50 pointer-events-none' : ''}`}>
                                    <span
                                        className="picker-icon-left text-gray-700 cursor-pointer"
                                        onClick={() => retPickerRef.current?.focus?.()}
                                        aria-hidden
                                    >
                                        <CalendarOutlined style={{ fontSize: 18 }} />
                                    </span>

                                    <DatePicker
                                        ref={retPickerRef}
                                        className="w-full px-4! py-4! text-sm! leading-5!"
                                        size="large"
                                        format="DD / MM / YYYY"
                                        placeholder="DD / MM / YYYY 00:00"
                                        disabled={!isRoundTrip}
                                        suffixIcon={null}
                                        disabledDate={disabledDateToday}
                                        onChange={(val) => {
                                            form.setFieldsValue({ returnDate: val });
                                            form.validateFields(['returnDate', 'departureDate']).catch(() => { });
                                        }}
                                    />
                                </div>
                            </Form.Item>
                        </div>

                        <div className="flex-1">
                            <Form.Item
                                name="passengers"
                                label={<span className="text-desc font-medium text-xs">NO. OF PASSENGER</span>}
                                className="mb-0!"
                                initialValue={1}
                                rules={[{ required: true }]}
                            >
                                <InputNumber
                                    min={1}
                                    className="w-full! px-4! py-4! text-sm! leading-5!"
                                    size="large"
                                    prefix={<UserOutlined className="text-gray-500 mr-2" />}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    <div className="text-center mt-6">
                        {contextHolder}
                        <Button
                            type="primary"
                            shape="round"
                            size="large"
                            htmlType="submit"
                            icon={<SearchOutlined />}
                            className="min-w-52 py-4 px-5 leading-5 font-semibold tracking-wide"
                        >
                            SEARCH
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
