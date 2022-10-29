export const withAttrs =
  <Props extends {}>(attrs: Props, Component: React.FC<Props>) =>
  (props: Props) =>
    <Component {...attrs} {...props} />;
