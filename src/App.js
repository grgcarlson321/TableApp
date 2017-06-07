import React, { Component } from 'react';
import Search from './components/Search';
import TableHeader from './components/TableHeader';
import TableRows from './components/TableRow';
import PageNumbers from './components/PageNumbers';
import NumOfRows from './components/NumOfRows';
import Button from './components/Button';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';


const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;

class App extends Component {

    constructor(props){
        super(props);

        this.rows = null;

        this.state = {
            result: null,
            rowData: [],
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            sortBy: null,
            sortDir: null,
            currentPage: 1,
            rowsPerPage: 10,
            rowsPerPageString: '10',
        };

        this.fetchTableResultsPage = this.fetchTableResultsPage.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.sortRowsBy = this.sortRowsBy.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.renderRows = this.renderRows.bind(this);
        this.onNumOfRowsClick = this.onNumOfRowsClick.bind(this);
        this.handleRowChange = this.handleRowChange.bind(this);
    }

    componentDidMount(){
        const { searchTerm } = this.state;
        this.fetchTableResultsPage(searchTerm, DEFAULT_PAGE);
    }

    setSearchTopStories(result) {


        const { page, hits } = result;

        const oldHits = page !== 0
            ? this.state.result
            : [];

        const updatedHits = [
            ...oldHits,
            ...hits
        ];

        const { sortDir, sortBy, currentPage, rowsPerPage} = this.state;

        this.renderRows(updatedHits, sortDir, sortBy, currentPage, rowsPerPage);
    }

    fetchTableResultsPage(searchTerm, page){
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result));
    }

    renderRows(result, sortDir, sortBy, currentPage, rowsPerPage){

        const rowData = [];
        let numberOfHits = result.length;

        let rowIndex = 0;
        let rowEndIndex = 0;

        if(numberOfHits % rowsPerPage === 0){
            rowIndex = (currentPage * rowsPerPage) - rowsPerPage;

            rowEndIndex = rowIndex + rowsPerPage;

            for(let i = rowIndex; i < rowEndIndex; i++){
                rowData.push(result[i]);
            }

        }else{

            rowIndex = (currentPage * rowsPerPage) - rowsPerPage;

            rowEndIndex = rowIndex + rowsPerPage;

            if(rowEndIndex <= numberOfHits){
                for(let i = rowIndex; i < rowEndIndex; i++){
                    rowData.push(result[i]);
            }
            }else{

                let pageRemainder = numberOfHits % rowsPerPage;

                rowEndIndex = rowIndex + pageRemainder;

                for(let i = rowIndex; i < rowEndIndex; i++){
                    rowData.push(result[i]);
                }
            }
        }

        this.setState({result, rowData, numberOfHits, sortDir, sortBy, currentPage, rowsPerPage});
    }

    handlePageClick(event){
        const { result, rowsPerPage, sortDir, sortBy } = this.state;

        this.renderRows(result, sortDir, sortBy, Number(event.target.id), rowsPerPage);
    }

    sortRowsBy(sortBy){

        let { result, sortDir, currentPage, rowsPerPage } = this.state;

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

        this.renderRows(result, sortDir, sortBy, currentPage, rowsPerPage);
    }

    handleRowChange(e){
        this.setState({ rowsPerPageString: e.target.value });
    }

    onNumOfRowsClick(e){

        e.preventDefault();
        const { result, sortDir, sortBy, rowsPerPageString } = this.state;

        let value = rowsPerPageString;

        let setNumRows = parseInt(value);

        this.renderRows(result, sortDir, sortBy, 1, setNumRows);
    }

    onSearchSubmit(e){
        const { searchTerm } = this.state;
        this.fetchTableResultsPage(searchTerm, DEFAULT_PAGE);
        e.preventDefault();
    }

    onSearchChange(e){
        e.preventDefault();
        this.setState({searchTerm: e.target.value});
    }

    onDismiss(id){
        const { sortDir, sortBy, currentPage, rowsPerPage} = this.state;

        const isNotId = result => result.objectID !== id;
        const updatedHits = this.state.result.filter(isNotId);
        //this.setState({result: { ...this.state.result, updatedHits}});
        this.renderRows(updatedHits, sortDir, sortBy, currentPage, rowsPerPage);
    }

    render() {

    const divSearchStyle = { 'marginBottom': '20px' };

    const { searchTerm, rowsPerPageString, rowData, result, numberOfHits, rowsPerPage } = this.state;


    const page = (result && result.page) || 0;

    //Logic for displaying page numbers
    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(numberOfHits / rowsPerPage); i++){
        pageNumbers.push(i);
    }

    if(!result){
        return null;
    }

    let sortDirArrow = '';

    if (this.state.sortDir !== null){
        sortDirArrow = this.state.sortDir === 'DESC' ? ' ↓' : ' ↑';
    }else{
        sortDirArrow = ' ↓';
    }

    return (
        <div className="App page">
            <div className="interactions">
          <div style={divSearchStyle} >
          <Search
              value={searchTerm}
              onChange={this.onSearchChange}
              onSubmit={this.onSearchSubmit}
          >
               <span>Search </span>
          </Search>
          </div>
              <div style={divSearchStyle} >
              <NumOfRows
                  value={rowsPerPageString}
                  onRowsSubmit={this.onNumOfRowsClick}
                  handleRowChange={this.handleRowChange}
              >
                  <span>Number of Rows </span>
              </NumOfRows>

              </div>
          <div className="panel panel-default">
              <div className="panel-heading">Table of People</div>
                <table className="table">
                  <tbody>
                  <tr>
                  <TableHeader
                      rowStyle={{ width: '10%' }}
                      dataKey="row"
                      label="Row"
                      sortRowsBy = {null}
                  />
                  <TableHeader
                      rowStyle={{ width: '40%' }}
                  dataKey="title"
                  label="Title"
                  sortRowsBy = {this.sortRowsBy}
                  sortDirArrow = {(this.state.sortBy === 'title' ? sortDirArrow : '')}
                  />
                  <TableHeader
                      rowStyle={{ width: '30%' }}
                  dataKey="author"
                  label="Author"
                  sortRowsBy={this.sortRowsBy}
                  sortDirArrow={(this.state.sortBy === 'author' ? sortDirArrow : '')}
                  />
                  <TableHeader
                      rowStyle={{ width: '10%' }}
                  dataKey="comments"
                  label = "Comments"
                  sortRowsBy = {null}
                  />
                  <TableHeader
                      rowStyle={{ width: '10%' }}
                  dataKey="points"
                  label = "Points"
                  sortRowsBy = {null}
                  />
                  <TableHeader
                      rowStyle={{ width: '10%' }}
                  dataKey="deleteRow"
                  label = "Delete"
                  sortRowsBy = {null}
                  />
                  </tr>
                  { numberOfHits > 0 &&
                      rowData.map((tableRow, index) =>
                        <TableRows
                              key={tableRow.objectID}
                              index={index}
                              item={tableRow}
                              onDismiss={this.onDismiss}
                          />
                      )
                  }
                  </tbody>
                  </table>
              </div>
          <ul id="page-numbers">
              {
                  pageNumbers.map(number =>
                  <PageNumbers
                      className={(number === this.state.currentPage ? 'click-state' : 'base-state')}
                      key={number}
                      id={number}
                      handlePageClick={this.handlePageClick}
                  />
                  )
              }
          </ul>
                <div className="interactions">
                    <Button onClick={() => this.fetchTableResultsPage(searchTerm, page + 1)}>
                        More
                    </Button>
                </div>
            </div>
        </div>

    );
  }
}


export default App;

