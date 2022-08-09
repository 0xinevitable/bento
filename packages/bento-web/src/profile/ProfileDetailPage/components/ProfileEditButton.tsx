type ToggleStateProp = {
  isEditing: Boolean;
};

export const ProfileEditButton: React.FC<ToggleStateProp> = ({ isEditing }) => (
  <div className="w-fit p-1 px-3 text-slate-100/75 border border-slate-100/75 rounded-2xl absolute top-[-24px] right-6 hover:opacity-50 transition-all">
    {!isEditing ? <>Edit Profile</> : <>Submit</>}
  </div>
);
