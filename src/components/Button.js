import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Button extends Component {
    render() {
        const { onClick, className, children } = this.props;
        return (
            <button
                onClick={onClick}
                className={className}
                type="button"
                >
                {children}
                </button>
        );
    }
}

Button.propDefaults = {
    className: '',
}
Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    value: PropTypes.string,
    children: PropTypes.node.isRequired,
}

export default Button;