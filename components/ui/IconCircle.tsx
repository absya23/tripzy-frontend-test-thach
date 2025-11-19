import React from 'react';

type IconCircleProps = {
    icon: React.ReactNode;
    background?: string;
    color?: string;
};

const IconCircle = ({ background, color, icon }: IconCircleProps) => {
    return (
        <div
            style={{
                backgroundColor: background || '#fff',
                color: color || '#000',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '21px',
            }}
        >
            {icon}
        </div>
    );
};

export default IconCircle;