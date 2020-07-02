import * as React from 'react';
import setDocumentTitle from '../../helpers';
import { InjectedIntlProps, injectIntl } from 'react-intl';

type Props = InjectedIntlProps;

export class PageNotFound extends React.Component<Props> {
  public componentDidMount() {
    setDocumentTitle('404');
  }

  public render() {
    return(
      <div className="pg-404-screen">
        <h1>404</h1>
        <span>{this.translate('page.body.404')}</span>
      </div>
    );
  }

  private translate = (key: string) => this.props.intl.formatMessage({id: key});
}
