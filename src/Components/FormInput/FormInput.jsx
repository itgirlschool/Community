const FormInput = ({ label, type, name, value, onChange, options, checked, ...props }) => {
    let inputElement = null;
    let labelContent = null;

    switch (type) {
        case 'text':
            inputElement = <input type={type} name={name} value={value} onChange={onChange} {...props} />;
            labelContent = <>{label}{inputElement}</>;
            break;
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
            labelContent = <>{inputElement}{label}</>;
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
            labelContent = <>{label}{inputElement}</>;
            break;
        default:
            inputElement = <input type="text" {...props} />;
            labelContent = <>{label}{inputElement}</>;
    }

    return (
        <label>
            {labelContent}
        </label>
    );
};

export default FormInput;