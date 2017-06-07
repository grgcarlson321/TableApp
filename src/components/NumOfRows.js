import React, { Component } from 'react';
import PropTypes from 'prop-types';


class NumOfRows extends Component {

    render() {
        const { value, onRowsSubmit, handleRowChange, children } = this.props;


        return (
            <form onSubmit={onRowsSubmit}>
                { children }
                <input
                    type="text"
                    value={value}
                    onChange={ handleRowChange }
                />
                <button type="submit">
                {children}
                </button>
            </form>
        );
    }
}
NumOfRows.propDefaults = {
    value: '',
}
NumOfRows.propTypes = {
    value: PropTypes.string,
    onRowsSubmit: PropTypes.func.isRequired,
    handleRowChange: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
}

export default NumOfRows;