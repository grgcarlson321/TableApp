import React, { Component } from 'react';
import PropTypes from 'prop-types';


class Search extends Component {
    render() {
        const { value, onChange, children } = this.props;
        return (
            <form>
                { children }
                <input
                    type="text"
                    value={value}
                    onChange={ onChange }
                /> </form>
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



