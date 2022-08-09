type ToggleStateProp = {
  isEdit: Boolean;
};

export const ProfileEditButton: React.FC<ToggleStateProp> = ({ isEdit }) => (
  <button
    type="button"
    className="w-fit p-1 px-3 text-slate-100/75 border border-slate-100/75 rounded-2xl absolute top-[-24px] right-6 hover:opacity-50 transition-all"
  >
    {!isEdit ? <>Edit Profile</> : <>Submit</>}
  </button>
);
