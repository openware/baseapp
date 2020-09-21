//tslint:disable-next-line
import * as QRCodeGenerator from 'qrcode.react';
import * as React from 'react';

interface QRCodeProps {
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
const QRCodeComponent: React.FunctionComponent<QRCodeProps> = (props: QRCodeProps) => {
    const { data = '', dimensions } = props;

    return (
        <div className="qr-code">
            <QRCodeGenerator
                value={data}
                size={dimensions}
                renderAs="svg"
            />
        </div>
    );
};

const QRCode = React.memo(QRCodeComponent);

export {
    QRCode,
};
