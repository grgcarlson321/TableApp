import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Search extends Component {
    render() {
        const { value, onChange, onSubmit, children } = this.props;
        return (
            <form onSubmit={onSubmit}>
                { children }
                <input
                    type="text"
                    value={value}
                    onChange={ onChange }
                />
                <button type="submit">
                    {children}
                </button>
            </form>
        );
    }
}
Search.propDefaults = {
    value: '',
}
Search.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
}

export default Search;



