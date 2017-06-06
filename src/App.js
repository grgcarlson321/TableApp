import React, { Component } from 'react';
import Search from './components/Search';
import TableHeader from './components/TableHeader';
import TableRows from './components/TableRow';
import PageNumbers from './components/PageNumbers';
import './App.css';


const DEFAULT_QUERY = '';

const quizObj = document.getElementById("quiz").value;

class App extends Component {

    constructor(props){
        super(props);

        this.rows = JSON.parse(quizObj);

        this.state = {
            result: [],
            rowData: [],
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            sortBy: null,
            sortDir: null,
            currentPage: 1,
            rowsPerPage: 10,
            selected: '',
        };

        this.fetchQuizResultsPage = this.fetchQuizResultsPage.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.sortRowsBy = this.sortRowsBy.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.renderRows = this.renderRows.bind(this);
        this.isActive = this.isActive.bind(this);
    }

    componentDidMount(){
        let {result} = this.state;
        let resultCount = result.length;

        if(resultCount <= 0){
            result = this.rows;
        }
        this.fetchQuizResultsPage(result);
    }

    fetchQuizResultsPage(newResult){
        let {currentPage, rowsPerPage, result} = this.state;

        let rowData = [];

        for(let i = 0; i < rowsPerPage; i++){
            rowData.push(newResult[i]);
        }
        this.setState({result: newResult, rowData: rowData, currentPage: currentPage, rowsPerPage: rowsPerPage});

        if(result.length > 0){
            this.renderRows(currentPage, rowsPerPage);
        }

    }

    isActive(number){
        if(number === this.state.currentPage){
            return 'click-state';
        }else{
            return 'base-state';
        }
    }

    renderRows(currentPage, rowsPerPage){
        const currentRows = [];

        const { result } = this.state;

        let rowIndex = 0;
        let rowEndIndex = 0;

        if(result.length % rowsPerPage === 0){

            rowIndex = (currentPage * rowsPerPage) - rowsPerPage;

            rowEndIndex = rowIndex + rowsPerPage;

            for(let i = rowIndex; i < rowEndIndex; i++){
                currentRows.push(result[i]);
            }

        }else{

            rowIndex = (currentPage * rowsPerPage) - rowsPerPage;

            rowEndIndex = rowIndex + rowsPerPage;

            if(rowEndIndex <= result.length){
                for(let i = rowIndex; i < rowEndIndex; i++){
                    currentRows.push(result[i]);
            }
            }else{

                let pageRemainder = result.length % rowsPerPage;

                rowEndIndex = rowIndex + pageRemainder;

                for(let i = rowIndex; i < rowEndIndex; i++){
                    currentRows.push(result[i]);
                }
            }
        }

        this.setState({rowData: currentRows, currentPage: currentPage, rowsPerPage: rowsPerPage});
    }

    handlePageClick(event){
        const { rowsPerPage } = this.state;

        this.renderRows(Number(event.target.id), rowsPerPage);
    }

    onChangePage(pageOfItems) {
        // update state with new page of items
        this.setState({ pageOfItems: pageOfItems });
    }

    sortRowsBy(sortBy){

        let { sortDir, result, currentPage, rowsPerPage } = this.state;

        if(sortBy === this.state.sortBy){
            sortDir = this.state.sortDir === 'ASC' ? 'DESC': 'ASC';
        }else{
            sortDir = 'ASC';
        }

        result.sort((a, b) => {
            let sortVal = 0;
            if(a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ){
                sortVal = 1;
            }
            if(a[sortBy].toLowerCase()  < b[sortBy].toLowerCase() ){
                sortVal = -1;
            }
            if(sortDir === 'DESC'){
                sortVal = sortVal * -1;
            }
            return sortVal;
        });

        this.setState({result: result, sortDir: sortDir, sortBy: sortBy});

        this.renderRows(currentPage, rowsPerPage);
    }

    onSearchChange(e){
        e.preventDefault();

        let { result, rowsPerPage } = this.state;

        if(!e.target.value){
            this.setState({ searchTerm: e.target.value });
        }else{
            const filterBy = e.target.value.toString().toLowerCase();

            const filteredList = result.filter(function(fetchData){
                    return (!filterBy ||
                    fetchData.firstName.toString().toLowerCase().includes(filterBy.toLowerCase()) ||
                    fetchData.lastName.toString().toLowerCase().includes(filterBy.toLowerCase())  ||
                    fetchData.quizTitle.toString().toLowerCase().includes(filterBy.toLowerCase()) ||
                    fetchData.gradePercent.toString().toLowerCase().includes(filterBy.toLowerCase()));
            });

            let currentRows = [];

            for(let i = 0; i < filteredList.length; i++){
                if(i < rowsPerPage){
                    currentRows.push(filteredList[i]);
                }
            }

            this.setState({rowData: currentRows, result: filteredList, searchTerm: e.target.value});
        }
    }

    onDismiss(index){
        const updatedList = this.state.result.slice();
        updatedList.splice(index, 1);
        this.fetchQuizResultsPage(updatedList);
    }

    render() {

    const divSearchStyle = { 'marginBottom': '20px' };

    const { searchTerm, rowData, result, rowsPerPage } = this.state;

    //Logic for displaying page numbers
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(result.length / rowsPerPage); i++){
        pageNumbers.push(i);
    }

    if(!rowData){
        return null;
    }

    let sortDirArrow = '';

    if (this.state.sortDir !== null){
        sortDirArrow = this.state.sortDir === 'DESC' ? ' ↓' : ' ↑';
    }else{
        sortDirArrow = ' ↓';
    }

    return (
      <div className="App">
          <div style={divSearchStyle} >
          <Search
              value={searchTerm}
              onChange={this.onSearchChange}
          >
               <span>Search </span>
          </Search>
              </div>
          <div className="panel panel-default">
              <div className="panel-heading">Quiz Results for Newsletters</div>
              { rowData &&
                <table className="table">
                  <tbody>
                  <tr>
                  <TableHeader
                  dataKey="firstName"
                  label = "First Name"
                  sortRowsBy = {this.sortRowsBy}
                  sortDirArrow = {(this.state.sortBy === 'firstName' ? sortDirArrow : '')}
                  />
                  <TableHeader
                  dataKey="lastName"
                  label = "Last Name"
                  sortRowsBy = {this.sortRowsBy}
                  sortDirArrow = {(this.state.sortBy === 'lastName' ? sortDirArrow : '')}
                  />
                  <TableHeader
                  dataKey="address"
                  label = "Address"
                  sortRowsBy = {null}
                  />
                  <TableHeader
                  dataKey="newsletterTitle"
                  label = "Newsletter Article"
                  sortRowsBy = {null}
                  />
                  <TableHeader
                  dataKey="quizTitle"
                  label = "Quiz"
                  sortRowsBy = {null}
                  />
                  <TableHeader
                  dataKey="gradePercent"
                  label = "Grade"
                  sortRowsBy = {null}
                  />
                  <TableHeader
                  dataKey="createdDate"
                  label = "Submission Date"
                  sortRowsBy = {null}
                  />
                  <TableHeader
                  dataKey="downloadCertificate"
                  label = "Download Certificate"
                  sortRowsBy = {null}
                  />
                  <TableHeader
                  dataKey="deleteRow"
                  label = "Delete"
                  sortRowsBy = {null}
                  />
                  </tr>
                  {
                      rowData.map((tableRow, index) =>
                          <TableRows
                              quiz={tableRow}
                              index={index}
                              onDismiss={this.onDismiss}
                              key={index}
                          />
                      )
                  }
                  </tbody>
                  </table>
                  }
              </div>
          <ul id="page-numbers">
              {
                  pageNumbers.map(number =>
                  <PageNumbers
                      className={this.isActive(number)}
                      key={number}
                      id={number}
                      handlePageClick={this.handlePageClick}
                  />
                  )
              }
          </ul>
      </div>

    );
  }
}


export default App;

