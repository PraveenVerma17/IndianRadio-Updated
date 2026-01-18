import React from 'react';
import type { Station } from '../data/stations';

interface StationIconProps {
    station: Station;
}

const StationIcon: React.FC<StationIconProps> = ({ station }) => {
    return (
        <div
            className="station-icon"
            style={{
                backgroundImage: station.imageUrl ? `url('${station.imageUrl}')` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {!station.imageUrl && station.name.substring(0, 2).toUpperCase()}
        </div>
    );
};

export default StationIcon;
