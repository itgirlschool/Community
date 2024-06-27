import './AddedItem.scss'
const AddedItem = ({ name, status, onRemove}) => (
    <div className="added-item-container">
        <span>{name}</span> : <span>{status}</span>
        <button type="button" title="Удалить" onClick={onRemove}>✖</button>
    </div>
);

export default AddedItem;