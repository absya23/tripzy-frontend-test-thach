import React from 'react';
import IconCircle from './IconCircle';

type IconTextProps = {
    children?: React.ReactNode,
    backgroundActive?: string,
    background?: string,
    color?: string,
    icon?: React.ReactNode,
    iconBackground?: string,
    iconColor?: string,
    isActive?: boolean
}

const IconText = ({
    children,
    backgroundActive,
    background = "#ffffff",
    color,
    icon,
    iconBackground,
    iconColor,
    isActive = false
}: IconTextProps) => {

    const currentBackground = isActive ? backgroundActive : background;

    return (
        <div
            className="flex items-center rounded-lg gap-3 px-4 py-3"
            style={{
                backgroundColor: currentBackground,
            }}
        >
            {icon && (
                <IconCircle
                    background={iconBackground}
                    color={iconColor}
                    icon={icon}
                />
            )}
            <span
                className="text-lg font-semibold"
                style={{
                    color: color || '#333'
                }}
            >
                {children}
            </span>
        </div>
    )
}

export default IconText;