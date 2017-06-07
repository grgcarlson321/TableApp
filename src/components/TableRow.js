import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';


class TableRow extends Component {

    render() {

    const { item, onDismiss, index} = this.props;

    return (
            <tr>
                <td style={{ width: '10%' }} data-title="'title'" >
                    { index+1 }
                </td>
                <td style={{ width: '40%' }} data-title="'title'" >
                    <a href={item.url}>{item.title}</a>
                </td>
                <td style={{ width: '30%' }} data-title="'author'">
                      {item.author}
                </td>
                <td style={{ width: '10%' }} data-title="'comments'">
                    {item.num_comments}
                </td>
    
                  <td style={{ width: '10%' }} data-title="'points'">
                    {item.points}
                  </td>
                    <td style={{ width: '10%' }} data-title="'onDismiss'">
                    <span>
                            <Button
                                onClick={() => onDismiss(item.objectID)} className="button-inline"
                            > Dismiss
                            </Button>
                     </span>
                </td>
            </tr>
        );
    }
}

export default TableRow;
