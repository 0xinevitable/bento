import styled from '@emotion/styled';
import React, { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { Analytics, AnalyticsEvent } from '@/utils';

type RefForwardedSectionProps = React.HTMLAttributes<HTMLElement> & {
  forwardedRef?: React.ForwardedRef<HTMLElement>;
};
const RefForwardedSection: React.FC<RefForwardedSectionProps> = ({
  forwardedRef,
  ...props
}) => <RelativeSection ref={forwardedRef} {...props} />;

export const RelativeSection = styled.section`
  position: relative;
`;

export type TrackedSectionOptions = {
  id: string;
  event: keyof AnalyticsEvent;
};

export type TrackedSectionProps = React.HTMLAttributes<HTMLElement> &
  TrackedSectionOptions & {
    ref?: React.ForwardedRef<HTMLElement>;
  };

export const TrackedSection = React.forwardRef<
  HTMLElement,
  TrackedSectionProps
>((props, forwardedRef) => {
  const [inViewRef, inView] = useInView({ threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      Analytics.logEvent(props.event, { section: props.id });
    }
  }, [inView, props.id]);

  const mergedRef = useCallback(
    (instance: HTMLElement | null) => {
      if (typeof forwardedRef === 'function') {
        forwardedRef(instance);
      } else if (forwardedRef) {
        forwardedRef.current = instance;
      }
      inViewRef(instance);
    },
    [forwardedRef, inViewRef],
  );

  return <RefForwardedSection forwardedRef={mergedRef} {...props} />;
});
