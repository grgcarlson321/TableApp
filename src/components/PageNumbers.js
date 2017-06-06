/**
 * Created by grg3 on 6/6/17.
 */
/**
 * Created by grg3 on 5/31/17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class PageNumbers extends Component {

    render() {
        //Login for displaying page numbers
        const { className, id, handlePageClick } = this.props;

        return (
            <li
                className={className}
                id={id}
                onClick={handlePageClick}
            >
                {id}
            </li>
        );
    }
}

export default PageNumbers;