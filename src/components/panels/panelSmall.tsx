import React from 'react';
import { Box } from '@mui/material';
import clsx from 'clsx';
import { cn } from '@/utils/cn';

interface PanelSmallProps {
    accentColor: string;
    children: React.ReactNode;
    className?: string;
}

const PanelSmall: React.FC<PanelSmallProps> = ({ accentColor, children, className }) => {
    return (
        <Box
            className={cn(`rounded-2xl p-2 m-1 bg-slate-100 text-black`, className)}
            sx={{ borderLeft: `10px solid ${accentColor}` }}
        >
            {children}
        </Box>
    );
};

export default PanelSmall;