//tslint:disable-next-line
import QRCodeGenerator from 'qrcode.react';
import React from 'react';

export interface QRCodeProps {
    /**
     * Data which is used to generate QR code(e.g. wallet address).
     * @default Required
     */
    data: string;
    /**
     * Defines the size of QR code component.
     * @default 118x118
     */
    dimensions?: number;
}

/**
 * Component for displaying QR code.
 */
const QRCodeComponent: React.FC<QRCodeProps> = ({ data = '', dimensions = 0 }) => {
    return (
        <div className="qr-code">
            <QRCodeGenerator value={data} size={dimensions} renderAs="svg" />
        </div>
    );
};

export const QRCode = React.memo(QRCodeComponent);
