import ListItem from '../../Components/ListItem/ListItem.jsx';
import FormInput from '../../Components/FormInput/FormInput.jsx';

const ListManager = ({ title, items, editAction, removeAction, inputLabel, inputValue, inputChange, addButtonClick, isInputFilled }) => {
    return (
        <div>
            <h2>{title}</h2>
            {items.map((item) => (
                <ListItem
                    key={item.id}
                    item={item}
                    editAction={editAction}
                    removeAction={removeAction}
                />
            ))}
            <FormInput
                label={inputLabel}
                type="text"
                name={`${title.toLowerCase()}Name`}
                value={inputValue}
                onChange={inputChange}
            />
            <button
                className="add-button"
                type="button"
                onClick={addButtonClick}
                disabled={!isInputFilled}
            >
                Добавить
            </button>
        </div>
    );
};

export default ListManager;
