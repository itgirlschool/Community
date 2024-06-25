const FormInput = ({ label, type, name, value, onChange, options, checked, ...props }) => {
    let inputElement = null;

    switch (type) {
        case 'text':
        case 'radio':
        case 'checkbox':
            inputElement = (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    checked={checked}
                    {...props}
                />
            );
            break;
        case 'select':
            inputElement = (
                <select name={name} value={value} onChange={onChange} {...props}>
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
            break;
        default:
            inputElement = <input type="text" {...props} />;
    }

    return (
        <label>
            {label}
            {inputElement}
        </label>
    );
};

export default FormInput;