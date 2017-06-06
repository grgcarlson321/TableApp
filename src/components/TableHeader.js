/**
 * Created by grg3 on 5/31/17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class TableHeader extends Component {

    render() {
        const { dataKey, label, sortRowsBy, sortDirArrow } = this.props;

        return (
            <th className="myTableHeader">
                { isSortedCol(sortRowsBy, dataKey, label) }
                <span>{ sortDirArrow }</span>
            </th>
        );
    }
}

function isSortedCol(sortRowsBy, dataKey, label){
    if(sortRowsBy === null){
        return <span> { label } </span>
    }else {
        return   <a  onClick={() => sortRowsBy(dataKey)}>
                        { label }
                </a>
    }
}

export default TableHeader;
