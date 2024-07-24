const FormInput = ({ label, type, name, value, onChange, options, checked, ...props }) => {
    let inputElement = null;
    let labelContent = null;

    // Убедитесь, что value не undefined
    const inputValue = value ?? '';

    switch (type) {
        case 'text':
            inputElement = <input type={type} name={name} value={inputValue} onChange={onChange} {...props} />;
            labelContent = <>{label}{inputElement}</>;
            break;
        case 'radio':
        case 'checkbox':
            // Для radio и checkbox, если checked не определено, используйте false
            const inputChecked = checked ?? false;
            inputElement = (
                <input
                    type={type}
                    name={name}
                    value={inputValue}
                    onChange={onChange}
                    checked={inputChecked}
                    {...props}
                />
            );
            labelContent = <>{inputElement}{label}</>;
            break;
        case 'select':
            inputElement = (
            <select name={name} value={inputValue} onChange={onChange} {...props}>
                <option value="" disabled hidden>Выбрать</option>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            );
            labelContent = <>{label}{inputElement}</>;
            break;
        default:
            inputElement = <input type="text" value={inputValue} {...props} />;
            labelContent = <>{label}{inputElement}</>;
    }

    return (
        <label>
            {labelContent}
        </label>
    );
};

export default FormInput;