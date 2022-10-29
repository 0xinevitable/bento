export const withAttrs =
  <Props extends {}>(attrs: Partial<Props>, Component: React.FC<Props>) =>
  (props: Props) =>
    <Component {...attrs} {...props} />;
