export type NetworkDraft = {
  id: string;
  type: string;
  name: string;
  logo: string;
};

export type ConnectorProps = {
  networks: NetworkDraft[];
  signOut: () => Promise<void>;
  onSave?: () => void;
};
