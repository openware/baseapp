import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { setDocumentTitle } from '../../helpers';

type Props = InjectedIntlProps;

class Restricted extends React.Component<Props> {
  public componentDidMount() {
    setDocumentTitle('404');
  }

  public render() {
    return(
      <div className="pg-restricted-screen">
        <div className="pg-restricted-screen__title">
          <h1>404</h1>
        </div>
        <div className="pg-restricted-screen__content">
          <p>{this.translate('page.body.restricted')}</p>
        </div>
      </div>
    );
  }

  private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

export const RestrictedScreen = injectIntl(Restricted) as any;
