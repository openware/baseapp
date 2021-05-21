import cr from 'classnames';
import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { CalendarPicker } from '..';
import { CloseIcon } from '../../../assets/images/CloseIcon';

export interface DownloadBalanceProps {
    title: string;
    closeModal?: () => void;
    handleDownloadBalance: (startDate: Date, endDate: Date) => void;
}

export const DownloadBalanceComponent: React.FC<DownloadBalanceProps> = ({
    title,
    closeModal,
    handleDownloadBalance,
}) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const { formatMessage } = useIntl();
    const translate = useCallback((id: string, value?: any) => formatMessage({ id: id }, { ...value }), [formatMessage]);

    const renderHeader = useMemo(() => {
        <div className="cr-email-form__options-group">
            <div className="cr-email-form__option">
                <div className="cr-email-form__option-inner">
                {title}
                    {closeModal && (
                        <div className="cr-email-form__cros-icon" onClick={closeModal}>
                            <CloseIcon className="close-icon" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    }, [title, closeModal]);

    const renderBody = useMemo(() => {
        return (
            <div className="cr-download-balance__body">
                <CalendarPicker
                    selectedDate={startDate}
                    placeholder={translate('page.body.profile.header.company.profile.downloadBalance.chooseDate')}
                    label={translate('page.body.profile.header.company.profile.downloadBalance.chooseDate.from')}
                    handleChangeDate={date => setStartDate(date)}
                />
                <div className="cr-download-balance__body__dash">-</div>
                <CalendarPicker
                    selectedDate={endDate}
                    placeholder={translate('page.body.profile.header.company.profile.downloadBalance.chooseDate')}
                    label={translate('page.body.profile.header.company.profile.downloadBalance.chooseDate.to')}
                    handleChangeDate={date => setEndDate(date)}
                />
            </div>
        );
    }, [startDate, endDate]);

    const onClickDownloadBalance = useCallback(() => {
        handleDownloadBalance(startDate, endDate);
    }, [startDate, endDate]);

    const renderFooter = useMemo(() => {
        return (
            <div className="cr-download-balance__footer">
                <Button
                    block={true}
                    onClick={onClickDownloadBalance}
                    size="lg"
                    variant="primary"
                >
                    {translate('page.body.profile.header.company.profile.downloadBalance.button')}
                </Button>
            </div>
        );
    }, []);

    return (
        <div className="cr-download-balance">
            {title && renderHeader}
            <div className="cr-download-balance__wrapper">
                {renderBody}
                {renderFooter}
            </div>
        </div>
    );
};

export const DownloadBalance = React.memo(DownloadBalanceComponent);
