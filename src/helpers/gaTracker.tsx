import * as React from 'react';
import * as ReactGA from 'react-ga';
import { RouteComponentProps } from 'react-router-dom';
import { gaTrackerKey } from '../../src/api';

const gaKey = gaTrackerKey();

if (gaKey) {
  ReactGA.initialize(gaKey);
}

export const gaTracker = <P extends RouteComponentProps>(
  WrappedComponent: React.ComponentType<P>,
  options: ReactGA.FieldsObject = {},
) => {
  const trackPage = (page: string) => {
    ReactGA.set({
      page,
      ...options,
    });
    ReactGA.pageview(page);
  };

  return (props: P) => {
   React.useEffect(() => {
      gaKey && trackPage(props.location.pathname);
    }, [props.location.pathname]);

   return <WrappedComponent {...props} />;
  };
};
