import * as React from 'react';
import congratsImage from '../../../assets/images/setup/setup-congrats.svg';

export class SetupCongratsBlock extends React.Component {
    public render() {
        return (
            <div className="setup-congrats-block">
                <img src={congratsImage} alt="platform-setup-congrats" />
            </div>
        );
    }
}
