const AddedItem = ({ name, status, onRemove}) => (
    <div>
        <span>{name}</span> : <span>{status}</span>
        <button type="button" onClick={onRemove}>Удалить</button>
    </div>
);

export default AddedItem;