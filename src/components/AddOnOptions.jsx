import { formatPKR } from '../utils/format.js';

export default function AddOnOptions({ idPrefix, addOns, selectedIds, onToggle }) {
  if (addOns.length === 0) return null;
  return (
    <fieldset className="field">
      <legend>Optional extras (fixed price per traveller)</legend>
      {addOns.map((addOn) => (
        <label key={addOn.id} className="checkbox addon" htmlFor={`${idPrefix}-${addOn.id}`}>
          <input
            id={`${idPrefix}-${addOn.id}`}
            type="checkbox"
            checked={selectedIds.includes(addOn.id)}
            onChange={() => onToggle(addOn.id)}
          />
          <span className="addon__label">{addOn.label}</span>
          <span className="addon__price">+{formatPKR(addOn.pricePerPerson)}</span>
        </label>
      ))}
    </fieldset>
  );
}
