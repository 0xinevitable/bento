type Props = React.HTMLAttributes<HTMLButtonElement> & {
  isEditing: Boolean;
};

export const ProfileEditButton: React.FC<Props> = ({ isEditing, ...props }) => (
  <button
    className="w-fit p-1 px-3 text-slate-100/75 border border-slate-100/75 rounded-2xl absolute top-[-24px] right-6 hover:opacity-50 transition-all"
    {...props}
  >
    {!isEditing ? 'Edit Profile' : 'Submit'}
  </button>
);
