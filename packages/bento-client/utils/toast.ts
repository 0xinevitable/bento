import {
  ReactNotifications,
  Store,
  iNotification,
} from 'react-notifications-component';

export type ToastProps = Partial<
  Omit<Omit<iNotification, 'message'>, 'type'>
> & {
  type?: 'success' | 'error' | 'info' | 'default' | 'warning';
  title: string;
  description?: string;
};

export const toast = ({
  type = 'success',
  title,
  description,
  ...params
}: ToastProps) =>
  Store.addNotification({
    // @ts-ignore
    type: type === 'error' ? 'danger' : type,
    title,
    message: description,
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    ...params,
    dismiss: {
      ...params.dismiss,
      duration: 3000,
      onScreen: true,
    },
  });

export const ToastProvider = ReactNotifications;
