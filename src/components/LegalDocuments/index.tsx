import { Modal, TabPanel } from '@openware/components';
import * as React from 'react';

const panels = [
    {
        label: 'LEGAL NOTES',
        content: (
            <div className={'tabs-content'}>
                LEGAL NOTES
            </div>
        ),
    },
    {
        label: 'PRIVACY POLICY',
        content: (
            <div id="privacy-policy" className="tabs-content">
                PRIVACY POLICY
            </div>
        ),
    },
    {
        label: 'TERM OF SERVICE',
        content: (
            <div className={'tabs-content'}>
                TERM OF SERVICE
            </div>
        ),
    },
];

export interface LegalDocumentsProps {
    isOpen: boolean;
    footer: React.ReactNode;
}

class LegalDocuments extends React.Component<LegalDocumentsProps> {
    public render() {
      return(
          <Modal
              className={'pg-legal-docs-modal'}
              show={this.props.isOpen}
              header={<h3>Title</h3>}
              content={this.renderModalBody()}
              footer={this.props.footer}
          />
      );
    }

    private renderModalBody = () => {
        return(
            <div>
                <TabPanel panels={panels}/>
            </div>
        );
    };
}

export {
    LegalDocuments,
};
