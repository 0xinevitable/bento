import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import React, { useState } from 'react';

import { Portal } from './Portal';

export type ModalProps = HTMLMotionProps<'div'> & {
  visible: boolean;
  onDismiss?: () => void;
};

export const Modal: React.FC<ModalProps> = ({
  className,
  visible,
  onDismiss,
  children,
  ...props
}) => {
  const [disabled, setDisabled] = useState<boolean>(false);

  return (
    <Portal id="profile-edit">
      <AnimatePresence>
        {visible && (
          <FixedContainer className={className} disabled={disabled}>
            <AnimatedBlur
              className="animated-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ ease: 'easeOut', duration: 0.5 }}
            />
            <Background
              className="modal-background"
              onClick={(event) => {
                if (!onDismiss) {
                  return;
                }
                const targetElement = event.target as HTMLElement;
                if (targetElement.className?.includes?.('modal-background')) {
                  setDisabled(true);
                  setTimeout(() => onDismiss());
                  setTimeout(() => setDisabled(false), 500);
                }
              }}
            >
              <ModalContainer
                className="modal-container"
                initial={{ transform: 'translate3d(0, 350px, 0)', opacity: 0 }}
                animate={{ transform: 'translate3d(0, 0px, 0)', opacity: 1 }}
                exit={{ transform: 'translate3d(0, 350px, 0)', opacity: 0 }}
                transition={{ type: 'spring' }}
                {...props}
              >
                {children}
              </ModalContainer>
            </Background>
          </FixedContainer>
        )}
      </AnimatePresence>
    </Portal>
  );
};

type FixedContainerProps = {
  disabled: boolean;
};
const FixedContainer = styled.div<FixedContainerProps>`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  cursor: pointer;
  z-index: 50;

  ${({ disabled }) =>
    disabled &&
    css`
      &,
      & > div {
        pointer-events: none;
      }
    `};
`;

const AnimatedBlur = styled(motion.div)`
  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
`;
const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled(motion.div)`
  cursor: default;
`;
