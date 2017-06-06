/**
 * Created by grg3 on 6/1/17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import Button from './Button';


class TableRow extends Component {

    render() {

    const { quiz, index, onDismiss} = this.props;

    return (
            <tr>
                <td data-title="'firstName'" >
                    { quiz.firstName }
                </td>
                <td data-title="'lastName'">
                    { quiz.lastName }
                </td>
                <td data-title="'Address'">
                    { quiz.homeAddress },  { quiz.city }, { quiz.zipCode }
                </td>
                <td data-title="'Newsletter Article'">
                    {quiz.newsletterTitle}
                </td>
                <td data-title="'Quiz'">
                    {quiz.quizTitle}
                </td>
                <td data-title="'Grade'">
                    {quiz.gradePercent}
                </td>
                <td data-title="'Date'" >
                    { Moment(quiz.createdAt.date).format('MM/DD/YY ') }
                </td>
                <td>
                    { certificateAvailable(quiz.gradePercent, quiz.passingGrade) }
                </td>
                <td>
                            <span>
                            <Button
                                onClick={ () => onDismiss(index)}
                            > Dismiss
              </Button>
            </span>
                </td>
            </tr>
        );
    }
}

function certificateAvailable(gradePercent, passingGrade){
    if(gradePercent >= passingGrade){
        return  <span> <button className="btn btn-primary btn-md">
                        <i className="fa fa-btn fa-download"></i>
                    Download Certificate</button>
                </span>;
    }else{
        return  <span>Not available</span>;
    }
}
export default TableRow;
