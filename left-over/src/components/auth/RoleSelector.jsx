import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_ICONS } from '../../utils/roles';

const RoleSelector = ({ selectedRole, onSelect }) => {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {Object.values(ROLES).map(role => (
        <button
          key={role}
          onClick={() => onSelect(role)}
          className={`p-6 border-2 rounded-lg text-center transition ${
            selectedRole === role
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300'
          }`}
        >
          <div className="text-4xl mb-2">{ROLE_ICONS[role]}</div>
          <h3 className="font-semibold text-lg mb-1 capitalize">{role}</h3>
          <p className="text-sm text-gray-600">{ROLE_LABELS[role]}</p>
          <p className="text-xs text-gray-500 mt-2">{ROLE_DESCRIPTIONS[role]}</p>
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;