export const withAttrs =
  <Props extends {}>(Component: React.FC<Props>, attrs: Props) =>
  (props: Props) =>
    <Component {...attrs} {...props} />;
